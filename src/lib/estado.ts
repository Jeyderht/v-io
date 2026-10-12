/**
 * Estado global de la web y sus acciones (antes: class Component + class App).
 * Es un store pequeño fuera de React; los componentes lo leen con useVio()
 * (src/lib/useVio.ts). Así el estado sobrevive al cambiar de página, igual
 * que en la versión de un solo archivo.
 */
import type { AdminTab, CategoriaId, CodigoNuevo, FiltroId, Miembro, PlanId, PortadaCfg, Sesion, TipoArchivo, Visual } from "@/types";
import { alCerrarSesion, cerrarSesion, esAdmin, haySesion, iniciarSesion } from "./auth";
import { cambiarPremium, cargarCatalogo, eliminarVisual, publicarVisual } from "./catalogo";
import { genCode, hashCodigo, normCode } from "./codigos";
import { CONFIGURADO } from "./config";
import { deviceId } from "./dispositivo";
import { addMonths, parseDrive } from "./formato";
import { canjear, cargarMiembros, crearMiembro, liberarDispositivos, quitarMiembro, renovarMiembro } from "./miembros";
import { cargarPortada, guardarPortada, PORTADA_DEFECTO } from "./portada";
import { CLAVES, guardar, leer } from "./storage";

export interface Estado {
  /** Hora del último cambio de estado (ms). Sirve para saber qué accesos siguen vigentes sin llamar a Date.now() al pintar. */
  ahora: number;
  // catálogo y navegación
  filter: FiltroId;
  filtersOpen: boolean;
  query: string;
  preview: string | null;
  // planes y pago
  annual: boolean;
  sheetPlan: PlanId | null;
  email: string;
  emailTouched: boolean;
  // cotización a medida
  quoteOpen: boolean;
  qType: string;
  qName: string;
  qDate: string;
  qDetail: string;
  // datos
  items: Visual[] | null;
  members: Miembro[];
  isAdminUser: boolean;
  adminChecked: boolean;
  listMsg: string;
  // cuenta del cliente
  member: Sesion | null;
  loginOpen: boolean;
  code: string;
  loginErr: string;
  loginBusy: boolean;
  // admin: login
  aEmail: string;
  aPass: string;
  aBusy: boolean;
  aErr: string;
  // admin: visuales
  adminTab: AdminTab;
  driveUrl: string;
  upKind: TipoArchivo;
  upTitle: string;
  upCat: CategoriaId;
  upLen: string;
  upPremium: boolean;
  uploading: boolean;
  upMsg: string;
  upErr: boolean;
  confirmDel: string | null;
  // admin: miembros
  mName: string;
  mTel: string;
  mPlan: PlanId;
  mMonths: number;
  creating: boolean;
  memMsg: string;
  newCode: CodigoNuevo | null;
  copied: boolean;
  confirmMem: string | null;
  // admin: portada (heroSaved = lo publicado, heroDraft = lo que se edita)
  heroSaved: Partial<PortadaCfg> | null;
  heroDraft: PortadaCfg | null;
  heroSaving: boolean;
  heroMsg: string;
  heroErr: boolean;
}

export const ESTADO_INICIAL: Estado = {
  ahora: 0,
  filter: "all",
  filtersOpen: false,
  query: "",
  preview: null,
  annual: false,
  sheetPlan: null,
  email: "",
  emailTouched: false,
  quoteOpen: false,
  qType: "logo",
  qName: "",
  qDate: "",
  qDetail: "",
  items: null,
  members: [],
  isAdminUser: false,
  adminChecked: false,
  listMsg: "",
  member: null,
  loginOpen: false,
  code: "",
  loginErr: "",
  loginBusy: false,
  aEmail: "",
  aPass: "",
  aBusy: false,
  aErr: "",
  adminTab: "visuales",
  driveUrl: "",
  upKind: "video",
  upTitle: "",
  upCat: "vj",
  upLen: "",
  upPremium: true,
  uploading: false,
  upMsg: "",
  upErr: false,
  confirmDel: null,
  mName: "",
  mTel: "",
  mPlan: "pro",
  mMonths: 1,
  creating: false,
  memMsg: "",
  newCode: null,
  copied: false,
  confirmMem: null,
  heroSaved: null,
  heroDraft: null,
  heroSaving: false,
  heroMsg: "",
  heroErr: false,
};

const mensaje = (e: unknown) => (e && typeof e === "object" && "message" in e && String((e as { message: unknown }).message)) || "error";

class VioStore {
  private estado: Estado = ESTADO_INICIAL;
  private oyentes = new Set<() => void>();
  private iniciado = false;
  /** Código del miembro activo (normalizado) y dispositivo de este navegador */
  private memberCode: string | null = null;
  private disp = "";

