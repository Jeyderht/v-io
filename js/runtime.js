/* =========================================================
   V-IO · mini runtime
   Renderiza la plantilla <template id="tpl"> (huecos {{x}},
   <sc-if value="{{x}}"> y <sc-for list="{{lista}}" as="item">)
   con un pequeño parcheador de DOM.
   - DCLogic: clase base con state / setState (re-render en microtarea).
   - mountDC(Comp, props, tplEl, root): monta el componente.
   No hace falta tocar este archivo para editar la web.
   ========================================================= */
(function () {
  'use strict';
  class DCLogic {
    constructor(props) { this.props = props || {}; this.state = {}; this.__q = false; }
    setState(p) {
      const next = typeof p === 'function' ? p(this.state, this.props) : p;
      if (next) Object.assign(this.state, next);
      if (this.__mounted && !this.__q) {
        this.__q = true;
        Promise.resolve().then(() => { this.__q = false; this.__render(); });
      }
    }
  }
  window.DCLogic = DCLogic;

  const HOLE = /\{\{([\w.$]+)\}\}/g;
  const ONE = /^\{\{([\w.$]+)\}\}$/;

  function look(path, scope, vals) {
    const parts = path.split('.');
    let v = Object.prototype.hasOwnProperty.call(scope, parts[0]) ? scope[parts[0]] : vals[parts[0]];
    for (let i = 1; i < parts.length && v != null; i++) v = v[parts[i]];
    return v;
  }
  function val(str, scope, vals) {
    const m = ONE.exec(str);
    if (m) return look(m[1], scope, vals);
    return str.replace(HOLE, (_, p) => { const v = look(p, scope, vals); return v == null ? '' : String(v); });
  }

  function build(node, scope, vals, out) {
    if (node.nodeType === 3) {
      const t = node.nodeValue;
      out.push({ t: t.indexOf('{{') >= 0 ? val(t, scope, vals) : t });
      return;
    }
    if (node.nodeType !== 1) return;
    const tag = node.localName;
    if (tag === 'sc-if') {
      if (val(node.getAttribute('value') || '', scope, vals)) for (const c of node.childNodes) build(c, scope, vals, out);
      return;
    }
    if (tag === 'sc-for') {
      const list = val(node.getAttribute('list') || '', scope, vals) || [];
      const as = node.getAttribute('as') || 'item';
      for (let i = 0; i < list.length; i++) {
        const s = Object.assign({}, scope); s[as] = list[i]; s[as + 'Index'] = i;
        for (const c of node.childNodes) build(c, s, vals, out);
      }
      return;
    }
    const attrs = [];
    for (const a of node.attributes) {
      if (a.name.indexOf('hint-') === 0) continue;
      attrs.push([a.name, a.value.indexOf('{{') >= 0 ? val(a.value, scope, vals) : a.value]);
    }
    const kids = [];
    for (const c of node.childNodes) build(c, scope, vals, kids);
    out.push({ tag, ns: node.namespaceURI, attrs, kids });
  }

  function evName(el, name) {
    let e = name.slice(2).toLowerCase();
    if (e === 'change' && (el.localName === 'input' || el.localName === 'textarea') && el.type !== 'file' && el.type !== 'checkbox' && el.type !== 'radio' && el.type !== 'date') e = 'input';
    return e;
  }
  function setAttr(el, name, v, old) {
    if (name.indexOf('on') === 0 && name.length > 2) {
      const e = evName(el, name);
      el.__h = el.__h || {};
      if (!el.__h[e]) el.addEventListener(e, (ev) => { const h = el.__h[e]; if (typeof h === 'function') h(ev); });
      el.__h[e] = v;
      return;
    }
    if (name === 'value' && (el.localName === 'input' || el.localName === 'textarea')) {
      const s = v == null ? '' : String(v);
      if (el.value !== s) el.value = s;
      return;
    }
    if (v === old && el.hasAttribute(name) === !(v === false || v == null)) return;
    if (v === false || v == null) { el.removeAttribute(name); if (name === 'muted') el.muted = false; return; }
    const s = v === true ? '' : String(v);
    if (el.getAttribute(name) !== s) el.setAttribute(name, s);
    if (name === 'muted') el.muted = true;
  }
  function create(v) {
    if (v.t != null) { v.el = document.createTextNode(v.t); return v.el; }
    const el = v.ns && v.ns !== 'http://www.w3.org/1999/xhtml' ? document.createElementNS(v.ns, v.tag) : document.createElement(v.tag);
    for (const [n, x] of v.attrs) setAttr(el, n, x, undefined);
    for (const k of v.kids) el.appendChild(create(k));
    v.el = el;
    return el;
  }
  function patch(parent, olds, news) {
    for (let i = 0; i < news.length; i++) {
      const o = olds[i], n = news[i];
      if (!o) { parent.appendChild(create(n)); continue; }
      if (o.t != null && n.t != null) { if (o.t !== n.t) o.el.nodeValue = n.t; n.el = o.el; continue; }
      if (o.t == null && n.t == null && o.tag === n.tag && o.ns === n.ns) {
        const om = {}; for (const [k, x] of o.attrs) om[k] = x;
        const nm = {};
        for (const [k, x] of n.attrs) { nm[k] = 1; setAttr(o.el, k, x, om[k]); }
        for (const k in om) if (!nm[k] && k.indexOf('on') !== 0) o.el.removeAttribute(k);
        patch(o.el, o.kids, n.kids);
        n.el = o.el;
        continue;
      }
      parent.replaceChild(create(n), o.el);
    }
    for (let i = olds.length - 1; i >= news.length; i--) if (olds[i].el && olds[i].el.parentNode === parent) parent.removeChild(olds[i].el);
  }

  window.mountDC = function (Comp, props, tplEl, root) {
    const tpl = document.createElement('template');
    tpl.innerHTML = tplEl.innerHTML;
    const inst = new Comp(props);
    let tree = [];
    inst.__render = () => {
      const vals = inst.renderVals();
      const out = [];
      for (const c of tpl.content.childNodes) build(c, {}, vals, out);
      patch(root, tree, out);
      tree = out;
    };
    inst.__mounted = true;
    inst.__render();
    if (typeof inst.componentDidMount === 'function') inst.componentDidMount();
    return inst;
  };
})();
