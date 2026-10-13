/**
 * Estado global de la web y sus acciones (antes: class Component + class App).
 * Es un store pequeño fuera de React; los componentes lo leen con useVio()
 * (src/lib/useVio.ts). Así el estado sobrevive al cambiar de página, igual
 * que en la versión de un solo archivo.
 */
import type { AdminTab, CategoriaId, CodigoNuevo, FiltroId, LadoPortada, Miembro, PlanId, PortadaCfg, Sesion, TipoArchivo, TipoPortada, Visual } from "@/types";
import { alCerrarSesion, cerrarSesion, esAdmin, haySesion, iniciarSesion } from "./auth";
import { cambiarPremium, cargarCatalogo, eliminarVisual, publicarVisual } from "./catalogo";
import { genCode, hashCodigo, normCode } from "./codigos";
import { CONFIGURADO } from "./config";
import { deviceId } from "./dispositivo";
import { addMonths, parseDrive } from "./formato";
import { canjear, cargarMiembros, crearMiembro, liberarDispositivos, quitarMiembro, renovarMiembro } from "./miembros";
import {
  borrarArchivosPortada,
  cargarPortada,
  enMB,
  generarPoster,
  guardarPortada,
  MAX_ARCHIVO,
  NOMBRE_LADO,
  PORTADA_DEFECTO,
  subirArchivoPortada,
  TIPOS_POSTER,
  TIPOS_VIDEO,
  VIDEO_RECOMENDADO,
} from "./portada";
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
  /** Subida de video/póster de la portada, por lado (d = escritorio, m = móvil) */
  portadaSubida: Record<LadoPortada, SubidaPortada>;
}

