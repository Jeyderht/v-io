/* =========================================================
   V-IO · capa de datos (class App extends Component)
   Habla con Supabase por REST (fetch, sin librerías):
   login de admin, catálogo, canje de códigos, miembros
   y páginas legales. Los datos de conexión están en config.js.
   ========================================================= */

/* =========================================================
   TEXTOS LEGALES (pie de página → Licencia / Términos / Privacidad)
   "contacto" se arma con el WhatsApp de config.js.
   ========================================================= */
const LEGAL_FECHA = '12 de octubre de 2026';

function textosLegales(contacto) {
  const date = LEGAL_FECHA;
  return {
    licencia: {
      label: 'Licencia', title: 'Licencia de uso', date,
      intro: 'Al suscribirte a V-IO recibes una licencia para usar los visuales del catálogo según tu plan. Los visuales siguen siendo propiedad de V-IO; lo que adquieres es el derecho de uso.',
      sections: [
        { h: '1. Qué incluye', ps: ['Una licencia no exclusiva, personal e intransferible para proyectar, mezclar y editar los visuales del catálogo en presentaciones en vivo, mientras tu suscripción esté activa.', 'Puedes recortar, cambiar colores, combinar y sincronizar los visuales con tu música.'] },
        { h: '2. Alcance según tu plan', ps: ['DJ / VJ: uso en tus propias presentaciones y sets como DJ o VJ, incluidas fechas en las que te contraten y transmisiones en vivo de tu set. 1 dispositivo.', 'PRO: proyección pública en clubs, bares, fiestas y eventos, propios o de terceros. 2 dispositivos.', 'Productora: uso en múltiples eventos, venues e instalaciones de tu empresa o productora. 5 dispositivos.'] },
        { h: '3. Qué no está permitido', ps: ['Revender, compartir, regalar o publicar los archivos (por ejemplo en bancos de video, Drive públicos o grupos).', 'Compartir tu código de acceso con otras personas.', 'Usar los visuales como parte principal de publicidad o anuncios de marcas de terceros sin una licencia a medida.', 'Presentarlos como obra propia, registrarlos o usarlos para entrenar modelos de inteligencia artificial.'] },
        { h: '4. Si cancelas', ps: ['Puedes seguir usando en tus presentaciones los visuales que descargaste mientras tu suscripción estaba activa, bajo estas mismas condiciones. No podrás descargar visuales nuevos.'] },
        { h: '5. Visuales a medida', ps: ['Los visuales hechos a pedido se rigen por lo acordado en cada cotización. Salvo que se indique lo contrario, el cliente puede usarlos sin límite de eventos y V-IO puede mostrarlos en su portafolio.'] },
        { h: '6. Incumplimiento', ps: ['Si se detecta un uso fuera de esta licencia o el código se comparte, V-IO puede suspender el acceso sin reembolso.', 'Consultas: ' + contacto + '.'] }
      ]
    },
    terminos: {
      label: 'Términos', title: 'Términos y condiciones', date,
      intro: 'Estos términos regulan el uso de la web V-IO y la suscripción a su catálogo de visuales. Al suscribirte, los aceptas.',
      sections: [
        { h: '1. El servicio', ps: ['V-IO ofrece acceso a un catálogo de visuales digitales para DJs, VJs, clubs y eventos, y un servicio de visuales a medida, desde Lima, Perú.'] },
        { h: '2. Suscripción y pago', ps: ['Los precios se muestran en soles (S/) e incluyen el periodo elegido (mensual o anual). El pago se coordina por WhatsApp mediante tarjeta, Yape o transferencia.', 'Al confirmar el pago recibes un código de acceso personal, válido hasta la fecha de vencimiento de tu plan. La suscripción no se renueva automáticamente: para continuar, renuevas por WhatsApp.'] },
        { h: '3. Código y dispositivos', ps: ['El código es personal y funciona en el número de dispositivos de tu plan (1, 2 o 5). Se activa en cada dispositivo la primera vez que se usa.', 'Si cambias de equipo, escríbenos y liberamos tus dispositivos. No compartas tu código: hacerlo puede causar la suspensión del acceso.'] },
        { h: '4. Cancelación y reembolsos', ps: ['Puedes dejar de renovar cuando quieras, sin permanencia. Una vez entregado el código y habilitado el acceso al catálogo, no se realizan reembolsos del periodo en curso, salvo que la ley aplicable disponga lo contrario o exista una falla del servicio que no podamos resolver.'] },
        { h: '5. Disponibilidad', ps: ['Hacemos lo posible por mantener la web y los archivos disponibles, pero pueden existir interrupciones por mantenimiento o por los servicios de terceros que usamos (alojamiento web, base de datos y Google Drive).', 'El catálogo puede cambiar: agregamos visuales nuevos y podemos retirar algunos.'] },
        { h: '6. Cambios', ps: ['Podemos actualizar precios y estos términos. Los cambios de precio no afectan un periodo ya pagado.'] },
        { h: '7. Ley aplicable y contacto', ps: ['Estos términos se rigen por las leyes de la República del Perú.', 'Para consultas o reclamos: ' + contacto + '.'] }
      ]
    },
    privacidad: {
      label: 'Privacidad', title: 'Política de privacidad', date,
      intro: 'En V-IO tratamos tus datos personales con cuidado y solo para darte el servicio, conforme a la Ley N.° 29733, Ley de Protección de Datos Personales del Perú.',
      sections: [
        { h: '1. Qué datos usamos', ps: ['Tu nombre, número de WhatsApp y correo, cuando nos escribes para suscribirte o cotizar.', 'Tu plan, fecha de vencimiento y código de acceso (guardamos el código cifrado, no en texto legible).', 'Un identificador aleatorio de tu dispositivo, para que tu acceso funcione solo en los dispositivos de tu plan. No incluye tu ubicación ni datos de tu teléfono.'] },
        { h: '2. Para qué los usamos', ps: ['Para activar y mantener tu suscripción, darte acceso al catálogo, responder tus consultas y avisarte sobre renovaciones.', 'No vendemos ni alquilamos tus datos, ni los usamos para publicidad de terceros.'] },
        { h: '3. Dónde se guardan', ps: ['La web está alojada en Netlify, los datos de suscripción se guardan en Supabase y los archivos de video se sirven desde Google Drive. Estos proveedores pueden almacenar información fuera del Perú.', 'En tu navegador guardamos tu código e identificador de dispositivo para que no tengas que ingresar cada vez. Puedes borrarlos cerrando sesión o limpiando los datos del navegador.'] },
        { h: '4. Cuánto tiempo', ps: ['Conservamos tus datos mientras tengas una suscripción y hasta 12 meses después, salvo que pidas eliminarlos antes o la ley exija conservarlos.'] },
        { h: '5. Tus derechos', ps: ['Puedes pedir acceder, corregir, cancelar u oponerte al uso de tus datos (derechos ARCO) escribiéndonos por ' + contacto + '.'] }
      ]
    }
  };
}

