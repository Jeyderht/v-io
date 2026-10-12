/* =========================================================
   V-IO · arranque
   Monta la app (class App) sobre <div id="app"> usando la
   plantilla <template id="tpl"> de index.html.
   ========================================================= */
(function () {
  var c = window.VIO_CONFIG || {};
  window.vio = mountDC(App, { accent: c.ACCENT || '#1CA9E5', startPage: 'home', whatsapp: c.WHATSAPP || '51XXXXXXXXX' }, document.getElementById('tpl'), document.getElementById('app'));
})();
