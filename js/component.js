/* =========================================================
   V-IO · interfaz (class Component)
   Estado de la página, navegación, catálogo, planes, FAQ y
   todos los valores que la plantilla muestra en sus {{huecos}}.

   Las acciones que hablan con la base de datos (verify, logout,
   doUpload, togglePremItem, deleteItem, createMember, renewMember,
   releaseMember, deleteMember, abrirPortada...) están en js/app.js (class App).
   ========================================================= */

/* =========================================================
   TEXTOS EDITABLES
   ========================================================= */

// Precio "desde" de los visuales a medida
const PRECIO_A_MEDIDA = 'S/ 350';

// Planes de suscripción. m = precio mensual, y = precio anual.
// Si cambias "dispositivos", cámbialo también en supabase/schema.sql (función max_disp).
const PLANES = [
  { id: 'dj', name: 'DJ / VJ', desc: 'Para DJs y VJs.', m: 'S/ 39', y: 'S/ 390', dispositivos: 1, features: ['Todo el catálogo', '1 dispositivo', 'Licencia para tus sets'], cta: 'Elegir' },
  { id: 'pro', name: 'PRO', featured: true, desc: 'Para clubs y eventos.', m: 'S/ 89', y: 'S/ 890', dispositivos: 2, features: ['Todo el catálogo', '2 dispositivos', 'Licencia para clubs y eventos'], cta: 'PRO Access' },
  { id: 'prod', name: 'Productora', desc: 'Para equipos y venues.', m: 'S/ 249', y: 'S/ 2,490', dispositivos: 5, features: ['Todo el catálogo', '5 dispositivos', 'Licencia para venues y productoras'], cta: 'Elegir' }
];
const NOMBRE_PLAN = {};
PLANES.forEach((p) => { NOMBRE_PLAN[p.id] = p.name; });

// Preguntas frecuentes (página Contacto)
const FAQ = [
  { q: '¿Sirve para eventos pagados?', a: 'Sí, con los planes PRO y Productora. El plan DJ / VJ cubre tus propios sets y presentaciones.' },
  { q: '¿En cuántos dispositivos puedo usarlo?', a: 'DJ / VJ en 1, PRO en 2 y Productora en 5. Tu código se activa en cada dispositivo la primera vez que lo usas. Si cambias de equipo, escríbenos y lo liberamos.' },
  { q: '¿Funciona en Resolume?', a: 'Sí, y en VirtualDJ, Serato Video, MadMapper o cualquier software VJ.' },
  { q: '¿Qué formatos incluye?', a: 'MP4 o MOV, en la resolución y formato indicados en cada visual (16:9, vertical o panorámico para LED).' },
  { q: '¿Hacen visuales personalizados?', a: 'Sí. Logos animados, intros, contenido para LED de cualquier medida y shows completos. Cotiza por WhatsApp, desde ' + PRECIO_A_MEDIDA + '.' },
  { q: '¿Cómo pago?', a: 'Con tarjeta, Yape o transferencia por WhatsApp. Al confirmar el pago te enviamos tu código de acceso.' },
  { q: '¿Si cancelo, pierdo mis descargas?', a: 'No. Lo que descargaste mientras estabas suscrito lo puedes seguir usando.' },
  { q: '¿Cómo cancelo?', a: 'Escríbenos por WhatsApp y lo cancelamos al instante. Sin permanencia.' }
];

// Categorías del catálogo (el id se guarda en la base de datos: no lo cambies)
const CATEGORIAS = [
  { id: 'vj', label: 'VJ loops' }, { id: 'led', label: 'LED' },
  { id: 'intro', label: 'Intros DJ' }, { id: 'tema', label: 'Temáticos' }
];
const FILTROS = [{ id: 'all', label: 'Todos' }].concat(CATEGORIAS);

// Tipos de visual en el formulario "Cotizar a medida"
const TIPOS_COTIZACION = [
  { id: 'logo', label: 'Logo animado / intro' }, { id: 'led', label: 'Contenido LED' },
  { id: 'evento', label: 'Visuales para evento' }, { id: 'show', label: 'Show completo' }
];

// Duraciones al crear un acceso en Admin → Miembros: [meses, texto]
const DURACIONES_ACCESO = [[1, '1 mes'], [3, '3 meses'], [12, '1 año']];

// Catálogo de ejemplo: se muestra solo si config.js no tiene Supabase.
// Los 4 primeros son gratis y el resto premium.
const VISUALES_DEMO = [
  { title: 'Neón Líquido', tag: 'VJ loops', type: 'vj', count: '12', len: '0:30 loop' },
  { title: 'Cosmic Night', tag: 'LED', type: 'led', count: '8', len: '0:45 loop' },
  { title: 'Entrada Headliner', tag: 'Intros DJ', type: 'intro', count: '6', len: '0:20 min' },
  { title: 'Noche Neón', tag: 'Temáticos', type: 'tema', count: '10', len: '1:00 loop' },
  { title: 'Láser Grid', tag: 'LED', type: 'led', count: '9', len: '0:30 loop' },
  { title: 'Año Nuevo', tag: 'Temáticos', type: 'tema', count: '5', len: '1:00 min' },
  { title: 'Jungla Ácida', tag: 'VJ loops', type: 'vj', count: '14', len: '0:40 loop' },
  { title: 'Drop Countdown', tag: 'Intros DJ', type: 'intro', count: '4', len: '0:15 min' }
];

