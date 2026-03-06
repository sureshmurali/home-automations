/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Le = globalThis, Ci = Le.ShadowRoot && (Le.ShadyCSS === void 0 || Le.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ki = Symbol(), Wi = /* @__PURE__ */ new WeakMap();
let kr = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== ki) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Ci && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = Wi.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && Wi.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const On = (a) => new kr(typeof a == "string" ? a : a + "", void 0, ki), Dn = (a, ...t) => {
  const e = a.length === 1 ? a[0] : t.reduce((i, r, n) => i + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + a[n + 1], a[0]);
  return new kr(e, a, ki);
}, Rn = (a, t) => {
  if (Ci) a.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), r = Le.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = e.cssText, a.appendChild(i);
  }
}, Ki = Ci ? (a) => a : (a) => a instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return On(e);
})(a) : a;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: zn, defineProperty: Hn, getOwnPropertyDescriptor: Un, getOwnPropertyNames: Fn, getOwnPropertySymbols: Ln, getPrototypeOf: Bn } = Object, Tt = globalThis, Xi = Tt.trustedTypes, In = Xi ? Xi.emptyScript : "", Nn = Tt.reactiveElementPolyfillSupport, ge = (a, t) => a, Ye = { toAttribute(a, t) {
  switch (t) {
    case Boolean:
      a = a ? In : null;
      break;
    case Object:
    case Array:
      a = a == null ? a : JSON.stringify(a);
  }
  return a;
}, fromAttribute(a, t) {
  let e = a;
  switch (t) {
    case Boolean:
      e = a !== null;
      break;
    case Number:
      e = a === null ? null : Number(a);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(a);
      } catch {
        e = null;
      }
  }
  return e;
} }, Ti = (a, t) => !zn(a, t), qi = { attribute: !0, type: String, converter: Ye, reflect: !1, useDefault: !1, hasChanged: Ti };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), Tt.litPropertyMetadata ?? (Tt.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let Kt = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = qi) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, e);
      r !== void 0 && Hn(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: r, set: n } = Un(this.prototype, t) ?? { get() {
      return this[e];
    }, set(s) {
      this[e] = s;
    } };
    return { get: r, set(s) {
      const o = r?.call(this);
      n?.call(this, s), this.requestUpdate(t, o, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? qi;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ge("elementProperties"))) return;
    const t = Bn(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ge("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ge("properties"))) {
      const e = this.properties, i = [...Fn(e), ...Ln(e)];
      for (const r of i) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, r] of e) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const r = this._$Eu(e, i);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const r of i) e.unshift(Ki(r));
    } else t !== void 0 && e.push(Ki(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Rn(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const n = (i.converter?.toAttribute !== void 0 ? i.converter : Ye).toAttribute(e, i.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const n = i.getPropertyOptions(r), s = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : Ye;
      this._$Em = r;
      const o = s.fromAttribute(e, n.type);
      this[r] = o ?? this._$Ej?.get(r) ?? o, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, r = !1, n) {
    if (t !== void 0) {
      const s = this.constructor;
      if (r === !1 && (n = this[t]), i ?? (i = s.getPropertyOptions(t)), !((i.hasChanged ?? Ti)(n, e) || i.useDefault && i.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(s._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: r, wrapped: n }, s) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, s ?? e ?? this[t]), n !== !0 || s !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [r, n] of this._$Ep) this[r] = n;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [r, n] of i) {
        const { wrapped: s } = n, o = this[r];
        s !== !0 || this._$AL.has(r) || o === void 0 || this.C(r, void 0, n, o);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
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
Kt.elementStyles = [], Kt.shadowRootOptions = { mode: "open" }, Kt[ge("elementProperties")] = /* @__PURE__ */ new Map(), Kt[ge("finalized")] = /* @__PURE__ */ new Map(), Nn?.({ ReactiveElement: Kt }), (Tt.reactiveElementVersions ?? (Tt.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const me = globalThis, Gi = (a) => a, Ve = me.trustedTypes, Qi = Ve ? Ve.createPolicy("lit-html", { createHTML: (a) => a }) : void 0, Tr = "$lit$", wt = `lit$${Math.random().toFixed(9).slice(2)}$`, Pr = "?" + wt, Yn = `<${Pr}>`, Jt = document, Ae = () => Jt.createComment(""), Ce = (a) => a === null || typeof a != "object" && typeof a != "function", Pi = Array.isArray, Vn = (a) => Pi(a) || typeof a?.[Symbol.iterator] == "function", ei = `[ 	
\f\r]`, de = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, tr = /-->/g, er = />/g, Ht = RegExp(`>|${ei}(?:([^\\s"'>=/]+)(${ei}*=${ei}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ir = /'/g, rr = /"/g, Sr = /^(?:script|style|textarea|title)$/i, $n = (a) => (t, ...e) => ({ _$litType$: a, strings: t, values: e }), Zt = $n(1), ie = Symbol.for("lit-noChange"), V = Symbol.for("lit-nothing"), nr = /* @__PURE__ */ new WeakMap(), Bt = Jt.createTreeWalker(Jt, 129);
function Er(a, t) {
  if (!Pi(a) || !a.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Qi !== void 0 ? Qi.createHTML(t) : t;
}
const Jn = (a, t) => {
  const e = a.length - 1, i = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", s = de;
  for (let o = 0; o < e; o++) {
    const l = a[o];
    let h, u, c = -1, f = 0;
    for (; f < l.length && (s.lastIndex = f, u = s.exec(l), u !== null); ) f = s.lastIndex, s === de ? u[1] === "!--" ? s = tr : u[1] !== void 0 ? s = er : u[2] !== void 0 ? (Sr.test(u[2]) && (r = RegExp("</" + u[2], "g")), s = Ht) : u[3] !== void 0 && (s = Ht) : s === Ht ? u[0] === ">" ? (s = r ?? de, c = -1) : u[1] === void 0 ? c = -2 : (c = s.lastIndex - u[2].length, h = u[1], s = u[3] === void 0 ? Ht : u[3] === '"' ? rr : ir) : s === rr || s === ir ? s = Ht : s === tr || s === er ? s = de : (s = Ht, r = void 0);
    const p = s === Ht && a[o + 1].startsWith("/>") ? " " : "";
    n += s === de ? l + Yn : c >= 0 ? (i.push(h), l.slice(0, c) + Tr + l.slice(c) + wt + p) : l + wt + (c === -2 ? o : p);
  }
  return [Er(a, n + (a[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class ke {
  constructor({ strings: t, _$litType$: e }, i) {
    let r;
    this.parts = [];
    let n = 0, s = 0;
    const o = t.length - 1, l = this.parts, [h, u] = Jn(t, e);
    if (this.el = ke.createElement(h, i), Bt.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (r = Bt.nextNode()) !== null && l.length < o; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const c of r.getAttributeNames()) if (c.endsWith(Tr)) {
          const f = u[s++], p = r.getAttribute(c).split(wt), _ = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: n, name: _[2], strings: p, ctor: _[1] === "." ? Zn : _[1] === "?" ? Wn : _[1] === "@" ? Kn : qe }), r.removeAttribute(c);
        } else c.startsWith(wt) && (l.push({ type: 6, index: n }), r.removeAttribute(c));
        if (Sr.test(r.tagName)) {
          const c = r.textContent.split(wt), f = c.length - 1;
          if (f > 0) {
            r.textContent = Ve ? Ve.emptyScript : "";
            for (let p = 0; p < f; p++) r.append(c[p], Ae()), Bt.nextNode(), l.push({ type: 2, index: ++n });
            r.append(c[f], Ae());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Pr) l.push({ type: 2, index: n });
      else {
        let c = -1;
        for (; (c = r.data.indexOf(wt, c + 1)) !== -1; ) l.push({ type: 7, index: n }), c += wt.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const i = Jt.createElement("template");
    return i.innerHTML = t, i;
  }
}
function re(a, t, e = a, i) {
  if (t === ie) return t;
  let r = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const n = Ce(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(a), r._$AT(a, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = r : e._$Cl = r), r !== void 0 && (t = re(a, r._$AS(a, t.values), r, i)), t;
}
class jn {
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
    const { el: { content: e }, parts: i } = this._$AD, r = (t?.creationScope ?? Jt).importNode(e, !0);
    Bt.currentNode = r;
    let n = Bt.nextNode(), s = 0, o = 0, l = i[0];
    for (; l !== void 0; ) {
      if (s === l.index) {
        let h;
        l.type === 2 ? h = new ze(n, n.nextSibling, this, t) : l.type === 1 ? h = new l.ctor(n, l.name, l.strings, this, t) : l.type === 6 && (h = new Xn(n, this, t)), this._$AV.push(h), l = i[++o];
      }
      s !== l?.index && (n = Bt.nextNode(), s++);
    }
    return Bt.currentNode = Jt, r;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class ze {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, i, r) {
    this.type = 2, this._$AH = V, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    t = re(this, t, e), Ce(t) ? t === V || t == null || t === "" ? (this._$AH !== V && this._$AR(), this._$AH = V) : t !== this._$AH && t !== ie && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Vn(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== V && Ce(this._$AH) ? this._$AA.nextSibling.data = t : this.T(Jt.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = ke.createElement(Er(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === r) this._$AH.p(e);
    else {
      const n = new jn(r, this), s = n.u(this.options);
      n.p(e), this.T(s), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = nr.get(t.strings);
    return e === void 0 && nr.set(t.strings, e = new ke(t)), e;
  }
  k(t) {
    Pi(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, r = 0;
    for (const n of t) r === e.length ? e.push(i = new ze(this.O(Ae()), this.O(Ae()), this, this.options)) : i = e[r], i._$AI(n), r++;
    r < e.length && (this._$AR(i && i._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = Gi(t).nextSibling;
      Gi(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class qe {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, r, n) {
    this.type = 1, this._$AH = V, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = V;
  }
  _$AI(t, e = this, i, r) {
    const n = this.strings;
    let s = !1;
    if (n === void 0) t = re(this, t, e, 0), s = !Ce(t) || t !== this._$AH && t !== ie, s && (this._$AH = t);
    else {
      const o = t;
      let l, h;
      for (t = n[0], l = 0; l < n.length - 1; l++) h = re(this, o[i + l], e, l), h === ie && (h = this._$AH[l]), s || (s = !Ce(h) || h !== this._$AH[l]), h === V ? t = V : t !== V && (t += (h ?? "") + n[l + 1]), this._$AH[l] = h;
    }
    s && !r && this.j(t);
  }
  j(t) {
    t === V ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Zn extends qe {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === V ? void 0 : t;
  }
}
class Wn extends qe {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== V);
  }
}
class Kn extends qe {
  constructor(t, e, i, r, n) {
    super(t, e, i, r, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = re(this, t, e, 0) ?? V) === ie) return;
    const i = this._$AH, r = t === V && i !== V || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, n = t !== V && (i === V || r);
    r && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Xn {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    re(this, t);
  }
}
const qn = me.litHtmlPolyfillSupport;
qn?.(ke, ze), (me.litHtmlVersions ?? (me.litHtmlVersions = [])).push("3.3.2");
const Gn = (a, t, e) => {
  const i = e?.renderBefore ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const n = e?.renderBefore ?? null;
    i._$litPart$ = r = new ze(t.insertBefore(Ae(), n), n, void 0, e ?? {});
  }
  return r._$AI(a), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ye = globalThis;
class ve extends Kt {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Gn(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return ie;
  }
}
ve._$litElement$ = !0, ve.finalized = !0, ye.litElementHydrateSupport?.({ LitElement: ve });
const Qn = ye.litElementPolyfillSupport;
Qn?.({ LitElement: ve });
(ye.litElementVersions ?? (ye.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ts = { attribute: !0, type: String, converter: Ye, reflect: !1, hasChanged: Ti }, es = (a = ts, t, e) => {
  const { kind: i, metadata: r } = e;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), i === "setter" && ((a = Object.create(a)).wrapped = !0), n.set(e.name, a), i === "accessor") {
    const { name: s } = e;
    return { set(o) {
      const l = t.get.call(this);
      t.set.call(this, o), this.requestUpdate(s, l, a, !0, o);
    }, init(o) {
      return o !== void 0 && this.C(s, void 0, a, o), o;
    } };
  }
  if (i === "setter") {
    const { name: s } = e;
    return function(o) {
      const l = this[s];
      t.call(this, o), this.requestUpdate(s, l, a, !0, o);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function Mr(a) {
  return (t, e) => typeof e == "object" ? es(a, t, e) : ((i, r, n) => {
    const s = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, i), s ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(a, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function is(a) {
  return Mr({ ...a, state: !0, attribute: !1 });
}
function yt(a) {
  if (a === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return a;
}
function Or(a, t) {
  a.prototype = Object.create(t.prototype), a.prototype.constructor = a, a.__proto__ = t;
}
/*!
 * GSAP 3.14.2
 * https://gsap.com
 *
 * @license Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/
var ot = {
  autoSleep: 120,
  force3D: "auto",
  nullTargetWarn: 1,
  units: {
    lineHeight: ""
  }
}, ne = {
  duration: 0.5,
  overwrite: !1,
  delay: 0
}, Si, j, R, ut = 1e8, E = 1 / ut, ui = Math.PI * 2, rs = ui / 4, ns = 0, Dr = Math.sqrt, ss = Math.cos, os = Math.sin, $ = function(t) {
  return typeof t == "string";
}, F = function(t) {
  return typeof t == "function";
}, bt = function(t) {
  return typeof t == "number";
}, Ei = function(t) {
  return typeof t > "u";
}, gt = function(t) {
  return typeof t == "object";
}, q = function(t) {
  return t !== !1;
}, Mi = function() {
  return typeof window < "u";
}, Fe = function(t) {
  return F(t) || $(t);
}, Rr = typeof ArrayBuffer == "function" && ArrayBuffer.isView || function() {
}, K = Array.isArray, as = /random\([^)]+\)/g, ls = /,\s*/g, sr = /(?:-?\.?\d|\.)+/gi, zr = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g, qt = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g, ii = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi, Hr = /[+-]=-?[.\d]+/, hs = /[^,'"\[\]\s]+/gi, us = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i, H, ft, ci, Oi, at = {}, $e = {}, Ur, Fr = function(t) {
  return ($e = se(t, at)) && et;
}, Di = function(t, e) {
  return console.warn("Invalid property", t, "set to", e, "Missing plugin? gsap.registerPlugin()");
}, Te = function(t, e) {
  return !e && console.warn(t);
}, Lr = function(t, e) {
  return t && (at[t] = e) && $e && ($e[t] = e) || at;
}, Pe = function() {
  return 0;
}, cs = {
  suppressEvents: !0,
  isStart: !0,
  kill: !1
}, Be = {
  suppressEvents: !0,
  kill: !1
}, ds = {
  suppressEvents: !0
}, Ri = {}, Pt = [], di = {}, Br, it = {}, ri = {}, or = 30, Ie = [], zi = "", Hi = function(t) {
  var e = t[0], i, r;
  if (gt(e) || F(e) || (t = [t]), !(i = (e._gsap || {}).harness)) {
    for (r = Ie.length; r-- && !Ie[r].targetTest(e); )
      ;
    i = Ie[r];
  }
  for (r = t.length; r--; )
    t[r] && (t[r]._gsap || (t[r]._gsap = new un(t[r], i))) || t.splice(r, 1);
  return t;
}, Nt = function(t) {
  return t._gsap || Hi(ct(t))[0]._gsap;
}, Ir = function(t, e, i) {
  return (i = t[e]) && F(i) ? t[e]() : Ei(i) && t.getAttribute && t.getAttribute(e) || i;
}, G = function(t, e) {
  return (t = t.split(",")).forEach(e) || t;
}, L = function(t) {
  return Math.round(t * 1e5) / 1e5 || 0;
}, z = function(t) {
  return Math.round(t * 1e7) / 1e7 || 0;
}, Qt = function(t, e) {
  var i = e.charAt(0), r = parseFloat(e.substr(2));
  return t = parseFloat(t), i === "+" ? t + r : i === "-" ? t - r : i === "*" ? t * r : t / r;
}, fs = function(t, e) {
  for (var i = e.length, r = 0; t.indexOf(e[r]) < 0 && ++r < i; )
    ;
  return r < i;
}, Je = function() {
  var t = Pt.length, e = Pt.slice(0), i, r;
  for (di = {}, Pt.length = 0, i = 0; i < t; i++)
    r = e[i], r && r._lazy && (r.render(r._lazy[0], r._lazy[1], !0)._lazy = 0);
}, Ui = function(t) {
  return !!(t._initted || t._startAt || t.add);
}, Nr = function(t, e, i, r) {
  Pt.length && !j && Je(), t.render(e, i, !!(j && e < 0 && Ui(t))), Pt.length && !j && Je();
}, Yr = function(t) {
  var e = parseFloat(t);
  return (e || e === 0) && (t + "").match(hs).length < 2 ? e : $(t) ? t.trim() : t;
}, Vr = function(t) {
  return t;
}, lt = function(t, e) {
  for (var i in e)
    i in t || (t[i] = e[i]);
  return t;
}, ps = function(t) {
  return function(e, i) {
    for (var r in i)
      r in e || r === "duration" && t || r === "ease" || (e[r] = i[r]);
  };
}, se = function(t, e) {
  for (var i in e)
    t[i] = e[i];
  return t;
}, ar = function a(t, e) {
  for (var i in e)
    i !== "__proto__" && i !== "constructor" && i !== "prototype" && (t[i] = gt(e[i]) ? a(t[i] || (t[i] = {}), e[i]) : e[i]);
  return t;
}, je = function(t, e) {
  var i = {}, r;
  for (r in t)
    r in e || (i[r] = t[r]);
  return i;
}, be = function(t) {
  var e = t.parent || H, i = t.keyframes ? ps(K(t.keyframes)) : lt;
  if (q(t.inherit))
    for (; e; )
      i(t, e.vars.defaults), e = e.parent || e._dp;
  return t;
}, _s = function(t, e) {
  for (var i = t.length, r = i === e.length; r && i-- && t[i] === e[i]; )
    ;
  return i < 0;
}, $r = function(t, e, i, r, n) {
  var s = t[r], o;
  if (n)
    for (o = e[n]; s && s[n] > o; )
      s = s._prev;
  return s ? (e._next = s._next, s._next = e) : (e._next = t[i], t[i] = e), e._next ? e._next._prev = e : t[r] = e, e._prev = s, e.parent = e._dp = t, e;
}, Ge = function(t, e, i, r) {
  i === void 0 && (i = "_first"), r === void 0 && (r = "_last");
  var n = e._prev, s = e._next;
  n ? n._next = s : t[i] === e && (t[i] = s), s ? s._prev = n : t[r] === e && (t[r] = n), e._next = e._prev = e.parent = null;
}, Et = function(t, e) {
  t.parent && (!e || t.parent.autoRemoveChildren) && t.parent.remove && t.parent.remove(t), t._act = 0;
}, Yt = function(t, e) {
  if (t && (!e || e._end > t._dur || e._start < 0))
    for (var i = t; i; )
      i._dirty = 1, i = i.parent;
  return t;
}, gs = function(t) {
  for (var e = t.parent; e && e.parent; )
    e._dirty = 1, e.totalDuration(), e = e.parent;
  return t;
}, fi = function(t, e, i, r) {
  return t._startAt && (j ? t._startAt.revert(Be) : t.vars.immediateRender && !t.vars.autoRevert || t._startAt.render(e, !0, r));
}, ms = function a(t) {
  return !t || t._ts && a(t.parent);
}, lr = function(t) {
  return t._repeat ? oe(t._tTime, t = t.duration() + t._rDelay) * t : 0;
}, oe = function(t, e) {
  var i = Math.floor(t = z(t / e));
  return t && i === t ? i - 1 : i;
}, Ze = function(t, e) {
  return (t - e._start) * e._ts + (e._ts >= 0 ? 0 : e._dirty ? e.totalDuration() : e._tDur);
}, Qe = function(t) {
  return t._end = z(t._start + (t._tDur / Math.abs(t._ts || t._rts || E) || 0));
}, ti = function(t, e) {
  var i = t._dp;
  return i && i.smoothChildTiming && t._ts && (t._start = z(i._time - (t._ts > 0 ? e / t._ts : ((t._dirty ? t.totalDuration() : t._tDur) - e) / -t._ts)), Qe(t), i._dirty || Yt(i, t)), t;
}, Jr = function(t, e) {
  var i;
  if ((e._time || !e._dur && e._initted || e._start < t._time && (e._dur || !e.add)) && (i = Ze(t.rawTime(), e), (!e._dur || He(0, e.totalDuration(), i) - e._tTime > E) && e.render(i, !0)), Yt(t, e)._dp && t._initted && t._time >= t._dur && t._ts) {
    if (t._dur < t.duration())
      for (i = t; i._dp; )
        i.rawTime() >= 0 && i.totalTime(i._tTime), i = i._dp;
    t._zTime = -E;
  }
}, pt = function(t, e, i, r) {
  return e.parent && Et(e), e._start = z((bt(i) ? i : i || t !== H ? ht(t, i, e) : t._time) + e._delay), e._end = z(e._start + (e.totalDuration() / Math.abs(e.timeScale()) || 0)), $r(t, e, "_first", "_last", t._sort ? "_start" : 0), pi(e) || (t._recent = e), r || Jr(t, e), t._ts < 0 && ti(t, t._tTime), t;
}, jr = function(t, e) {
  return (at.ScrollTrigger || Di("scrollTrigger", e)) && at.ScrollTrigger.create(e, t);
}, Zr = function(t, e, i, r, n) {
  if (Li(t, e, n), !t._initted)
    return 1;
  if (!i && t._pt && !j && (t._dur && t.vars.lazy !== !1 || !t._dur && t.vars.lazy) && Br !== rt.frame)
    return Pt.push(t), t._lazy = [n, r], 1;
}, ys = function a(t) {
  var e = t.parent;
  return e && e._ts && e._initted && !e._lock && (e.rawTime() < 0 || a(e));
}, pi = function(t) {
  var e = t.data;
  return e === "isFromStart" || e === "isStart";
}, vs = function(t, e, i, r) {
  var n = t.ratio, s = e < 0 || !e && (!t._start && ys(t) && !(!t._initted && pi(t)) || (t._ts < 0 || t._dp._ts < 0) && !pi(t)) ? 0 : 1, o = t._rDelay, l = 0, h, u, c;
  if (o && t._repeat && (l = He(0, t._tDur, e), u = oe(l, o), t._yoyo && u & 1 && (s = 1 - s), u !== oe(t._tTime, o) && (n = 1 - s, t.vars.repeatRefresh && t._initted && t.invalidate())), s !== n || j || r || t._zTime === E || !e && t._zTime) {
    if (!t._initted && Zr(t, e, r, i, l))
      return;
    for (c = t._zTime, t._zTime = e || (i ? E : 0), i || (i = e && !c), t.ratio = s, t._from && (s = 1 - s), t._time = 0, t._tTime = l, h = t._pt; h; )
      h.r(s, h.d), h = h._next;
    e < 0 && fi(t, e, i, !0), t._onUpdate && !i && nt(t, "onUpdate"), l && t._repeat && !i && t.parent && nt(t, "onRepeat"), (e >= t._tDur || e < 0) && t.ratio === s && (s && Et(t, 1), !i && !j && (nt(t, s ? "onComplete" : "onReverseComplete", !0), t._prom && t._prom()));
  } else t._zTime || (t._zTime = e);
}, bs = function(t, e, i) {
  var r;
  if (i > e)
    for (r = t._first; r && r._start <= i; ) {
      if (r.data === "isPause" && r._start > e)
        return r;
      r = r._next;
    }
  else
    for (r = t._last; r && r._start >= i; ) {
      if (r.data === "isPause" && r._start < e)
        return r;
      r = r._prev;
    }
}, ae = function(t, e, i, r) {
  var n = t._repeat, s = z(e) || 0, o = t._tTime / t._tDur;
  return o && !r && (t._time *= s / t._dur), t._dur = s, t._tDur = n ? n < 0 ? 1e10 : z(s * (n + 1) + t._rDelay * n) : s, o > 0 && !r && ti(t, t._tTime = t._tDur * o), t.parent && Qe(t), i || Yt(t.parent, t), t;
}, hr = function(t) {
  return t instanceof X ? Yt(t) : ae(t, t._dur);
}, xs = {
  _start: 0,
  endTime: Pe,
  totalDuration: Pe
}, ht = function a(t, e, i) {
  var r = t.labels, n = t._recent || xs, s = t.duration() >= ut ? n.endTime(!1) : t._dur, o, l, h;
  return $(e) && (isNaN(e) || e in r) ? (l = e.charAt(0), h = e.substr(-1) === "%", o = e.indexOf("="), l === "<" || l === ">" ? (o >= 0 && (e = e.replace(/=/, "")), (l === "<" ? n._start : n.endTime(n._repeat >= 0)) + (parseFloat(e.substr(1)) || 0) * (h ? (o < 0 ? n : i).totalDuration() / 100 : 1)) : o < 0 ? (e in r || (r[e] = s), r[e]) : (l = parseFloat(e.charAt(o - 1) + e.substr(o + 1)), h && i && (l = l / 100 * (K(i) ? i[0] : i).totalDuration()), o > 1 ? a(t, e.substr(0, o - 1), i) + l : s + l)) : e == null ? s : +e;
}, xe = function(t, e, i) {
  var r = bt(e[1]), n = (r ? 2 : 1) + (t < 2 ? 0 : 1), s = e[n], o, l;
  if (r && (s.duration = e[1]), s.parent = i, t) {
    for (o = s, l = i; l && !("immediateRender" in o); )
      o = l.vars.defaults || {}, l = q(l.vars.inherit) && l.parent;
    s.immediateRender = q(o.immediateRender), t < 2 ? s.runBackwards = 1 : s.startAt = e[n - 1];
  }
  return new I(e[0], s, e[n + 1]);
}, Dt = function(t, e) {
  return t || t === 0 ? e(t) : e;
}, He = function(t, e, i) {
  return i < t ? t : i > e ? e : i;
}, W = function(t, e) {
  return !$(t) || !(e = us.exec(t)) ? "" : e[1];
}, ws = function(t, e, i) {
  return Dt(i, function(r) {
    return He(t, e, r);
  });
}, _i = [].slice, Wr = function(t, e) {
  return t && gt(t) && "length" in t && (!e && !t.length || t.length - 1 in t && gt(t[0])) && !t.nodeType && t !== ft;
}, As = function(t, e, i) {
  return i === void 0 && (i = []), t.forEach(function(r) {
    var n;
    return $(r) && !e || Wr(r, 1) ? (n = i).push.apply(n, ct(r)) : i.push(r);
  }) || i;
}, ct = function(t, e, i) {
  return R && !e && R.selector ? R.selector(t) : $(t) && !i && (ci || !le()) ? _i.call((e || Oi).querySelectorAll(t), 0) : K(t) ? As(t, i) : Wr(t) ? _i.call(t, 0) : t ? [t] : [];
}, gi = function(t) {
  return t = ct(t)[0] || Te("Invalid scope") || {}, function(e) {
    var i = t.current || t.nativeElement || t;
    return ct(e, i.querySelectorAll ? i : i === t ? Te("Invalid scope") || Oi.createElement("div") : t);
  };
}, Kr = function(t) {
  return t.sort(function() {
    return 0.5 - Math.random();
  });
}, Xr = function(t) {
  if (F(t))
    return t;
  var e = gt(t) ? t : {
    each: t
  }, i = Vt(e.ease), r = e.from || 0, n = parseFloat(e.base) || 0, s = {}, o = r > 0 && r < 1, l = isNaN(r) || o, h = e.axis, u = r, c = r;
  return $(r) ? u = c = {
    center: 0.5,
    edges: 0.5,
    end: 1
  }[r] || 0 : !o && l && (u = r[0], c = r[1]), function(f, p, _) {
    var d = (_ || e).length, g = s[d], y, v, x, w, m, A, C, k, b;
    if (!g) {
      if (b = e.grid === "auto" ? 0 : (e.grid || [1, ut])[1], !b) {
        for (C = -ut; C < (C = _[b++].getBoundingClientRect().left) && b < d; )
          ;
        b < d && b--;
      }
      for (g = s[d] = [], y = l ? Math.min(b, d) * u - 0.5 : r % b, v = b === ut ? 0 : l ? d * c / b - 0.5 : r / b | 0, C = 0, k = ut, A = 0; A < d; A++)
        x = A % b - y, w = v - (A / b | 0), g[A] = m = h ? Math.abs(h === "y" ? w : x) : Dr(x * x + w * w), m > C && (C = m), m < k && (k = m);
      r === "random" && Kr(g), g.max = C - k, g.min = k, g.v = d = (parseFloat(e.amount) || parseFloat(e.each) * (b > d ? d - 1 : h ? h === "y" ? d / b : b : Math.max(b, d / b)) || 0) * (r === "edges" ? -1 : 1), g.b = d < 0 ? n - d : n, g.u = W(e.amount || e.each) || 0, i = i && d < 0 ? an(i) : i;
    }
    return d = (g[f] - g.min) / g.max || 0, z(g.b + (i ? i(d) : d) * g.v) + g.u;
  };
}, mi = function(t) {
  var e = Math.pow(10, ((t + "").split(".")[1] || "").length);
  return function(i) {
    var r = z(Math.round(parseFloat(i) / t) * t * e);
    return (r - r % 1) / e + (bt(i) ? 0 : W(i));
  };
}, qr = function(t, e) {
  var i = K(t), r, n;
  return !i && gt(t) && (r = i = t.radius || ut, t.values ? (t = ct(t.values), (n = !bt(t[0])) && (r *= r)) : t = mi(t.increment)), Dt(e, i ? F(t) ? function(s) {
    return n = t(s), Math.abs(n - s) <= r ? n : s;
  } : function(s) {
    for (var o = parseFloat(n ? s.x : s), l = parseFloat(n ? s.y : 0), h = ut, u = 0, c = t.length, f, p; c--; )
      n ? (f = t[c].x - o, p = t[c].y - l, f = f * f + p * p) : f = Math.abs(t[c] - o), f < h && (h = f, u = c);
    return u = !r || h <= r ? t[u] : s, n || u === s || bt(s) ? u : u + W(s);
  } : mi(t));
}, Gr = function(t, e, i, r) {
  return Dt(K(t) ? !e : i === !0 ? !!(i = 0) : !r, function() {
    return K(t) ? t[~~(Math.random() * t.length)] : (i = i || 1e-5) && (r = i < 1 ? Math.pow(10, (i + "").length - 2) : 1) && Math.floor(Math.round((t - i / 2 + Math.random() * (e - t + i * 0.99)) / i) * i * r) / r;
  });
}, Cs = function() {
  for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++)
    e[i] = arguments[i];
  return function(r) {
    return e.reduce(function(n, s) {
      return s(n);
    }, r);
  };
}, ks = function(t, e) {
  return function(i) {
    return t(parseFloat(i)) + (e || W(i));
  };
}, Ts = function(t, e, i) {
  return tn(t, e, 0, 1, i);
}, Qr = function(t, e, i) {
  return Dt(i, function(r) {
    return t[~~e(r)];
  });
}, Ps = function a(t, e, i) {
  var r = e - t;
  return K(t) ? Qr(t, a(0, t.length), e) : Dt(i, function(n) {
    return (r + (n - t) % r) % r + t;
  });
}, Ss = function a(t, e, i) {
  var r = e - t, n = r * 2;
  return K(t) ? Qr(t, a(0, t.length - 1), e) : Dt(i, function(s) {
    return s = (n + (s - t) % n) % n || 0, t + (s > r ? n - s : s);
  });
}, Se = function(t) {
  return t.replace(as, function(e) {
    var i = e.indexOf("[") + 1, r = e.substring(i || 7, i ? e.indexOf("]") : e.length - 1).split(ls);
    return Gr(i ? r : +r[0], i ? 0 : +r[1], +r[2] || 1e-5);
  });
}, tn = function(t, e, i, r, n) {
  var s = e - t, o = r - i;
  return Dt(n, function(l) {
    return i + ((l - t) / s * o || 0);
  });
}, Es = function a(t, e, i, r) {
  var n = isNaN(t + e) ? 0 : function(p) {
    return (1 - p) * t + p * e;
  };
  if (!n) {
    var s = $(t), o = {}, l, h, u, c, f;
    if (i === !0 && (r = 1) && (i = null), s)
      t = {
        p: t
      }, e = {
        p: e
      };
    else if (K(t) && !K(e)) {
      for (u = [], c = t.length, f = c - 2, h = 1; h < c; h++)
        u.push(a(t[h - 1], t[h]));
      c--, n = function(_) {
        _ *= c;
        var d = Math.min(f, ~~_);
        return u[d](_ - d);
      }, i = e;
    } else r || (t = se(K(t) ? [] : {}, t));
    if (!u) {
      for (l in e)
        Fi.call(o, t, l, "get", e[l]);
      n = function(_) {
        return Ni(_, o) || (s ? t.p : t);
      };
    }
  }
  return Dt(i, n);
}, ur = function(t, e, i) {
  var r = t.labels, n = ut, s, o, l;
  for (s in r)
    o = r[s] - e, o < 0 == !!i && o && n > (o = Math.abs(o)) && (l = s, n = o);
  return l;
}, nt = function(t, e, i) {
  var r = t.vars, n = r[e], s = R, o = t._ctx, l, h, u;
  if (n)
    return l = r[e + "Params"], h = r.callbackScope || t, i && Pt.length && Je(), o && (R = o), u = l ? n.apply(h, l) : n.call(h), R = s, u;
}, pe = function(t) {
  return Et(t), t.scrollTrigger && t.scrollTrigger.kill(!!j), t.progress() < 1 && nt(t, "onInterrupt"), t;
}, Gt, en = [], rn = function(t) {
  if (t)
    if (t = !t.name && t.default || t, Mi() || t.headless) {
      var e = t.name, i = F(t), r = e && !i && t.init ? function() {
        this._props = [];
      } : t, n = {
        init: Pe,
        render: Ni,
        add: Fi,
        kill: Js,
        modifier: $s,
        rawVars: 0
      }, s = {
        targetTest: 0,
        get: 0,
        getSetter: Ii,
        aliases: {},
        register: 0
      };
      if (le(), t !== r) {
        if (it[e])
          return;
        lt(r, lt(je(t, n), s)), se(r.prototype, se(n, je(t, s))), it[r.prop = e] = r, t.targetTest && (Ie.push(r), Ri[e] = 1), e = (e === "css" ? "CSS" : e.charAt(0).toUpperCase() + e.substr(1)) + "Plugin";
      }
      Lr(e, r), t.register && t.register(et, r, Q);
    } else
      en.push(t);
}, S = 255, _e = {
  aqua: [0, S, S],
  lime: [0, S, 0],
  silver: [192, 192, 192],
  black: [0, 0, 0],
  maroon: [128, 0, 0],
  teal: [0, 128, 128],
  blue: [0, 0, S],
  navy: [0, 0, 128],
  white: [S, S, S],
  olive: [128, 128, 0],
  yellow: [S, S, 0],
  orange: [S, 165, 0],
  gray: [128, 128, 128],
  purple: [128, 0, 128],
  green: [0, 128, 0],
  red: [S, 0, 0],
  pink: [S, 192, 203],
  cyan: [0, S, S],
  transparent: [S, S, S, 0]
}, ni = function(t, e, i) {
  return t += t < 0 ? 1 : t > 1 ? -1 : 0, (t * 6 < 1 ? e + (i - e) * t * 6 : t < 0.5 ? i : t * 3 < 2 ? e + (i - e) * (2 / 3 - t) * 6 : e) * S + 0.5 | 0;
}, nn = function(t, e, i) {
  var r = t ? bt(t) ? [t >> 16, t >> 8 & S, t & S] : 0 : _e.black, n, s, o, l, h, u, c, f, p, _;
  if (!r) {
    if (t.substr(-1) === "," && (t = t.substr(0, t.length - 1)), _e[t])
      r = _e[t];
    else if (t.charAt(0) === "#") {
      if (t.length < 6 && (n = t.charAt(1), s = t.charAt(2), o = t.charAt(3), t = "#" + n + n + s + s + o + o + (t.length === 5 ? t.charAt(4) + t.charAt(4) : "")), t.length === 9)
        return r = parseInt(t.substr(1, 6), 16), [r >> 16, r >> 8 & S, r & S, parseInt(t.substr(7), 16) / 255];
      t = parseInt(t.substr(1), 16), r = [t >> 16, t >> 8 & S, t & S];
    } else if (t.substr(0, 3) === "hsl") {
      if (r = _ = t.match(sr), !e)
        l = +r[0] % 360 / 360, h = +r[1] / 100, u = +r[2] / 100, s = u <= 0.5 ? u * (h + 1) : u + h - u * h, n = u * 2 - s, r.length > 3 && (r[3] *= 1), r[0] = ni(l + 1 / 3, n, s), r[1] = ni(l, n, s), r[2] = ni(l - 1 / 3, n, s);
      else if (~t.indexOf("="))
        return r = t.match(zr), i && r.length < 4 && (r[3] = 1), r;
    } else
      r = t.match(sr) || _e.transparent;
    r = r.map(Number);
  }
  return e && !_ && (n = r[0] / S, s = r[1] / S, o = r[2] / S, c = Math.max(n, s, o), f = Math.min(n, s, o), u = (c + f) / 2, c === f ? l = h = 0 : (p = c - f, h = u > 0.5 ? p / (2 - c - f) : p / (c + f), l = c === n ? (s - o) / p + (s < o ? 6 : 0) : c === s ? (o - n) / p + 2 : (n - s) / p + 4, l *= 60), r[0] = ~~(l + 0.5), r[1] = ~~(h * 100 + 0.5), r[2] = ~~(u * 100 + 0.5)), i && r.length < 4 && (r[3] = 1), r;
}, sn = function(t) {
  var e = [], i = [], r = -1;
  return t.split(St).forEach(function(n) {
    var s = n.match(qt) || [];
    e.push.apply(e, s), i.push(r += s.length + 1);
  }), e.c = i, e;
}, cr = function(t, e, i) {
  var r = "", n = (t + r).match(St), s = e ? "hsla(" : "rgba(", o = 0, l, h, u, c;
  if (!n)
    return t;
  if (n = n.map(function(f) {
    return (f = nn(f, e, 1)) && s + (e ? f[0] + "," + f[1] + "%," + f[2] + "%," + f[3] : f.join(",")) + ")";
  }), i && (u = sn(t), l = i.c, l.join(r) !== u.c.join(r)))
    for (h = t.replace(St, "1").split(qt), c = h.length - 1; o < c; o++)
      r += h[o] + (~l.indexOf(o) ? n.shift() || s + "0,0,0,0)" : (u.length ? u : n.length ? n : i).shift());
  if (!h)
    for (h = t.split(St), c = h.length - 1; o < c; o++)
      r += h[o] + n[o];
  return r + h[c];
}, St = (function() {
  var a = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", t;
  for (t in _e)
    a += "|" + t + "\\b";
  return new RegExp(a + ")", "gi");
})(), Ms = /hsl[a]?\(/, on = function(t) {
  var e = t.join(" "), i;
  if (St.lastIndex = 0, St.test(e))
    return i = Ms.test(e), t[1] = cr(t[1], i), t[0] = cr(t[0], i, sn(t[1])), !0;
}, Ee, rt = (function() {
  var a = Date.now, t = 500, e = 33, i = a(), r = i, n = 1e3 / 240, s = n, o = [], l, h, u, c, f, p, _ = function d(g) {
    var y = a() - r, v = g === !0, x, w, m, A;
    if ((y > t || y < 0) && (i += y - e), r += y, m = r - i, x = m - s, (x > 0 || v) && (A = ++c.frame, f = m - c.time * 1e3, c.time = m = m / 1e3, s += x + (x >= n ? 4 : n - x), w = 1), v || (l = h(d)), w)
      for (p = 0; p < o.length; p++)
        o[p](m, f, A, g);
  };
  return c = {
    time: 0,
    frame: 0,
    tick: function() {
      _(!0);
    },
    deltaRatio: function(g) {
      return f / (1e3 / (g || 60));
    },
    wake: function() {
      Ur && (!ci && Mi() && (ft = ci = window, Oi = ft.document || {}, at.gsap = et, (ft.gsapVersions || (ft.gsapVersions = [])).push(et.version), Fr($e || ft.GreenSockGlobals || !ft.gsap && ft || {}), en.forEach(rn)), u = typeof requestAnimationFrame < "u" && requestAnimationFrame, l && c.sleep(), h = u || function(g) {
        return setTimeout(g, s - c.time * 1e3 + 1 | 0);
      }, Ee = 1, _(2));
    },
    sleep: function() {
      (u ? cancelAnimationFrame : clearTimeout)(l), Ee = 0, h = Pe;
    },
    lagSmoothing: function(g, y) {
      t = g || 1 / 0, e = Math.min(y || 33, t);
    },
    fps: function(g) {
      n = 1e3 / (g || 240), s = c.time * 1e3 + n;
    },
    add: function(g, y, v) {
      var x = y ? function(w, m, A, C) {
        g(w, m, A, C), c.remove(x);
      } : g;
      return c.remove(g), o[v ? "unshift" : "push"](x), le(), x;
    },
    remove: function(g, y) {
      ~(y = o.indexOf(g)) && o.splice(y, 1) && p >= y && p--;
    },
    _listeners: o
  }, c;
})(), le = function() {
  return !Ee && rt.wake();
}, T = {}, Os = /^[\d.\-M][\d.\-,\s]/, Ds = /["']/g, Rs = function(t) {
  for (var e = {}, i = t.substr(1, t.length - 3).split(":"), r = i[0], n = 1, s = i.length, o, l, h; n < s; n++)
    l = i[n], o = n !== s - 1 ? l.lastIndexOf(",") : l.length, h = l.substr(0, o), e[r] = isNaN(h) ? h.replace(Ds, "").trim() : +h, r = l.substr(o + 1).trim();
  return e;
}, zs = function(t) {
  var e = t.indexOf("(") + 1, i = t.indexOf(")"), r = t.indexOf("(", e);
  return t.substring(e, ~r && r < i ? t.indexOf(")", i + 1) : i);
}, Hs = function(t) {
  var e = (t + "").split("("), i = T[e[0]];
  return i && e.length > 1 && i.config ? i.config.apply(null, ~t.indexOf("{") ? [Rs(e[1])] : zs(t).split(",").map(Yr)) : T._CE && Os.test(t) ? T._CE("", t) : i;
}, an = function(t) {
  return function(e) {
    return 1 - t(1 - e);
  };
}, ln = function a(t, e) {
  for (var i = t._first, r; i; )
    i instanceof X ? a(i, e) : i.vars.yoyoEase && (!i._yoyo || !i._repeat) && i._yoyo !== e && (i.timeline ? a(i.timeline, e) : (r = i._ease, i._ease = i._yEase, i._yEase = r, i._yoyo = e)), i = i._next;
}, Vt = function(t, e) {
  return t && (F(t) ? t : T[t] || Hs(t)) || e;
}, jt = function(t, e, i, r) {
  i === void 0 && (i = function(l) {
    return 1 - e(1 - l);
  }), r === void 0 && (r = function(l) {
    return l < 0.5 ? e(l * 2) / 2 : 1 - e((1 - l) * 2) / 2;
  });
  var n = {
    easeIn: e,
    easeOut: i,
    easeInOut: r
  }, s;
  return G(t, function(o) {
    T[o] = at[o] = n, T[s = o.toLowerCase()] = i;
    for (var l in n)
      T[s + (l === "easeIn" ? ".in" : l === "easeOut" ? ".out" : ".inOut")] = T[o + "." + l] = n[l];
  }), n;
}, hn = function(t) {
  return function(e) {
    return e < 0.5 ? (1 - t(1 - e * 2)) / 2 : 0.5 + t((e - 0.5) * 2) / 2;
  };
}, si = function a(t, e, i) {
  var r = e >= 1 ? e : 1, n = (i || (t ? 0.3 : 0.45)) / (e < 1 ? e : 1), s = n / ui * (Math.asin(1 / r) || 0), o = function(u) {
    return u === 1 ? 1 : r * Math.pow(2, -10 * u) * os((u - s) * n) + 1;
  }, l = t === "out" ? o : t === "in" ? function(h) {
    return 1 - o(1 - h);
  } : hn(o);
  return n = ui / n, l.config = function(h, u) {
    return a(t, h, u);
  }, l;
}, oi = function a(t, e) {
  e === void 0 && (e = 1.70158);
  var i = function(s) {
    return s ? --s * s * ((e + 1) * s + e) + 1 : 0;
  }, r = t === "out" ? i : t === "in" ? function(n) {
    return 1 - i(1 - n);
  } : hn(i);
  return r.config = function(n) {
    return a(t, n);
  }, r;
};
G("Linear,Quad,Cubic,Quart,Quint,Strong", function(a, t) {
  var e = t < 5 ? t + 1 : t;
  jt(a + ",Power" + (e - 1), t ? function(i) {
    return Math.pow(i, e);
  } : function(i) {
    return i;
  }, function(i) {
    return 1 - Math.pow(1 - i, e);
  }, function(i) {
    return i < 0.5 ? Math.pow(i * 2, e) / 2 : 1 - Math.pow((1 - i) * 2, e) / 2;
  });
});
T.Linear.easeNone = T.none = T.Linear.easeIn;
jt("Elastic", si("in"), si("out"), si());
(function(a, t) {
  var e = 1 / t, i = 2 * e, r = 2.5 * e, n = function(o) {
    return o < e ? a * o * o : o < i ? a * Math.pow(o - 1.5 / t, 2) + 0.75 : o < r ? a * (o -= 2.25 / t) * o + 0.9375 : a * Math.pow(o - 2.625 / t, 2) + 0.984375;
  };
  jt("Bounce", function(s) {
    return 1 - n(1 - s);
  }, n);
})(7.5625, 2.75);
jt("Expo", function(a) {
  return Math.pow(2, 10 * (a - 1)) * a + a * a * a * a * a * a * (1 - a);
});
jt("Circ", function(a) {
  return -(Dr(1 - a * a) - 1);
});
jt("Sine", function(a) {
  return a === 1 ? 1 : -ss(a * rs) + 1;
});
jt("Back", oi("in"), oi("out"), oi());
T.SteppedEase = T.steps = at.SteppedEase = {
  config: function(t, e) {
    t === void 0 && (t = 1);
    var i = 1 / t, r = t + (e ? 0 : 1), n = e ? 1 : 0, s = 1 - E;
    return function(o) {
      return ((r * He(0, s, o) | 0) + n) * i;
    };
  }
};
ne.ease = T["quad.out"];
G("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(a) {
  return zi += a + "," + a + "Params,";
});
var un = function(t, e) {
  this.id = ns++, t._gsap = this, this.target = t, this.harness = e, this.get = e ? e.get : Ir, this.set = e ? e.getSetter : Ii;
}, Me = /* @__PURE__ */ (function() {
  function a(e) {
    this.vars = e, this._delay = +e.delay || 0, (this._repeat = e.repeat === 1 / 0 ? -2 : e.repeat || 0) && (this._rDelay = e.repeatDelay || 0, this._yoyo = !!e.yoyo || !!e.yoyoEase), this._ts = 1, ae(this, +e.duration, 1, 1), this.data = e.data, R && (this._ctx = R, R.data.push(this)), Ee || rt.wake();
  }
  var t = a.prototype;
  return t.delay = function(i) {
    return i || i === 0 ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + i - this._delay), this._delay = i, this) : this._delay;
  }, t.duration = function(i) {
    return arguments.length ? this.totalDuration(this._repeat > 0 ? i + (i + this._rDelay) * this._repeat : i) : this.totalDuration() && this._dur;
  }, t.totalDuration = function(i) {
    return arguments.length ? (this._dirty = 0, ae(this, this._repeat < 0 ? i : (i - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur;
  }, t.totalTime = function(i, r) {
    if (le(), !arguments.length)
      return this._tTime;
    var n = this._dp;
    if (n && n.smoothChildTiming && this._ts) {
      for (ti(this, i), !n._dp || n.parent || Jr(n, this); n && n.parent; )
        n.parent._time !== n._start + (n._ts >= 0 ? n._tTime / n._ts : (n.totalDuration() - n._tTime) / -n._ts) && n.totalTime(n._tTime, !0), n = n.parent;
      !this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && i < this._tDur || this._ts < 0 && i > 0 || !this._tDur && !i) && pt(this._dp, this, this._start - this._delay);
    }
    return (this._tTime !== i || !this._dur && !r || this._initted && Math.abs(this._zTime) === E || !this._initted && this._dur && i || !i && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = i), Nr(this, i, r)), this;
  }, t.time = function(i, r) {
    return arguments.length ? this.totalTime(Math.min(this.totalDuration(), i + lr(this)) % (this._dur + this._rDelay) || (i ? this._dur : 0), r) : this._time;
  }, t.totalProgress = function(i, r) {
    return arguments.length ? this.totalTime(this.totalDuration() * i, r) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() >= 0 && this._initted ? 1 : 0;
  }, t.progress = function(i, r) {
    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - i : i) + lr(this), r) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0;
  }, t.iteration = function(i, r) {
    var n = this.duration() + this._rDelay;
    return arguments.length ? this.totalTime(this._time + (i - 1) * n, r) : this._repeat ? oe(this._tTime, n) + 1 : 1;
  }, t.timeScale = function(i, r) {
    if (!arguments.length)
      return this._rts === -E ? 0 : this._rts;
    if (this._rts === i)
      return this;
    var n = this.parent && this._ts ? Ze(this.parent._time, this) : this._tTime;
    return this._rts = +i || 0, this._ts = this._ps || i === -E ? 0 : this._rts, this.totalTime(He(-Math.abs(this._delay), this.totalDuration(), n), r !== !1), Qe(this), gs(this);
  }, t.paused = function(i) {
    return arguments.length ? (this._ps !== i && (this._ps = i, i ? (this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0) : (le(), this._ts = this._rts, this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== E && (this._tTime -= E)))), this) : this._ps;
  }, t.startTime = function(i) {
    if (arguments.length) {
      this._start = z(i);
      var r = this.parent || this._dp;
      return r && (r._sort || !this.parent) && pt(r, this, this._start - this._delay), this;
    }
    return this._start;
  }, t.endTime = function(i) {
    return this._start + (q(i) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
  }, t.rawTime = function(i) {
    var r = this.parent || this._dp;
    return r ? i && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? Ze(r.rawTime(i), this) : this._tTime : this._tTime;
  }, t.revert = function(i) {
    i === void 0 && (i = ds);
    var r = j;
    return j = i, Ui(this) && (this.timeline && this.timeline.revert(i), this.totalTime(-0.01, i.suppressEvents)), this.data !== "nested" && i.kill !== !1 && this.kill(), j = r, this;
  }, t.globalTime = function(i) {
    for (var r = this, n = arguments.length ? i : r.rawTime(); r; )
      n = r._start + n / (Math.abs(r._ts) || 1), r = r._dp;
    return !this.parent && this._sat ? this._sat.globalTime(i) : n;
  }, t.repeat = function(i) {
    return arguments.length ? (this._repeat = i === 1 / 0 ? -2 : i, hr(this)) : this._repeat === -2 ? 1 / 0 : this._repeat;
  }, t.repeatDelay = function(i) {
    if (arguments.length) {
      var r = this._time;
      return this._rDelay = i, hr(this), r ? this.time(r) : this;
    }
    return this._rDelay;
  }, t.yoyo = function(i) {
    return arguments.length ? (this._yoyo = i, this) : this._yoyo;
  }, t.seek = function(i, r) {
    return this.totalTime(ht(this, i), q(r));
  }, t.restart = function(i, r) {
    return this.play().totalTime(i ? -this._delay : 0, q(r)), this._dur || (this._zTime = -E), this;
  }, t.play = function(i, r) {
    return i != null && this.seek(i, r), this.reversed(!1).paused(!1);
  }, t.reverse = function(i, r) {
    return i != null && this.seek(i || this.totalDuration(), r), this.reversed(!0).paused(!1);
  }, t.pause = function(i, r) {
    return i != null && this.seek(i, r), this.paused(!0);
  }, t.resume = function() {
    return this.paused(!1);
  }, t.reversed = function(i) {
    return arguments.length ? (!!i !== this.reversed() && this.timeScale(-this._rts || (i ? -E : 0)), this) : this._rts < 0;
  }, t.invalidate = function() {
    return this._initted = this._act = 0, this._zTime = -E, this;
  }, t.isActive = function() {
    var i = this.parent || this._dp, r = this._start, n;
    return !!(!i || this._ts && this._initted && i.isActive() && (n = i.rawTime(!0)) >= r && n < this.endTime(!0) - E);
  }, t.eventCallback = function(i, r, n) {
    var s = this.vars;
    return arguments.length > 1 ? (r ? (s[i] = r, n && (s[i + "Params"] = n), i === "onUpdate" && (this._onUpdate = r)) : delete s[i], this) : s[i];
  }, t.then = function(i) {
    var r = this, n = r._prom;
    return new Promise(function(s) {
      var o = F(i) ? i : Vr, l = function() {
        var u = r.then;
        r.then = null, n && n(), F(o) && (o = o(r)) && (o.then || o === r) && (r.then = u), s(o), r.then = u;
      };
      r._initted && r.totalProgress() === 1 && r._ts >= 0 || !r._tTime && r._ts < 0 ? l() : r._prom = l;
    });
  }, t.kill = function() {
    pe(this);
  }, a;
})();
lt(Me.prototype, {
  _time: 0,
  _start: 0,
  _end: 0,
  _tTime: 0,
  _tDur: 0,
  _dirty: 0,
  _repeat: 0,
  _yoyo: !1,
  parent: null,
  _initted: !1,
  _rDelay: 0,
  _ts: 1,
  _dp: 0,
  ratio: 0,
  _zTime: -E,
  _prom: 0,
  _ps: !1,
  _rts: 1
});
var X = /* @__PURE__ */ (function(a) {
  Or(t, a);
  function t(i, r) {
    var n;
    return i === void 0 && (i = {}), n = a.call(this, i) || this, n.labels = {}, n.smoothChildTiming = !!i.smoothChildTiming, n.autoRemoveChildren = !!i.autoRemoveChildren, n._sort = q(i.sortChildren), H && pt(i.parent || H, yt(n), r), i.reversed && n.reverse(), i.paused && n.paused(!0), i.scrollTrigger && jr(yt(n), i.scrollTrigger), n;
  }
  var e = t.prototype;
  return e.to = function(r, n, s) {
    return xe(0, arguments, this), this;
  }, e.from = function(r, n, s) {
    return xe(1, arguments, this), this;
  }, e.fromTo = function(r, n, s, o) {
    return xe(2, arguments, this), this;
  }, e.set = function(r, n, s) {
    return n.duration = 0, n.parent = this, be(n).repeatDelay || (n.repeat = 0), n.immediateRender = !!n.immediateRender, new I(r, n, ht(this, s), 1), this;
  }, e.call = function(r, n, s) {
    return pt(this, I.delayedCall(0, r, n), s);
  }, e.staggerTo = function(r, n, s, o, l, h, u) {
    return s.duration = n, s.stagger = s.stagger || o, s.onComplete = h, s.onCompleteParams = u, s.parent = this, new I(r, s, ht(this, l)), this;
  }, e.staggerFrom = function(r, n, s, o, l, h, u) {
    return s.runBackwards = 1, be(s).immediateRender = q(s.immediateRender), this.staggerTo(r, n, s, o, l, h, u);
  }, e.staggerFromTo = function(r, n, s, o, l, h, u, c) {
    return o.startAt = s, be(o).immediateRender = q(o.immediateRender), this.staggerTo(r, n, o, l, h, u, c);
  }, e.render = function(r, n, s) {
    var o = this._time, l = this._dirty ? this.totalDuration() : this._tDur, h = this._dur, u = r <= 0 ? 0 : z(r), c = this._zTime < 0 != r < 0 && (this._initted || !h), f, p, _, d, g, y, v, x, w, m, A, C;
    if (this !== H && u > l && r >= 0 && (u = l), u !== this._tTime || s || c) {
      if (o !== this._time && h && (u += this._time - o, r += this._time - o), f = u, w = this._start, x = this._ts, y = !x, c && (h || (o = this._zTime), (r || !n) && (this._zTime = r)), this._repeat) {
        if (A = this._yoyo, g = h + this._rDelay, this._repeat < -1 && r < 0)
          return this.totalTime(g * 100 + r, n, s);
        if (f = z(u % g), u === l ? (d = this._repeat, f = h) : (m = z(u / g), d = ~~m, d && d === m && (f = h, d--), f > h && (f = h)), m = oe(this._tTime, g), !o && this._tTime && m !== d && this._tTime - m * g - this._dur <= 0 && (m = d), A && d & 1 && (f = h - f, C = 1), d !== m && !this._lock) {
          var k = A && m & 1, b = k === (A && d & 1);
          if (d < m && (k = !k), o = k ? 0 : u % h ? h : u, this._lock = 1, this.render(o || (C ? 0 : z(d * g)), n, !h)._lock = 0, this._tTime = u, !n && this.parent && nt(this, "onRepeat"), this.vars.repeatRefresh && !C && (this.invalidate()._lock = 1, m = d), o && o !== this._time || y !== !this._ts || this.vars.onRepeat && !this.parent && !this._act)
            return this;
          if (h = this._dur, l = this._tDur, b && (this._lock = 2, o = k ? h : -1e-4, this.render(o, !0), this.vars.repeatRefresh && !C && this.invalidate()), this._lock = 0, !this._ts && !y)
            return this;
          ln(this, C);
        }
      }
      if (this._hasPause && !this._forcing && this._lock < 2 && (v = bs(this, z(o), z(f)), v && (u -= f - (f = v._start))), this._tTime = u, this._time = f, this._act = !x, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = r, o = 0), !o && u && h && !n && !m && (nt(this, "onStart"), this._tTime !== u))
        return this;
      if (f >= o && r >= 0)
        for (p = this._first; p; ) {
          if (_ = p._next, (p._act || f >= p._start) && p._ts && v !== p) {
            if (p.parent !== this)
              return this.render(r, n, s);
            if (p.render(p._ts > 0 ? (f - p._start) * p._ts : (p._dirty ? p.totalDuration() : p._tDur) + (f - p._start) * p._ts, n, s), f !== this._time || !this._ts && !y) {
              v = 0, _ && (u += this._zTime = -E);
              break;
            }
          }
          p = _;
        }
      else {
        p = this._last;
        for (var P = r < 0 ? r : f; p; ) {
          if (_ = p._prev, (p._act || P <= p._end) && p._ts && v !== p) {
            if (p.parent !== this)
              return this.render(r, n, s);
            if (p.render(p._ts > 0 ? (P - p._start) * p._ts : (p._dirty ? p.totalDuration() : p._tDur) + (P - p._start) * p._ts, n, s || j && Ui(p)), f !== this._time || !this._ts && !y) {
              v = 0, _ && (u += this._zTime = P ? -E : E);
              break;
            }
          }
          p = _;
        }
      }
      if (v && !n && (this.pause(), v.render(f >= o ? 0 : -E)._zTime = f >= o ? 1 : -1, this._ts))
        return this._start = w, Qe(this), this.render(r, n, s);
      this._onUpdate && !n && nt(this, "onUpdate", !0), (u === l && this._tTime >= this.totalDuration() || !u && o) && (w === this._start || Math.abs(x) !== Math.abs(this._ts)) && (this._lock || ((r || !h) && (u === l && this._ts > 0 || !u && this._ts < 0) && Et(this, 1), !n && !(r < 0 && !o) && (u || o || !l) && (nt(this, u === l && r >= 0 ? "onComplete" : "onReverseComplete", !0), this._prom && !(u < l && this.timeScale() > 0) && this._prom())));
    }
    return this;
  }, e.add = function(r, n) {
    var s = this;
    if (bt(n) || (n = ht(this, n, r)), !(r instanceof Me)) {
      if (K(r))
        return r.forEach(function(o) {
          return s.add(o, n);
        }), this;
      if ($(r))
        return this.addLabel(r, n);
      if (F(r))
        r = I.delayedCall(0, r);
      else
        return this;
    }
    return this !== r ? pt(this, r, n) : this;
  }, e.getChildren = function(r, n, s, o) {
    r === void 0 && (r = !0), n === void 0 && (n = !0), s === void 0 && (s = !0), o === void 0 && (o = -ut);
    for (var l = [], h = this._first; h; )
      h._start >= o && (h instanceof I ? n && l.push(h) : (s && l.push(h), r && l.push.apply(l, h.getChildren(!0, n, s)))), h = h._next;
    return l;
  }, e.getById = function(r) {
    for (var n = this.getChildren(1, 1, 1), s = n.length; s--; )
      if (n[s].vars.id === r)
        return n[s];
  }, e.remove = function(r) {
    return $(r) ? this.removeLabel(r) : F(r) ? this.killTweensOf(r) : (r.parent === this && Ge(this, r), r === this._recent && (this._recent = this._last), Yt(this));
  }, e.totalTime = function(r, n) {
    return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = z(rt.time - (this._ts > 0 ? r / this._ts : (this.totalDuration() - r) / -this._ts))), a.prototype.totalTime.call(this, r, n), this._forcing = 0, this) : this._tTime;
  }, e.addLabel = function(r, n) {
    return this.labels[r] = ht(this, n), this;
  }, e.removeLabel = function(r) {
    return delete this.labels[r], this;
  }, e.addPause = function(r, n, s) {
    var o = I.delayedCall(0, n || Pe, s);
    return o.data = "isPause", this._hasPause = 1, pt(this, o, ht(this, r));
  }, e.removePause = function(r) {
    var n = this._first;
    for (r = ht(this, r); n; )
      n._start === r && n.data === "isPause" && Et(n), n = n._next;
  }, e.killTweensOf = function(r, n, s) {
    for (var o = this.getTweensOf(r, s), l = o.length; l--; )
      At !== o[l] && o[l].kill(r, n);
    return this;
  }, e.getTweensOf = function(r, n) {
    for (var s = [], o = ct(r), l = this._first, h = bt(n), u; l; )
      l instanceof I ? fs(l._targets, o) && (h ? (!At || l._initted && l._ts) && l.globalTime(0) <= n && l.globalTime(l.totalDuration()) > n : !n || l.isActive()) && s.push(l) : (u = l.getTweensOf(o, n)).length && s.push.apply(s, u), l = l._next;
    return s;
  }, e.tweenTo = function(r, n) {
    n = n || {};
    var s = this, o = ht(s, r), l = n, h = l.startAt, u = l.onStart, c = l.onStartParams, f = l.immediateRender, p, _ = I.to(s, lt({
      ease: n.ease || "none",
      lazy: !1,
      immediateRender: !1,
      time: o,
      overwrite: "auto",
      duration: n.duration || Math.abs((o - (h && "time" in h ? h.time : s._time)) / s.timeScale()) || E,
      onStart: function() {
        if (s.pause(), !p) {
          var g = n.duration || Math.abs((o - (h && "time" in h ? h.time : s._time)) / s.timeScale());
          _._dur !== g && ae(_, g, 0, 1).render(_._time, !0, !0), p = 1;
        }
        u && u.apply(_, c || []);
      }
    }, n));
    return f ? _.render(0) : _;
  }, e.tweenFromTo = function(r, n, s) {
    return this.tweenTo(n, lt({
      startAt: {
        time: ht(this, r)
      }
    }, s));
  }, e.recent = function() {
    return this._recent;
  }, e.nextLabel = function(r) {
    return r === void 0 && (r = this._time), ur(this, ht(this, r));
  }, e.previousLabel = function(r) {
    return r === void 0 && (r = this._time), ur(this, ht(this, r), 1);
  }, e.currentLabel = function(r) {
    return arguments.length ? this.seek(r, !0) : this.previousLabel(this._time + E);
  }, e.shiftChildren = function(r, n, s) {
    s === void 0 && (s = 0);
    var o = this._first, l = this.labels, h;
    for (r = z(r); o; )
      o._start >= s && (o._start += r, o._end += r), o = o._next;
    if (n)
      for (h in l)
        l[h] >= s && (l[h] += r);
    return Yt(this);
  }, e.invalidate = function(r) {
    var n = this._first;
    for (this._lock = 0; n; )
      n.invalidate(r), n = n._next;
    return a.prototype.invalidate.call(this, r);
  }, e.clear = function(r) {
    r === void 0 && (r = !0);
    for (var n = this._first, s; n; )
      s = n._next, this.remove(n), n = s;
    return this._dp && (this._time = this._tTime = this._pTime = 0), r && (this.labels = {}), Yt(this);
  }, e.totalDuration = function(r) {
    var n = 0, s = this, o = s._last, l = ut, h, u, c;
    if (arguments.length)
      return s.timeScale((s._repeat < 0 ? s.duration() : s.totalDuration()) / (s.reversed() ? -r : r));
    if (s._dirty) {
      for (c = s.parent; o; )
        h = o._prev, o._dirty && o.totalDuration(), u = o._start, u > l && s._sort && o._ts && !s._lock ? (s._lock = 1, pt(s, o, u - o._delay, 1)._lock = 0) : l = u, u < 0 && o._ts && (n -= u, (!c && !s._dp || c && c.smoothChildTiming) && (s._start += z(u / s._ts), s._time -= u, s._tTime -= u), s.shiftChildren(-u, !1, -1 / 0), l = 0), o._end > n && o._ts && (n = o._end), o = h;
      ae(s, s === H && s._time > n ? s._time : n, 1, 1), s._dirty = 0;
    }
    return s._tDur;
  }, t.updateRoot = function(r) {
    if (H._ts && (Nr(H, Ze(r, H)), Br = rt.frame), rt.frame >= or) {
      or += ot.autoSleep || 120;
      var n = H._first;
      if ((!n || !n._ts) && ot.autoSleep && rt._listeners.length < 2) {
        for (; n && !n._ts; )
          n = n._next;
        n || rt.sleep();
      }
    }
  }, t;
})(Me);
lt(X.prototype, {
  _lock: 0,
  _hasPause: 0,
  _forcing: 0
});
var Us = function(t, e, i, r, n, s, o) {
  var l = new Q(this._pt, t, e, 0, 1, gn, null, n), h = 0, u = 0, c, f, p, _, d, g, y, v;
  for (l.b = i, l.e = r, i += "", r += "", (y = ~r.indexOf("random(")) && (r = Se(r)), s && (v = [i, r], s(v, t, e), i = v[0], r = v[1]), f = i.match(ii) || []; c = ii.exec(r); )
    _ = c[0], d = r.substring(h, c.index), p ? p = (p + 1) % 5 : d.substr(-5) === "rgba(" && (p = 1), _ !== f[u++] && (g = parseFloat(f[u - 1]) || 0, l._pt = {
      _next: l._pt,
      p: d || u === 1 ? d : ",",
      //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
      s: g,
      c: _.charAt(1) === "=" ? Qt(g, _) - g : parseFloat(_) - g,
      m: p && p < 4 ? Math.round : 0
    }, h = ii.lastIndex);
  return l.c = h < r.length ? r.substring(h, r.length) : "", l.fp = o, (Hr.test(r) || y) && (l.e = 0), this._pt = l, l;
}, Fi = function(t, e, i, r, n, s, o, l, h, u) {
  F(r) && (r = r(n || 0, t, s));
  var c = t[e], f = i !== "get" ? i : F(c) ? h ? t[e.indexOf("set") || !F(t["get" + e.substr(3)]) ? e : "get" + e.substr(3)](h) : t[e]() : c, p = F(c) ? h ? Ns : pn : Bi, _;
  if ($(r) && (~r.indexOf("random(") && (r = Se(r)), r.charAt(1) === "=" && (_ = Qt(f, r) + (W(f) || 0), (_ || _ === 0) && (r = _))), !u || f !== r || yi)
    return !isNaN(f * r) && r !== "" ? (_ = new Q(this._pt, t, e, +f || 0, r - (f || 0), typeof c == "boolean" ? Vs : _n, 0, p), h && (_.fp = h), o && _.modifier(o, this, t), this._pt = _) : (!c && !(e in t) && Di(e, r), Us.call(this, t, e, f, r, p, l || ot.stringFilter, h));
}, Fs = function(t, e, i, r, n) {
  if (F(t) && (t = we(t, n, e, i, r)), !gt(t) || t.style && t.nodeType || K(t) || Rr(t))
    return $(t) ? we(t, n, e, i, r) : t;
  var s = {}, o;
  for (o in t)
    s[o] = we(t[o], n, e, i, r);
  return s;
}, cn = function(t, e, i, r, n, s) {
  var o, l, h, u;
  if (it[t] && (o = new it[t]()).init(n, o.rawVars ? e[t] : Fs(e[t], r, n, s, i), i, r, s) !== !1 && (i._pt = l = new Q(i._pt, n, t, 0, 1, o.render, o, 0, o.priority), i !== Gt))
    for (h = i._ptLookup[i._targets.indexOf(n)], u = o._props.length; u--; )
      h[o._props[u]] = l;
  return o;
}, At, yi, Li = function a(t, e, i) {
  var r = t.vars, n = r.ease, s = r.startAt, o = r.immediateRender, l = r.lazy, h = r.onUpdate, u = r.runBackwards, c = r.yoyoEase, f = r.keyframes, p = r.autoRevert, _ = t._dur, d = t._startAt, g = t._targets, y = t.parent, v = y && y.data === "nested" ? y.vars.targets : g, x = t._overwrite === "auto" && !Si, w = t.timeline, m, A, C, k, b, P, D, M, O, J, N, B, Y;
  if (w && (!f || !n) && (n = "none"), t._ease = Vt(n, ne.ease), t._yEase = c ? an(Vt(c === !0 ? n : c, ne.ease)) : 0, c && t._yoyo && !t._repeat && (c = t._yEase, t._yEase = t._ease, t._ease = c), t._from = !w && !!r.runBackwards, !w || f && !r.stagger) {
    if (M = g[0] ? Nt(g[0]).harness : 0, B = M && r[M.prop], m = je(r, Ri), d && (d._zTime < 0 && d.progress(1), e < 0 && u && o && !p ? d.render(-1, !0) : d.revert(u && _ ? Be : cs), d._lazy = 0), s) {
      if (Et(t._startAt = I.set(g, lt({
        data: "isStart",
        overwrite: !1,
        parent: y,
        immediateRender: !0,
        lazy: !d && q(l),
        startAt: null,
        delay: 0,
        onUpdate: h && function() {
          return nt(t, "onUpdate");
        },
        stagger: 0
      }, s))), t._startAt._dp = 0, t._startAt._sat = t, e < 0 && (j || !o && !p) && t._startAt.revert(Be), o && _ && e <= 0 && i <= 0) {
        e && (t._zTime = e);
        return;
      }
    } else if (u && _ && !d) {
      if (e && (o = !1), C = lt({
        overwrite: !1,
        data: "isFromStart",
        //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
        lazy: o && !d && q(l),
        immediateRender: o,
        //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
        stagger: 0,
        parent: y
        //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y: gsap.utils.wrap([-100,100]), stagger: 0.5})
      }, m), B && (C[M.prop] = B), Et(t._startAt = I.set(g, C)), t._startAt._dp = 0, t._startAt._sat = t, e < 0 && (j ? t._startAt.revert(Be) : t._startAt.render(-1, !0)), t._zTime = e, !o)
        a(t._startAt, E, E);
      else if (!e)
        return;
    }
    for (t._pt = t._ptCache = 0, l = _ && q(l) || l && !_, A = 0; A < g.length; A++) {
      if (b = g[A], D = b._gsap || Hi(g)[A]._gsap, t._ptLookup[A] = J = {}, di[D.id] && Pt.length && Je(), N = v === g ? A : v.indexOf(b), M && (O = new M()).init(b, B || m, t, N, v) !== !1 && (t._pt = k = new Q(t._pt, b, O.name, 0, 1, O.render, O, 0, O.priority), O._props.forEach(function(dt) {
        J[dt] = k;
      }), O.priority && (P = 1)), !M || B)
        for (C in m)
          it[C] && (O = cn(C, m, t, N, b, v)) ? O.priority && (P = 1) : J[C] = k = Fi.call(t, b, C, "get", m[C], N, v, 0, r.stringFilter);
      t._op && t._op[A] && t.kill(b, t._op[A]), x && t._pt && (At = t, H.killTweensOf(b, J, t.globalTime(e)), Y = !t.parent, At = 0), t._pt && l && (di[D.id] = 1);
    }
    P && mn(t), t._onInit && t._onInit(t);
  }
  t._onUpdate = h, t._initted = (!t._op || t._pt) && !Y, f && e <= 0 && w.render(ut, !0, !0);
}, Ls = function(t, e, i, r, n, s, o, l) {
  var h = (t._pt && t._ptCache || (t._ptCache = {}))[e], u, c, f, p;
  if (!h)
    for (h = t._ptCache[e] = [], f = t._ptLookup, p = t._targets.length; p--; ) {
      if (u = f[p][e], u && u.d && u.d._pt)
        for (u = u.d._pt; u && u.p !== e && u.fp !== e; )
          u = u._next;
      if (!u)
        return yi = 1, t.vars[e] = "+=0", Li(t, o), yi = 0, l ? Te(e + " not eligible for reset") : 1;
      h.push(u);
    }
  for (p = h.length; p--; )
    c = h[p], u = c._pt || c, u.s = (r || r === 0) && !n ? r : u.s + (r || 0) + s * u.c, u.c = i - u.s, c.e && (c.e = L(i) + W(c.e)), c.b && (c.b = u.s + W(c.b));
}, Bs = function(t, e) {
  var i = t[0] ? Nt(t[0]).harness : 0, r = i && i.aliases, n, s, o, l;
  if (!r)
    return e;
  n = se({}, e);
  for (s in r)
    if (s in n)
      for (l = r[s].split(","), o = l.length; o--; )
        n[l[o]] = n[s];
  return n;
}, Is = function(t, e, i, r) {
  var n = e.ease || r || "power1.inOut", s, o;
  if (K(e))
    o = i[t] || (i[t] = []), e.forEach(function(l, h) {
      return o.push({
        t: h / (e.length - 1) * 100,
        v: l,
        e: n
      });
    });
  else
    for (s in e)
      o = i[s] || (i[s] = []), s === "ease" || o.push({
        t: parseFloat(t),
        v: e[s],
        e: n
      });
}, we = function(t, e, i, r, n) {
  return F(t) ? t.call(e, i, r, n) : $(t) && ~t.indexOf("random(") ? Se(t) : t;
}, dn = zi + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert", fn = {};
G(dn + ",id,stagger,delay,duration,paused,scrollTrigger", function(a) {
  return fn[a] = 1;
});
var I = /* @__PURE__ */ (function(a) {
  Or(t, a);
  function t(i, r, n, s) {
    var o;
    typeof r == "number" && (n.duration = r, r = n, n = null), o = a.call(this, s ? r : be(r)) || this;
    var l = o.vars, h = l.duration, u = l.delay, c = l.immediateRender, f = l.stagger, p = l.overwrite, _ = l.keyframes, d = l.defaults, g = l.scrollTrigger, y = l.yoyoEase, v = r.parent || H, x = (K(i) || Rr(i) ? bt(i[0]) : "length" in r) ? [i] : ct(i), w, m, A, C, k, b, P, D;
    if (o._targets = x.length ? Hi(x) : Te("GSAP target " + i + " not found. https://gsap.com", !ot.nullTargetWarn) || [], o._ptLookup = [], o._overwrite = p, _ || f || Fe(h) || Fe(u)) {
      if (r = o.vars, w = o.timeline = new X({
        data: "nested",
        defaults: d || {},
        targets: v && v.data === "nested" ? v.vars.targets : x
      }), w.kill(), w.parent = w._dp = yt(o), w._start = 0, f || Fe(h) || Fe(u)) {
        if (C = x.length, P = f && Xr(f), gt(f))
          for (k in f)
            ~dn.indexOf(k) && (D || (D = {}), D[k] = f[k]);
        for (m = 0; m < C; m++)
          A = je(r, fn), A.stagger = 0, y && (A.yoyoEase = y), D && se(A, D), b = x[m], A.duration = +we(h, yt(o), m, b, x), A.delay = (+we(u, yt(o), m, b, x) || 0) - o._delay, !f && C === 1 && A.delay && (o._delay = u = A.delay, o._start += u, A.delay = 0), w.to(b, A, P ? P(m, b, x) : 0), w._ease = T.none;
        w.duration() ? h = u = 0 : o.timeline = 0;
      } else if (_) {
        be(lt(w.vars.defaults, {
          ease: "none"
        })), w._ease = Vt(_.ease || r.ease || "none");
        var M = 0, O, J, N;
        if (K(_))
          _.forEach(function(B) {
            return w.to(x, B, ">");
          }), w.duration();
        else {
          A = {};
          for (k in _)
            k === "ease" || k === "easeEach" || Is(k, _[k], A, _.easeEach);
          for (k in A)
            for (O = A[k].sort(function(B, Y) {
              return B.t - Y.t;
            }), M = 0, m = 0; m < O.length; m++)
              J = O[m], N = {
                ease: J.e,
                duration: (J.t - (m ? O[m - 1].t : 0)) / 100 * h
              }, N[k] = J.v, w.to(x, N, M), M += N.duration;
          w.duration() < h && w.to({}, {
            duration: h - w.duration()
          });
        }
      }
      h || o.duration(h = w.duration());
    } else
      o.timeline = 0;
    return p === !0 && !Si && (At = yt(o), H.killTweensOf(x), At = 0), pt(v, yt(o), n), r.reversed && o.reverse(), r.paused && o.paused(!0), (c || !h && !_ && o._start === z(v._time) && q(c) && ms(yt(o)) && v.data !== "nested") && (o._tTime = -E, o.render(Math.max(0, -u) || 0)), g && jr(yt(o), g), o;
  }
  var e = t.prototype;
  return e.render = function(r, n, s) {
    var o = this._time, l = this._tDur, h = this._dur, u = r < 0, c = r > l - E && !u ? l : r < E ? 0 : r, f, p, _, d, g, y, v, x, w;
    if (!h)
      vs(this, r, n, s);
    else if (c !== this._tTime || !r || s || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== u || this._lazy) {
      if (f = c, x = this.timeline, this._repeat) {
        if (d = h + this._rDelay, this._repeat < -1 && u)
          return this.totalTime(d * 100 + r, n, s);
        if (f = z(c % d), c === l ? (_ = this._repeat, f = h) : (g = z(c / d), _ = ~~g, _ && _ === g ? (f = h, _--) : f > h && (f = h)), y = this._yoyo && _ & 1, y && (w = this._yEase, f = h - f), g = oe(this._tTime, d), f === o && !s && this._initted && _ === g)
          return this._tTime = c, this;
        _ !== g && (x && this._yEase && ln(x, y), this.vars.repeatRefresh && !y && !this._lock && f !== d && this._initted && (this._lock = s = 1, this.render(z(d * _), !0).invalidate()._lock = 0));
      }
      if (!this._initted) {
        if (Zr(this, u ? r : f, s, n, c))
          return this._tTime = 0, this;
        if (o !== this._time && !(s && this.vars.repeatRefresh && _ !== g))
          return this;
        if (h !== this._dur)
          return this.render(r, n, s);
      }
      if (this._tTime = c, this._time = f, !this._act && this._ts && (this._act = 1, this._lazy = 0), this.ratio = v = (w || this._ease)(f / h), this._from && (this.ratio = v = 1 - v), !o && c && !n && !g && (nt(this, "onStart"), this._tTime !== c))
        return this;
      for (p = this._pt; p; )
        p.r(v, p.d), p = p._next;
      x && x.render(r < 0 ? r : x._dur * x._ease(f / this._dur), n, s) || this._startAt && (this._zTime = r), this._onUpdate && !n && (u && fi(this, r, n, s), nt(this, "onUpdate")), this._repeat && _ !== g && this.vars.onRepeat && !n && this.parent && nt(this, "onRepeat"), (c === this._tDur || !c) && this._tTime === c && (u && !this._onUpdate && fi(this, r, !0, !0), (r || !h) && (c === this._tDur && this._ts > 0 || !c && this._ts < 0) && Et(this, 1), !n && !(u && !o) && (c || o || y) && (nt(this, c === l ? "onComplete" : "onReverseComplete", !0), this._prom && !(c < l && this.timeScale() > 0) && this._prom()));
    }
    return this;
  }, e.targets = function() {
    return this._targets;
  }, e.invalidate = function(r) {
    return (!r || !this.vars.runBackwards) && (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(r), a.prototype.invalidate.call(this, r);
  }, e.resetTo = function(r, n, s, o, l) {
    Ee || rt.wake(), this._ts || this.play();
    var h = Math.min(this._dur, (this._dp._time - this._start) * this._ts), u;
    return this._initted || Li(this, h), u = this._ease(h / this._dur), Ls(this, r, n, s, o, u, h, l) ? this.resetTo(r, n, s, o, 1) : (ti(this, 0), this.parent || $r(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0), this.render(0));
  }, e.kill = function(r, n) {
    if (n === void 0 && (n = "all"), !r && (!n || n === "all"))
      return this._lazy = this._pt = 0, this.parent ? pe(this) : this.scrollTrigger && this.scrollTrigger.kill(!!j), this;
    if (this.timeline) {
      var s = this.timeline.totalDuration();
      return this.timeline.killTweensOf(r, n, At && At.vars.overwrite !== !0)._first || pe(this), this.parent && s !== this.timeline.totalDuration() && ae(this, this._dur * this.timeline._tDur / s, 0, 1), this;
    }
    var o = this._targets, l = r ? ct(r) : o, h = this._ptLookup, u = this._pt, c, f, p, _, d, g, y;
    if ((!n || n === "all") && _s(o, l))
      return n === "all" && (this._pt = 0), pe(this);
    for (c = this._op = this._op || [], n !== "all" && ($(n) && (d = {}, G(n, function(v) {
      return d[v] = 1;
    }), n = d), n = Bs(o, n)), y = o.length; y--; )
      if (~l.indexOf(o[y])) {
        f = h[y], n === "all" ? (c[y] = n, _ = f, p = {}) : (p = c[y] = c[y] || {}, _ = n);
        for (d in _)
          g = f && f[d], g && ((!("kill" in g.d) || g.d.kill(d) === !0) && Ge(this, g, "_pt"), delete f[d]), p !== "all" && (p[d] = 1);
      }
    return this._initted && !this._pt && u && pe(this), this;
  }, t.to = function(r, n) {
    return new t(r, n, arguments[2]);
  }, t.from = function(r, n) {
    return xe(1, arguments);
  }, t.delayedCall = function(r, n, s, o) {
    return new t(n, 0, {
      immediateRender: !1,
      lazy: !1,
      overwrite: !1,
      delay: r,
      onComplete: n,
      onReverseComplete: n,
      onCompleteParams: s,
      onReverseCompleteParams: s,
      callbackScope: o
    });
  }, t.fromTo = function(r, n, s) {
    return xe(2, arguments);
  }, t.set = function(r, n) {
    return n.duration = 0, n.repeatDelay || (n.repeat = 0), new t(r, n);
  }, t.killTweensOf = function(r, n, s) {
    return H.killTweensOf(r, n, s);
  }, t;
})(Me);
lt(I.prototype, {
  _targets: [],
  _lazy: 0,
  _startAt: 0,
  _op: 0,
  _onInit: 0
});
G("staggerTo,staggerFrom,staggerFromTo", function(a) {
  I[a] = function() {
    var t = new X(), e = _i.call(arguments, 0);
    return e.splice(a === "staggerFromTo" ? 5 : 4, 0, 0), t[a].apply(t, e);
  };
});
var Bi = function(t, e, i) {
  return t[e] = i;
}, pn = function(t, e, i) {
  return t[e](i);
}, Ns = function(t, e, i, r) {
  return t[e](r.fp, i);
}, Ys = function(t, e, i) {
  return t.setAttribute(e, i);
}, Ii = function(t, e) {
  return F(t[e]) ? pn : Ei(t[e]) && t.setAttribute ? Ys : Bi;
}, _n = function(t, e) {
  return e.set(e.t, e.p, Math.round((e.s + e.c * t) * 1e6) / 1e6, e);
}, Vs = function(t, e) {
  return e.set(e.t, e.p, !!(e.s + e.c * t), e);
}, gn = function(t, e) {
  var i = e._pt, r = "";
  if (!t && e.b)
    r = e.b;
  else if (t === 1 && e.e)
    r = e.e;
  else {
    for (; i; )
      r = i.p + (i.m ? i.m(i.s + i.c * t) : Math.round((i.s + i.c * t) * 1e4) / 1e4) + r, i = i._next;
    r += e.c;
  }
  e.set(e.t, e.p, r, e);
}, Ni = function(t, e) {
  for (var i = e._pt; i; )
    i.r(t, i.d), i = i._next;
}, $s = function(t, e, i, r) {
  for (var n = this._pt, s; n; )
    s = n._next, n.p === r && n.modifier(t, e, i), n = s;
}, Js = function(t) {
  for (var e = this._pt, i, r; e; )
    r = e._next, e.p === t && !e.op || e.op === t ? Ge(this, e, "_pt") : e.dep || (i = 1), e = r;
  return !i;
}, js = function(t, e, i, r) {
  r.mSet(t, e, r.m.call(r.tween, i, r.mt), r);
}, mn = function(t) {
  for (var e = t._pt, i, r, n, s; e; ) {
    for (i = e._next, r = n; r && r.pr > e.pr; )
      r = r._next;
    (e._prev = r ? r._prev : s) ? e._prev._next = e : n = e, (e._next = r) ? r._prev = e : s = e, e = i;
  }
  t._pt = n;
}, Q = /* @__PURE__ */ (function() {
  function a(e, i, r, n, s, o, l, h, u) {
    this.t = i, this.s = n, this.c = s, this.p = r, this.r = o || _n, this.d = l || this, this.set = h || Bi, this.pr = u || 0, this._next = e, e && (e._prev = this);
  }
  var t = a.prototype;
  return t.modifier = function(i, r, n) {
    this.mSet = this.mSet || this.set, this.set = js, this.m = i, this.mt = n, this.tween = r;
  }, a;
})();
G(zi + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function(a) {
  return Ri[a] = 1;
});
at.TweenMax = at.TweenLite = I;
at.TimelineLite = at.TimelineMax = X;
H = new X({
  sortChildren: !1,
  defaults: ne,
  autoRemoveChildren: !0,
  id: "root",
  smoothChildTiming: !0
});
ot.stringFilter = on;
var $t = [], Ne = {}, Zs = [], dr = 0, Ws = 0, ai = function(t) {
  return (Ne[t] || Zs).map(function(e) {
    return e();
  });
}, vi = function() {
  var t = Date.now(), e = [];
  t - dr > 2 && (ai("matchMediaInit"), $t.forEach(function(i) {
    var r = i.queries, n = i.conditions, s, o, l, h;
    for (o in r)
      s = ft.matchMedia(r[o]).matches, s && (l = 1), s !== n[o] && (n[o] = s, h = 1);
    h && (i.revert(), l && e.push(i));
  }), ai("matchMediaRevert"), e.forEach(function(i) {
    return i.onMatch(i, function(r) {
      return i.add(null, r);
    });
  }), dr = t, ai("matchMedia"));
}, yn = /* @__PURE__ */ (function() {
  function a(e, i) {
    this.selector = i && gi(i), this.data = [], this._r = [], this.isReverted = !1, this.id = Ws++, e && this.add(e);
  }
  var t = a.prototype;
  return t.add = function(i, r, n) {
    F(i) && (n = r, r = i, i = F);
    var s = this, o = function() {
      var h = R, u = s.selector, c;
      return h && h !== s && h.data.push(s), n && (s.selector = gi(n)), R = s, c = r.apply(s, arguments), F(c) && s._r.push(c), R = h, s.selector = u, s.isReverted = !1, c;
    };
    return s.last = o, i === F ? o(s, function(l) {
      return s.add(null, l);
    }) : i ? s[i] = o : o;
  }, t.ignore = function(i) {
    var r = R;
    R = null, i(this), R = r;
  }, t.getTweens = function() {
    var i = [];
    return this.data.forEach(function(r) {
      return r instanceof a ? i.push.apply(i, r.getTweens()) : r instanceof I && !(r.parent && r.parent.data === "nested") && i.push(r);
    }), i;
  }, t.clear = function() {
    this._r.length = this.data.length = 0;
  }, t.kill = function(i, r) {
    var n = this;
    if (i ? (function() {
      for (var o = n.getTweens(), l = n.data.length, h; l--; )
        h = n.data[l], h.data === "isFlip" && (h.revert(), h.getChildren(!0, !0, !1).forEach(function(u) {
          return o.splice(o.indexOf(u), 1);
        }));
      for (o.map(function(u) {
        return {
          g: u._dur || u._delay || u._sat && !u._sat.vars.immediateRender ? u.globalTime(0) : -1 / 0,
          t: u
        };
      }).sort(function(u, c) {
        return c.g - u.g || -1 / 0;
      }).forEach(function(u) {
        return u.t.revert(i);
      }), l = n.data.length; l--; )
        h = n.data[l], h instanceof X ? h.data !== "nested" && (h.scrollTrigger && h.scrollTrigger.revert(), h.kill()) : !(h instanceof I) && h.revert && h.revert(i);
      n._r.forEach(function(u) {
        return u(i, n);
      }), n.isReverted = !0;
    })() : this.data.forEach(function(o) {
      return o.kill && o.kill();
    }), this.clear(), r)
      for (var s = $t.length; s--; )
        $t[s].id === this.id && $t.splice(s, 1);
  }, t.revert = function(i) {
    this.kill(i || {});
  }, a;
})(), Ks = /* @__PURE__ */ (function() {
  function a(e) {
    this.contexts = [], this.scope = e, R && R.data.push(this);
  }
  var t = a.prototype;
  return t.add = function(i, r, n) {
    gt(i) || (i = {
      matches: i
    });
    var s = new yn(0, n || this.scope), o = s.conditions = {}, l, h, u;
    R && !s.selector && (s.selector = R.selector), this.contexts.push(s), r = s.add("onMatch", r), s.queries = i;
    for (h in i)
      h === "all" ? u = 1 : (l = ft.matchMedia(i[h]), l && ($t.indexOf(s) < 0 && $t.push(s), (o[h] = l.matches) && (u = 1), l.addListener ? l.addListener(vi) : l.addEventListener("change", vi)));
    return u && r(s, function(c) {
      return s.add(null, c);
    }), this;
  }, t.revert = function(i) {
    this.kill(i || {});
  }, t.kill = function(i) {
    this.contexts.forEach(function(r) {
      return r.kill(i, !0);
    });
  }, a;
})(), We = {
  registerPlugin: function() {
    for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++)
      e[i] = arguments[i];
    e.forEach(function(r) {
      return rn(r);
    });
  },
  timeline: function(t) {
    return new X(t);
  },
  getTweensOf: function(t, e) {
    return H.getTweensOf(t, e);
  },
  getProperty: function(t, e, i, r) {
    $(t) && (t = ct(t)[0]);
    var n = Nt(t || {}).get, s = i ? Vr : Yr;
    return i === "native" && (i = ""), t && (e ? s((it[e] && it[e].get || n)(t, e, i, r)) : function(o, l, h) {
      return s((it[o] && it[o].get || n)(t, o, l, h));
    });
  },
  quickSetter: function(t, e, i) {
    if (t = ct(t), t.length > 1) {
      var r = t.map(function(u) {
        return et.quickSetter(u, e, i);
      }), n = r.length;
      return function(u) {
        for (var c = n; c--; )
          r[c](u);
      };
    }
    t = t[0] || {};
    var s = it[e], o = Nt(t), l = o.harness && (o.harness.aliases || {})[e] || e, h = s ? function(u) {
      var c = new s();
      Gt._pt = 0, c.init(t, i ? u + i : u, Gt, 0, [t]), c.render(1, c), Gt._pt && Ni(1, Gt);
    } : o.set(t, l);
    return s ? h : function(u) {
      return h(t, l, i ? u + i : u, o, 1);
    };
  },
  quickTo: function(t, e, i) {
    var r, n = et.to(t, lt((r = {}, r[e] = "+=0.1", r.paused = !0, r.stagger = 0, r), i || {})), s = function(l, h, u) {
      return n.resetTo(e, l, h, u);
    };
    return s.tween = n, s;
  },
  isTweening: function(t) {
    return H.getTweensOf(t, !0).length > 0;
  },
  defaults: function(t) {
    return t && t.ease && (t.ease = Vt(t.ease, ne.ease)), ar(ne, t || {});
  },
  config: function(t) {
    return ar(ot, t || {});
  },
  registerEffect: function(t) {
    var e = t.name, i = t.effect, r = t.plugins, n = t.defaults, s = t.extendTimeline;
    (r || "").split(",").forEach(function(o) {
      return o && !it[o] && !at[o] && Te(e + " effect requires " + o + " plugin.");
    }), ri[e] = function(o, l, h) {
      return i(ct(o), lt(l || {}, n), h);
    }, s && (X.prototype[e] = function(o, l, h) {
      return this.add(ri[e](o, gt(l) ? l : (h = l) && {}, this), h);
    });
  },
  registerEase: function(t, e) {
    T[t] = Vt(e);
  },
  parseEase: function(t, e) {
    return arguments.length ? Vt(t, e) : T;
  },
  getById: function(t) {
    return H.getById(t);
  },
  exportRoot: function(t, e) {
    t === void 0 && (t = {});
    var i = new X(t), r, n;
    for (i.smoothChildTiming = q(t.smoothChildTiming), H.remove(i), i._dp = 0, i._time = i._tTime = H._time, r = H._first; r; )
      n = r._next, (e || !(!r._dur && r instanceof I && r.vars.onComplete === r._targets[0])) && pt(i, r, r._start - r._delay), r = n;
    return pt(H, i, 0), i;
  },
  context: function(t, e) {
    return t ? new yn(t, e) : R;
  },
  matchMedia: function(t) {
    return new Ks(t);
  },
  matchMediaRefresh: function() {
    return $t.forEach(function(t) {
      var e = t.conditions, i, r;
      for (r in e)
        e[r] && (e[r] = !1, i = 1);
      i && t.revert();
    }) || vi();
  },
  addEventListener: function(t, e) {
    var i = Ne[t] || (Ne[t] = []);
    ~i.indexOf(e) || i.push(e);
  },
  removeEventListener: function(t, e) {
    var i = Ne[t], r = i && i.indexOf(e);
    r >= 0 && i.splice(r, 1);
  },
  utils: {
    wrap: Ps,
    wrapYoyo: Ss,
    distribute: Xr,
    random: Gr,
    snap: qr,
    normalize: Ts,
    getUnit: W,
    clamp: ws,
    splitColor: nn,
    toArray: ct,
    selector: gi,
    mapRange: tn,
    pipe: Cs,
    unitize: ks,
    interpolate: Es,
    shuffle: Kr
  },
  install: Fr,
  effects: ri,
  ticker: rt,
  updateRoot: X.updateRoot,
  plugins: it,
  globalTimeline: H,
  core: {
    PropTween: Q,
    globals: Lr,
    Tween: I,
    Timeline: X,
    Animation: Me,
    getCache: Nt,
    _removeLinkedListItem: Ge,
    reverting: function() {
      return j;
    },
    context: function(t) {
      return t && R && (R.data.push(t), t._ctx = R), R;
    },
    suppressOverwrites: function(t) {
      return Si = t;
    }
  }
};
G("to,from,fromTo,delayedCall,set,killTweensOf", function(a) {
  return We[a] = I[a];
});
rt.add(X.updateRoot);
Gt = We.to({}, {
  duration: 0
});
var Xs = function(t, e) {
  for (var i = t._pt; i && i.p !== e && i.op !== e && i.fp !== e; )
    i = i._next;
  return i;
}, qs = function(t, e) {
  var i = t._targets, r, n, s;
  for (r in e)
    for (n = i.length; n--; )
      s = t._ptLookup[n][r], s && (s = s.d) && (s._pt && (s = Xs(s, r)), s && s.modifier && s.modifier(e[r], t, i[n], r));
}, li = function(t, e) {
  return {
    name: t,
    headless: 1,
    rawVars: 1,
    //don't pre-process function-based values or "random()" strings.
    init: function(r, n, s) {
      s._onInit = function(o) {
        var l, h;
        if ($(n) && (l = {}, G(n, function(u) {
          return l[u] = 1;
        }), n = l), e) {
          l = {};
          for (h in n)
            l[h] = e(n[h]);
          n = l;
        }
        qs(o, n);
      };
    }
  };
}, et = We.registerPlugin({
  name: "attr",
  init: function(t, e, i, r, n) {
    var s, o, l;
    this.tween = i;
    for (s in e)
      l = t.getAttribute(s) || "", o = this.add(t, "setAttribute", (l || 0) + "", e[s], r, n, 0, 0, s), o.op = s, o.b = l, this._props.push(s);
  },
  render: function(t, e) {
    for (var i = e._pt; i; )
      j ? i.set(i.t, i.p, i.b, i) : i.r(t, i.d), i = i._next;
  }
}, {
  name: "endArray",
  headless: 1,
  init: function(t, e) {
    for (var i = e.length; i--; )
      this.add(t, i, t[i] || 0, e[i], 0, 0, 0, 0, 0, 1);
  }
}, li("roundProps", mi), li("modifiers"), li("snap", qr)) || We;
I.version = X.version = et.version = "3.14.2";
Ur = 1;
Mi() && le();
T.Power0;
T.Power1;
T.Power2;
T.Power3;
T.Power4;
T.Linear;
T.Quad;
T.Cubic;
T.Quart;
T.Quint;
T.Strong;
T.Elastic;
T.Back;
T.SteppedEase;
T.Bounce;
T.Sine;
T.Expo;
T.Circ;
/*!
 * CSSPlugin 3.14.2
 * https://gsap.com
 *
 * Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/
var fr, Ct, te, Yi, It, pr, Vi, Gs = function() {
  return typeof window < "u";
}, xt = {}, Lt = 180 / Math.PI, ee = Math.PI / 180, Wt = Math.atan2, _r = 1e8, $i = /([A-Z])/g, Qs = /(left|right|width|margin|padding|x)/i, to = /[\s,\(]\S/, _t = {
  autoAlpha: "opacity,visibility",
  scale: "scaleX,scaleY",
  alpha: "opacity"
}, bi = function(t, e) {
  return e.set(e.t, e.p, Math.round((e.s + e.c * t) * 1e4) / 1e4 + e.u, e);
}, eo = function(t, e) {
  return e.set(e.t, e.p, t === 1 ? e.e : Math.round((e.s + e.c * t) * 1e4) / 1e4 + e.u, e);
}, io = function(t, e) {
  return e.set(e.t, e.p, t ? Math.round((e.s + e.c * t) * 1e4) / 1e4 + e.u : e.b, e);
}, ro = function(t, e) {
  return e.set(e.t, e.p, t === 1 ? e.e : t ? Math.round((e.s + e.c * t) * 1e4) / 1e4 + e.u : e.b, e);
}, no = function(t, e) {
  var i = e.s + e.c * t;
  e.set(e.t, e.p, ~~(i + (i < 0 ? -0.5 : 0.5)) + e.u, e);
}, vn = function(t, e) {
  return e.set(e.t, e.p, t ? e.e : e.b, e);
}, bn = function(t, e) {
  return e.set(e.t, e.p, t !== 1 ? e.b : e.e, e);
}, so = function(t, e, i) {
  return t.style[e] = i;
}, oo = function(t, e, i) {
  return t.style.setProperty(e, i);
}, ao = function(t, e, i) {
  return t._gsap[e] = i;
}, lo = function(t, e, i) {
  return t._gsap.scaleX = t._gsap.scaleY = i;
}, ho = function(t, e, i, r, n) {
  var s = t._gsap;
  s.scaleX = s.scaleY = i, s.renderTransform(n, s);
}, uo = function(t, e, i, r, n) {
  var s = t._gsap;
  s[e] = i, s.renderTransform(n, s);
}, U = "transform", tt = U + "Origin", co = function a(t, e) {
  var i = this, r = this.target, n = r.style, s = r._gsap;
  if (t in xt && n) {
    if (this.tfm = this.tfm || {}, t !== "transform")
      t = _t[t] || t, ~t.indexOf(",") ? t.split(",").forEach(function(o) {
        return i.tfm[o] = vt(r, o);
      }) : this.tfm[t] = s.x ? s[t] : vt(r, t), t === tt && (this.tfm.zOrigin = s.zOrigin);
    else
      return _t.transform.split(",").forEach(function(o) {
        return a.call(i, o, e);
      });
    if (this.props.indexOf(U) >= 0)
      return;
    s.svg && (this.svgo = r.getAttribute("data-svg-origin"), this.props.push(tt, e, "")), t = U;
  }
  (n || e) && this.props.push(t, e, n[t]);
}, xn = function(t) {
  t.translate && (t.removeProperty("translate"), t.removeProperty("scale"), t.removeProperty("rotate"));
}, fo = function() {
  var t = this.props, e = this.target, i = e.style, r = e._gsap, n, s;
  for (n = 0; n < t.length; n += 3)
    t[n + 1] ? t[n + 1] === 2 ? e[t[n]](t[n + 2]) : e[t[n]] = t[n + 2] : t[n + 2] ? i[t[n]] = t[n + 2] : i.removeProperty(t[n].substr(0, 2) === "--" ? t[n] : t[n].replace($i, "-$1").toLowerCase());
  if (this.tfm) {
    for (s in this.tfm)
      r[s] = this.tfm[s];
    r.svg && (r.renderTransform(), e.setAttribute("data-svg-origin", this.svgo || "")), n = Vi(), (!n || !n.isStart) && !i[U] && (xn(i), r.zOrigin && i[tt] && (i[tt] += " " + r.zOrigin + "px", r.zOrigin = 0, r.renderTransform()), r.uncache = 1);
  }
}, wn = function(t, e) {
  var i = {
    target: t,
    props: [],
    revert: fo,
    save: co
  };
  return t._gsap || et.core.getCache(t), e && t.style && t.nodeType && e.split(",").forEach(function(r) {
    return i.save(r);
  }), i;
}, An, xi = function(t, e) {
  var i = Ct.createElementNS ? Ct.createElementNS((e || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), t) : Ct.createElement(t);
  return i && i.style ? i : Ct.createElement(t);
}, st = function a(t, e, i) {
  var r = getComputedStyle(t);
  return r[e] || r.getPropertyValue(e.replace($i, "-$1").toLowerCase()) || r.getPropertyValue(e) || !i && a(t, he(e) || e, 1) || "";
}, gr = "O,Moz,ms,Ms,Webkit".split(","), he = function(t, e, i) {
  var r = e || It, n = r.style, s = 5;
  if (t in n && !i)
    return t;
  for (t = t.charAt(0).toUpperCase() + t.substr(1); s-- && !(gr[s] + t in n); )
    ;
  return s < 0 ? null : (s === 3 ? "ms" : s >= 0 ? gr[s] : "") + t;
}, wi = function() {
  Gs() && window.document && (fr = window, Ct = fr.document, te = Ct.documentElement, It = xi("div") || {
    style: {}
  }, xi("div"), U = he(U), tt = U + "Origin", It.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0", An = !!he("perspective"), Vi = et.core.reverting, Yi = 1);
}, mr = function(t) {
  var e = t.ownerSVGElement, i = xi("svg", e && e.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), r = t.cloneNode(!0), n;
  r.style.display = "block", i.appendChild(r), te.appendChild(i);
  try {
    n = r.getBBox();
  } catch {
  }
  return i.removeChild(r), te.removeChild(i), n;
}, yr = function(t, e) {
  for (var i = e.length; i--; )
    if (t.hasAttribute(e[i]))
      return t.getAttribute(e[i]);
}, Cn = function(t) {
  var e, i;
  try {
    e = t.getBBox();
  } catch {
    e = mr(t), i = 1;
  }
  return e && (e.width || e.height) || i || (e = mr(t)), e && !e.width && !e.x && !e.y ? {
    x: +yr(t, ["x", "cx", "x1"]) || 0,
    y: +yr(t, ["y", "cy", "y1"]) || 0,
    width: 0,
    height: 0
  } : e;
}, kn = function(t) {
  return !!(t.getCTM && (!t.parentNode || t.ownerSVGElement) && Cn(t));
}, Mt = function(t, e) {
  if (e) {
    var i = t.style, r;
    e in xt && e !== tt && (e = U), i.removeProperty ? (r = e.substr(0, 2), (r === "ms" || e.substr(0, 6) === "webkit") && (e = "-" + e), i.removeProperty(r === "--" ? e : e.replace($i, "-$1").toLowerCase())) : i.removeAttribute(e);
  }
}, kt = function(t, e, i, r, n, s) {
  var o = new Q(t._pt, e, i, 0, 1, s ? bn : vn);
  return t._pt = o, o.b = r, o.e = n, t._props.push(i), o;
}, vr = {
  deg: 1,
  rad: 1,
  turn: 1
}, po = {
  grid: 1,
  flex: 1
}, Ot = function a(t, e, i, r) {
  var n = parseFloat(i) || 0, s = (i + "").trim().substr((n + "").length) || "px", o = It.style, l = Qs.test(e), h = t.tagName.toLowerCase() === "svg", u = (h ? "client" : "offset") + (l ? "Width" : "Height"), c = 100, f = r === "px", p = r === "%", _, d, g, y;
  if (r === s || !n || vr[r] || vr[s])
    return n;
  if (s !== "px" && !f && (n = a(t, e, i, "px")), y = t.getCTM && kn(t), (p || s === "%") && (xt[e] || ~e.indexOf("adius")))
    return _ = y ? t.getBBox()[l ? "width" : "height"] : t[u], L(p ? n / _ * c : n / 100 * _);
  if (o[l ? "width" : "height"] = c + (f ? s : r), d = r !== "rem" && ~e.indexOf("adius") || r === "em" && t.appendChild && !h ? t : t.parentNode, y && (d = (t.ownerSVGElement || {}).parentNode), (!d || d === Ct || !d.appendChild) && (d = Ct.body), g = d._gsap, g && p && g.width && l && g.time === rt.time && !g.uncache)
    return L(n / g.width * c);
  if (p && (e === "height" || e === "width")) {
    var v = t.style[e];
    t.style[e] = c + r, _ = t[u], v ? t.style[e] = v : Mt(t, e);
  } else
    (p || s === "%") && !po[st(d, "display")] && (o.position = st(t, "position")), d === t && (o.position = "static"), d.appendChild(It), _ = It[u], d.removeChild(It), o.position = "absolute";
  return l && p && (g = Nt(d), g.time = rt.time, g.width = d[u]), L(f ? _ * n / c : _ && n ? c / _ * n : 0);
}, vt = function(t, e, i, r) {
  var n;
  return Yi || wi(), e in _t && e !== "transform" && (e = _t[e], ~e.indexOf(",") && (e = e.split(",")[0])), xt[e] && e !== "transform" ? (n = De(t, r), n = e !== "transformOrigin" ? n[e] : n.svg ? n.origin : Xe(st(t, tt)) + " " + n.zOrigin + "px") : (n = t.style[e], (!n || n === "auto" || r || ~(n + "").indexOf("calc(")) && (n = Ke[e] && Ke[e](t, e, i) || st(t, e) || Ir(t, e) || (e === "opacity" ? 1 : 0))), i && !~(n + "").trim().indexOf(" ") ? Ot(t, e, n, i) + i : n;
}, _o = function(t, e, i, r) {
  if (!i || i === "none") {
    var n = he(e, t, 1), s = n && st(t, n, 1);
    s && s !== i ? (e = n, i = s) : e === "borderColor" && (i = st(t, "borderTopColor"));
  }
  var o = new Q(this._pt, t.style, e, 0, 1, gn), l = 0, h = 0, u, c, f, p, _, d, g, y, v, x, w, m;
  if (o.b = i, o.e = r, i += "", r += "", r.substring(0, 6) === "var(--" && (r = st(t, r.substring(4, r.indexOf(")")))), r === "auto" && (d = t.style[e], t.style[e] = r, r = st(t, e) || r, d ? t.style[e] = d : Mt(t, e)), u = [i, r], on(u), i = u[0], r = u[1], f = i.match(qt) || [], m = r.match(qt) || [], m.length) {
    for (; c = qt.exec(r); )
      g = c[0], v = r.substring(l, c.index), _ ? _ = (_ + 1) % 5 : (v.substr(-5) === "rgba(" || v.substr(-5) === "hsla(") && (_ = 1), g !== (d = f[h++] || "") && (p = parseFloat(d) || 0, w = d.substr((p + "").length), g.charAt(1) === "=" && (g = Qt(p, g) + w), y = parseFloat(g), x = g.substr((y + "").length), l = qt.lastIndex - x.length, x || (x = x || ot.units[e] || w, l === r.length && (r += x, o.e += x)), w !== x && (p = Ot(t, e, d, x) || 0), o._pt = {
        _next: o._pt,
        p: v || h === 1 ? v : ",",
        //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
        s: p,
        c: y - p,
        m: _ && _ < 4 || e === "zIndex" ? Math.round : 0
      });
    o.c = l < r.length ? r.substring(l, r.length) : "";
  } else
    o.r = e === "display" && r === "none" ? bn : vn;
  return Hr.test(r) && (o.e = 0), this._pt = o, o;
}, br = {
  top: "0%",
  bottom: "100%",
  left: "0%",
  right: "100%",
  center: "50%"
}, go = function(t) {
  var e = t.split(" "), i = e[0], r = e[1] || "50%";
  return (i === "top" || i === "bottom" || r === "left" || r === "right") && (t = i, i = r, r = t), e[0] = br[i] || i, e[1] = br[r] || r, e.join(" ");
}, mo = function(t, e) {
  if (e.tween && e.tween._time === e.tween._dur) {
    var i = e.t, r = i.style, n = e.u, s = i._gsap, o, l, h;
    if (n === "all" || n === !0)
      r.cssText = "", l = 1;
    else
      for (n = n.split(","), h = n.length; --h > -1; )
        o = n[h], xt[o] && (l = 1, o = o === "transformOrigin" ? tt : U), Mt(i, o);
    l && (Mt(i, U), s && (s.svg && i.removeAttribute("transform"), r.scale = r.rotate = r.translate = "none", De(i, 1), s.uncache = 1, xn(r)));
  }
}, Ke = {
  clearProps: function(t, e, i, r, n) {
    if (n.data !== "isFromStart") {
      var s = t._pt = new Q(t._pt, e, i, 0, 0, mo);
      return s.u = r, s.pr = -10, s.tween = n, t._props.push(i), 1;
    }
  }
  /* className feature (about 0.4kb gzipped).
  , className(plugin, target, property, endValue, tween) {
  	let _renderClassName = (ratio, data) => {
  			data.css.render(ratio, data.css);
  			if (!ratio || ratio === 1) {
  				let inline = data.rmv,
  					target = data.t,
  					p;
  				target.setAttribute("class", ratio ? data.e : data.b);
  				for (p in inline) {
  					_removeProperty(target, p);
  				}
  			}
  		},
  		_getAllStyles = (target) => {
  			let styles = {},
  				computed = getComputedStyle(target),
  				p;
  			for (p in computed) {
  				if (isNaN(p) && p !== "cssText" && p !== "length") {
  					styles[p] = computed[p];
  				}
  			}
  			_setDefaults(styles, _parseTransform(target, 1));
  			return styles;
  		},
  		startClassList = target.getAttribute("class"),
  		style = target.style,
  		cssText = style.cssText,
  		cache = target._gsap,
  		classPT = cache.classPT,
  		inlineToRemoveAtEnd = {},
  		data = {t:target, plugin:plugin, rmv:inlineToRemoveAtEnd, b:startClassList, e:(endValue.charAt(1) !== "=") ? endValue : startClassList.replace(new RegExp("(?:\\s|^)" + endValue.substr(2) + "(?![\\w-])"), "") + ((endValue.charAt(0) === "+") ? " " + endValue.substr(2) : "")},
  		changingVars = {},
  		startVars = _getAllStyles(target),
  		transformRelated = /(transform|perspective)/i,
  		endVars, p;
  	if (classPT) {
  		classPT.r(1, classPT.d);
  		_removeLinkedListItem(classPT.d.plugin, classPT, "_pt");
  	}
  	target.setAttribute("class", data.e);
  	endVars = _getAllStyles(target, true);
  	target.setAttribute("class", startClassList);
  	for (p in endVars) {
  		if (endVars[p] !== startVars[p] && !transformRelated.test(p)) {
  			changingVars[p] = endVars[p];
  			if (!style[p] && style[p] !== "0") {
  				inlineToRemoveAtEnd[p] = 1;
  			}
  		}
  	}
  	cache.classPT = plugin._pt = new PropTween(plugin._pt, target, "className", 0, 0, _renderClassName, data, 0, -11);
  	if (style.cssText !== cssText) { //only apply if things change. Otherwise, in cases like a background-image that's pulled dynamically, it could cause a refresh. See https://gsap.com/forums/topic/20368-possible-gsap-bug-switching-classnames-in-chrome/.
  		style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
  	}
  	_parseTransform(target, true); //to clear the caching of transforms
  	data.css = new gsap.plugins.css();
  	data.css.init(target, changingVars, tween);
  	plugin._props.push(...data.css._props);
  	return 1;
  }
  */
}, Oe = [1, 0, 0, 1, 0, 0], Tn = {}, Pn = function(t) {
  return t === "matrix(1, 0, 0, 1, 0, 0)" || t === "none" || !t;
}, xr = function(t) {
  var e = st(t, U);
  return Pn(e) ? Oe : e.substr(7).match(zr).map(L);
}, Ji = function(t, e) {
  var i = t._gsap || Nt(t), r = t.style, n = xr(t), s, o, l, h;
  return i.svg && t.getAttribute("transform") ? (l = t.transform.baseVal.consolidate().matrix, n = [l.a, l.b, l.c, l.d, l.e, l.f], n.join(",") === "1,0,0,1,0,0" ? Oe : n) : (n === Oe && !t.offsetParent && t !== te && !i.svg && (l = r.display, r.display = "block", s = t.parentNode, (!s || !t.offsetParent && !t.getBoundingClientRect().width) && (h = 1, o = t.nextElementSibling, te.appendChild(t)), n = xr(t), l ? r.display = l : Mt(t, "display"), h && (o ? s.insertBefore(t, o) : s ? s.appendChild(t) : te.removeChild(t))), e && n.length > 6 ? [n[0], n[1], n[4], n[5], n[12], n[13]] : n);
}, Ai = function(t, e, i, r, n, s) {
  var o = t._gsap, l = n || Ji(t, !0), h = o.xOrigin || 0, u = o.yOrigin || 0, c = o.xOffset || 0, f = o.yOffset || 0, p = l[0], _ = l[1], d = l[2], g = l[3], y = l[4], v = l[5], x = e.split(" "), w = parseFloat(x[0]) || 0, m = parseFloat(x[1]) || 0, A, C, k, b;
  i ? l !== Oe && (C = p * g - _ * d) && (k = w * (g / C) + m * (-d / C) + (d * v - g * y) / C, b = w * (-_ / C) + m * (p / C) - (p * v - _ * y) / C, w = k, m = b) : (A = Cn(t), w = A.x + (~x[0].indexOf("%") ? w / 100 * A.width : w), m = A.y + (~(x[1] || x[0]).indexOf("%") ? m / 100 * A.height : m)), r || r !== !1 && o.smooth ? (y = w - h, v = m - u, o.xOffset = c + (y * p + v * d) - y, o.yOffset = f + (y * _ + v * g) - v) : o.xOffset = o.yOffset = 0, o.xOrigin = w, o.yOrigin = m, o.smooth = !!r, o.origin = e, o.originIsAbsolute = !!i, t.style[tt] = "0px 0px", s && (kt(s, o, "xOrigin", h, w), kt(s, o, "yOrigin", u, m), kt(s, o, "xOffset", c, o.xOffset), kt(s, o, "yOffset", f, o.yOffset)), t.setAttribute("data-svg-origin", w + " " + m);
}, De = function(t, e) {
  var i = t._gsap || new un(t);
  if ("x" in i && !e && !i.uncache)
    return i;
  var r = t.style, n = i.scaleX < 0, s = "px", o = "deg", l = getComputedStyle(t), h = st(t, tt) || "0", u, c, f, p, _, d, g, y, v, x, w, m, A, C, k, b, P, D, M, O, J, N, B, Y, dt, Ue, ue, ce, Rt, Zi, mt, zt;
  return u = c = f = d = g = y = v = x = w = 0, p = _ = 1, i.svg = !!(t.getCTM && kn(t)), l.translate && ((l.translate !== "none" || l.scale !== "none" || l.rotate !== "none") && (r[U] = (l.translate !== "none" ? "translate3d(" + (l.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (l.rotate !== "none" ? "rotate(" + l.rotate + ") " : "") + (l.scale !== "none" ? "scale(" + l.scale.split(" ").join(",") + ") " : "") + (l[U] !== "none" ? l[U] : "")), r.scale = r.rotate = r.translate = "none"), C = Ji(t, i.svg), i.svg && (i.uncache ? (dt = t.getBBox(), h = i.xOrigin - dt.x + "px " + (i.yOrigin - dt.y) + "px", Y = "") : Y = !e && t.getAttribute("data-svg-origin"), Ai(t, Y || h, !!Y || i.originIsAbsolute, i.smooth !== !1, C)), m = i.xOrigin || 0, A = i.yOrigin || 0, C !== Oe && (D = C[0], M = C[1], O = C[2], J = C[3], u = N = C[4], c = B = C[5], C.length === 6 ? (p = Math.sqrt(D * D + M * M), _ = Math.sqrt(J * J + O * O), d = D || M ? Wt(M, D) * Lt : 0, v = O || J ? Wt(O, J) * Lt + d : 0, v && (_ *= Math.abs(Math.cos(v * ee))), i.svg && (u -= m - (m * D + A * O), c -= A - (m * M + A * J))) : (zt = C[6], Zi = C[7], ue = C[8], ce = C[9], Rt = C[10], mt = C[11], u = C[12], c = C[13], f = C[14], k = Wt(zt, Rt), g = k * Lt, k && (b = Math.cos(-k), P = Math.sin(-k), Y = N * b + ue * P, dt = B * b + ce * P, Ue = zt * b + Rt * P, ue = N * -P + ue * b, ce = B * -P + ce * b, Rt = zt * -P + Rt * b, mt = Zi * -P + mt * b, N = Y, B = dt, zt = Ue), k = Wt(-O, Rt), y = k * Lt, k && (b = Math.cos(-k), P = Math.sin(-k), Y = D * b - ue * P, dt = M * b - ce * P, Ue = O * b - Rt * P, mt = J * P + mt * b, D = Y, M = dt, O = Ue), k = Wt(M, D), d = k * Lt, k && (b = Math.cos(k), P = Math.sin(k), Y = D * b + M * P, dt = N * b + B * P, M = M * b - D * P, B = B * b - N * P, D = Y, N = dt), g && Math.abs(g) + Math.abs(d) > 359.9 && (g = d = 0, y = 180 - y), p = L(Math.sqrt(D * D + M * M + O * O)), _ = L(Math.sqrt(B * B + zt * zt)), k = Wt(N, B), v = Math.abs(k) > 2e-4 ? k * Lt : 0, w = mt ? 1 / (mt < 0 ? -mt : mt) : 0), i.svg && (Y = t.getAttribute("transform"), i.forceCSS = t.setAttribute("transform", "") || !Pn(st(t, U)), Y && t.setAttribute("transform", Y))), Math.abs(v) > 90 && Math.abs(v) < 270 && (n ? (p *= -1, v += d <= 0 ? 180 : -180, d += d <= 0 ? 180 : -180) : (_ *= -1, v += v <= 0 ? 180 : -180)), e = e || i.uncache, i.x = u - ((i.xPercent = u && (!e && i.xPercent || (Math.round(t.offsetWidth / 2) === Math.round(-u) ? -50 : 0))) ? t.offsetWidth * i.xPercent / 100 : 0) + s, i.y = c - ((i.yPercent = c && (!e && i.yPercent || (Math.round(t.offsetHeight / 2) === Math.round(-c) ? -50 : 0))) ? t.offsetHeight * i.yPercent / 100 : 0) + s, i.z = f + s, i.scaleX = L(p), i.scaleY = L(_), i.rotation = L(d) + o, i.rotationX = L(g) + o, i.rotationY = L(y) + o, i.skewX = v + o, i.skewY = x + o, i.transformPerspective = w + s, (i.zOrigin = parseFloat(h.split(" ")[2]) || !e && i.zOrigin || 0) && (r[tt] = Xe(h)), i.xOffset = i.yOffset = 0, i.force3D = ot.force3D, i.renderTransform = i.svg ? vo : An ? Sn : yo, i.uncache = 0, i;
}, Xe = function(t) {
  return (t = t.split(" "))[0] + " " + t[1];
}, hi = function(t, e, i) {
  var r = W(e);
  return L(parseFloat(e) + parseFloat(Ot(t, "x", i + "px", r))) + r;
}, yo = function(t, e) {
  e.z = "0px", e.rotationY = e.rotationX = "0deg", e.force3D = 0, Sn(t, e);
}, Ut = "0deg", fe = "0px", Ft = ") ", Sn = function(t, e) {
  var i = e || this, r = i.xPercent, n = i.yPercent, s = i.x, o = i.y, l = i.z, h = i.rotation, u = i.rotationY, c = i.rotationX, f = i.skewX, p = i.skewY, _ = i.scaleX, d = i.scaleY, g = i.transformPerspective, y = i.force3D, v = i.target, x = i.zOrigin, w = "", m = y === "auto" && t && t !== 1 || y === !0;
  if (x && (c !== Ut || u !== Ut)) {
    var A = parseFloat(u) * ee, C = Math.sin(A), k = Math.cos(A), b;
    A = parseFloat(c) * ee, b = Math.cos(A), s = hi(v, s, C * b * -x), o = hi(v, o, -Math.sin(A) * -x), l = hi(v, l, k * b * -x + x);
  }
  g !== fe && (w += "perspective(" + g + Ft), (r || n) && (w += "translate(" + r + "%, " + n + "%) "), (m || s !== fe || o !== fe || l !== fe) && (w += l !== fe || m ? "translate3d(" + s + ", " + o + ", " + l + ") " : "translate(" + s + ", " + o + Ft), h !== Ut && (w += "rotate(" + h + Ft), u !== Ut && (w += "rotateY(" + u + Ft), c !== Ut && (w += "rotateX(" + c + Ft), (f !== Ut || p !== Ut) && (w += "skew(" + f + ", " + p + Ft), (_ !== 1 || d !== 1) && (w += "scale(" + _ + ", " + d + Ft), v.style[U] = w || "translate(0, 0)";
}, vo = function(t, e) {
  var i = e || this, r = i.xPercent, n = i.yPercent, s = i.x, o = i.y, l = i.rotation, h = i.skewX, u = i.skewY, c = i.scaleX, f = i.scaleY, p = i.target, _ = i.xOrigin, d = i.yOrigin, g = i.xOffset, y = i.yOffset, v = i.forceCSS, x = parseFloat(s), w = parseFloat(o), m, A, C, k, b;
  l = parseFloat(l), h = parseFloat(h), u = parseFloat(u), u && (u = parseFloat(u), h += u, l += u), l || h ? (l *= ee, h *= ee, m = Math.cos(l) * c, A = Math.sin(l) * c, C = Math.sin(l - h) * -f, k = Math.cos(l - h) * f, h && (u *= ee, b = Math.tan(h - u), b = Math.sqrt(1 + b * b), C *= b, k *= b, u && (b = Math.tan(u), b = Math.sqrt(1 + b * b), m *= b, A *= b)), m = L(m), A = L(A), C = L(C), k = L(k)) : (m = c, k = f, A = C = 0), (x && !~(s + "").indexOf("px") || w && !~(o + "").indexOf("px")) && (x = Ot(p, "x", s, "px"), w = Ot(p, "y", o, "px")), (_ || d || g || y) && (x = L(x + _ - (_ * m + d * C) + g), w = L(w + d - (_ * A + d * k) + y)), (r || n) && (b = p.getBBox(), x = L(x + r / 100 * b.width), w = L(w + n / 100 * b.height)), b = "matrix(" + m + "," + A + "," + C + "," + k + "," + x + "," + w + ")", p.setAttribute("transform", b), v && (p.style[U] = b);
}, bo = function(t, e, i, r, n) {
  var s = 360, o = $(n), l = parseFloat(n) * (o && ~n.indexOf("rad") ? Lt : 1), h = l - r, u = r + h + "deg", c, f;
  return o && (c = n.split("_")[1], c === "short" && (h %= s, h !== h % (s / 2) && (h += h < 0 ? s : -s)), c === "cw" && h < 0 ? h = (h + s * _r) % s - ~~(h / s) * s : c === "ccw" && h > 0 && (h = (h - s * _r) % s - ~~(h / s) * s)), t._pt = f = new Q(t._pt, e, i, r, h, eo), f.e = u, f.u = "deg", t._props.push(i), f;
}, wr = function(t, e) {
  for (var i in e)
    t[i] = e[i];
  return t;
}, xo = function(t, e, i) {
  var r = wr({}, i._gsap), n = "perspective,force3D,transformOrigin,svgOrigin", s = i.style, o, l, h, u, c, f, p, _;
  r.svg ? (h = i.getAttribute("transform"), i.setAttribute("transform", ""), s[U] = e, o = De(i, 1), Mt(i, U), i.setAttribute("transform", h)) : (h = getComputedStyle(i)[U], s[U] = e, o = De(i, 1), s[U] = h);
  for (l in xt)
    h = r[l], u = o[l], h !== u && n.indexOf(l) < 0 && (p = W(h), _ = W(u), c = p !== _ ? Ot(i, l, h, _) : parseFloat(h), f = parseFloat(u), t._pt = new Q(t._pt, o, l, c, f - c, bi), t._pt.u = _ || 0, t._props.push(l));
  wr(o, r);
};
G("padding,margin,Width,Radius", function(a, t) {
  var e = "Top", i = "Right", r = "Bottom", n = "Left", s = (t < 3 ? [e, i, r, n] : [e + n, e + i, r + i, r + n]).map(function(o) {
    return t < 2 ? a + o : "border" + o + a;
  });
  Ke[t > 1 ? "border" + a : a] = function(o, l, h, u, c) {
    var f, p;
    if (arguments.length < 4)
      return f = s.map(function(_) {
        return vt(o, _, h);
      }), p = f.join(" "), p.split(f[0]).length === 5 ? f[0] : p;
    f = (u + "").split(" "), p = {}, s.forEach(function(_, d) {
      return p[_] = f[d] = f[d] || f[(d - 1) / 2 | 0];
    }), o.init(l, p, c);
  };
});
var En = {
  name: "css",
  register: wi,
  targetTest: function(t) {
    return t.style && t.nodeType;
  },
  init: function(t, e, i, r, n) {
    var s = this._props, o = t.style, l = i.vars.startAt, h, u, c, f, p, _, d, g, y, v, x, w, m, A, C, k, b;
    Yi || wi(), this.styles = this.styles || wn(t), k = this.styles.props, this.tween = i;
    for (d in e)
      if (d !== "autoRound" && (u = e[d], !(it[d] && cn(d, e, i, r, t, n)))) {
        if (p = typeof u, _ = Ke[d], p === "function" && (u = u.call(i, r, t, n), p = typeof u), p === "string" && ~u.indexOf("random(") && (u = Se(u)), _)
          _(this, t, d, u, i) && (C = 1);
        else if (d.substr(0, 2) === "--")
          h = (getComputedStyle(t).getPropertyValue(d) + "").trim(), u += "", St.lastIndex = 0, St.test(h) || (g = W(h), y = W(u), y ? g !== y && (h = Ot(t, d, h, y) + y) : g && (u += g)), this.add(o, "setProperty", h, u, r, n, 0, 0, d), s.push(d), k.push(d, 0, o[d]);
        else if (p !== "undefined") {
          if (l && d in l ? (h = typeof l[d] == "function" ? l[d].call(i, r, t, n) : l[d], $(h) && ~h.indexOf("random(") && (h = Se(h)), W(h + "") || h === "auto" || (h += ot.units[d] || W(vt(t, d)) || ""), (h + "").charAt(1) === "=" && (h = vt(t, d))) : h = vt(t, d), f = parseFloat(h), v = p === "string" && u.charAt(1) === "=" && u.substr(0, 2), v && (u = u.substr(2)), c = parseFloat(u), d in _t && (d === "autoAlpha" && (f === 1 && vt(t, "visibility") === "hidden" && c && (f = 0), k.push("visibility", 0, o.visibility), kt(this, o, "visibility", f ? "inherit" : "hidden", c ? "inherit" : "hidden", !c)), d !== "scale" && d !== "transform" && (d = _t[d], ~d.indexOf(",") && (d = d.split(",")[0]))), x = d in xt, x) {
            if (this.styles.save(d), b = u, p === "string" && u.substring(0, 6) === "var(--") {
              if (u = st(t, u.substring(4, u.indexOf(")"))), u.substring(0, 5) === "calc(") {
                var P = t.style.perspective;
                t.style.perspective = u, u = st(t, "perspective"), P ? t.style.perspective = P : Mt(t, "perspective");
              }
              c = parseFloat(u);
            }
            if (w || (m = t._gsap, m.renderTransform && !e.parseTransform || De(t, e.parseTransform), A = e.smoothOrigin !== !1 && m.smooth, w = this._pt = new Q(this._pt, o, U, 0, 1, m.renderTransform, m, 0, -1), w.dep = 1), d === "scale")
              this._pt = new Q(this._pt, m, "scaleY", m.scaleY, (v ? Qt(m.scaleY, v + c) : c) - m.scaleY || 0, bi), this._pt.u = 0, s.push("scaleY", d), d += "X";
            else if (d === "transformOrigin") {
              k.push(tt, 0, o[tt]), u = go(u), m.svg ? Ai(t, u, 0, A, 0, this) : (y = parseFloat(u.split(" ")[2]) || 0, y !== m.zOrigin && kt(this, m, "zOrigin", m.zOrigin, y), kt(this, o, d, Xe(h), Xe(u)));
              continue;
            } else if (d === "svgOrigin") {
              Ai(t, u, 1, A, 0, this);
              continue;
            } else if (d in Tn) {
              bo(this, m, d, f, v ? Qt(f, v + u) : u);
              continue;
            } else if (d === "smoothOrigin") {
              kt(this, m, "smooth", m.smooth, u);
              continue;
            } else if (d === "force3D") {
              m[d] = u;
              continue;
            } else if (d === "transform") {
              xo(this, u, t);
              continue;
            }
          } else d in o || (d = he(d) || d);
          if (x || (c || c === 0) && (f || f === 0) && !to.test(u) && d in o)
            g = (h + "").substr((f + "").length), c || (c = 0), y = W(u) || (d in ot.units ? ot.units[d] : g), g !== y && (f = Ot(t, d, h, y)), this._pt = new Q(this._pt, x ? m : o, d, f, (v ? Qt(f, v + c) : c) - f, !x && (y === "px" || d === "zIndex") && e.autoRound !== !1 ? no : bi), this._pt.u = y || 0, x && b !== u ? (this._pt.b = h, this._pt.e = b, this._pt.r = ro) : g !== y && y !== "%" && (this._pt.b = h, this._pt.r = io);
          else if (d in o)
            _o.call(this, t, d, h, v ? v + u : u);
          else if (d in t)
            this.add(t, d, h || t[d], v ? v + u : u, r, n);
          else if (d !== "parseTransform") {
            Di(d, u);
            continue;
          }
          x || (d in o ? k.push(d, 0, o[d]) : typeof t[d] == "function" ? k.push(d, 2, t[d]()) : k.push(d, 1, h || t[d])), s.push(d);
        }
      }
    C && mn(this);
  },
  render: function(t, e) {
    if (e.tween._time || !Vi())
      for (var i = e._pt; i; )
        i.r(t, i.d), i = i._next;
    else
      e.styles.revert();
  },
  get: vt,
  aliases: _t,
  getSetter: function(t, e, i) {
    var r = _t[e];
    return r && r.indexOf(",") < 0 && (e = r), e in xt && e !== tt && (t._gsap.x || vt(t, "x")) ? i && pr === i ? e === "scale" ? lo : ao : (pr = i || {}) && (e === "scale" ? ho : uo) : t.style && !Ei(t.style[e]) ? so : ~e.indexOf("-") ? oo : Ii(t, e);
  },
  core: {
    _removeProperty: Mt,
    _getMatrix: Ji
  }
};
et.utils.checkPrefix = he;
et.core.getStyleSaver = wn;
(function(a, t, e, i) {
  var r = G(a + "," + t + "," + e, function(n) {
    xt[n] = 1;
  });
  G(t, function(n) {
    ot.units[n] = "deg", Tn[n] = 1;
  }), _t[r[13]] = a + "," + t, G(i, function(n) {
    var s = n.split(":");
    _t[s[1]] = r[s[0]];
  });
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
G("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(a) {
  ot.units[a] = "px";
});
et.registerPlugin(En);
var Xt = et.registerPlugin(En) || et;
Xt.core.Tween;
var wo = Object.defineProperty, Mn = (a, t, e, i) => {
  for (var r = void 0, n = a.length - 1, s; n >= 0; n--)
    (s = a[n]) && (r = s(t, e, r) || r);
  return r && wo(t, e, r), r;
};
const Ar = [
  { name: "YouTube", icon: "youtube", package: "com.google.android.youtube.tv" },
  { name: "Netflix", icon: "netflix", package: "com.netflix.ninja" },
  { name: "IPTV", icon: "tv", package: "ru.iptvremote.android.iptv" }
], Cr = {
  "com.google.android.youtube.tv": { label: "YouTube", color: "#FF0000" },
  "com.google.android.apps.youtube.music": { label: "YouTube Music", color: "#FF0000" },
  "com.netflix.ninja": { label: "Netflix", color: "#E50914" },
  "ru.iptvremote.android.iptv": { label: "IPTV", color: "#4fc3f7" },
  "com.google.android.tvlauncher": { label: "Home", color: "#4285F4" },
  "com.sony.dtv.tvx": { label: "Live TV", color: "#0077B5" },
  "com.disney.disneyplus": { label: "Disney+", color: "#113CCF" },
  "com.amazon.amazonvideo.livingroom": { label: "Prime Video", color: "#00A8E1" },
  "com.apple.atve.androidtv.appletv": { label: "Apple TV", color: "#555555" },
  "com.plexapp.android": { label: "Plex", color: "#E5A00D" }
}, Z = {
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
  mute: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>',
  youtube: '<svg viewBox="0 0 90 20" fill="currentColor"><path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 0 14.285 0 14.285 0C14.285 0 5.35042 0 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C0 5.35042 0 10 0 10C0 10 0 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"/><path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"/><g><path d="M34.6024 13.0036L31.3945 1.41846H34.1932L35.3174 6.6701C35.6043 7.96361 35.8136 9.06662 35.95 9.97913H36.0323C36.1264 9.32532 36.3381 8.22937 36.665 6.68892L37.8291 1.41846H40.6278L37.3799 13.0036V18.561H34.6001V13.0036H34.6024Z"/><path d="M41.4697 18.1937C40.9053 17.8127 40.5031 17.22 40.2632 16.4157C40.0257 15.6114 39.9058 14.5437 39.9058 13.2078V11.3898C39.9058 10.0422 40.0422 8.95805 40.315 8.14196C40.5878 7.32588 41.0135 6.72851 41.592 6.35457C42.1706 5.98063 42.9302 5.79248 43.871 5.79248C44.7976 5.79248 45.5384 5.98298 46.0981 6.36398C46.6555 6.74497 47.0508 7.34234 47.2765 8.15137C47.5023 8.96275 47.6176 10.0422 47.6176 11.3898V13.2078C47.6176 14.5437 47.5023 15.6161 47.2765 16.4251C47.0508 17.2365 46.6508 17.8292 46.0787 18.2031C45.5066 18.5771 44.7764 18.7652 43.8874 18.7652C42.9514 18.7675 42.1847 18.5747 41.4697 18.1937ZM44.6353 16.2323C44.7905 15.8231 44.8705 15.1575 44.8705 14.2309V10.3292C44.8705 9.43077 44.7929 8.77225 44.6353 8.35833C44.4777 7.94206 44.2026 7.7351 43.8074 7.7351C43.4265 7.7351 43.156 7.94206 42.9914 8.35833C42.8268 8.77461 42.7445 9.43077 42.7445 10.3292V14.2309C42.7445 15.1575 42.8268 15.8254 42.9914 16.2323C43.156 16.6415 43.4382 16.8461 43.8074 16.8461C44.1767 16.8461 44.4777 16.6415 44.6353 16.2323Z"/><path d="M56.8154 18.5634H54.6094L54.3648 17.03H54.3037C53.7039 18.1871 52.8055 18.7656 51.6061 18.7656C50.7759 18.7656 50.1621 18.4928 49.767 17.9496C49.3719 17.4039 49.1743 16.5526 49.1743 15.3955V6.03751H51.9942V15.2308C51.9942 15.7906 52.0553 16.188 52.1776 16.4256C52.2999 16.6631 52.5045 16.783 52.7914 16.783C53.036 16.783 53.2712 16.7078 53.497 16.5573C53.7228 16.4067 53.8874 16.2162 53.9979 15.9858V6.03516H56.8154V18.5634Z"/><path d="M64.4755 3.68758H61.6768V18.5629H58.9181V3.68758H56.1194V1.42041H64.4755V3.68758Z"/><path d="M71.2768 18.5634H69.0708L68.8262 17.03H68.7651C68.1654 18.1871 67.267 18.7656 66.0675 18.7656C65.2373 18.7656 64.6235 18.4928 64.2284 17.9496C63.8333 17.4039 63.6357 16.5526 63.6357 15.3955V6.03751H66.4556V15.2308C66.4556 15.7906 66.5167 16.188 66.639 16.4256C66.7613 16.6631 66.9659 16.783 67.2529 16.783C67.4974 16.783 67.7326 16.7078 67.9584 16.5573C68.1842 16.4067 68.3488 16.2162 68.4593 15.9858V6.03516H71.2768V18.5634Z"/><path d="M80.609 8.0387C80.4373 7.24849 80.1621 6.67699 79.7812 6.32186C79.4002 5.96674 78.8757 5.79035 78.2078 5.79035C77.6904 5.79035 77.2059 5.93616 76.7567 6.23014C76.3075 6.52412 75.9594 6.90747 75.7148 7.38489H75.6937V0.785645H72.9773V18.5608H75.3056L75.5925 17.3755H75.6537C75.8724 17.7988 76.1993 18.1304 76.6344 18.3774C77.0695 18.622 77.554 18.7443 78.0855 18.7443C79.038 18.7443 79.7412 18.3045 80.1904 17.4272C80.6396 16.5476 80.8653 15.1765 80.8653 13.3092V11.3266C80.8653 9.92722 80.7783 8.82892 80.609 8.0387ZM78.0243 13.1492C78.0243 14.0617 77.9867 14.7767 77.9114 15.2941C77.8362 15.8115 77.7115 16.1808 77.5328 16.3971C77.3564 16.6158 77.1165 16.724 76.8178 16.724C76.585 16.724 76.371 16.6699 76.1734 16.5594C75.9759 16.4512 75.816 16.2866 75.6937 16.0702V8.96062C75.7877 8.6196 75.9524 8.34209 76.1852 8.12337C76.4157 7.90465 76.6697 7.79646 76.9401 7.79646C77.2271 7.79646 77.4481 7.90935 77.6034 8.13278C77.7609 8.35855 77.8691 8.73485 77.9303 9.26636C77.9914 9.79787 78.022 10.5528 78.022 11.5335V13.1492H78.0243Z"/></g></svg>',
  "youtube-music": '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228 18.228 15.432 18.228 12 15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z"/></svg>',
  netflix: '<svg viewBox="0 0 111 30" fill="currentColor"><path d="M105.062 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 8.31c-1.812-.28-3.624-.436-5.405-.625l6.062-13.5L93.5 0h5.28l3.062 7.874L105 0h5.343l-5.28 14.28zM90.311 0h-4.968v27.25c1.687.094 3.374.156 5.125.156V0zm-14.406 0h-4.968v24.938c1.687.094 3.374.156 5.125.156V0zM70.999 0h-4.969v22.625c1.688.094 3.375.156 5.125.156V0zM56.124 0h-4.969v20.313c1.688.093 3.375.155 5.125.155V0zM41.062 0h-4.969v17.969c1.688.094 3.375.156 5.125.156V0zM24.999 0h-4.969v15.656c1.688.094 3.375.156 5.125.156V0zM10.937 0H6v13.344c1.688.093 3.375.155 5.125.155V0z"/></svg>',
  tv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="13" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>'
}, Ao = {
  youtube: "data:image/png;base64,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",
  netflix: "data:image/png;base64,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",
  tv: "data:image/png;base64,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"
}, ji = class ji extends ve {
  constructor() {
    super(...arguments), this._swipeStartX = 0, this._swipeStartY = 0, this._SWIPE_THRESHOLD = 30, this._boundPointerDown = this._onDpadPointerDown.bind(this), this._boundPointerUp = this._onDpadPointerUp.bind(this);
  }
  /* ── HA card API ────────────────────────────────────────────── */
  static getStubConfig() {
    return { entity: "media_player.android_tv_192_168_11_26", apps: Ar };
  }
  setConfig(t) {
    if (!t.entity)
      throw new Error("bravia-tv-remote: 'entity' is required");
    this._config = { ...t }, this._apps = t.apps ?? Ar;
  }
  getCardSize() {
    return 10;
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
  get _appId() {
    return this._attr("app_id");
  }
  get _appName() {
    const t = Cr[this._appId];
    return t ? t.label : this._attr("app_name") || this._attr("source") || "";
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
  /* ── Service calls ─────────────────────────────────────────── */
  _callService(t, e, i) {
    this.hass.callService(t, e, {
      entity_id: this._config.entity,
      ...i
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
  _launchApp(t) {
    this._callService("androidtv", "adb_command", {
      command: `monkey -p ${t} -c android.intent.category.LAUNCHER 1`
    });
  }
  firstUpdated() {
    const t = this.shadowRoot.querySelector(".dpad-disc");
    t && (t.addEventListener("pointerdown", this._boundPointerDown), t.addEventListener("pointerup", this._boundPointerUp));
    const e = this.shadowRoot.querySelector(".remote-body");
    e && e.addEventListener("click", (i) => {
      const r = i.target.closest(".ctrl-btn, .app-btn, .vol-rocker-btn, .color-btn");
      r && Xt.fromTo(
        r,
        { scale: 0.92 },
        { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.4)" }
      );
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    const t = this.shadowRoot?.querySelector(".dpad-disc");
    t && (t.removeEventListener("pointerdown", this._boundPointerDown), t.removeEventListener("pointerup", this._boundPointerUp));
  }
  _onDpadPointerDown(t) {
    this._swipeStartX = t.clientX, this._swipeStartY = t.clientY, t.currentTarget.setPointerCapture(t.pointerId);
  }
  _onDpadPointerUp(t) {
    const e = t.clientX - this._swipeStartX, i = t.clientY - this._swipeStartY, r = Math.abs(e), n = Math.abs(i);
    if (Math.max(r, n) < this._SWIPE_THRESHOLD) return;
    const s = this.shadowRoot.querySelector(".dpad-disc");
    if (!s) return;
    let o, l;
    r > n ? (o = e > 0 ? "right" : "left", l = { x: e > 0 ? 10 : -10 }) : (o = i > 0 ? "down" : "up", l = { y: i > 0 ? 10 : -10 }), {
      up: () => this._dpadUp(),
      down: () => this._dpadDown(),
      left: () => this._dpadLeft(),
      right: () => this._dpadRight()
    }[o](), Xt.timeline().to(s, { ...l, duration: 0.12, ease: "power2.out" }).to(s, { x: 0, y: 0, duration: 0.25, ease: "elastic.out(1, 0.5)" });
    const u = this.shadowRoot.querySelector(`.dpad-arrow.${o}`);
    u && Xt.fromTo(
      u,
      { color: "rgba(255,255,255,0.8)" },
      { color: "rgba(255,255,255,0.25)", duration: 0.4 }
    );
  }
  _animateOk() {
    const t = this.shadowRoot.querySelector(".dpad-ok");
    t && Xt.fromTo(
      t,
      { scale: 0.9 },
      { scale: 1, duration: 0.35, ease: "elastic.out(1, 0.5)" }
    ), this._dpadCenter();
  }
  _animateDpadArrow(t) {
    const e = this.shadowRoot.querySelector(`.dpad-arrow.${t}`);
    e && Xt.fromTo(
      e,
      { scale: 0.85, color: "rgba(255,255,255,0.8)" },
      { scale: 1, color: "rgba(255,255,255,0.25)", duration: 0.3, ease: "elastic.out(1, 0.4)" }
    ), { up: () => this._dpadUp(), down: () => this._dpadDown(), left: () => this._dpadLeft(), right: () => this._dpadRight() }[t]();
  }
  /* ── Render ─────────────────────────────────────────────────── */
  render() {
    if (!this._config)
      return Zt`<ha-card><div>Loading…</div></ha-card>`;
    const t = this._isOn ? "on" : "off";
    return this._mediaTitle, this._mediaArtist, this._entityPicture, this._appName, Zt`
      <ha-card>
        <div class="remote-body">

          <!-- Power button -->
          <div class="top-row">
            <button class="ctrl-btn power-btn ${t}" @click="${this._togglePower}" title="Power">
              <span .innerHTML="${Z.power}"></span>
            </button>
          </div>

          <!-- App launchers -->
          <div class="app-launchers">
            ${this._apps.map((e) => {
      const i = this._appId === e.package, r = Cr[e.package]?.color ?? "#4fc3f7", n = Ao[e.icon];
      return Zt`
                <button
                  class="app-btn ${e.icon} ${i ? "active" : ""}"
                  style="--active-color: ${r}"
                  @click="${() => this._launchApp(e.package)}"
                >
                  ${n ? Zt`<img src="${n}" alt="${e.name}" />` : Zt`<span .innerHTML="${Z[e.icon] || Z.play}"></span>`}
                  ${e.icon === "tv" ? Zt`<span class="label">${e.name}</span>` : ""}
                </button>
              `;
    })}
          </div>

          <!-- D-pad disc -->
          <div class="remote-section">
            <div class="dpad-container">
              <div class="dpad-disc"></div>
              <button class="dpad-arrow up" @click="${() => this._animateDpadArrow("up")}">
                <span .innerHTML="${Z.up}"></span>
              </button>
              <button class="dpad-arrow left" @click="${() => this._animateDpadArrow("left")}">
                <span .innerHTML="${Z.left}"></span>
              </button>
              <button class="dpad-ok" @click="${this._animateOk}">OK</button>
              <button class="dpad-arrow right" @click="${() => this._animateDpadArrow("right")}">
                <span .innerHTML="${Z.right}"></span>
              </button>
              <button class="dpad-arrow down" @click="${() => this._animateDpadArrow("down")}">
                <span .innerHTML="${Z.down}"></span>
              </button>
            </div>
          </div>

          <!-- Back + Home -->
          <div class="remote-section" style="margin-top: 8px;">
            <div class="nav-row">
              <div class="labeled-btn">
                <button class="ctrl-btn sm" @click="${this._goBack}" title="Back">
                  <span .innerHTML="${Z.back}"></span>
                </button>
                <span class="btn-label">Back</span>
              </div>
              <div class="labeled-btn">
                <button class="ctrl-btn sm" @click="${this._goHome}" title="Home">
                  <span .innerHTML="${Z.home}"></span>
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
                <button class="ctrl-btn sm" @click="${this._volumeMute}" title="Mute">
                  <span .innerHTML="${Z[this._isMuted ? "mute" : "volume-x"]}"></span>
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
                  <span .innerHTML="${Z.rewind}"></span>
                </button>
                <span class="btn-label">Rew</span>
              </div>
              <div class="labeled-btn">
                <button class="ctrl-btn md" @click="${this._playPause}" title="Play/Pause">
                  <span .innerHTML="${Z[this._isPlaying ? "pause" : "play"]}"></span>
                </button>
                <span class="btn-label">Play</span>
              </div>
              <div class="labeled-btn">
                <button class="ctrl-btn sm" @click="${this._mediaFastForward}" title="Fast Forward">
                  <span .innerHTML="${Z["fast-forward"]}"></span>
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
                  <span .innerHTML="${Z["skip-back"]}"></span>
                </button>
                <span class="btn-label">Prev</span>
              </div>
              <div class="labeled-btn">
                <button class="ctrl-btn sm" @click="${this._playPause}" title="Pause">
                  <span .innerHTML="${Z.pause}"></span>
                </button>
                <span class="btn-label">Pause</span>
              </div>
              <div class="labeled-btn">
                <button class="ctrl-btn sm" @click="${this._mediaNext}" title="Next">
                  <span .innerHTML="${Z["skip-forward"]}"></span>
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
ji.styles = Dn`
    :host {
      display: block;
      --text-primary: #e0e0e0;
      --text-secondary: #777;
      --text-dim: #444;
      --accent: #4fc3f7;
      --youtube: #ff0000;
      --youtube-music: #ff0000;
      --netflix: #e50914;
      --iptv: #4fc3f7;
    }

    ha-card {
      background:
        radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px),
        #1a1a2e;
      background-size: 16px 16px, 100% 100%;
      border: none;
      box-shadow: none;
      padding: 24px 0;
    }

    /* ── App launchers ───────────────────────── */

    .app-launchers {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
      width: 100%;
      margin: 0 0 32px;
    }

    .app-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 150ms ease;
      -webkit-tap-highlight-color: transparent;
      position: relative;
      overflow: hidden;
      min-height: 44px;
    }

    .app-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
    

    .app-btn img { pointer-events: none; }

    .app-btn.youtube {
      background: white;
      border-radius: 14px;
      padding: 14px 8px;
      box-shadow: none;
    }
    .app-btn.youtube.active { box-shadow: none; }
    .app-btn.youtube img { width: 100%; height: auto; }

    .app-btn.netflix {
      background: #E50914;
      border-radius: 14px;
      padding: 14px 8px;
    }
    .app-btn.netflix img { width: 100%; height: auto; }

    .app-btn.tv {
      background: #8CC24A;
      padding: 10px 20px;
      gap: 4px;
      border-radius: 14px;
    }
    .app-btn.tv img { width: 36px; height: 36px; flex-shrink: 0; object-fit: contain; }
    .app-btn.tv .label {
      font-size: 12px;
      font-weight: 700;
      color: #fff;
    }

    .app-btn.active {
      box-shadow: 0 0 0 2px var(--active-color, var(--accent));
    }

    /* ── Remote Body ────────────────────────────── */

    .remote-body {
      background: linear-gradient(180deg, #1c1c1e 0%, #141414 50%, #111 100%);
      border-radius: 32px 32px 40px 40px;
      margin: 0 auto;
      max-width: 320px;
      padding: 22px 32px 28px;
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
      margin-bottom: 16px;
    }

    .remote-divider {
      width: 50%;
      height: 1px;
      background: linear-gradient(90deg, transparent, #2a2a2a, transparent);
      margin: 14px 0;
    }

    /* ── Power button row ──────────────────── */

    .top-row {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 32px;
    }

    /* ── Color buttons ───────────────────────── */

    .color-row { display: flex; gap: 14px; margin: 2px 0; }

    .color-btn {
      width: 52px; height: 16px; border-radius: 8px; border: none;
      cursor: pointer; transition: all 120ms ease;
      -webkit-tap-highlight-color: transparent; opacity: 0.85;
    }
    .color-btn:hover { opacity: 1; transform: scaleY(1.4); }
    
    .color-btn.blue   { background: #5c6bc0; }
    .color-btn.red    { background: #e53935; }
    .color-btn.green  { background: #43a047; }
    .color-btn.yellow { background: #fdd835; }

    /* ── Utility row ─────────────────────────── */

    .util-row { display: flex; gap: 20px; }

    /* ── D-pad ───────────────────────────────── */

    .dpad-container { position: relative; width: 250px; height: 250px; }

    .dpad-disc {
      position: absolute; inset: 0; border-radius: 50%;
      background: radial-gradient(circle at 50% 50%, #222 0%, #1a1a1a 70%, #161616 100%);
      box-shadow: 0 3px 10px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.04), inset 0 -1px 1px rgba(0,0,0,0.3);
      touch-action: none;
    }

    .dpad-arrow {
      position: absolute; display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: rgba(255,255,255,0.25); transition: all 120ms ease;
      -webkit-tap-highlight-color: transparent; background: none; border: none; padding: 0; z-index: 1;
    }
    .dpad-arrow:hover { color: rgba(255,255,255,0.6); }
    .dpad-arrow svg { width: 32px; height: 32px; }

    .dpad-arrow.up { top: -4px; left: 50%; transform: translateX(-50%); width: 70px; height: 64px; }
    .dpad-arrow.down { bottom: -4px; left: 50%; transform: translateX(-50%); width: 70px; height: 64px; }
    .dpad-arrow.left { left: -4px; top: 50%; transform: translateY(-50%); width: 64px; height: 70px; }
    .dpad-arrow.right { right: -4px; top: 50%; transform: translateY(-50%); width: 64px; height: 70px; }

    .dpad-ok {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 110px; height: 110px; border-radius: 50%;
      background: radial-gradient(circle at 50% 40%, #2c2c2e, #242424);
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      font-size: 18px; font-weight: 600; color: rgba(255,255,255,0.5);
      letter-spacing: 2px; transition: all 120ms ease;
      -webkit-tap-highlight-color: transparent; z-index: 2;
    }
    .dpad-ok:hover { background: radial-gradient(circle at 50% 40%, #353537, #2a2a2c); color: rgba(255,255,255,0.8); border-color: rgba(255,255,255,0.15); }

    /* ── Back / Home row ─────────────────────── */

    .nav-row { display: flex; width: 100%; justify-content: space-between; }

    /* ── Volume ──────────────────────────────── */

    .vol-section { display: flex; align-items: center; gap: 28px; }

    .vol-rocker {
      display: flex; flex-direction: column; align-items: center; gap: 0;
      background: rgba(255,255,255,0.03); border-radius: 18px;
      border: 1px solid rgba(255,255,255,0.06); overflow: hidden;
    }

    .vol-rocker-btn {
      width: 78px; height: 60px; display: flex; align-items: center; justify-content: center;
      cursor: pointer; background: none; border: none;
      color: rgba(255,255,255,0.45); font-size: 28px; font-weight: 300;
      transition: all 120ms ease; -webkit-tap-highlight-color: transparent;
    }
    .vol-rocker-btn:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.8); }

    .vol-rocker-label {
      font-size: 12px; color: var(--text-dim); text-transform: uppercase;
      letter-spacing: 0.8px; padding: 2px 0;
    }

    /* ── Media transport ─────────────────────── */

    .transport-row { display: flex; align-items: flex-end; gap: 16px; }

    /* ── Shared button styles ────────────────── */

    .ctrl-btn {
      display: flex; align-items: center; justify-content: center;
      border: 1px solid rgba(255,255,255,0.06); border-radius: 18px;
      background: rgba(255,255,255,0.04); cursor: pointer;
      transition: all 120ms ease; -webkit-tap-highlight-color: transparent;
      color: rgba(255,255,255,0.45);
    }
    .ctrl-btn:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.8); }
    .ctrl-btn span { display: flex; align-items: center; justify-content: center; }
    .ctrl-btn svg { width: 28px; height: 28px; display: block; }

    .ctrl-btn.sm { width: 70px; height: 60px; }
    .ctrl-btn.md { width: 82px; height: 68px; }
    .ctrl-btn.round { border-radius: 50%; }

    .ctrl-btn.power-btn {
      width: 60px; height: 60px; border-radius: 50%;
      background: rgba(255,255,255,0.03);
    }
    .ctrl-btn.power-btn.on {
      color: #4caf50; border-color: rgba(76, 175, 80, 0.4);
      box-shadow: 0 0 12px rgba(76, 175, 80, 0.15);
    }
    .ctrl-btn.power-btn.off { color: #444; }

    /* ── Labeled button ──────────────────────── */

    .labeled-btn { display: flex; flex-direction: column; align-items: center; gap: 6px; }
    .labeled-btn .btn-label {
      font-size: 12px; color: var(--text-dim); text-transform: uppercase;
      letter-spacing: 0.8px; font-weight: 500;
    }
  `;
let Re = ji;
Mn([
  Mr({ attribute: !1 })
], Re.prototype, "hass");
Mn([
  is()
], Re.prototype, "_config");
customElements.get("bravia-tv-remote") || customElements.define("bravia-tv-remote", Re);
typeof window < "u" && (window.customCards = window.customCards || [], window.customCards.some((a) => a.type === "bravia-tv-remote") || window.customCards.push({
  type: "bravia-tv-remote",
  name: "Bravia TV Remote",
  description: "Full remote control for Sony Bravia Android TV with ADB integration"
}));
export {
  Re as BraviaTvRemote
};
//# sourceMappingURL=bravia-tv-remote.js.map