  // ---------- store ----------
  get = (): Estado => this.estado;
  getInicial = (): Estado => ESTADO_INICIAL;
  subscribe = (fn: () => void): (() => void) => {
    this.oyentes.add(fn);
    return () => this.oyentes.delete(fn);
  };
  set = (cambio: Partial<Estado>): void => {
    this.estado = { ...this.estado, ...cambio, ahora: Date.now() };
    this.oyentes.forEach((fn) => fn());
  };

  /** Configuración de portada publicada (valores originales + lo guardado). */
  heroCfg = (): PortadaCfg => ({ ...PORTADA_DEFECTO, ...(this.estado.heroSaved || {}) });

  // ---------- arranque ----------
  iniciar = async (): Promise<void> => {
    if (this.iniciado) return;
    this.iniciado = true;
    if (!CONFIGURADO) {
      this.set({ adminChecked: true, items: null });
      return;
    }
    this.disp = deviceId();
    alCerrarSesion(() => {
      if (this.estado.isAdminUser) this.set({ isAdminUser: false });
    });
    void this.cargarPortada();
    if (await haySesion()) await this.checkAdmin();
    else this.set({ adminChecked: true });
    const saved = leer(CLAVES.codigo);
    if (saved) await this.verify(saved, true);
    else await this.loadCatalog();
  };

  // ---------- admin: sesión ----------
  private checkAdmin = async (): Promise<boolean> => {
    const ok = await esAdmin();
    if (!ok) await cerrarSesion();
    this.set({ isAdminUser: ok, adminChecked: true });
    if (ok) await Promise.all([this.loadMembers(), this.loadCatalog()]);
    return ok;
  };
  adminLogin = async (): Promise<void> => {
    if (this.estado.aBusy) return;
    const email = this.estado.aEmail.trim();
    const password = this.estado.aPass;
    if (!email || !password) return this.set({ aErr: "Escribe tu correo y contraseña." });
    this.set({ aBusy: true, aErr: "" });
    const error = await iniciarSesion(email, password);
    if (error) return this.set({ aBusy: false, aErr: error });
    const ok = await this.checkAdmin();
    this.set({ aBusy: false, aPass: "", aErr: ok ? "" : "Esta cuenta no es administradora. Revisa el paso 4 de la guía." });
  };
  adminLogout = async (): Promise<void> => {
    await cerrarSesion();
    this.set({ isAdminUser: false, members: [], newCode: null });
    void this.loadCatalog();
  };

  // ---------- catálogo ----------
  loadCatalog = async (): Promise<void> => {
    if (!CONFIGURADO) return;
    try {
      const { isAdminUser, member } = this.estado;
      const items = await cargarCatalogo({ admin: isAdminUser, codigo: member ? this.memberCode : null, disp: this.disp });
      this.set({ items, listMsg: "" });
    } catch {
      this.set({ items: this.estado.items || [], listMsg: "No se pudo cargar el catálogo." });
    }
  };

  // ---------- acceso de clientes (códigos) ----------
  verify = async (raw: string, silent: boolean): Promise<void> => {
    if (!CONFIGURADO) {
      if (!silent) this.set({ loginErr: "El sistema de acceso aún no está configurado." });
      return;
    }
    const code = normCode(raw);
    if (code.length !== 11) {
      if (!silent) this.set({ loginErr: "Revisa tu código: tiene el formato VIO-XXXX-XXXX." });
      return;
    }
    this.set({ loginBusy: true, loginErr: "" });
    try {
      const r = await canjear(code, this.disp || deviceId());
      if (r.ok) {
        this.memberCode = code;
        guardar(CLAVES.codigo, code);
        this.set({ member: { nombre: r.nombre, plan: r.plan, expira: r.expira }, loginBusy: false, code: "", loginErr: "" });
        await this.loadCatalog();
        return;
      }
      guardar(CLAVES.codigo, null);
      this.memberCode = null;
      this.set({
        loginBusy: false,
        member: null,
        loginErr: silent
          ? ""
          : r.error === "otro"
            ? "Este código ya está activo en todos los dispositivos que incluye su plan. Cada acceso es personal."
            : r.error === "vencido"
              ? "Tu acceso venció. Escríbenos por WhatsApp para renovarlo."
              : "Código no válido.",
      });
      if (silent) await this.loadCatalog();
    } catch {
      this.set({ loginBusy: false, loginErr: silent ? "" : "No pudimos verificar tu código. Revisa tu conexión." });
      if (silent) await this.loadCatalog();
    }
  };
  logout = (): void => {
    guardar(CLAVES.codigo, null);
    this.memberCode = null;
    this.set({ member: null, loginOpen: false });
    void this.loadCatalog();
  };