/* =========================================================
   DISEÑO COMPARTIDO
   ========================================================= */

// Fondos animados de las tarjetas: [color de fondo, forma A, forma B]
const ESCENAS = [
  ['#0B1D3F', 'width: 90%; height: 60%; left: -20%; bottom: 10%; border-radius: 50%; background: #6F8AD5; filter: blur(26px); animation: drift 8s ease-in-out infinite alternate', 'width: 70%; height: 50%; right: -15%; bottom: 0; border-radius: 50%; background: #1CA9E5; filter: blur(18px); animation: drift2 6s ease-in-out infinite alternate'],
  ['#0E2A5C', 'width: 120%; height: 60%; left: -10%; top: -15%; border-radius: 50%; background: #86D3D8; filter: blur(30px); animation: drift 7s ease-in-out infinite alternate', 'width: 3px; height: 80%; left: 50%; top: -6%; transform-origin: top center; background: #FFFFFF; animation: sweep 3s ease-in-out infinite alternate'],
  ['#07070C', 'width: 80%; height: 80%; left: 10%; top: 0; border-radius: 50%; background: #86D3D8; filter: blur(30px); animation: drift2 9s ease-in-out infinite alternate', 'width: 60%; height: 40%; right: -10%; top: 40%; border-radius: 50%; background: #1CA9E5; filter: blur(20px); animation: drift 5s ease-in-out infinite alternate'],
  ['#1B2350', 'width: 70%; height: 70%; left: 15%; top: 5%; border-radius: 50%; background: #6F8AD5; filter: blur(28px); animation: drift 6s ease-in-out infinite alternate', 'width: 100%; height: 26%; left: 0; top: 46%; background: #50BFED; opacity: 0.55; filter: blur(16px); animation: drift2 4s ease-in-out infinite alternate'],
  ['#06121F', 'width: 3px; height: 130%; left: 50%; top: -15%; transform-origin: top center; background: #86D3D8; animation: sweep 2.6s ease-in-out infinite alternate', 'width: 3px; height: 130%; left: 50%; top: -15%; transform-origin: top center; background: #86D3D8; animation: sweep2 3.4s ease-in-out infinite alternate'],
  ['#00303C', 'width: 90%; height: 70%; left: 5%; top: 8%; border-radius: 50%; background: #1CA9E5; filter: blur(30px); animation: drift2 7s ease-in-out infinite alternate', 'width: 46%; height: 36%; left: 27%; top: 22%; border-radius: 50%; background: #ECF1FF; filter: blur(14px); animation: drift 3.5s ease-in-out infinite alternate'],
  ['#001E28', 'width: 80%; height: 60%; left: -10%; top: 20%; border-radius: 50%; background: #50BFED; filter: blur(28px); animation: drift 7s ease-in-out infinite alternate', 'width: 50%; height: 50%; right: -5%; top: 5%; border-radius: 50%; background: #E8F5FF; filter: blur(24px); animation: drift2 5s ease-in-out infinite alternate'],
  ['#0B1230', 'width: 3px; height: 130%; left: 50%; top: -15%; transform-origin: top center; background: #6F8AD5; animation: sweep2 2.8s ease-in-out infinite alternate', 'width: 70%; height: 50%; left: 15%; bottom: -10%; border-radius: 50%; background: #6F8AD5; filter: blur(26px); animation: drift 6s ease-in-out infinite alternate']
];

