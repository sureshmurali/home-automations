/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = globalThis, K = U.ShadowRoot && (U.ShadyCSS === void 0 || U.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, j = Symbol(), V = /* @__PURE__ */ new WeakMap();
let it = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== j) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (K && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = V.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && V.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const dt = (r) => new it(typeof r == "string" ? r : r + "", void 0, j), ht = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((s, i, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[n + 1], r[0]);
  return new it(e, r, j);
}, pt = (r, t) => {
  if (K) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = U.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, r.appendChild(s);
  }
}, F = K ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return dt(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ut, defineProperty: _t, getOwnPropertyDescriptor: bt, getOwnPropertyNames: gt, getOwnPropertySymbols: vt, getPrototypeOf: ft } = Object, v = globalThis, W = v.trustedTypes, $t = W ? W.emptyScript : "", mt = v.reactiveElementPolyfillSupport, k = (r, t) => r, R = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? $t : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, t) {
  let e = r;
  switch (t) {
    case Boolean:
      e = r !== null;
      break;
    case Number:
      e = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(r);
      } catch {
        e = null;
      }
  }
  return e;
} }, I = (r, t) => !ut(r, t), q = { attribute: !0, type: String, converter: R, reflect: !1, useDefault: !1, hasChanged: I };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), v.litPropertyMetadata ?? (v.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let y = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = q) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && _t(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: n } = bt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: i, set(o) {
      const l = i?.call(this);
      n?.call(this, o), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? q;
  }
  static _$Ei() {
    if (this.hasOwnProperty(k("elementProperties"))) return;
    const t = ft(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(k("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(k("properties"))) {
      const e = this.properties, s = [...gt(e), ...vt(e)];
      for (const i of s) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, i] of e) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const i = this._$Eu(e, s);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s) e.unshift(F(i));
    } else t !== void 0 && e.push(F(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return pt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const n = (s.converter?.toAttribute !== void 0 ? s.converter : R).toAttribute(e, s.type);
      this._$Em = t, n == null ? this.removeAttribute(i) : this.setAttribute(i, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const n = s.getPropertyOptions(i), o = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : R;
      this._$Em = i;
      const l = o.fromAttribute(e, n.type);
      this[i] = l ?? this._$Ej?.get(i) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, n) {
    if (t !== void 0) {
      const o = this.constructor;
      if (i === !1 && (n = this[t]), s ?? (s = o.getPropertyOptions(t)), !((s.hasChanged ?? I)(n, e) || s.useDefault && s.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: n }, o) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [i, n] of this._$Ep) this[i] = n;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [i, n] of s) {
        const { wrapped: o } = n, l = this[i];
        o !== !0 || this._$AL.has(i) || l === void 0 || this.C(i, void 0, n, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[k("elementProperties")] = /* @__PURE__ */ new Map(), y[k("finalized")] = /* @__PURE__ */ new Map(), mt?.({ ReactiveElement: y }), (v.reactiveElementVersions ?? (v.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const E = globalThis, G = (r) => r, N = E.trustedTypes, X = N ? N.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, rt = "$lit$", g = `lit$${Math.random().toFixed(9).slice(2)}$`, nt = "?" + g, yt = `<${nt}>`, m = document, P = () => m.createComment(""), M = (r) => r === null || typeof r != "object" && typeof r != "function", z = Array.isArray, wt = (r) => z(r) || typeof r?.[Symbol.iterator] == "function", L = `[ 	
\f\r]`, A = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Z = /-->/g, J = />/g, f = RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Q = /'/g, tt = /"/g, ot = /^(?:script|style|textarea|title)$/i, xt = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), et = xt(1), w = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), st = /* @__PURE__ */ new WeakMap(), $ = m.createTreeWalker(m, 129);
function at(r, t) {
  if (!z(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return X !== void 0 ? X.createHTML(t) : t;
}
const At = (r, t) => {
  const e = r.length - 1, s = [];
  let i, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = A;
  for (let l = 0; l < e; l++) {
    const a = r[l];
    let d, p, c = -1, _ = 0;
    for (; _ < a.length && (o.lastIndex = _, p = o.exec(a), p !== null); ) _ = o.lastIndex, o === A ? p[1] === "!--" ? o = Z : p[1] !== void 0 ? o = J : p[2] !== void 0 ? (ot.test(p[2]) && (i = RegExp("</" + p[2], "g")), o = f) : p[3] !== void 0 && (o = f) : o === f ? p[0] === ">" ? (o = i ?? A, c = -1) : p[1] === void 0 ? c = -2 : (c = o.lastIndex - p[2].length, d = p[1], o = p[3] === void 0 ? f : p[3] === '"' ? tt : Q) : o === tt || o === Q ? o = f : o === Z || o === J ? o = A : (o = f, i = void 0);
    const b = o === f && r[l + 1].startsWith("/>") ? " " : "";
    n += o === A ? a + yt : c >= 0 ? (s.push(d), a.slice(0, c) + rt + a.slice(c) + g + b) : a + g + (c === -2 ? l : b);
  }
  return [at(r, n + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class O {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let n = 0, o = 0;
    const l = t.length - 1, a = this.parts, [d, p] = At(t, e);
    if (this.el = O.createElement(d, s), $.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (i = $.nextNode()) !== null && a.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const c of i.getAttributeNames()) if (c.endsWith(rt)) {
          const _ = p[o++], b = i.getAttribute(c).split(g), T = /([.?@])?(.*)/.exec(_);
          a.push({ type: 1, index: n, name: T[2], strings: b, ctor: T[1] === "." ? Et : T[1] === "?" ? Ct : T[1] === "@" ? St : B }), i.removeAttribute(c);
        } else c.startsWith(g) && (a.push({ type: 6, index: n }), i.removeAttribute(c));
        if (ot.test(i.tagName)) {
          const c = i.textContent.split(g), _ = c.length - 1;
          if (_ > 0) {
            i.textContent = N ? N.emptyScript : "";
            for (let b = 0; b < _; b++) i.append(c[b], P()), $.nextNode(), a.push({ type: 2, index: ++n });
            i.append(c[_], P());
          }
        }
      } else if (i.nodeType === 8) if (i.data === nt) a.push({ type: 2, index: n });
      else {
        let c = -1;
        for (; (c = i.data.indexOf(g, c + 1)) !== -1; ) a.push({ type: 7, index: n }), c += g.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const s = m.createElement("template");
    return s.innerHTML = t, s;
  }
}
function x(r, t, e = r, s) {
  if (t === w) return t;
  let i = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const n = M(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== n && (i?._$AO?.(!1), n === void 0 ? i = void 0 : (i = new n(r), i._$AT(r, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = i : e._$Cl = i), i !== void 0 && (t = x(r, i._$AS(r, t.values), i, s)), t;
}
class kt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, i = (t?.creationScope ?? m).importNode(e, !0);
    $.currentNode = i;
    let n = $.nextNode(), o = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let d;
        a.type === 2 ? d = new H(n, n.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (d = new Pt(n, this, t)), this._$AV.push(d), a = s[++l];
      }
      o !== a?.index && (n = $.nextNode(), o++);
    }
    return $.currentNode = m, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class H {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = x(this, t, e), M(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== w && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : wt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && M(this._$AH) ? this._$AA.nextSibling.data = t : this.T(m.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = O.createElement(at(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === i) this._$AH.p(e);
    else {
      const n = new kt(i, this), o = n.u(this.options);
      n.p(e), this.T(o), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = st.get(t.strings);
    return e === void 0 && st.set(t.strings, e = new O(t)), e;
  }
  k(t) {
    z(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const n of t) i === e.length ? e.push(s = new H(this.O(P()), this.O(P()), this, this.options)) : s = e[i], s._$AI(n), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = G(t).nextSibling;
      G(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class B {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, n) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = h;
  }
  _$AI(t, e = this, s, i) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = x(this, t, e, 0), o = !M(t) || t !== this._$AH && t !== w, o && (this._$AH = t);
    else {
      const l = t;
      let a, d;
      for (t = n[0], a = 0; a < n.length - 1; a++) d = x(this, l[s + a], e, a), d === w && (d = this._$AH[a]), o || (o = !M(d) || d !== this._$AH[a]), d === h ? t = h : t !== h && (t += (d ?? "") + n[a + 1]), this._$AH[a] = d;
    }
    o && !i && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Et extends B {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class Ct extends B {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class St extends B {
  constructor(t, e, s, i, n) {
    super(t, e, s, i, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = x(this, t, e, 0) ?? h) === w) return;
    const s = this._$AH, i = t === h && s !== h || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== h && (s === h || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Pt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    x(this, t);
  }
}
const Mt = E.litHtmlPolyfillSupport;
Mt?.(O, H), (E.litHtmlVersions ?? (E.litHtmlVersions = [])).push("3.3.2");
const Ot = (r, t, e) => {
  const s = e?.renderBefore ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = e?.renderBefore ?? null;
    s._$litPart$ = i = new H(t.insertBefore(P(), n), n, void 0, e ?? {});
  }
  return i._$AI(r), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const C = globalThis;
class S extends y {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ot(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return w;
  }
}
S._$litElement$ = !0, S.finalized = !0, C.litElementHydrateSupport?.({ LitElement: S });
const Dt = C.litElementPolyfillSupport;
Dt?.({ LitElement: S });
(C.litElementVersions ?? (C.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ht = { attribute: !0, type: String, converter: R, reflect: !1, hasChanged: I }, Tt = (r = Ht, t, e) => {
  const { kind: s, metadata: i } = e;
  let n = globalThis.litPropertyMetadata.get(i);
  if (n === void 0 && globalThis.litPropertyMetadata.set(i, n = /* @__PURE__ */ new Map()), s === "setter" && ((r = Object.create(r)).wrapped = !0), n.set(e.name, r), s === "accessor") {
    const { name: o } = e;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(o, a, r, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, r, l), l;
    } };
  }
  if (s === "setter") {
    const { name: o } = e;
    return function(l) {
      const a = this[o];
      t.call(this, l), this.requestUpdate(o, a, r, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function lt(r) {
  return (t, e) => typeof e == "object" ? Tt(r, t, e) : ((s, i, n) => {
    const o = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, s), o ? Object.getOwnPropertyDescriptor(i, n) : void 0;
  })(r, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Ut(r) {
  return lt({ ...r, state: !0, attribute: !1 });
}
var Rt = Object.defineProperty, ct = (r, t, e, s) => {
  for (var i = void 0, n = r.length - 1, o; n >= 0; n--)
    (o = r[n]) && (i = o(t, e, i) || i);
  return i && Rt(t, e, i), i;
};
const u = {
  power: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>',
  "volume-x": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>',
  down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>',
  rewind: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>',
  "fast-forward": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>',
  stop: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>',
  "skip-back": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>',
  "skip-forward": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>',
  hdmi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="10" rx="2"/><line x1="6" y1="11" x2="6" y2="13"/><line x1="10" y1="11" x2="10" y2="13"/><line x1="14" y1="11" x2="14" y2="13"/><line x1="18" y1="11" x2="18" y2="13"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  mute: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>'
}, Y = class Y extends S {
  /* ── HA card API ────────────────────────────────────────────── */
  static getStubConfig() {
    return { entity: "media_player.android_tv_192_168_11_26" };
  }
  setConfig(t) {
    if (!t.entity)
      throw new Error("bravia-tv-remote: 'entity' is required");
    this._config = { ...t };
  }
  getCardSize() {
    return 8;
  }
  /* ── Entity helpers ─────────────────────────────────────────── */
  get _entity() {
    return this.hass?.states?.[this._config.entity] ?? null;
  }
  get _state() {
    return this._entity?.state ?? "unavailable";
  }
  get _isOn() {
    return !["off", "unavailable", "unknown"].includes(this._state);
  }
  get _isPlaying() {
    return this._state === "playing";
  }
  _attr(t) {
    const e = this._entity?.attributes?.[t];
    return e != null ? String(e) : "";
  }
  get _isMuted() {
    return this._entity?.attributes?.is_volume_muted === !0;
  }
  /* ── Service calls ─────────────────────────────────────────── */
  _callService(t, e, s) {
    this.hass.callService(t, e, {
      entity_id: this._config.entity,
      ...s
    });
  }
  _togglePower() {
    this._isOn ? this._callService("media_player", "turn_off") : this._callService("media_player", "turn_on");
  }
  _playPause() {
    this._callService("media_player", "media_play_pause");
  }
  _volumeUp() {
    this._callService("media_player", "volume_up");
  }
  _volumeDown() {
    this._callService("media_player", "volume_down");
  }
  _volumeMute() {
    this._callService("media_player", "volume_mute", {
      is_volume_muted: !this._isMuted
    });
  }
  _sendKey(t) {
    this._callService("androidtv", "adb_command", {
      command: `input keyevent ${t}`
    });
  }
  _goBack() {
    this._sendKey("KEYCODE_BACK");
  }
  _goHome() {
    this._sendKey("KEYCODE_HOME");
  }
  _dpadUp() {
    this._sendKey("KEYCODE_DPAD_UP");
  }
  _dpadDown() {
    this._sendKey("KEYCODE_DPAD_DOWN");
  }
  _dpadLeft() {
    this._sendKey("KEYCODE_DPAD_LEFT");
  }
  _dpadRight() {
    this._sendKey("KEYCODE_DPAD_RIGHT");
  }
  _dpadCenter() {
    this._sendKey("KEYCODE_DPAD_CENTER");
  }
  _mediaRewind() {
    this._sendKey("KEYCODE_MEDIA_REWIND");
  }
  _mediaFastForward() {
    this._sendKey("KEYCODE_MEDIA_FAST_FORWARD");
  }
  _mediaPrevious() {
    this._sendKey("KEYCODE_MEDIA_PREVIOUS");
  }
  _mediaNext() {
    this._sendKey("KEYCODE_MEDIA_NEXT");
  }
  _mediaStop() {
    this._sendKey("KEYCODE_MEDIA_STOP");
  }
  _colorRed() {
    this._sendKey("KEYCODE_PROG_RED");
  }
  _colorGreen() {
    this._sendKey("KEYCODE_PROG_GREEN");
  }
  _colorYellow() {
    this._sendKey("KEYCODE_PROG_YELLOW");
  }
  _colorBlue() {
    this._sendKey("KEYCODE_PROG_BLUE");
  }
  _hdmiInput() {
    this._sendKey("KEYCODE_TV_INPUT");
  }
  _quickSettings() {
    this._sendKey("KEYCODE_MENU");
  }
  /* ── Render ─────────────────────────────────────────────────── */
  render() {
    if (!this._config)
      return et`<ha-card><div>Loading…</div></ha-card>`;
    const t = this._isOn ? "on" : "off";
    return et`
      <ha-card>
        <div class="remote-body">

          <!-- Top row: Input / Power / Settings -->
          <div class="top-row">
            <div class="labeled-btn">
              <button class="ctrl-btn sm" @click="${this._hdmiInput}" title="Input">
                <span .innerHTML="${u.hdmi}"></span>
              </button>
              <span class="btn-label">Input</span>
            </div>
            <button class="ctrl-btn power-btn ${t}" @click="${this._togglePower}" title="Power">
              <span .innerHTML="${u.power}"></span>
            </button>
            <div class="labeled-btn">
              <button class="ctrl-btn sm" @click="${this._quickSettings}" title="Settings">
                <span .innerHTML="${u.settings}"></span>
              </button>
              <span class="btn-label">Settings</span>
            </div>
          </div>

          <!-- D-pad disc -->
          <div class="remote-section">
            <div class="dpad-container">
              <div class="dpad-disc"></div>
              <button class="dpad-arrow up" @click="${this._dpadUp}">
                <span .innerHTML="${u.up}"></span>
              </button>
              <button class="dpad-arrow left" @click="${this._dpadLeft}">
                <span .innerHTML="${u.left}"></span>
              </button>
              <button class="dpad-ok" @click="${this._dpadCenter}">OK</button>
              <button class="dpad-arrow right" @click="${this._dpadRight}">
                <span .innerHTML="${u.right}"></span>
              </button>
              <button class="dpad-arrow down" @click="${this._dpadDown}">
                <span .innerHTML="${u.down}"></span>
              </button>
            </div>
          </div>

          <!-- Back + Home -->
          <div class="remote-section" style="margin-top: 8px;">
            <div class="nav-row">
              <div class="labeled-btn">
                <button class="ctrl-btn sm" @click="${this._goBack}" title="Back">
                  <span .innerHTML="${u.back}"></span>
                </button>
                <span class="btn-label">Back</span>
              </div>
              <div class="labeled-btn">
                <button class="ctrl-btn sm" @click="${this._goHome}" title="Home">
                  <span .innerHTML="${u.home}"></span>
                </button>
                <span class="btn-label">Home</span>
              </div>
            </div>
          </div>

          <div class="remote-divider"></div>

          <!-- Volume -->
          <div class="remote-section">
            <div class="vol-section">
              <div class="vol-rocker">
                <button class="vol-rocker-btn" @click="${this._volumeUp}" title="Volume Up">+</button>
                <span class="vol-rocker-label">Vol</span>
                <button class="vol-rocker-btn" @click="${this._volumeDown}" title="Volume Down">−</button>
              </div>
              <div class="labeled-btn">
                <button class="ctrl-btn sm round" @click="${this._volumeMute}" title="Mute">
                  <span .innerHTML="${u[this._isMuted ? "mute" : "volume-x"]}"></span>
                </button>
                <span class="btn-label">Mute</span>
              </div>
            </div>
          </div>

          <div class="remote-divider"></div>

          <!-- Color buttons -->
          <div class="remote-section">
            <div class="color-row">
              <button class="color-btn blue" @click="${this._colorBlue}" title="Blue"></button>
              <button class="color-btn red" @click="${this._colorRed}" title="Red"></button>
              <button class="color-btn green" @click="${this._colorGreen}" title="Green"></button>
              <button class="color-btn yellow" @click="${this._colorYellow}" title="Yellow"></button>
            </div>
          </div>

          <div class="remote-divider"></div>

          <!-- Media row 1: Rewind / Play / Fast Forward -->
          <div class="remote-section">
            <div class="transport-row">
              <div class="labeled-btn">
                <button class="ctrl-btn sm" @click="${this._mediaRewind}" title="Rewind">
                  <span .innerHTML="${u.rewind}"></span>
                </button>
                <span class="btn-label">Rew</span>
              </div>
              <div class="labeled-btn">
                <button class="ctrl-btn md" @click="${this._playPause}" title="Play/Pause">
                  <span .innerHTML="${u[this._isPlaying ? "pause" : "play"]}"></span>
                </button>
                <span class="btn-label">Play</span>
              </div>
              <div class="labeled-btn">
                <button class="ctrl-btn sm" @click="${this._mediaFastForward}" title="Fast Forward">
                  <span .innerHTML="${u["fast-forward"]}"></span>
                </button>
                <span class="btn-label">FF</span>
              </div>
            </div>
          </div>

          <!-- Media row 2: Previous / Stop / Next -->
          <div class="remote-section" style="margin-top: 6px;">
            <div class="transport-row">
              <div class="labeled-btn">
                <button class="ctrl-btn sm" @click="${this._mediaPrevious}" title="Previous">
                  <span .innerHTML="${u["skip-back"]}"></span>
                </button>
                <span class="btn-label">Prev</span>
              </div>
              <div class="labeled-btn">
                <button class="ctrl-btn sm" @click="${this._playPause}" title="Pause">
                  <span .innerHTML="${u.pause}"></span>
                </button>
                <span class="btn-label">Pause</span>
              </div>
              <div class="labeled-btn">
                <button class="ctrl-btn sm" @click="${this._mediaNext}" title="Next">
                  <span .innerHTML="${u["skip-forward"]}"></span>
                </button>
                <span class="btn-label">Next</span>
              </div>
            </div>
          </div>

        </div>
      </ha-card>
    `;
  }
};
Y.styles = ht`
    :host {
      display: block;
      --text-primary: #e0e0e0;
      --text-secondary: #777;
      --text-dim: #444;
      --accent: #4fc3f7;
      
    }

    ha-card {
      background: transparent;
      border: none;
      box-shadow: none;
    }

    /* ── Remote Body ────────────────────────────── */

    .remote-body {
      background: linear-gradient(180deg, #1c1c1e 0%, #141414 50%, #111 100%);
      border-radius: 32px 32px 40px 40px;
      margin: 0 auto;
      max-width: 160px;
      padding: 22px 28px 28px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0;
      box-shadow:
        0 2px 8px rgba(0,0,0,0.4),
        inset 0 1px 0 rgba(255,255,255,0.04);
    }

    .remote-section {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .remote-divider {
      width: 50%;
      height: 1px;
      background: linear-gradient(90deg, transparent, #2a2a2a, transparent);
      margin: 14px 0;
    }

    /* ── Top row: Input / Power / Settings ──── */

    .top-row {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    /* ── Color buttons ───────────────────────── */

    .color-row { display: flex; gap: 10px; margin: 2px 0; }

    .color-btn {
      width: 38px; height: 10px; border-radius: 5px; border: none;
      cursor: pointer; transition: all 120ms ease;
      -webkit-tap-highlight-color: transparent; opacity: 0.85;
    }
    .color-btn:hover { opacity: 1; transform: scaleY(1.4); }
    .color-btn:active { transform: scale(0.9); }
    .color-btn.blue   { background: #5c6bc0; }
    .color-btn.red    { background: #e53935; }
    .color-btn.green  { background: #43a047; }
    .color-btn.yellow { background: #fdd835; }

    /* ── Utility row ─────────────────────────── */

    .util-row { display: flex; gap: 20px; }

    /* ── D-pad ───────────────────────────────── */

    .dpad-container { position: relative; width: 140px; height: 140px; }

    .dpad-disc {
      position: absolute; inset: 0; border-radius: 50%;
      background: radial-gradient(circle at 50% 50%, #222 0%, #1a1a1a 70%, #161616 100%);
      box-shadow: 0 2px 6px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.04), inset 0 -1px 1px rgba(0,0,0,0.3);
    }

    .dpad-arrow {
      position: absolute; display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: rgba(255,255,255,0.25); transition: all 120ms ease;
      -webkit-tap-highlight-color: transparent; background: none; border: none; padding: 0; z-index: 1;
    }
    .dpad-arrow:hover { color: rgba(255,255,255,0.6); }
    .dpad-arrow:active { color: rgba(255,255,255,0.8); transform: scale(0.85); }
    .dpad-arrow svg { width: 20px; height: 20px; }

    .dpad-arrow.up { top: -2px; left: 50%; transform: translateX(-50%); width: 40px; height: 36px; }
    .dpad-arrow.up:active { transform: translateX(-50%) scale(0.85); }
    .dpad-arrow.down { bottom: -2px; left: 50%; transform: translateX(-50%); width: 40px; height: 36px; }
    .dpad-arrow.down:active { transform: translateX(-50%) scale(0.85); }
    .dpad-arrow.left { left: -2px; top: 50%; transform: translateY(-50%); width: 36px; height: 40px; }
    .dpad-arrow.left:active { transform: translateY(-50%) scale(0.85); }
    .dpad-arrow.right { right: -2px; top: 50%; transform: translateY(-50%); width: 36px; height: 40px; }
    .dpad-arrow.right:active { transform: translateY(-50%) scale(0.85); }

    .dpad-ok {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 64px; height: 64px; border-radius: 50%;
      background: radial-gradient(circle at 50% 40%, #2c2c2e, #242424);
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.5);
      letter-spacing: 1px; transition: all 120ms ease;
      -webkit-tap-highlight-color: transparent; z-index: 2;
    }
    .dpad-ok:hover { background: radial-gradient(circle at 50% 40%, #353537, #2a2a2c); color: rgba(255,255,255,0.8); border-color: rgba(255,255,255,0.15); }
    .dpad-ok:active { transform: translate(-50%, -50%) scale(0.95); box-shadow: 0 1px 3px rgba(0,0,0,0.5); }

    /* ── Back / Home row ─────────────────────── */

    .nav-row { display: flex; gap: 98px; }

    /* ── Volume ──────────────────────────────── */

    .vol-section { display: flex; align-items: center; gap: 16px; }

    .vol-rocker {
      display: flex; flex-direction: column; align-items: center; gap: 0;
      background: rgba(255,255,255,0.03); border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.06); overflow: hidden;
    }

    .vol-rocker-btn {
      width: 44px; height: 34px; display: flex; align-items: center; justify-content: center;
      cursor: pointer; background: none; border: none;
      color: rgba(255,255,255,0.45); font-size: 18px; font-weight: 300;
      transition: all 120ms ease; -webkit-tap-highlight-color: transparent;
    }
    .vol-rocker-btn:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.8); }
    .vol-rocker-btn:active { background: rgba(255,255,255,0.1); }

    .vol-rocker-label {
      font-size: 7px; color: var(--text-dim); text-transform: uppercase;
      letter-spacing: 0.5px; padding: 1px 0;
    }

    /* ── Media transport ─────────────────────── */

    .transport-row { display: flex; align-items: flex-end; gap: 10px; }

    /* ── Shared button styles ────────────────── */

    .ctrl-btn {
      display: flex; align-items: center; justify-content: center;
      border: 1px solid rgba(255,255,255,0.06); border-radius: 10px;
      background: rgba(255,255,255,0.04); cursor: pointer;
      transition: all 120ms ease; -webkit-tap-highlight-color: transparent;
      color: rgba(255,255,255,0.45);
    }
    .ctrl-btn:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.8); }
    .ctrl-btn:active { transform: scale(0.92); background: rgba(255,255,255,0.12); }
    .ctrl-btn span { display: flex; align-items: center; justify-content: center; }
    .ctrl-btn svg { width: 16px; height: 16px; display: block; }

    .ctrl-btn.sm { width: 40px; height: 34px; }
    .ctrl-btn.md { width: 46px; height: 38px; }
    .ctrl-btn.round { border-radius: 50%; }

    .ctrl-btn.power-btn {
      width: 34px; height: 34px; border-radius: 50%;
      background: rgba(255,255,255,0.03);
    }
    .ctrl-btn.power-btn.on {
      color: #4caf50; border-color: rgba(76, 175, 80, 0.4);
      box-shadow: 0 0 12px rgba(76, 175, 80, 0.15);
    }
    .ctrl-btn.power-btn.off { color: #444; }

    /* ── Labeled button ──────────────────────── */

    .labeled-btn { display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .labeled-btn .btn-label {
      font-size: 7px; color: var(--text-dim); text-transform: uppercase;
      letter-spacing: 0.6px; font-weight: 500;
    }
  `;
let D = Y;
ct([
  lt({ attribute: !1 })
], D.prototype, "hass");
ct([
  Ut()
], D.prototype, "_config");
customElements.define("bravia-tv-remote", D);
typeof window < "u" && (window.customCards = window.customCards || [], window.customCards.push({
  type: "bravia-tv-remote",
  name: "Bravia TV Remote",
  description: "Full remote control for Sony Bravia Android TV with ADB integration"
}));
export {
  D as BraviaTvRemote
};
//# sourceMappingURL=bravia-tv-remote.js.map
