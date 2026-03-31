/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis, j = H.ShadowRoot && (H.ShadyCSS === void 0 || H.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, D = Symbol(), K = /* @__PURE__ */ new WeakMap();
let ot = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== D) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (j && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = K.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && K.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const dt = (r) => new ot(typeof r == "string" ? r : r + "", void 0, D), ut = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((s, i, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[n + 1], r[0]);
  return new ot(e, r, D);
}, ft = (r, t) => {
  if (j) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = H.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, r.appendChild(s);
  }
}, Y = j ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return dt(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: _t, defineProperty: $t, getOwnPropertyDescriptor: gt, getOwnPropertyNames: mt, getOwnPropertySymbols: vt, getPrototypeOf: yt } = Object, g = globalThis, Z = g.trustedTypes, bt = Z ? Z.emptyScript : "", At = g.reactiveElementPolyfillSupport, S = (r, t) => r, R = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? bt : null;
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
} }, V = (r, t) => !_t(r, t), J = { attribute: !0, type: String, converter: R, reflect: !1, useDefault: !1, hasChanged: V };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), g.litPropertyMetadata ?? (g.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let A = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = J) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && $t(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: n } = gt(this.prototype, t) ?? { get() {
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
    return this.elementProperties.get(t) ?? J;
  }
  static _$Ei() {
    if (this.hasOwnProperty(S("elementProperties"))) return;
    const t = yt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(S("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(S("properties"))) {
      const e = this.properties, s = [...mt(e), ...vt(e)];
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
      for (const i of s) e.unshift(Y(i));
    } else t !== void 0 && e.push(Y(t));
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
    return ft(t, this.constructor.elementStyles), t;
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
      if (i === !1 && (n = this[t]), s ?? (s = o.getPropertyOptions(t)), !((s.hasChanged ?? V)(n, e) || s.useDefault && s.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, s)))) return;
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
A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, A[S("elementProperties")] = /* @__PURE__ */ new Map(), A[S("finalized")] = /* @__PURE__ */ new Map(), At?.({ ReactiveElement: A }), (g.reactiveElementVersions ?? (g.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const C = globalThis, X = (r) => r, I = C.trustedTypes, G = I ? I.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, at = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, lt = "?" + $, xt = `<${lt}>`, y = document, O = () => y.createComment(""), k = (r) => r === null || typeof r != "object" && typeof r != "function", q = Array.isArray, wt = (r) => q(r) || typeof r?.[Symbol.iterator] == "function", L = `[ 	
\f\r]`, E = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Q = /-->/g, tt = />/g, m = RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), et = /'/g, st = /"/g, ct = /^(?:script|style|textarea|title)$/i, Et = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), u = Et(1), x = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), it = /* @__PURE__ */ new WeakMap(), v = y.createTreeWalker(y, 129);
function ht(r, t) {
  if (!q(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return G !== void 0 ? G.createHTML(t) : t;
}
const St = (r, t) => {
  const e = r.length - 1, s = [];
  let i, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = E;
  for (let l = 0; l < e; l++) {
    const a = r[l];
    let p, d, h = -1, f = 0;
    for (; f < a.length && (o.lastIndex = f, d = o.exec(a), d !== null); ) f = o.lastIndex, o === E ? d[1] === "!--" ? o = Q : d[1] !== void 0 ? o = tt : d[2] !== void 0 ? (ct.test(d[2]) && (i = RegExp("</" + d[2], "g")), o = m) : d[3] !== void 0 && (o = m) : o === m ? d[0] === ">" ? (o = i ?? E, h = -1) : d[1] === void 0 ? h = -2 : (h = o.lastIndex - d[2].length, p = d[1], o = d[3] === void 0 ? m : d[3] === '"' ? st : et) : o === st || o === et ? o = m : o === Q || o === tt ? o = E : (o = m, i = void 0);
    const _ = o === m && r[l + 1].startsWith("/>") ? " " : "";
    n += o === E ? a + xt : h >= 0 ? (s.push(p), a.slice(0, h) + at + a.slice(h) + $ + _) : a + $ + (h === -2 ? l : _);
  }
  return [ht(r, n + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class U {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let n = 0, o = 0;
    const l = t.length - 1, a = this.parts, [p, d] = St(t, e);
    if (this.el = U.createElement(p, s), v.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (i = v.nextNode()) !== null && a.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const h of i.getAttributeNames()) if (h.endsWith(at)) {
          const f = d[o++], _ = i.getAttribute(h).split($), M = /([.?@])?(.*)/.exec(f);
          a.push({ type: 1, index: n, name: M[2], strings: _, ctor: M[1] === "." ? Pt : M[1] === "?" ? Tt : M[1] === "@" ? Ot : z }), i.removeAttribute(h);
        } else h.startsWith($) && (a.push({ type: 6, index: n }), i.removeAttribute(h));
        if (ct.test(i.tagName)) {
          const h = i.textContent.split($), f = h.length - 1;
          if (f > 0) {
            i.textContent = I ? I.emptyScript : "";
            for (let _ = 0; _ < f; _++) i.append(h[_], O()), v.nextNode(), a.push({ type: 2, index: ++n });
            i.append(h[f], O());
          }
        }
      } else if (i.nodeType === 8) if (i.data === lt) a.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = i.data.indexOf($, h + 1)) !== -1; ) a.push({ type: 7, index: n }), h += $.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const s = y.createElement("template");
    return s.innerHTML = t, s;
  }
}
function w(r, t, e = r, s) {
  if (t === x) return t;
  let i = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const n = k(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== n && (i?._$AO?.(!1), n === void 0 ? i = void 0 : (i = new n(r), i._$AT(r, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = i : e._$Cl = i), i !== void 0 && (t = w(r, i._$AS(r, t.values), i, s)), t;
}
class Ct {
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
    const { el: { content: e }, parts: s } = this._$AD, i = (t?.creationScope ?? y).importNode(e, !0);
    v.currentNode = i;
    let n = v.nextNode(), o = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let p;
        a.type === 2 ? p = new N(n, n.nextSibling, this, t) : a.type === 1 ? p = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (p = new kt(n, this, t)), this._$AV.push(p), a = s[++l];
      }
      o !== a?.index && (n = v.nextNode(), o++);
    }
    return v.currentNode = y, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class N {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = i?.isConnected ?? !0;
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
    t = w(this, t, e), k(t) ? t === c || t == null || t === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : t !== this._$AH && t !== x && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : wt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== c && k(this._$AH) ? this._$AA.nextSibling.data = t : this.T(y.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = U.createElement(ht(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === i) this._$AH.p(e);
    else {
      const n = new Ct(i, this), o = n.u(this.options);
      n.p(e), this.T(o), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = it.get(t.strings);
    return e === void 0 && it.set(t.strings, e = new U(t)), e;
  }
  k(t) {
    q(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const n of t) i === e.length ? e.push(s = new N(this.O(O()), this.O(O()), this, this.options)) : s = e[i], s._$AI(n), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = X(t).nextSibling;
      X(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class z {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, n) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = c;
  }
  _$AI(t, e = this, s, i) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = w(this, t, e, 0), o = !k(t) || t !== this._$AH && t !== x, o && (this._$AH = t);
    else {
      const l = t;
      let a, p;
      for (t = n[0], a = 0; a < n.length - 1; a++) p = w(this, l[s + a], e, a), p === x && (p = this._$AH[a]), o || (o = !k(p) || p !== this._$AH[a]), p === c ? t = c : t !== c && (t += (p ?? "") + n[a + 1]), this._$AH[a] = p;
    }
    o && !i && this.j(t);
  }
  j(t) {
    t === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Pt extends z {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === c ? void 0 : t;
  }
}
class Tt extends z {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== c);
  }
}
class Ot extends z {
  constructor(t, e, s, i, n) {
    super(t, e, s, i, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = w(this, t, e, 0) ?? c) === x) return;
    const s = this._$AH, i = t === c && s !== c || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== c && (s === c || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class kt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    w(this, t);
  }
}
const Ut = C.litHtmlPolyfillSupport;
Ut?.(U, N), (C.litHtmlVersions ?? (C.litHtmlVersions = [])).push("3.3.2");
const Nt = (r, t, e) => {
  const s = e?.renderBefore ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = e?.renderBefore ?? null;
    s._$litPart$ = i = new N(t.insertBefore(O(), n), n, void 0, e ?? {});
  }
  return i._$AI(r), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const P = globalThis;
class T extends A {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Nt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return x;
  }
}
T._$litElement$ = !0, T.finalized = !0, P.litElementHydrateSupport?.({ LitElement: T });
const Mt = P.litElementPolyfillSupport;
Mt?.({ LitElement: T });
(P.litElementVersions ?? (P.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ht = { attribute: !0, type: String, converter: R, reflect: !1, hasChanged: V }, Rt = (r = Ht, t, e) => {
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
function pt(r) {
  return (t, e) => typeof e == "object" ? Rt(r, t, e) : ((s, i, n) => {
    const o = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, s), o ? Object.getOwnPropertyDescriptor(i, n) : void 0;
  })(r, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function W(r) {
  return pt({ ...r, state: !0, attribute: !1 });
}
var It = Object.defineProperty, B = (r, t, e, s) => {
  for (var i = void 0, n = r.length - 1, o; n >= 0; n--)
    (o = r[n]) && (i = o(t, e, i) || i);
  return i && It(t, e, i), i;
};
const zt = {
  top: 39.63,
  left: 29.65,
  width: 43.15,
  height: 29.99
}, rt = {
  "com.google.android.youtube.tv": { label: "YouTube", color: "#FF0000" },
  "com.netflix.ninja": { label: "Netflix", color: "#E50914" },
  "com.google.android.tvlauncher": { label: "Home", color: "#4285F4" },
  "com.sony.dtv.tvx": { label: "Live TV", color: "#0077B5" },
  "com.disney.disneyplus": { label: "Disney+", color: "#113CCF" },
  "com.amazon.amazonvideo.livingroom": {
    label: "Prime Video",
    color: "#00A8E1"
  },
  "com.apple.atve.androidtv.appletv": {
    label: "Apple TV",
    color: "#555555"
  },
  "com.plexapp.android": { label: "Plex", color: "#E5A00D" }
}, nt = {
  youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
  netflix: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24h-4.715zm8.489 0v9.63L18.6 22.951c-.043-7.86-.004-15.913.002-22.95H13.887zM5.398 1.05V24c1.873-.225 2.81-.312 4.715-.398v-9.22l-4.715-13.332z"/></svg>'
}, F = class F extends T {
  constructor() {
    super(...arguments), this._cacheBuster = 0, this._showAppBadge = !1, this._refreshInterval = null, this._badgeTimeout = null, this._lastEntityPicture = "", this._onTvClick = () => {
      !this._isOn || !this._appName || (this._clearBadgeTimeout(), this._showAppBadge = !0, this._badgeTimeout = setTimeout(() => {
        this._showAppBadge = !1;
      }, 4e3));
    }, this._onScreenError = (t) => {
      const e = t.target;
      e.classList.remove("loaded"), e.classList.add("loading");
    };
  }
  /* ── HA card API ────────────────────────────────────────────── */
  static getStubConfig() {
    return {
      entity: "media_player.android_tv_192_168_11_26",
      image: "/local/bravia-tv.png"
    };
  }
  setConfig(t) {
    if (!t.entity)
      throw new Error("bravia-tv-display: 'entity' is required");
    if (!t.image)
      throw new Error("bravia-tv-display: 'image' is required");
    this._config = { ...t }, this._screen = { ...zt, ...t.screen_position };
  }
  getCardSize() {
    return 5;
  }
  /* ── Lifecycle ──────────────────────────────────────────────── */
  connectedCallback() {
    super.connectedCallback(), this._startScreenRefresh();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._stopScreenRefresh(), this._clearBadgeTimeout();
  }
  updated(t) {
    if (super.updated(t), t.has("hass")) {
      const e = this._entityPicture;
      e !== this._lastEntityPicture && (this._lastEntityPicture = e, this._cacheBuster = Date.now());
    }
  }
  _startScreenRefresh() {
    this._stopScreenRefresh();
    const t = this._config?.screen_refresh ?? 10;
    this._refreshInterval = setInterval(() => {
      this._isOn && this._entityPicture && (this._cacheBuster = Date.now());
    }, t * 1e3);
  }
  _stopScreenRefresh() {
    this._refreshInterval && (clearInterval(this._refreshInterval), this._refreshInterval = null);
  }
  _clearBadgeTimeout() {
    this._badgeTimeout && (clearTimeout(this._badgeTimeout), this._badgeTimeout = null);
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
  _attr(t) {
    const e = this._entity?.attributes?.[t];
    return e != null ? String(e) : "";
  }
  get _appId() {
    return this._attr("app_id");
  }
  get _appName() {
    const t = rt[this._appId];
    return t ? t.label : this._attr("app_name") || this._attr("source") || "";
  }
  get _appColor() {
    return rt[this._appId]?.color ?? "#ffffff";
  }
  get _mediaTitle() {
    return this._attr("media_title");
  }
  get _mediaArtist() {
    return this._attr("media_artist");
  }
  get _entityPicture() {
    return this._attr("entity_picture");
  }
  /* ── Render ─────────────────────────────────────────────────── */
  render() {
    if (!this._config)
      return u`<ha-card><div>Loading…</div></ha-card>`;
    const t = this._screen, e = `
      top: ${t.top}%;
      left: ${t.left}%;
      width: ${t.width}%;
      height: ${t.height}%;
    `, s = this._isOn ? "on" : "off", i = this._entityPicture, n = !!i && this._isOn, o = n ? `${i}${i.includes("?") ? "&" : "?"}_cb=${this._cacheBuster}` : "", l = this._appName, a = this._appColor, p = this._getAppIcon();
    return u`
      <ha-card>
        <div class="tv-display" @click="${this._onTvClick}">
          <img class="tv-image" src="${this._config.image}" alt="Bravia TV" />
          <div class="screen-overlay ${s}" style="${e}">
            ${n ? u`
                  <img
                    class="screen-capture loaded"
                    src="${o}"
                    alt="TV Screen"
                    @error="${this._onScreenError}"
                  />
                  <div class="live-dot"></div>
                  ${this._renderScreenInfoBar()}
                ` : u`
                  <div class="screen-content">
                    ${this._renderScreenFallback()}
                  </div>
                `}
          </div>
          ${this._isOn && l ? u`
                <div
                  class="app-badge-toast ${this._showAppBadge ? "visible" : ""}"
                  style="--toast-color: ${a}"
                >
                  ${p ? u`<span
                        class="toast-icon"
                        style="color: ${a}"
                        .innerHTML="${p}"
                      ></span>` : c}
                  <span class="toast-label">${l}</span>
                </div>
              ` : c}
        </div>
      </ha-card>
    `;
  }
  _renderScreenInfoBar() {
    const t = this._appName, e = this._mediaTitle, s = this._mediaArtist, i = this._appColor, n = this._getAppIcon(), o = [e, s].filter(Boolean).join(" — ");
    return !t && !o ? c : u`
      <div class="screen-info-bar">
        ${t ? u`<span class="info-app-badge" style="--app-color: ${i}">
              ${n ? u`<span class="app-icon" .innerHTML="${n}"></span>` : c}
              ${t}
            </span>` : c}
        ${o ? u`<span class="info-title">${o}</span>` : c}
      </div>
    `;
  }
  _renderScreenFallback() {
    if (!this._isOn)
      return c;
    const t = this._appName, e = this._mediaTitle, s = this._mediaArtist, i = this._appColor, n = this._getAppIcon();
    return !e && !t ? c : u`
      ${t ? u`<div class="screen-app-badge" style="--app-color: ${i}">
            ${n ? u`<span class="app-icon" .innerHTML="${n}"></span>` : c}
            ${t}
          </div>` : c}
      ${e ? u`<div class="screen-media-title">${e}</div>` : c}
      ${s ? u`<div class="screen-media-artist">${s}</div>` : c}
    `;
  }
  _getAppIcon() {
    const t = this._appId;
    return t.includes("youtube") ? nt.youtube : t.includes("netflix") ? nt.netflix : null;
  }
};
F.styles = ut`
    :host {
      display: block;
    }

    ha-card {
      background: #0c0c0c;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #222;
    }

    .tv-display {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .tv-image {
      display: block;
      width: 100%;
      height: auto;
    }

    .screen-overlay {
      position: absolute;
      overflow: hidden;
      border-radius: 2px;
      transition: background 600ms ease;
    }

    .screen-overlay.off {
      background: rgba(0, 0, 0, 0.92);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .screen-overlay.on {
      background: rgba(0, 0, 0, 0.85);
    }

    .screen-capture {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 400ms ease;
    }

    .screen-capture.loaded { opacity: 1; }
    .screen-capture.loading { opacity: 0.6; }

    .screen-info-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
      z-index: 2;
      opacity: 0;
      transition: opacity 300ms ease;
    }

    .screen-overlay:hover .screen-info-bar {
      opacity: 1;
    }

    .screen-info-bar .info-app-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 6px;
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(6px);
      font-size: 8px;
      font-weight: 600;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      color: var(--app-color, #fff);
    }

    .screen-info-bar .info-app-badge .app-icon {
      width: 10px;
      height: 10px;
    }

    .screen-info-bar .info-title {
      flex: 1;
      font-size: 9px;
      color: rgba(255, 255, 255, 0.85);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
    }

    .screen-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8%;
      text-align: center;
      width: 100%;
      height: 100%;
    }

    .screen-power-icon {
      width: 28px;
      height: 28px;
      color: #333;
      opacity: 0.6;
    }

    .screen-state-text {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.4);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .screen-app-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 10px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(8px);
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: var(--app-color, #fff);
    }

    .screen-app-badge .app-icon {
      width: 12px;
      height: 12px;
    }

    .screen-media-title {
      font-size: 13px;
      font-weight: 600;
      color: #fff;
      text-shadow: 0 1px 6px rgba(0, 0, 0, 0.8);
      max-width: 90%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .screen-media-artist {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.7);
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
    }

    .live-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #4caf50;
      animation: live-pulse 2s ease-in-out infinite;
      position: absolute;
      top: 5px;
      right: 5px;
      z-index: 3;
    }

    @keyframes live-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    .app-badge-toast {
      position: absolute;
      bottom: 6%;
      left: 50%;
      transform: translateX(-50%) translateY(8px);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 18px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1);
      z-index: 10;
      pointer-events: none;
      opacity: 0;
      transition: opacity 350ms ease, transform 350ms ease;
    }

    .app-badge-toast.visible {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    .app-badge-toast .toast-icon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    .app-badge-toast .toast-label {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.5px;
      color: var(--toast-color, #fff);
      white-space: nowrap;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    }
  `;
let b = F;
B([
  pt({ attribute: !1 })
], b.prototype, "hass");
B([
  W()
], b.prototype, "_config");
B([
  W()
], b.prototype, "_cacheBuster");
B([
  W()
], b.prototype, "_showAppBadge");
customElements.get("bravia-tv-display") || customElements.define("bravia-tv-display", b);
typeof window < "u" && (window.customCards = window.customCards || [], window.customCards.some((r) => r.type === "bravia-tv-display") || window.customCards.push({
  type: "bravia-tv-display",
  name: "Bravia TV Display",
  description: "TV illustration with live screen overlay showing what's running"
}));
export {
  b as BraviaTvDisplay
};
//# sourceMappingURL=bravia-tv-display.js.map