// Estilos que cambian según el estado (botón activo / inactivo, ocupado...)
const ESTILOS = (() => {
  const segBase = 'flex-shrink: 0; border: 0; cursor: pointer; font: inherit; font-size: 15px; font-weight: 600; padding: 11px 20px; min-height: 44px; border-radius: 999px; transition: all .25s ease; ';
  const bigBtn = 'display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 58px; padding: 16px; border: 0; border-radius: 999px; cursor: pointer; font: inherit; font-size: 17px; font-weight: 700; ';
  const ctaBase = 'display: flex; align-items: center; justify-content: center; width: 100%; min-height: 56px; cursor: pointer; font: inherit; font-size: 17px; font-weight: 700; padding: 16px 24px; border-radius: 999px; ';
  return {
    // menú
    navOn: 'height: 46px; display: inline-flex; align-items: center; gap: 8px; padding: 0 18px 0 5px; border-radius: 999px; background: #FFFFFF2E; border: 0.5px solid #FFFFFF1A; box-shadow: inset 0 0.5px 0 #FFFFFF40; color: #FFFFFF; cursor: pointer; font: inherit; font-size: 15px; font-weight: 600; white-space: nowrap; transition: all .3s cubic-bezier(.2,.8,.2,1)',
    navOff: 'height: 46px; width: 46px; display: inline-flex; align-items: center; justify-content: center; padding: 0; border-radius: 999px; border: 1px solid transparent; background: transparent; color: #9DB0C2; cursor: pointer; transition: all .3s cubic-bezier(.2,.8,.2,1)',
    boxOn: 'width: 36px; height: 36px; border-radius: 50%; background: #FFFFFF; color: #000F15; display: inline-flex; align-items: center; justify-content: center; ',
    boxOff: 'width: 36px; height: 36px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center',
    // segmentos y chips
    segOn: segBase + 'background: #FFFFFF; color: #000F15; ',
    segOff: segBase + 'background: transparent; color: #B6C2E7',
    chipOff: segBase + 'background: #FFFFFF14; color: #ECF1FF; border: 0.5px solid #FFFFFF14',
    // botones
    smallBtn: 'min-height: 40px; padding: 8px 14px; border-radius: 999px; cursor: pointer; font: inherit; font-size: 14px; font-weight: 600; flex-shrink: 0; ',
    btnHot: bigBtn + 'background: #F7F9FF; color: #000F15; ',
    btnBusy: bigBtn + 'background: #FFFFFF26; color: #F7F9FF; cursor: progress',
    // tarjetas de planes
    card: 'padding: 30px; border-radius: 34px; background: #FFFFFF0F; border: 0.5px solid #FFFFFF12; box-shadow: inset 0 0.5px 0 #FFFFFF26; display: flex; flex-direction: column; gap: 18px',
    cardHot: 'padding: 30px; border-radius: 34px; background: #FFFFFF1A; border: 0.5px solid #FFFFFF33; box-shadow: inset 0 0.5px 0 #FFFFFF4D; display: flex; flex-direction: column; gap: 18px',
    cta: ctaBase + 'background: #FFFFFF1A; border: 0.5px solid #FFFFFF14; color: #F7F9FF',
    ctaHot: ctaBase + 'border: 0; background: #F7F9FF; color: #000F15; '
  };
})();

/* =========================================================
   COMPONENTE
   ========================================================= */
class Component extends DCLogic {

  /* ---------- Estado ---------- */
  constructor(props) {
    super(props);
    this.state = {
      // navegación y catálogo
      page: null, filter: 'all', filtersOpen: false, query: '', preview: null,
      // planes y pago
      annual: false, sheetPlan: null, email: '', emailTouched: false,
      // cotización a medida
      quoteOpen: false, qType: 'logo', qName: '', qDate: '', qDetail: '',
      // datos (los llena App)
      items: null, members: [], isAdminUser: false, adminChecked: false,
      // cuenta del cliente
      member: null, loginOpen: false, code: '', loginErr: '', loginBusy: false,
      // admin: visuales
      adminTab: 'visuales', driveUrl: '', upKind: 'video', upTitle: '', upCat: 'vj', upLen: '', upPremium: true, uploading: false, upMsg: '', upErr: false, confirmDel: null,
      // admin: miembros
      mName: '', mTel: '', mPlan: 'pro', mMonths: 1, creating: false, memMsg: '', newCode: null, copied: false, confirmMem: null
    };
  }
  componentDidMount() { this.initCaps(); }
  initCaps() {} // App carga aquí los datos

  /* ---------- Utilidades ---------- */
  fmtDate(ms) { try { return new Date(ms).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return ''; } }
  parseDrive(url) {
    const u = String(url || '').trim();
    let m = u.match(/\/d\/([a-zA-Z0-9_-]{20,})/) || u.match(/[?&]id=([a-zA-Z0-9_-]{20,})/);
    if (m) return m[1];
    if (/^[a-zA-Z0-9_-]{25,}$/.test(u)) return u;
    return '';
  }
  waLink(msg) {
    const wa = String(this.props.whatsapp ?? '51XXXXXXXXX').replace(/\D/g, '');
    return 'https://wa.me/' + wa + '?text=' + encodeURIComponent(msg);
  }

  /* ---------- Navegación ---------- */
  go(page) {
    this.setState({ page });
    try { window.scrollTo({ top: 0 }); } catch (e) {}
  }

  /* =========================================================
     VALORES PARA LA PLANTILLA
     renderVals() devuelve un objeto con cada {{hueco}} de index.html.
     Se arma por secciones; App (app.js) añade admin-login,
     legales y el estado del catálogo real.
     ========================================================= */
  renderVals() {
    const page = this.state.page ?? (this.props.startPage ?? 'home');
    const member = this.state.member && this.state.member.expira > Date.now() ? this.state.member : null;
    const real = this.catalogoReal(member);
    const all = real.length ? real : this.catalogoDemo(member);
    return Object.assign(
      {
        accent: this.props.accent ?? '#1CA9E5',
        stop: (e) => { if (e && e.stopPropagation) e.stopPropagation(); },
        hideImg: (e) => { try { e.target.style.display = 'none'; } catch (x) {} }
      },
      this.valsNavegacion(page),
      this.valsCatalogo(all, member),
      this.valsPreview(all, member),
      this.valsPlanes(),
      this.valsCuenta(member),
      this.valsContacto(),
      this.valsAdmin(real),
      this.valsMiembros()
    );
  }