/* =========================================================
   APP
   ========================================================= */
class App extends Component {

  /* ---------- Estado ---------- */
  constructor(props) {
    super(props);
    Object.assign(this.state, {
      configured: !!(this.cfg().url && this.cfg().key),
      aEmail: '', aPass: '', aBusy: false, aErr: '', listMsg: ''
    });
  }

  /* ---------- Supabase: utilidades ---------- */
  cfg() { const c = window.VIO_CONFIG || {}; return { url: String(c.SUPABASE_URL || '').replace(/\/+$/, ''), key: c.SUPABASE_ANON_KEY || '' }; }
  // localStorage seguro: ls(k) lee, ls(k, v) guarda, ls(k, null) borra
  ls(k, v) {
    try {
      if (v === undefined) return localStorage.getItem(k);
      if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v);
    } catch (e) { return null; }
    return null;
  }
  // Identificador aleatorio de este dispositivo (para el límite de dispositivos por plan)
  deviceId() {
    let d = this.ls('vio_dev');
    if (!d || d.length < 16) {
      const a = new Uint8Array(16);
      try { crypto.getRandomValues(a); } catch (e) { for (let i = 0; i < 16; i++) a[i] = Math.floor(Math.random() * 256); }
      d = Array.from(a).map((b) => b.toString(16).padStart(2, '0')).join('');
      this.ls('vio_dev', d);
    }
    return d;
  }
  async api(path, opt) {
    opt = opt || {};
    const { url, key } = this.cfg();
    const sess = opt.auth ? this.session : null;
    const headers = { apikey: key, 'Content-Type': 'application/json' };
    if (sess) headers.Authorization = 'Bearer ' + sess.access_token;
    else if (/^eyJ/.test(key)) headers.Authorization = 'Bearer ' + key;
    if (opt.prefer) headers.Prefer = opt.prefer;
    const res = await fetch(url + path, { method: opt.method || 'GET', headers, body: opt.body ? JSON.stringify(opt.body) : undefined });
    if (res.status === 401 && opt.auth && !opt.retried && await this.refreshSession()) return this.api(path, Object.assign({}, opt, { retried: true }));
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
    if (!res.ok) { const err = new Error((data && (data.msg || data.message || data.error_description || data.error)) || ('HTTP ' + res.status)); err.status = res.status; err.data = data; throw err; }
    return data;
  }
  rpc(fn, args, auth) { return this.api('/rest/v1/rpc/' + fn, { method: 'POST', body: args || {}, auth }); }

  /* ---------- Arranque ---------- */
  async initCaps() {
    if (this._init) return;
    this._init = true;
    if (!this.state.configured) { this.setState({ adminChecked: true, items: null }); return; }
    this.disp = this.deviceId();
    const raw = this.ls('vio_admin');
    if (raw) { try { this.session = JSON.parse(raw); } catch (e) { this.session = null; } }
    if (this.session) await this.checkAdmin(); else this.setState({ adminChecked: true });
    const saved = this.ls('vio_code');
    if (saved) await this.verify(saved, true);
    else await this.loadCatalog();
  }

  /* ---------- Admin: sesión ---------- */
  async refreshSession() {
    if (!this.session || !this.session.refresh_token) return false;
    try {
      const { url, key } = this.cfg();
      const res = await fetch(url + '/auth/v1/token?grant_type=refresh_token', { method: 'POST', headers: { apikey: key, 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: this.session.refresh_token }) });
      if (!res.ok) throw new Error('refresh');
      this.session = await res.json();
      this.ls('vio_admin', JSON.stringify(this.session));
      return true;
    } catch (e) {
      this.session = null; this.ls('vio_admin', null);
      this.setState({ isAdminUser: false });
      return false;
    }
  }
  async checkAdmin() {
    let ok = false;
    try { ok = !!(await this.rpc('es_admin', {}, true)); } catch (e) { ok = false; }
    if (!ok) { this.session = null; this.ls('vio_admin', null); }
    this.setState({ isAdminUser: ok, adminChecked: true });
    if (ok) await Promise.all([this.loadMembers(), this.loadCatalog()]);
    return ok;
  }
  async adminLogin() {
    if (this.state.aBusy) return;
    const email = this.state.aEmail.trim(), password = this.state.aPass;
    if (!email || !password) return this.setState({ aErr: 'Escribe tu correo y contraseña.' });
    this.setState({ aBusy: true, aErr: '' });
    try {
      const { url, key } = this.cfg();
      const res = await fetch(url + '/auth/v1/token?grant_type=password', { method: 'POST', headers: { apikey: key, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(res.status === 400 ? 'Correo o contraseña incorrectos.' : 'No se pudo iniciar sesión.');
      this.session = data;
      this.ls('vio_admin', JSON.stringify(data));
      const ok = await this.checkAdmin();
      this.setState({ aBusy: false, aPass: '', aErr: ok ? '' : 'Esta cuenta no es administradora. Revisa el paso 4 de la guía.' });
    } catch (e) {
      this.setState({ aBusy: false, aErr: e.message || 'No se pudo iniciar sesión.' });
    }
  }
  adminLogout() {
    this.session = null; this.ls('vio_admin', null);
    this.setState({ isAdminUser: false, members: [], newCode: null });
    this.loadCatalog();
  }

  /* ---------- Catálogo ---------- */
  mapRow(r) {
    return { id: r.id, title: r.title, cat: r.cat, len: r.len || '', premium: r.premium !== false, driveId: r.drive_id || '', kind: r.kind || 'video', createdAt: Date.parse(r.created_at) || 0 };
  }
  // Admin ve todo; un miembro ve los enlaces premium; el público solo los gratis.
  async loadCatalog() {
    if (!this.state.configured) return;
    try {
      let rows;
      if (this.state.isAdminUser) rows = await this.api('/rest/v1/visuales?select=*&order=created_at.desc', { auth: true });
      else if (this.state.member && this.memberCode) rows = await this.rpc('catalogo_miembro', { p_code: this.memberCode, p_disp: this.disp });
      else rows = await this.rpc('catalogo', {});
      this.setState({ items: (rows || []).map((r) => this.mapRow(r)), listMsg: '' });
    } catch (e) {
      this.setState({ items: this.state.items || [], listMsg: 'No se pudo cargar el catálogo.' });
    }
  }

  /* ---------- Acceso de clientes (códigos) ---------- */
  normCode(raw) {
    let s = String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (s.length === 8) s = 'VIO' + s;
    return s;
  }
  // Huella del código: es lo único que se guarda en la base de datos (igual que en schema.sql)
  async hash(raw) {
    const s = this.normCode(raw);
    try {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('v-io:' + s));
      return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      let h = 2166136261;
      for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
      return 'x' + h.toString(16) + s.length;
    }
  }
  genCode() {
    const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const a = new Uint8Array(8);
    try { crypto.getRandomValues(a); } catch (e) { for (let i = 0; i < 8; i++) a[i] = Math.floor(Math.random() * 256); }
    const ch = Array.from(a).map((n) => abc[n % abc.length]).join('');
    return 'VIO-' + ch.slice(0, 4) + '-' + ch.slice(4);
  }
  async verify(raw, silent) {
    if (!this.state.configured) { if (!silent) this.setState({ loginErr: 'El sistema de acceso aún no está configurado.' }); return; }
    const code = this.normCode(raw);
    if (code.length !== 11) { if (!silent) this.setState({ loginErr: 'Revisa tu código: tiene el formato VIO-XXXX-XXXX.' }); return; }
    this.setState({ loginBusy: true, loginErr: '' });
    try {
      const r = await this.rpc('canjear', { p_code: code, p_disp: this.disp || this.deviceId() });
      if (r && r.ok) {
        this.memberCode = code;
        this.ls('vio_code', code);
        this.setState({ member: { nombre: r.nombre || '', plan: r.plan || 'pro', expira: Date.parse(r.expira) }, loginBusy: false, code: '', loginErr: '' });
        await this.loadCatalog();
        return;
      }
      const err = r && r.error;
      this.ls('vio_code', null); this.memberCode = null;
      this.setState({
        loginBusy: false, member: null,
        loginErr: silent ? '' : err === 'otro' ? 'Este código ya está activo en todos los dispositivos que incluye su plan. Cada acceso es personal.'
          : err === 'vencido' ? 'Tu acceso venció. Escríbenos por WhatsApp para renovarlo.' : 'Código no válido.'
      });
      if (silent) await this.loadCatalog();
    } catch (e) {
      this.setState({ loginBusy: false, loginErr: silent ? '' : 'No pudimos verificar tu código. Revisa tu conexión.' });
      if (silent) await this.loadCatalog();
    }
  }
  logout() {
    this.ls('vio_code', null); this.memberCode = null;
    this.setState({ member: null, loginOpen: false });
    this.loadCatalog();
  }

  /* ---------- Admin: visuales ---------- */
  async doUpload() {
    if (this.state.uploading) return;
    const title = this.state.upTitle.trim();
    const fail = (m) => this.setState({ upMsg: m, upErr: true });
    if (/drive\.google\.com\/drive\/(u\/\d+\/)?folders/.test(this.state.driveUrl)) return fail('Ese es el enlace de una carpeta. Abre el archivo y copia su enlace.');
    const driveId = this.parseDrive(this.state.driveUrl);
    if (!driveId) return fail('Pega el enlace de un archivo de Google Drive.');
    if (!title) return fail('Escribe un título.');
    this.setState({ uploading: true, upMsg: 'Publicando…', upErr: false });
    try {
      await this.api('/rest/v1/visuales', { method: 'POST', auth: true, prefer: 'return=minimal', body: { title, cat: this.state.upCat, len: this.state.upLen.trim(), premium: !!this.state.upPremium, kind: this.state.upKind, drive_id: driveId } });
      this.setState({ uploading: false, upTitle: '', upLen: '', driveUrl: '', upMsg: 'Publicado en el catálogo', upErr: false });
      this.loadCatalog();
    } catch (e) {
      this.setState({ uploading: false, upMsg: 'No se pudo publicar: ' + (e.message || 'error'), upErr: true });
    }
  }
  async togglePremItem(t) {
    try { await this.api('/rest/v1/visuales?id=eq.' + t.id, { method: 'PATCH', auth: true, prefer: 'return=minimal', body: { premium: !t.premium } }); } catch (e) {}
    this.loadCatalog();
  }
  // Primer clic pide confirmación; el segundo elimina.
  async deleteItem(it) {
    if (this.state.confirmDel !== it.id) { this.setState({ confirmDel: it.id }); return; }
    this.setState({ confirmDel: null });
    try { await this.api('/rest/v1/visuales?id=eq.' + it.id, { method: 'DELETE', auth: true }); } catch (e) {}
    this.loadCatalog();
  }

  /* ---------- Admin: miembros ---------- */
  addMonths(base, n) { const d = new Date(base); d.setMonth(d.getMonth() + n); return d.getTime(); }
  async loadMembers() {
    try {
      const rows = await this.api('/rest/v1/miembros?select=id,nombre,plan,expira,disps,usado,creado&order=creado.desc', { auth: true });
      this.setState({ members: (rows || []).map((m) => ({ id: m.id, nombre: m.nombre, plan: m.plan, expira: Date.parse(m.expira), disps: m.disps || [], usado: m.usado, creado: Date.parse(m.creado) })) });
    } catch (e) {}
  }
  async createMember() {
    if (this.state.creating) return;
    const nombre = this.state.mName.trim();
    if (!nombre) return this.setState({ memMsg: 'Escribe el nombre del cliente.' });
    this.setState({ creating: true, memMsg: '', copied: false });
    try {
      const code = this.genCode();
      const code_hash = await this.hash(code);
      const expira = this.addMonths(Date.now(), this.state.mMonths);
      await this.api('/rest/v1/miembros', { method: 'POST', auth: true, prefer: 'return=minimal', body: { nombre, plan: this.state.mPlan, expira: new Date(expira).toISOString(), code_hash } });
      this.setState({ creating: false, newCode: { code, nombre, plan: this.state.mPlan, tel: this.state.mTel.replace(/\D/g, ''), expira }, mName: '', mTel: '' });
      this.loadMembers();
    } catch (e) {
      this.setState({ creating: false, memMsg: 'No se pudo crear el acceso: ' + (e.message || 'error') });
    }
  }
  async renewMember(m) {
    const base = Math.max(Number(m.expira) || 0, Date.now());
    try { await this.api('/rest/v1/miembros?id=eq.' + m.id, { method: 'PATCH', auth: true, prefer: 'return=minimal', body: { expira: new Date(this.addMonths(base, 1)).toISOString() } }); } catch (e) {}
    this.loadMembers();
  }
  async releaseMember(m) {
    try { await this.api('/rest/v1/miembros?id=eq.' + m.id, { method: 'PATCH', auth: true, prefer: 'return=minimal', body: { disps: [], usado: null } }); } catch (e) {}
    this.loadMembers();
  }
  async deleteMember(m) {
    if (this.state.confirmMem !== m.id) { this.setState({ confirmMem: m.id }); return; }
    this.setState({ confirmMem: null });
    try { await this.api('/rest/v1/miembros?id=eq.' + m.id, { method: 'DELETE', auth: true }); } catch (e) {}
    this.loadMembers();
  }

  /* ---------- Legales ---------- */
  legalDocs() {
    const wa = String((window.VIO_CONFIG || {}).WHATSAPP || '').replace(/\D/g, '');
    return textosLegales('WhatsApp +' + wa);
  }
  openLegal(id) { this.setState({ page: 'legal', legalDoc: id }); try { window.scrollTo({ top: 0 }); } catch (e) {} }

  /* =========================================================
     VALORES PARA LA PLANTILLA (se suman a los de Component)
     ========================================================= */
  renderVals() {
    const v = super.renderVals();
    return Object.assign(v, this.valsAdminLogin(v), this.valsLegal(), this.valsCatalogoReal(v));
  }
  valsAdminLogin(v) {
    const cfgd = this.state.configured;
    return {
      notConfigured: !cfgd,
      adminDenied: cfgd && this.state.adminChecked && !this.state.isAdminUser,
      aEmail: this.state.aEmail, aPass: this.state.aPass,
      onAEmail: (e) => this.setState({ aEmail: e.target.value, aErr: '' }),
      onAPass: (e) => this.setState({ aPass: e.target.value, aErr: '' }),
      onAKey: (e) => { if (e && e.key === 'Enter') this.adminLogin(); },
      doAdminLogin: () => this.adminLogin(),
      hasAErr: !!this.state.aErr, aErr: this.state.aErr,
      aBtnLabel: this.state.aBusy ? 'Entrando…' : 'Entrar como admin',
      aBtnStyle: v.createBtnStyle,
      adminLogout: () => this.adminLogout(),
      hasListMsg: !!this.state.listMsg, listMsg: this.state.listMsg
    };
  }
  valsLegal() {
    const docs = this.legalDocs();
    const cur = docs[this.state.legalDoc] || docs.licencia;
    const seg = 'flex-shrink: 0; border: 0; cursor: pointer; font: inherit; font-size: 15px; font-weight: 600; padding: 10px 18px; min-height: 44px; border-radius: 999px; ';
    return {
      isLegal: this.state.page === 'legal', legal: cur,
      legalTabs: Object.keys(docs).map((k) => ({ label: docs[k].label, selected: cur === docs[k] ? 'true' : 'false', style: seg + (cur === docs[k] ? 'background: #FFFFFF; color: #000F15' : 'background: transparent; color: #B6C2E7'), pick: () => this.openLegal(k) })),
      goLicencia: () => this.openLegal('licencia'), goTerminos: () => this.openLegal('terminos'), goPrivacidad: () => this.openLegal('privacidad')
    };
  }
  // Con Supabase conectado nunca se muestran los visuales de ejemplo:
  // si aún no hay visuales, la página dice "Nuevos visuales muy pronto".
  valsCatalogoReal(v) {
    if (!this.state.configured) return { catalogSoon: false };
    const items = this.state.items;
    const soon = Array.isArray(items) && items.length === 0;
    const tr = v.tracks.filter((t) => t.real);
    return { catalogSoon: soon, tracks: tr, noTracks: !soon && Array.isArray(items) && tr.length === 0 };
  }
}