export interface SubidaPortada {
  ocupado: boolean;
  /** Qué está pasando ("Subiendo video…", "Creando el póster…") */
  fase: string;
  aviso: string;
  error: string;
  ok: string;
}
const SUBIDA_LIBRE: SubidaPortada = { ocupado: false, fase: "", aviso: "", error: "", ok: "" };

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
  portadaSubida: { d: SUBIDA_LIBRE, m: SUBIDA_LIBRE },
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
    const antes = this.heroCfg();
    const valor = { ...(this.estado.heroDraft || antes) };
    this.set({ heroSaving: true, heroMsg: "" });
    try {
      await guardarPortada(valor);
      this.set({ heroSaving: false, heroSaved: valor, heroMsg: "Portada guardada y publicada", heroErr: false });
      // Videos o pósters que ya no usa la portada (por ejemplo, tras "Restablecer original")
      await this.limpiarArchivos([antes], [valor]);
    } catch (err) {
      this.set({ heroSaving: false, heroMsg: "No se pudo guardar: " + mensaje(err) + ". ¿Corriste el SQL de la portada en Supabase?", heroErr: true });
    }
  };
  resetHero = (): void =>
    this.set({ heroDraft: { ...PORTADA_DEFECTO }, heroMsg: "Valores originales cargados. Toca Guardar para aplicarlos.", heroErr: false });

  // ---------- admin: portada con video ----------
  private setSubida = (lado: LadoPortada, cambio: Partial<SubidaPortada>): void =>
    this.set({ portadaSubida: { ...this.estado.portadaSubida, [lado]: { ...this.estado.portadaSubida[lado], ...cambio } } });

  /** URLs de video/póster que referencia una o más configuraciones. */
  private archivosDe = (...cfgs: Partial<PortadaCfg>[]): Set<string> =>
    new Set(cfgs.flatMap((c) => [c.dVideo, c.dPoster, c.mVideo, c.mPoster]).filter((u): u is string => !!u));

  /** Borra del bucket los archivos que estaban en `antes` y ya no están en `ahora`. */
  private limpiarArchivos = async (antes: Partial<PortadaCfg>[], ahora: Partial<PortadaCfg>[]): Promise<void> => {
    const vivos = this.archivosDe(...ahora);
    const sobran = [...this.archivosDe(...antes)].filter((u) => !vivos.has(u));
    if (!sobran.length) return;
    try {
      await borrarArchivosPortada(sobran);
    } catch {
      /* si no se pudieron borrar quedan en el bucket; la web no los usa */
    }
  };

  /**
   * Publica de inmediato el video/póster de un lado (y lo copia al borrador),
   * y borra del bucket los archivos que reemplaza.
   */
  private publicarMedios = async (lado: LadoPortada, m: { tipo?: TipoPortada; video?: string; poster?: string }): Promise<void> => {
    const cambio: Partial<PortadaCfg> =
      lado === "d" ? { dTipo: m.tipo, dVideo: m.video, dPoster: m.poster } : { mTipo: m.tipo, mVideo: m.video, mPoster: m.poster };
    const limpio = Object.fromEntries(Object.entries(cambio).filter(([, v]) => v !== undefined)) as Partial<PortadaCfg>;
    const antesPub = this.heroCfg();
    const antesBorrador = this.estado.heroDraft || antesPub;
    const publicado: PortadaCfg = { ...antesPub, ...limpio };
    const borrador: PortadaCfg = { ...antesBorrador, ...limpio };
    await guardarPortada(publicado);
    this.set({ heroSaved: publicado, heroDraft: borrador });
    await this.limpiarArchivos([antesPub, antesBorrador], [publicado, borrador]);
  };

  /** Sube el video de un lado, crea su póster con un cuadro del video y lo publica. */
  subirVideoPortada = async (lado: LadoPortada, archivo: File): Promise<void> => {
    if (this.estado.portadaSubida[lado].ocupado) return;
    const limpiar = { aviso: "", error: "", ok: "" };
    if (!TIPOS_VIDEO.includes(archivo.type))
      return this.setSubida(lado, { ...limpiar, error: "Ese archivo no es MP4 ni WebM. Exporta el video en uno de esos formatos." });
    if (archivo.size > MAX_ARCHIVO)
      return this.setSubida(lado, {
        ...limpiar,
        error: `El video pesa ${enMB(archivo.size)} y el máximo es 15 MB. Comprímelo o recórtalo e inténtalo de nuevo.`,
      });
    const pesado =
      archivo.size > VIDEO_RECOMENDADO[lado]
        ? `Pesa ${enMB(archivo.size)}: se puede usar, pero ${lado === "d" ? "en escritorio conviene menos de 4 MB" : "en celulares conviene menos de 3 MB"} para que cargue rápido.`
        : "";
    this.setSubida(lado, { ...limpiar, ocupado: true, fase: `Subiendo video (${enMB(archivo.size)})…`, aviso: pesado });
    const base = NOMBRE_LADO[lado] + "-" + Date.now();
    const subidos: string[] = [];
    try {
      const video = await subirArchivoPortada(base + (archivo.type === "video/webm" ? ".webm" : ".mp4"), archivo, archivo.type);
      subidos.push(video);
      let poster = "";
      let sinPoster = "";
      this.setSubida(lado, { fase: "Creando el póster…" });
      try {
        poster = await subirArchivoPortada(base + "-poster.jpg", await generarPoster(archivo), "image/jpeg");
        subidos.push(poster);
      } catch {
        sinPoster = 'No se pudo crear el póster automático: sube una imagen con "Cambiar póster".';
      }
      this.setSubida(lado, { fase: "Publicando…" });
      await this.publicarMedios(lado, { tipo: "video", video, poster });
      this.setSubida(lado, { ocupado: false, fase: "", aviso: [pesado, sinPoster].filter(Boolean).join(" "), ok: "Video subido y publicado." });
    } catch (err) {
      if (subidos.length) await borrarArchivosPortada(subidos).catch(() => {});
      this.setSubida(lado, { ocupado: false, fase: "", error: "No se pudo subir el video: " + explicarSubida(err) });
    }
  };

  /** Reemplaza el póster (imagen que se ve mientras carga el video). */
  subirPosterPortada = async (lado: LadoPortada, archivo: File): Promise<void> => {
    if (this.estado.portadaSubida[lado].ocupado) return;
    const limpiar = { aviso: "", error: "", ok: "" };
    if (!TIPOS_POSTER.includes(archivo.type)) return this.setSubida(lado, { ...limpiar, error: "El póster debe ser una imagen JPG, PNG o WebP." });
    if (archivo.size > MAX_ARCHIVO) return this.setSubida(lado, { ...limpiar, error: `La imagen pesa ${enMB(archivo.size)} y el máximo es 15 MB.` });
    this.setSubida(lado, { ...limpiar, ocupado: true, fase: "Subiendo póster…" });
    const ext = archivo.type === "image/png" ? "png" : archivo.type === "image/webp" ? "webp" : "jpg";
    let subido = "";
    try {
      subido = await subirArchivoPortada(NOMBRE_LADO[lado] + "-poster-" + Date.now() + "." + ext, archivo, archivo.type);
      await this.publicarMedios(lado, { poster: subido });
      this.setSubida(lado, { ocupado: false, fase: "", ok: "Póster actualizado." });
    } catch (err) {
      if (subido) await borrarArchivosPortada([subido]).catch(() => {});
      this.setSubida(lado, { ocupado: false, fase: "", error: "No se pudo subir el póster: " + explicarSubida(err) });
    }
  };

  /** Quita el video de un lado (vuelve a imagen) y lo borra del bucket. */
  quitarVideoPortada = async (lado: LadoPortada): Promise<void> => {
    if (this.estado.portadaSubida[lado].ocupado) return;
    this.setSubida(lado, { ocupado: true, fase: "Quitando video…", aviso: "", error: "", ok: "" });
    try {
      await this.publicarMedios(lado, { tipo: "imagen", video: "", poster: "" });
      this.setSubida(lado, { ocupado: false, fase: "", ok: "Video quitado: se muestra la imagen." });
    } catch (err) {
      this.setSubida(lado, { ocupado: false, fase: "", error: "No se pudo quitar el video: " + explicarSubida(err) });
    }
  };
}

/** Mensaje claro para errores de Storage. */
function explicarSubida(err: unknown): string {
  const m = String(mensaje(err));
  if (/row-level security|unauthorized|403/i.test(m)) return "tu sesión no tiene permiso de administrador. Sal y vuelve a entrar.";
  if (/bucket not found/i.test(m)) return 'no existe el bucket "portada". Corre el SQL de Storage en Supabase.';
  if (/maximum allowed size|too large|413/i.test(m)) return "supera el límite de 15 MB del bucket.";
  if (/mime type/i.test(m)) return "el bucket no acepta ese formato.";
  if (/failed to fetch|network/i.test(m)) return "se cortó la conexión. Revisa tu internet e inténtalo de nuevo.";
  return m;
}

/** Única instancia (la web es una sola aplicación en el navegador). */
export const vio = new VioStore();