  /* ---------- Navegación ---------- */
  valsNavegacion(page) {
    const nav = {};
    ['home', 'visuales', 'planes', 'contacto', 'admin'].forEach((id) => {
      const on = page === id;
      nav[id] = { on, current: on ? 'page' : 'false', style: on ? ESTILOS.navOn : ESTILOS.navOff, box: on ? ESTILOS.boxOn : ESTILOS.boxOff, pick: () => this.go(id) };
    });
    return {
      nav,
      isHome: page === 'home', isVisuales: page === 'visuales', isPlanes: page === 'planes', isContacto: page === 'contacto', isAdmin: page === 'admin'
    };
  }

  /* ---------- Catálogo ---------- */
  // Visuales guardados en Supabase (ya mapeados por App.mapRow), más nuevos primero
  catalogoReal(member) {
    const catLabel = {};
    CATEGORIAS.forEach((c) => { catLabel[c.id] = c.label; });
    return (this.state.items || []).slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).map((d) => {
      const premium = d.premium !== false;
      return {
        key: d.id, id: d.id, title: d.title || 'Sin título', tag: catLabel[d.cat] || 'VJ loops', type: d.cat || 'vj', count: '', len: d.len || '',
        scene: ESCENAS[Math.abs(String(d.id).split('').reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) | 0, 7)) % ESCENAS.length], real: true, premium, locked: premium && !member,
        driveId: d.driveId || '', kind: d.kind === 'image' ? 'image' : 'video', file: d.title || 'visual'
      };
    });
  }
  catalogoDemo(member) {
    return VISUALES_DEMO.map((t, i) => ({ ...t, key: 'd' + i, scene: ESCENAS[i], real: false, premium: i >= 4, locked: i >= 4 && !member }));
  }
  // Datos de una tarjeta del catálogo. Los premium bloqueados no traen enlace de Drive: sin miniatura.
  tarjeta(t) {
    return {
      ...t,
      isImg: t.real && !!t.driveId,
      thumb: t.real ? 'https://drive.google.com/thumbnail?id=' + t.driveId + '&sz=w800' : '',
      hasCount: !!t.count,
      badge: t.premium ? 'Premium' : 'Gratis',
      openLabel: t.locked ? 'Desbloquear ' + t.title : 'Ver preview de ' + t.title,
      open: () => (t.locked ? this.setState({ sheetPlan: 'pro', emailTouched: false }) : this.setState({ preview: t.key })),
      coverStyle: 'position: relative; display: block; width: 100%; padding: 0; border: 0; cursor: pointer; overflow: hidden; aspect-ratio: 4 / 5; border-radius: 28px; background: ' + t.scene[0] + '; box-shadow: inset 0 0 0 0.5px #FFFFFF14; text-align: left; font: inherit',
      shapeA: t.scene[1] ? 'position: absolute; ' + t.scene[1] : 'display: none',
      shapeB: t.scene[2] ? 'position: absolute; ' + t.scene[2] : 'display: none'
    };
  }
  valsCatalogo(all, member) {
    const { filter, query } = this.state;
    const filters = FILTROS.map((f) => ({
      label: f.label, pressed: filter === f.id ? 'true' : 'false', style: filter === f.id ? ESTILOS.segOn : ESTILOS.chipOff,
      pick: () => this.setState({ filter: f.id })
    }));
    const activeFilter = FILTROS.find((f) => f.id === filter);
    const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const q = norm(query.trim());
    const tracks = all
      .filter((t) => filter === 'all' || t.type === filter)
      .filter((t) => !q || norm(t.title + ' ' + t.tag).includes(q))
      .map((t) => this.tarjeta(t));
    return {
      filters, tracks, noTracks: tracks.length === 0,
      resetAll: () => this.setState({ query: '', filter: 'all' }),
      filtersOpen: this.state.filtersOpen,
      filtersExpanded: this.state.filtersOpen ? 'true' : 'false',
      toggleFilters: () => this.setState({ filtersOpen: !this.state.filtersOpen }),
      plusStyle: 'transition: transform .3s ease; transform: rotate(' + (this.state.filtersOpen ? 45 : 0) + 'deg)',
      filterSummary: filter === 'all' ? '' : '· ' + activeFilter.label,
      query, hasQuery: query.length > 0,
      onQuery: (e) => this.setState({ query: e.target.value }),
      clearQuery: () => this.setState({ query: '' })
    };
  }

  /* ---------- Vista previa ---------- */
  valsPreview(all, member) {
    const pv = this.state.preview != null ? all.find((t) => t.key === this.state.preview) : null;
    const preview = pv ? {
      title: pv.title, meta: pv.tag + (pv.len ? ' · ' + pv.len : ''),
      stage: 'position: relative; overflow: hidden; aspect-ratio: 16 / 9; background: ' + (pv.real ? '#000000' : pv.scene[0]),
      shapeA: pv.scene[1] ? 'position: absolute; ' + pv.scene[1] : 'display: none',
      shapeB: pv.scene[2] ? 'position: absolute; ' + pv.scene[2] : 'display: none',
      isDemo: !pv.real, isDrive: pv.real,
      driveSrc: pv.real ? 'https://drive.google.com/file/d/' + pv.driveId + '/preview' : '',
      driveView: pv.real ? 'https://drive.google.com/file/d/' + pv.driveId + '/view' : '',
      canOpenDrive: pv.real && !pv.locked,
      src: pv.real ? 'https://drive.google.com/uc?export=download&id=' + pv.driveId : '', file: pv.file || pv.title,
      canDownload: pv.real && !pv.locked, showUnlock: !(pv.real && !pv.locked) && !member
    } : { title: '', meta: '', stage: '', shapeA: '', shapeB: '', isDemo: false, isDrive: false, driveSrc: '', driveView: '', canOpenDrive: false, src: '', file: '', canDownload: false, showUnlock: false };
    return {
      previewOpen: pv != null, preview,
      closePreview: () => this.setState({ preview: null }),
      previewToPro: () => this.setState({ preview: null, sheetPlan: 'pro', emailTouched: false })
    };
  }

  /* ---------- Planes y pago ---------- */
  valsPlanes() {
    const annual = this.state.annual;
    const plans = PLANES.map((p) => ({
      ...p, price: annual ? p.y : p.m, featured: !!p.featured,
      cardStyle: p.featured ? ESTILOS.cardHot : ESTILOS.card, ctaStyle: p.featured ? ESTILOS.ctaHot : ESTILOS.cta,
      choose: () => this.setState({ sheetPlan: p.id, emailTouched: false })
    }));
    const sp = PLANES.find((p) => p.id === this.state.sheetPlan);
    const email = this.state.email;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const checkoutStyle = 'display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 60px; box-sizing: border-box; padding: 18px; border-radius: 999px; text-decoration: none; font-size: 18px; font-weight: 700; ' + (emailValid ? 'background: #F7F9FF; color: #000F15; ' : 'background: #FFFFFF26; color: #F7F9FF');
    return {
      plans,
      period: annual ? '/ año' : '/ mes',
      monthlyStyle: annual ? ESTILOS.segOff : ESTILOS.segOn,
      annualStyle: annual ? ESTILOS.segOn : ESTILOS.segOff,
      monthlyStyleWide: (annual ? ESTILOS.segOff : ESTILOS.segOn) + '; flex: 1',
      annualStyleWide: (annual ? ESTILOS.segOn : ESTILOS.segOff) + '; flex: 1',
      monthlyPressed: annual ? 'false' : 'true',
      annualPressed: annual ? 'true' : 'false',
      setMonthly: () => this.setState({ annual: false }),
      setAnnual: () => this.setState({ annual: true }),
      openPro: () => this.setState({ sheetPlan: 'pro', emailTouched: false }),
      sheetOpen: !!sp, sheet: { name: sp ? sp.name : '', price: sp ? (annual ? sp.y : sp.m) : '' },
      closeSheet: () => this.setState({ sheetPlan: null }),
      email, emailError: this.state.emailTouched && !emailValid,
      onEmail: (e) => this.setState({ email: e.target.value }),
      checkout: (e) => { if (!emailValid) { if (e && e.preventDefault) e.preventDefault(); this.setState({ emailTouched: true }); } },
      checkoutStyle,
      checkoutHref: this.waLink('Hola V-IO, quiero el plan ' + (sp ? sp.name : '') + ' ' + (annual ? 'anual (' + (sp ? sp.y : '') + ')' : 'mensual (' + (sp ? sp.m : '') + ')') + '. Mi correo: ' + email)
    };
  }

  /* ---------- Cuenta del cliente (Ingresar / Mi cuenta) ---------- */
  valsCuenta(member) {
    const planName = member ? NOMBRE_PLAN[member.plan] || 'PRO' : '';
    return {
      isMember: !!member, notMember: !member,
      member: member ? { planName, until: this.fmtDate(member.expira) } : { planName: '', until: '' },
      accountLabel: member ? 'Mi cuenta' : 'Ingresar',
      accountBtnStyle: 'width: 44px; height: 44px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); ' + (member ? 'border: 0; background: #F7F9FF; color: #000F15' : 'border: 0.5px solid #FFFFFF1F; background: #FFFFFF1F; color: #FFFFFF'),
      proLabel: member ? planName + ' activo' : 'PRO',
      memberPillLabel: member ? planName + ' activo' : 'Ingresar',
      memberPillStyle: 'flex-shrink: 0; display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 10px 16px; border-radius: 999px; cursor: pointer; font: inherit; font-size: 15px; font-weight: 600; ' + (member ? 'border: 0; background: #F7F9FF; color: #000F15' : 'border: 0.5px solid #FFFFFF14; background: #FFFFFF14; color: #F7F9FF'),
      accountCardTitle: member ? 'Mi cuenta' : 'Ingresar con mi código',
      accountCardSub: member ? planName + ' activo hasta el ' + this.fmtDate(member.expira) : 'Accede a todo el catálogo premium',
      loginOpen: this.state.loginOpen,
      loginTitle: member ? 'Mi cuenta' : 'Ingresar',
      loginSub: member ? (member.nombre || 'Miembro V-IO') : 'Accede con tu código PRO',
      openLogin: () => this.setState({ loginOpen: true, loginErr: '' }),
      closeLogin: () => this.setState({ loginOpen: false }),
      sheetToLogin: () => this.setState({ sheetPlan: null, loginOpen: true, loginErr: '' }),
      loginToPlanes: () => { this.setState({ loginOpen: false }); this.go('planes'); },
      memberToVisuales: () => { this.setState({ loginOpen: false }); this.go('visuales'); },
      logout: () => this.logout(),
      code: this.state.code,
      onCode: (e) => this.setState({ code: e.target.value, loginErr: '' }),
      onCodeKey: (e) => { if (e && e.key === 'Enter') this.verify(this.state.code, false); },
      doLogin: () => { if (!this.state.loginBusy) this.verify(this.state.code, false); },
      hasLoginErr: !!this.state.loginErr, loginErr: this.state.loginErr,
      loginBtnLabel: this.state.loginBusy ? 'Verificando…' : 'Entrar',
      loginBtnStyle: this.state.loginBusy ? ESTILOS.btnBusy : ESTILOS.btnHot
    };
  }

  /* ---------- Contacto, FAQ y cotización a medida ---------- */
  valsContacto() {
    const qSel = TIPOS_COTIZACION.find((t) => t.id === this.state.qType) || TIPOS_COTIZACION[0];
    const quoteTypes = TIPOS_COTIZACION.map((t) => ({
      label: t.label, pressed: t.id === qSel.id ? 'true' : 'false', style: t.id === qSel.id ? ESTILOS.segOn : ESTILOS.chipOff,
      pick: () => this.setState({ qType: t.id })
    }));
    const quoteMsg = 'Hola V-IO, quiero cotizar un visual a medida.\n' +
      '• Tipo: ' + qSel.label + '\n' +
      (this.state.qName ? '• Nombre / marca: ' + this.state.qName + '\n' : '') +
      (this.state.qDate ? '• Fecha del evento: ' + this.state.qDate + '\n' : '') +
      (this.state.qDetail ? '• Idea: ' + this.state.qDetail : '');
    return {
      waHref: this.waLink('Hola V-IO, tengo una consulta.'),
      customFrom: PRECIO_A_MEDIDA,
      faqs: FAQ.map((f, i) => ({ ...f, style: 'padding: 16px 22px;' + (i > 0 ? ' border-top: 0.5px solid #FFFFFF0F;' : '') })),
      quoteTypes, quoteHref: this.waLink(quoteMsg),
      quoteOpen: this.state.quoteOpen,
      openQuote: () => this.setState({ quoteOpen: true }),
      closeQuote: () => this.setState({ quoteOpen: false }),
      qName: this.state.qName, qDate: this.state.qDate, qDetail: this.state.qDetail,
      onQName: (e) => this.setState({ qName: e.target.value }),
      onQDate: (e) => this.setState({ qDate: e.target.value }),
      onQDetail: (e) => this.setState({ qDetail: e.target.value })
    };
  }

  /* ---------- Admin: resumen y visuales ---------- */
  valsAdmin(real) {
    const isAdminUser = this.state.isAdminUser;
    const now = Date.now();
    const members = this.state.members;
    const stats = [
      { value: String(real.length), label: 'Visuales' },
      { value: String(real.filter((t) => t.premium).length), label: 'Premium' },
      { value: String(members.filter((m) => Number(m.expira) > now).length), label: 'Miembros activos' },
      { value: String(members.filter((m) => !(m.disps || []).length && Number(m.expira) > now).length), label: 'Códigos sin usar' }
    ];
    const adminTabs = [{ id: 'visuales', label: 'Visuales' }, { id: 'miembros', label: 'Miembros' }, { id: 'portada', label: 'Portada' }].map((tb) => ({
      label: tb.label, selected: this.state.adminTab === tb.id ? 'true' : 'false',
      style: this.state.adminTab === tb.id ? ESTILOS.segOn : ESTILOS.segOff,
      pick: () => (tb.id === 'portada' ? this.abrirPortada() : this.setState({ adminTab: tb.id }))
    }));
    const upCats = CATEGORIAS.map((c) => ({
      label: c.label, pressed: this.state.upCat === c.id ? 'true' : 'false',
      style: this.state.upCat === c.id ? ESTILOS.segOn : ESTILOS.chipOff, pick: () => this.setState({ upCat: c.id })
    }));
    const adminItems = real.map((t) => {
      const c = this.tarjeta(t);
      const confirming = this.state.confirmDel === t.id;
      return {
        title: t.title, isImg: true, thumb: c.thumb, // el admin siempre recibe el enlace de Drive
        meta: t.tag + (t.len ? ' · ' + t.len : '') + ' · ' + (t.kind === 'video' ? 'Video' : 'Imagen') + ' · Drive',
        premLabel: t.premium ? 'Premium' : 'Gratis',
        premAria: 'Cambiar a ' + (t.premium ? 'gratis' : 'premium') + ': ' + t.title,
        premStyle: ESTILOS.smallBtn + (t.premium ? 'border: 0; background: #F7F9FF; color: #000F15' : 'border: 0.5px solid #FFFFFF1F; background: #FFFFFF14; color: #F7F9FF'),
        togglePrem: () => this.togglePremItem(t),
        delLabel: confirming ? '¿Eliminar?' : '',
        delAria: 'Eliminar ' + t.title,
        delStyle: confirming
          ? ESTILOS.smallBtn + 'border: 0; background: #FF4D5E; color: #FFFFFF'
          : 'width: 40px; height: 40px; flex-shrink: 0; border-radius: 50%; border: 0.5px solid #FFFFFF14; cursor: pointer; background: #FFFFFF0F url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2718%27 height=%2718%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23FF8A95%27 stroke-width=%271.8%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27M4.5 6.5h15M9.5 6.5V4.8a.8.8 0 01.8-.8h3.4a.8.8 0 01.8.8v1.7M6.5 6.5l.8 12.2a1.6 1.6 0 001.6 1.5h6.2a1.6 1.6 0 001.6-1.5l.8-12.2%27/%3E%3C/svg%3E") center / 18px no-repeat',
        del: () => this.deleteItem(t)
      };
    });
    const driveId = this.parseDrive(this.state.driveUrl);
    const prem = this.state.upPremium;
    return {
      isAdminUser, adminOk: isAdminUser, adminDenied: this.state.adminChecked && !isAdminUser, adminLoading: !this.state.adminChecked,
      openAdmin: () => { this.setState({ loginOpen: false }); this.go('admin'); },
      stats, adminTabs, tabVisuales: this.state.adminTab === 'visuales', tabMiembros: this.state.adminTab === 'miembros', tabPortada: this.state.adminTab === 'portada',
      // formulario "Subir visual"
      driveUrl: this.state.driveUrl,
      onDriveUrl: (e) => this.setState({ driveUrl: e.target.value, upMsg: '' }),
      canPaste: typeof navigator !== 'undefined' && !!(navigator.clipboard && navigator.clipboard.readText),
      pasteDrive: () => { try { navigator.clipboard.readText().then((t) => this.setState({ driveUrl: (t || '').trim(), upMsg: '' }), () => {}); } catch (e) {} },
      driveHint: !this.state.driveUrl ? 'En Drive: Compartir → Acceso general → "Cualquier persona con el enlace" → Copiar enlace.' : driveId ? 'Enlace válido ✓  Recuerda que esté compartido como "Cualquier persona con el enlace".' : 'No reconozco ese enlace. Debe ser de un archivo (no de una carpeta).',
      driveHintColor: !this.state.driveUrl ? '#7F93A6' : driveId ? '#7FF5CC' : '#FF8A95',
      driveBorder: !this.state.driveUrl ? '#FFFFFF14' : driveId ? '#7FF5CC66' : '#FF8A9566',
      upKinds: [{ id: 'video', label: 'Video' }, { id: 'image', label: 'Imagen' }].map((k) => ({
        label: k.label, pressed: this.state.upKind === k.id ? 'true' : 'false',
        style: this.state.upKind === k.id ? ESTILOS.segOn : ESTILOS.chipOff, pick: () => this.setState({ upKind: k.id })
      })),
      upTitle: this.state.upTitle, onUpTitle: (e) => this.setState({ upTitle: e.target.value }),
      upLen: this.state.upLen, onUpLen: (e) => this.setState({ upLen: e.target.value }),
      upCats,
      upPremiumAria: prem ? 'true' : 'false',
      upPremiumLabel: prem ? 'Premium (solo miembros)' : 'Gratis (visible para todos)',
      togglePremium: () => this.setState({ upPremium: !prem }),
      switchTrack: 'position: relative; width: 51px; height: 31px; flex-shrink: 0; border-radius: 999px; transition: background .25s ease; background: ' + (prem ? '#34C759' : '#FFFFFF29'),
      switchKnob: 'position: absolute; top: 2px; left: ' + (prem ? '22px' : '2px') + '; width: 27px; height: 27px; border-radius: 50%; background: #FFFFFF; transition: left .25s cubic-bezier(.2,.8,.2,1)',
      doUpload: () => this.doUpload(),
      uploadBtnLabel: this.state.uploading ? 'Guardando…' : 'Publicar visual',
      uploadBtnStyle: this.state.uploading ? ESTILOS.btnBusy : ESTILOS.btnHot,
      hasUpMsg: !!this.state.upMsg, upMsg: this.state.upMsg,
      upMsgStyle: 'font-size: 14px; font-weight: 600; text-align: center; color: ' + (this.state.upErr ? '#FF8A95' : '#7FF5CC'),
      // lista del catálogo
      catalogTitle: 'Catálogo · ' + real.length,
      catalogEmpty: real.length === 0, adminItems
    };
  }

  /* ---------- Admin: miembros ---------- */
  valsMiembros() {
    const now = Date.now();
    const mPlans = PLANES.map((p) => ({
      label: p.name, pressed: this.state.mPlan === p.id ? 'true' : 'false',
      style: this.state.mPlan === p.id ? ESTILOS.segOn : ESTILOS.chipOff, pick: () => this.setState({ mPlan: p.id })
    }));
    const mMonthsOpts = DURACIONES_ACCESO.map(([n, label]) => ({
      label, pressed: this.state.mMonths === n ? 'true' : 'false',
      style: this.state.mMonths === n ? ESTILOS.segOn : ESTILOS.chipOff, pick: () => this.setState({ mMonths: n })
    }));
    const memberRows = this.state.members.slice().sort((a, b) => (Number(b.creado) || 0) - (Number(a.creado) || 0)).map((m) => {
      const active = Number(m.expira) > now;
      const confirming = this.state.confirmMem === m.id;
      const maxD = this.dispositivosPlan(m.plan);
      const nD = (m.disps || []).length;
      return {
        nombre: m.nombre || 'Sin nombre',
        meta: (NOMBRE_PLAN[m.plan] || 'PRO') + ' · ' + (active ? 'vence ' : 'venció ') + this.fmtDate(Number(m.expira)) + ' · ' + nD + ' de ' + maxD + (maxD === 1 ? ' dispositivo' : ' dispositivos'),
        status: active ? 'Activo' : 'Vencido',
        statusStyle: 'font-size: 13px; font-weight: 700; padding: 6px 12px; border-radius: 999px; ' + (active ? 'background: #3BF0B426; color: #7FF5CC' : 'background: #FF4D5E26; color: #FF8A95'),
        canRelease: nD > 0,
        release: () => this.releaseMember(m),
        renew: () => this.renewMember(m),
        delLabel: confirming ? '¿Quitar acceso?' : 'Quitar',
        delAria: 'Quitar acceso de ' + (m.nombre || 'miembro'),
        delStyle: ESTILOS.smallBtn + (confirming ? 'border: 0; background: #FF4D5E; color: #FFFFFF' : 'border: 0.5px solid #FFFFFF14; background: transparent; color: #FF8A95'),
        del: () => this.deleteMember(m)
      };
    });
    const nc = this.state.newCode;
    const newCode = nc ? {
      code: nc.code, nombre: nc.nombre, planName: NOMBRE_PLAN[nc.plan] || 'PRO', until: this.fmtDate(nc.expira),
      wa: 'https://wa.me/' + (nc.tel || '') + '?text=' + encodeURIComponent(this.mensajeCodigo(nc))
    } : { code: '', nombre: '', planName: '', until: '', wa: '' };
    return {
      mName: this.state.mName, onMName: (e) => this.setState({ mName: e.target.value, memMsg: '' }),
      mTel: this.state.mTel, onMTel: (e) => this.setState({ mTel: e.target.value }),
      mPlans, mMonthsOpts,
      createMember: () => this.createMember(),
      createBtnLabel: this.state.creating ? 'Creando…' : 'Crear código de acceso',
      createBtnStyle: this.state.creating ? ESTILOS.btnBusy : ESTILOS.btnHot,
      hasMemMsg: !!this.state.memMsg, memMsg: this.state.memMsg,
      hasNewCode: !!nc, newCode,
      copyLabel: this.state.copied ? 'Copiado' : 'Copiar código',
      copyCode: () => { try { navigator.clipboard.writeText(nc ? nc.code : '').then(() => this.setState({ copied: true }), () => {}); } catch (e) {} },
      membersTitle: 'Miembros · ' + this.state.members.length,
      membersEmpty: this.state.members.length === 0, memberRows
    };
  }
  dispositivosPlan(plan) {
    const p = PLANES.find((x) => x.id === plan);
    return p ? p.dispositivos : 1;
  }
  // Mensaje de WhatsApp que se envía al cliente con su código nuevo
  mensajeCodigo(nc) {
    const n = this.dispositivosPlan(nc.plan);
    return 'Hola ' + nc.nombre + ', tu acceso V-IO ' + (NOMBRE_PLAN[nc.plan] || 'PRO') + ' está activo hasta el ' + this.fmtDate(nc.expira) + '.\n\nTu código: ' + nc.code + '\n\nEntra a la web, toca el ícono de perfil e ingresa tu código. Funciona en ' + n + (n === 1 ? ' dispositivo' : ' dispositivos') + '.';
  }
}