  // ---------- admin: visuales ----------
  doUpload = async (): Promise<void> => {
    const e = this.estado;
    if (e.uploading) return;
    const title = e.upTitle.trim();
    const fail = (m: string) => this.set({ upMsg: m, upErr: true });
    if (/drive\.google\.com\/drive\/(u\/\d+\/)?folders/.test(e.driveUrl)) return fail("Ese es el enlace de una carpeta. Abre el archivo y copia su enlace.");
    const driveId = parseDrive(e.driveUrl);
    if (!driveId) return fail("Pega el enlace de un archivo de Google Drive.");
    if (!title) return fail("Escribe un título.");
    this.set({ uploading: true, upMsg: "Publicando…", upErr: false });
    try {
      await publicarVisual({ title, cat: e.upCat, len: e.upLen.trim(), premium: !!e.upPremium, kind: e.upKind, drive_id: driveId });
      this.set({ uploading: false, upTitle: "", upLen: "", driveUrl: "", upMsg: "Publicado en el catálogo", upErr: false });
      void this.loadCatalog();
    } catch (err) {
      this.set({ uploading: false, upMsg: "No se pudo publicar: " + mensaje(err), upErr: true });
    }
  };
  togglePremItem = async (t: { id?: string; premium: boolean }): Promise<void> => {
    if (!t.id) return;
    try {
      await cambiarPremium(t.id, !t.premium);
    } catch {
      /* se recarga igual */
    }
    void this.loadCatalog();
  };
  /** Primer clic pide confirmación; el segundo elimina. */
  deleteItem = async (id: string): Promise<void> => {
    if (this.estado.confirmDel !== id) return this.set({ confirmDel: id });
    this.set({ confirmDel: null });
    try {
      await eliminarVisual(id);
    } catch {
      /* se recarga igual */
    }
    void this.loadCatalog();
  };

  // ---------- admin: miembros ----------
  loadMembers = async (): Promise<void> => {
    try {
      this.set({ members: await cargarMiembros() });
    } catch {
      /* se mantiene la lista anterior */
    }
  };
  createMember = async (): Promise<void> => {
    const e = this.estado;
    if (e.creating) return;
    const nombre = e.mName.trim();
    if (!nombre) return this.set({ memMsg: "Escribe el nombre del cliente." });
    this.set({ creating: true, memMsg: "", copied: false });
    try {
      const code = genCode();
      const code_hash = await hashCodigo(code);
      const expira = addMonths(Date.now(), e.mMonths);
      await crearMiembro({ nombre, plan: e.mPlan, expira, code_hash });
      this.set({ creating: false, newCode: { code, nombre, plan: e.mPlan, tel: e.mTel.replace(/\D/g, ""), expira }, mName: "", mTel: "" });
      void this.loadMembers();
    } catch (err) {
      this.set({ creating: false, memMsg: "No se pudo crear el acceso: " + mensaje(err) });
    }
  };
  private enMiembro = async (fn: () => Promise<void>): Promise<void> => {
    try {
      await fn();
    } catch {
      /* se recarga igual */
    }
    void this.loadMembers();
  };
  renewMember = (m: Miembro) => this.enMiembro(() => renovarMiembro(m));
  releaseMember = (m: Miembro) => this.enMiembro(() => liberarDispositivos(m));
  deleteMember = async (m: Miembro): Promise<void> => {
    if (this.estado.confirmMem !== m.id) return this.set({ confirmMem: m.id });
    this.set({ confirmMem: null });
    await this.enMiembro(() => quitarMiembro(m));
  };

  // ---------- admin: portada ----------
  private cargarPortada = async (): Promise<void> => {
    const valor = await cargarPortada();
    if (valor) this.set({ heroSaved: valor });
  };
  abrirPortada = (): void => this.set({ adminTab: "portada", heroDraft: { ...this.heroCfg() }, heroMsg: "" });
  setDraft = <K extends keyof PortadaCfg>(k: K, val: PortadaCfg[K]): void =>
    this.set({ heroDraft: { ...(this.estado.heroDraft || this.heroCfg()), [k]: val }, heroMsg: "" });
  saveHero = async (): Promise<void> => {
    if (this.estado.heroSaving) return;
    const valor = { ...(this.estado.heroDraft || this.heroCfg()) };
    this.set({ heroSaving: true, heroMsg: "" });
    try {
      await guardarPortada(valor);
      this.set({ heroSaving: false, heroSaved: valor, heroMsg: "Portada guardada y publicada", heroErr: false });
    } catch (err) {
      this.set({ heroSaving: false, heroMsg: "No se pudo guardar: " + mensaje(err) + ". ¿Corriste el SQL de la portada en Supabase?", heroErr: true });
    }
  };
  resetHero = (): void =>
    this.set({ heroDraft: { ...PORTADA_DEFECTO }, heroMsg: "Valores originales cargados. Toca Guardar para aplicarlos.", heroErr: false });
}

/** Única instancia (la web es una sola aplicación en el navegador). */
export const vio = new VioStore();
