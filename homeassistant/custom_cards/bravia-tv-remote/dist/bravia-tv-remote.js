/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ne = globalThis, ki = Ne.ShadowRoot && (Ne.ShadyCSS === void 0 || Ne.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ti = Symbol(), Xi = /* @__PURE__ */ new WeakMap();
let Ar = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== Ti) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (ki && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = Xi.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && Xi.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Mn = (a) => new Ar(typeof a == "string" ? a : a + "", void 0, Ti), Dn = (a, ...t) => {
  const e = a.length === 1 ? a[0] : t.reduce((i, r, n) => i + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + a[n + 1], a[0]);
  return new Ar(e, a, Ti);
}, Rn = (a, t) => {
  if (ki) a.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), r = Ne.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = e.cssText, a.appendChild(i);
  }
}, Gi = ki ? (a) => a : (a) => a instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Mn(e);
})(a) : a;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: zn, defineProperty: Ln, getOwnPropertyDescriptor: Fn, getOwnPropertyNames: Nn, getOwnPropertySymbols: Vn, getPrototypeOf: In } = Object, At = globalThis, Zi = At.trustedTypes, Un = Zi ? Zi.emptyScript : "", Bn = At.reactiveElementPolyfillSupport, me = (a, t) => a, Be = { toAttribute(a, t) {
  switch (t) {
    case Boolean:
      a = a ? Un : null;
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
} }, Ai = (a, t) => !zn(a, t), Qi = { attribute: !0, type: String, converter: Be, reflect: !1, useDefault: !1, hasChanged: Ai };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), At.litPropertyMetadata ?? (At.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let Xt = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Qi) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, e);
      r !== void 0 && Ln(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: r, set: n } = Fn(this.prototype, t) ?? { get() {
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
    return this.elementProperties.get(t) ?? Qi;
  }
  static _$Ei() {
    if (this.hasOwnProperty(me("elementProperties"))) return;
    const t = In(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(me("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(me("properties"))) {
      const e = this.properties, i = [...Nn(e), ...Vn(e)];
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
      for (const r of i) e.unshift(Gi(r));
    } else t !== void 0 && e.push(Gi(t));
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
      const n = (i.converter?.toAttribute !== void 0 ? i.converter : Be).toAttribute(e, i.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const n = i.getPropertyOptions(r), s = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : Be;
      this._$Em = r;
      const o = s.fromAttribute(e, n.type);
      this[r] = o ?? this._$Ej?.get(r) ?? o, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, r = !1, n) {
    if (t !== void 0) {
      const s = this.constructor;
      if (r === !1 && (n = this[t]), i ?? (i = s.getPropertyOptions(t)), !((i.hasChanged ?? Ai)(n, e) || i.useDefault && i.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(s._$Eu(t, i)))) return;
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
Xt.elementStyles = [], Xt.shadowRootOptions = { mode: "open" }, Xt[me("elementProperties")] = /* @__PURE__ */ new Map(), Xt[me("finalized")] = /* @__PURE__ */ new Map(), Bn?.({ ReactiveElement: Xt }), (At.reactiveElementVersions ?? (At.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ve = globalThis, Ji = (a) => a, He = ve.trustedTypes, tr = He ? He.createPolicy("lit-html", { createHTML: (a) => a }) : void 0, Sr = "$lit$", wt = `lit$${Math.random().toFixed(9).slice(2)}$`, Pr = "?" + wt, Hn = `<${Pr}>`, Kt = document, ke = () => Kt.createComment(""), Te = (a) => a === null || typeof a != "object" && typeof a != "function", Si = Array.isArray, Yn = (a) => Si(a) || typeof a?.[Symbol.iterator] == "function", ei = `[ 	
\f\r]`, fe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, er = /-->/g, ir = />/g, zt = RegExp(`>|${ei}(?:([^\\s"'>=/]+)(${ei}*=${ei}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), rr = /'/g, nr = /"/g, $r = /^(?:script|style|textarea|title)$/i, Kn = (a) => (t, ...e) => ({ _$litType$: a, strings: t, values: e }), qt = Kn(1), ie = Symbol.for("lit-noChange"), H = Symbol.for("lit-nothing"), sr = /* @__PURE__ */ new WeakMap(), Vt = Kt.createTreeWalker(Kt, 129);
function Er(a, t) {
  if (!Si(a) || !a.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return tr !== void 0 ? tr.createHTML(t) : t;
}
const jn = (a, t) => {
  const e = a.length - 1, i = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", s = fe;
  for (let o = 0; o < e; o++) {
    const l = a[o];
    let h, u, c = -1, f = 0;
    for (; f < l.length && (s.lastIndex = f, u = s.exec(l), u !== null); ) f = s.lastIndex, s === fe ? u[1] === "!--" ? s = er : u[1] !== void 0 ? s = ir : u[2] !== void 0 ? ($r.test(u[2]) && (r = RegExp("</" + u[2], "g")), s = zt) : u[3] !== void 0 && (s = zt) : s === zt ? u[0] === ">" ? (s = r ?? fe, c = -1) : u[1] === void 0 ? c = -2 : (c = s.lastIndex - u[2].length, h = u[1], s = u[3] === void 0 ? zt : u[3] === '"' ? nr : rr) : s === nr || s === rr ? s = zt : s === er || s === ir ? s = fe : (s = zt, r = void 0);
    const _ = s === zt && a[o + 1].startsWith("/>") ? " " : "";
    n += s === fe ? l + Hn : c >= 0 ? (i.push(h), l.slice(0, c) + Sr + l.slice(c) + wt + _) : l + wt + (c === -2 ? o : _);
  }
  return [Er(a, n + (a[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class Ae {
  constructor({ strings: t, _$litType$: e }, i) {
    let r;
    this.parts = [];
    let n = 0, s = 0;
    const o = t.length - 1, l = this.parts, [h, u] = jn(t, e);
    if (this.el = Ae.createElement(h, i), Vt.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (r = Vt.nextNode()) !== null && l.length < o; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const c of r.getAttributeNames()) if (c.endsWith(Sr)) {
          const f = u[s++], _ = r.getAttribute(c).split(wt), p = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: n, name: p[2], strings: _, ctor: p[1] === "." ? Wn : p[1] === "?" ? Xn : p[1] === "@" ? Gn : Ze }), r.removeAttribute(c);
        } else c.startsWith(wt) && (l.push({ type: 6, index: n }), r.removeAttribute(c));
        if ($r.test(r.tagName)) {
          const c = r.textContent.split(wt), f = c.length - 1;
          if (f > 0) {
            r.textContent = He ? He.emptyScript : "";
            for (let _ = 0; _ < f; _++) r.append(c[_], ke()), Vt.nextNode(), l.push({ type: 2, index: ++n });
            r.append(c[f], ke());
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
    const i = Kt.createElement("template");
    return i.innerHTML = t, i;
  }
}
function re(a, t, e = a, i) {
  if (t === ie) return t;
  let r = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const n = Te(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(a), r._$AT(a, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = r : e._$Cl = r), r !== void 0 && (t = re(a, r._$AS(a, t.values), r, i)), t;
}
class qn {
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
    const { el: { content: e }, parts: i } = this._$AD, r = (t?.creationScope ?? Kt).importNode(e, !0);
    Vt.currentNode = r;
    let n = Vt.nextNode(), s = 0, o = 0, l = i[0];
    for (; l !== void 0; ) {
      if (s === l.index) {
        let h;
        l.type === 2 ? h = new Re(n, n.nextSibling, this, t) : l.type === 1 ? h = new l.ctor(n, l.name, l.strings, this, t) : l.type === 6 && (h = new Zn(n, this, t)), this._$AV.push(h), l = i[++o];
      }
      s !== l?.index && (n = Vt.nextNode(), s++);
    }
    return Vt.currentNode = Kt, r;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class Re {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, i, r) {
    this.type = 2, this._$AH = H, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    t = re(this, t, e), Te(t) ? t === H || t == null || t === "" ? (this._$AH !== H && this._$AR(), this._$AH = H) : t !== this._$AH && t !== ie && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Yn(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== H && Te(this._$AH) ? this._$AA.nextSibling.data = t : this.T(Kt.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = Ae.createElement(Er(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === r) this._$AH.p(e);
    else {
      const n = new qn(r, this), s = n.u(this.options);
      n.p(e), this.T(s), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = sr.get(t.strings);
    return e === void 0 && sr.set(t.strings, e = new Ae(t)), e;
  }
  k(t) {
    Si(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, r = 0;
    for (const n of t) r === e.length ? e.push(i = new Re(this.O(ke()), this.O(ke()), this, this.options)) : i = e[r], i._$AI(n), r++;
    r < e.length && (this._$AR(i && i._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = Ji(t).nextSibling;
      Ji(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class Ze {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, r, n) {
    this.type = 1, this._$AH = H, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = H;
  }
  _$AI(t, e = this, i, r) {
    const n = this.strings;
    let s = !1;
    if (n === void 0) t = re(this, t, e, 0), s = !Te(t) || t !== this._$AH && t !== ie, s && (this._$AH = t);
    else {
      const o = t;
      let l, h;
      for (t = n[0], l = 0; l < n.length - 1; l++) h = re(this, o[i + l], e, l), h === ie && (h = this._$AH[l]), s || (s = !Te(h) || h !== this._$AH[l]), h === H ? t = H : t !== H && (t += (h ?? "") + n[l + 1]), this._$AH[l] = h;
    }
    s && !r && this.j(t);
  }
  j(t) {
    t === H ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Wn extends Ze {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === H ? void 0 : t;
  }
}
class Xn extends Ze {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== H);
  }
}
class Gn extends Ze {
  constructor(t, e, i, r, n) {
    super(t, e, i, r, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = re(this, t, e, 0) ?? H) === ie) return;
    const i = this._$AH, r = t === H && i !== H || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, n = t !== H && (i === H || r);
    r && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Zn {
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
const Qn = ve.litHtmlPolyfillSupport;
Qn?.(Ae, Re), (ve.litHtmlVersions ?? (ve.litHtmlVersions = [])).push("3.3.2");
const Jn = (a, t, e) => {
  const i = e?.renderBefore ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const n = e?.renderBefore ?? null;
    i._$litPart$ = r = new Re(t.insertBefore(ke(), n), n, void 0, e ?? {});
  }
  return r._$AI(a), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ye = globalThis;
class be extends Xt {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Jn(e, this.renderRoot, this.renderOptions);
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
be._$litElement$ = !0, be.finalized = !0, ye.litElementHydrateSupport?.({ LitElement: be });
const ts = ye.litElementPolyfillSupport;
ts?.({ LitElement: be });
(ye.litElementVersions ?? (ye.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const es = { attribute: !0, type: String, converter: Be, reflect: !1, hasChanged: Ai }, is = (a = es, t, e) => {
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
function Or(a) {
  return (t, e) => typeof e == "object" ? is(a, t, e) : ((i, r, n) => {
    const s = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, i), s ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(a, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Mr(a) {
  return Or({ ...a, state: !0, attribute: !1 });
}
function vt(a) {
  if (a === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return a;
}
function Dr(a, t) {
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
}, Pi, j, D, ut = 1e8, $ = 1 / ut, ui = Math.PI * 2, rs = ui / 4, ns = 0, Rr = Math.sqrt, ss = Math.cos, os = Math.sin, Y = function(t) {
  return typeof t == "string";
}, F = function(t) {
  return typeof t == "function";
}, bt = function(t) {
  return typeof t == "number";
}, $i = function(t) {
  return typeof t > "u";
}, gt = function(t) {
  return typeof t == "object";
}, Z = function(t) {
  return t !== !1;
}, Ei = function() {
  return typeof window < "u";
}, Fe = function(t) {
  return F(t) || Y(t);
}, zr = typeof ArrayBuffer == "function" && ArrayBuffer.isView || function() {
}, X = Array.isArray, as = /random\([^)]+\)/g, ls = /,\s*/g, or = /(?:-?\.?\d|\.)+/gi, Lr = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g, Zt = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g, ii = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi, Fr = /[+-]=-?[.\d]+/, hs = /[^,'"\[\]\s]+/gi, us = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i, z, ft, ci, Oi, at = {}, Ye = {}, Nr, Vr = function(t) {
  return (Ye = se(t, at)) && et;
}, Mi = function(t, e) {
  return console.warn("Invalid property", t, "set to", e, "Missing plugin? gsap.registerPlugin()");
}, Se = function(t, e) {
  return !e && console.warn(t);
}, Ir = function(t, e) {
  return t && (at[t] = e) && Ye && (Ye[t] = e) || at;
}, Pe = function() {
  return 0;
}, cs = {
  suppressEvents: !0,
  isStart: !0,
  kill: !1
}, Ve = {
  suppressEvents: !0,
  kill: !1
}, ds = {
  suppressEvents: !0
}, Di = {}, St = [], di = {}, Ur, it = {}, ri = {}, ar = 30, Ie = [], Ri = "", zi = function(t) {
  var e = t[0], i, r;
  if (gt(e) || F(e) || (t = [t]), !(i = (e._gsap || {}).harness)) {
    for (r = Ie.length; r-- && !Ie[r].targetTest(e); )
      ;
    i = Ie[r];
  }
  for (r = t.length; r--; )
    t[r] && (t[r]._gsap || (t[r]._gsap = new dn(t[r], i))) || t.splice(r, 1);
  return t;
}, Ut = function(t) {
  return t._gsap || zi(ct(t))[0]._gsap;
}, Br = function(t, e, i) {
  return (i = t[e]) && F(i) ? t[e]() : $i(i) && t.getAttribute && t.getAttribute(e) || i;
}, Q = function(t, e) {
  return (t = t.split(",")).forEach(e) || t;
}, N = function(t) {
  return Math.round(t * 1e5) / 1e5 || 0;
}, R = function(t) {
  return Math.round(t * 1e7) / 1e7 || 0;
}, Jt = function(t, e) {
  var i = e.charAt(0), r = parseFloat(e.substr(2));
  return t = parseFloat(t), i === "+" ? t + r : i === "-" ? t - r : i === "*" ? t * r : t / r;
}, fs = function(t, e) {
  for (var i = e.length, r = 0; t.indexOf(e[r]) < 0 && ++r < i; )
    ;
  return r < i;
}, Ke = function() {
  var t = St.length, e = St.slice(0), i, r;
  for (di = {}, St.length = 0, i = 0; i < t; i++)
    r = e[i], r && r._lazy && (r.render(r._lazy[0], r._lazy[1], !0)._lazy = 0);
}, Li = function(t) {
  return !!(t._initted || t._startAt || t.add);
}, Hr = function(t, e, i, r) {
  St.length && !j && Ke(), t.render(e, i, !!(j && e < 0 && Li(t))), St.length && !j && Ke();
}, Yr = function(t) {
  var e = parseFloat(t);
  return (e || e === 0) && (t + "").match(hs).length < 2 ? e : Y(t) ? t.trim() : t;
}, Kr = function(t) {
  return t;
}, lt = function(t, e) {
  for (var i in e)
    i in t || (t[i] = e[i]);
  return t;
}, _s = function(t) {
  return function(e, i) {
    for (var r in i)
      r in e || r === "duration" && t || r === "ease" || (e[r] = i[r]);
  };
}, se = function(t, e) {
  for (var i in e)
    t[i] = e[i];
  return t;
}, lr = function a(t, e) {
  for (var i in e)
    i !== "__proto__" && i !== "constructor" && i !== "prototype" && (t[i] = gt(e[i]) ? a(t[i] || (t[i] = {}), e[i]) : e[i]);
  return t;
}, je = function(t, e) {
  var i = {}, r;
  for (r in t)
    r in e || (i[r] = t[r]);
  return i;
}, xe = function(t) {
  var e = t.parent || z, i = t.keyframes ? _s(X(t.keyframes)) : lt;
  if (Z(t.inherit))
    for (; e; )
      i(t, e.vars.defaults), e = e.parent || e._dp;
  return t;
}, ps = function(t, e) {
  for (var i = t.length, r = i === e.length; r && i-- && t[i] === e[i]; )
    ;
  return i < 0;
}, jr = function(t, e, i, r, n) {
  var s = t[r], o;
  if (n)
    for (o = e[n]; s && s[n] > o; )
      s = s._prev;
  return s ? (e._next = s._next, s._next = e) : (e._next = t[i], t[i] = e), e._next ? e._next._prev = e : t[r] = e, e._prev = s, e.parent = e._dp = t, e;
}, Qe = function(t, e, i, r) {
  i === void 0 && (i = "_first"), r === void 0 && (r = "_last");
  var n = e._prev, s = e._next;
  n ? n._next = s : t[i] === e && (t[i] = s), s ? s._prev = n : t[r] === e && (t[r] = n), e._next = e._prev = e.parent = null;
}, $t = function(t, e) {
  t.parent && (!e || t.parent.autoRemoveChildren) && t.parent.remove && t.parent.remove(t), t._act = 0;
}, Bt = function(t, e) {
  if (t && (!e || e._end > t._dur || e._start < 0))
    for (var i = t; i; )
      i._dirty = 1, i = i.parent;
  return t;
}, gs = function(t) {
  for (var e = t.parent; e && e.parent; )
    e._dirty = 1, e.totalDuration(), e = e.parent;
  return t;
}, fi = function(t, e, i, r) {
  return t._startAt && (j ? t._startAt.revert(Ve) : t.vars.immediateRender && !t.vars.autoRevert || t._startAt.render(e, !0, r));
}, ms = function a(t) {
  return !t || t._ts && a(t.parent);
}, hr = function(t) {
  return t._repeat ? oe(t._tTime, t = t.duration() + t._rDelay) * t : 0;
}, oe = function(t, e) {
  var i = Math.floor(t = R(t / e));
  return t && i === t ? i - 1 : i;
}, qe = function(t, e) {
  return (t - e._start) * e._ts + (e._ts >= 0 ? 0 : e._dirty ? e.totalDuration() : e._tDur);
}, Je = function(t) {
  return t._end = R(t._start + (t._tDur / Math.abs(t._ts || t._rts || $) || 0));
}, ti = function(t, e) {
  var i = t._dp;
  return i && i.smoothChildTiming && t._ts && (t._start = R(i._time - (t._ts > 0 ? e / t._ts : ((t._dirty ? t.totalDuration() : t._tDur) - e) / -t._ts)), Je(t), i._dirty || Bt(i, t)), t;
}, qr = function(t, e) {
  var i;
  if ((e._time || !e._dur && e._initted || e._start < t._time && (e._dur || !e.add)) && (i = qe(t.rawTime(), e), (!e._dur || ze(0, e.totalDuration(), i) - e._tTime > $) && e.render(i, !0)), Bt(t, e)._dp && t._initted && t._time >= t._dur && t._ts) {
    if (t._dur < t.duration())
      for (i = t; i._dp; )
        i.rawTime() >= 0 && i.totalTime(i._tTime), i = i._dp;
    t._zTime = -$;
  }
}, _t = function(t, e, i, r) {
  return e.parent && $t(e), e._start = R((bt(i) ? i : i || t !== z ? ht(t, i, e) : t._time) + e._delay), e._end = R(e._start + (e.totalDuration() / Math.abs(e.timeScale()) || 0)), jr(t, e, "_first", "_last", t._sort ? "_start" : 0), _i(e) || (t._recent = e), r || qr(t, e), t._ts < 0 && ti(t, t._tTime), t;
}, Wr = function(t, e) {
  return (at.ScrollTrigger || Mi("scrollTrigger", e)) && at.ScrollTrigger.create(e, t);
}, Xr = function(t, e, i, r, n) {
  if (Ni(t, e, n), !t._initted)
    return 1;
  if (!i && t._pt && !j && (t._dur && t.vars.lazy !== !1 || !t._dur && t.vars.lazy) && Ur !== rt.frame)
    return St.push(t), t._lazy = [n, r], 1;
}, vs = function a(t) {
  var e = t.parent;
  return e && e._ts && e._initted && !e._lock && (e.rawTime() < 0 || a(e));
}, _i = function(t) {
  var e = t.data;
  return e === "isFromStart" || e === "isStart";
}, ys = function(t, e, i, r) {
  var n = t.ratio, s = e < 0 || !e && (!t._start && vs(t) && !(!t._initted && _i(t)) || (t._ts < 0 || t._dp._ts < 0) && !_i(t)) ? 0 : 1, o = t._rDelay, l = 0, h, u, c;
  if (o && t._repeat && (l = ze(0, t._tDur, e), u = oe(l, o), t._yoyo && u & 1 && (s = 1 - s), u !== oe(t._tTime, o) && (n = 1 - s, t.vars.repeatRefresh && t._initted && t.invalidate())), s !== n || j || r || t._zTime === $ || !e && t._zTime) {
    if (!t._initted && Xr(t, e, r, i, l))
      return;
    for (c = t._zTime, t._zTime = e || (i ? $ : 0), i || (i = e && !c), t.ratio = s, t._from && (s = 1 - s), t._time = 0, t._tTime = l, h = t._pt; h; )
      h.r(s, h.d), h = h._next;
    e < 0 && fi(t, e, i, !0), t._onUpdate && !i && nt(t, "onUpdate"), l && t._repeat && !i && t.parent && nt(t, "onRepeat"), (e >= t._tDur || e < 0) && t.ratio === s && (s && $t(t, 1), !i && !j && (nt(t, s ? "onComplete" : "onReverseComplete", !0), t._prom && t._prom()));
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
  var n = t._repeat, s = R(e) || 0, o = t._tTime / t._tDur;
  return o && !r && (t._time *= s / t._dur), t._dur = s, t._tDur = n ? n < 0 ? 1e10 : R(s * (n + 1) + t._rDelay * n) : s, o > 0 && !r && ti(t, t._tTime = t._tDur * o), t.parent && Je(t), i || Bt(t.parent, t), t;
}, ur = function(t) {
  return t instanceof G ? Bt(t) : ae(t, t._dur);
}, xs = {
  _start: 0,
  endTime: Pe,
  totalDuration: Pe
}, ht = function a(t, e, i) {
  var r = t.labels, n = t._recent || xs, s = t.duration() >= ut ? n.endTime(!1) : t._dur, o, l, h;
  return Y(e) && (isNaN(e) || e in r) ? (l = e.charAt(0), h = e.substr(-1) === "%", o = e.indexOf("="), l === "<" || l === ">" ? (o >= 0 && (e = e.replace(/=/, "")), (l === "<" ? n._start : n.endTime(n._repeat >= 0)) + (parseFloat(e.substr(1)) || 0) * (h ? (o < 0 ? n : i).totalDuration() / 100 : 1)) : o < 0 ? (e in r || (r[e] = s), r[e]) : (l = parseFloat(e.charAt(o - 1) + e.substr(o + 1)), h && i && (l = l / 100 * (X(i) ? i[0] : i).totalDuration()), o > 1 ? a(t, e.substr(0, o - 1), i) + l : s + l)) : e == null ? s : +e;
}, we = function(t, e, i) {
  var r = bt(e[1]), n = (r ? 2 : 1) + (t < 2 ? 0 : 1), s = e[n], o, l;
  if (r && (s.duration = e[1]), s.parent = i, t) {
    for (o = s, l = i; l && !("immediateRender" in o); )
      o = l.vars.defaults || {}, l = Z(l.vars.inherit) && l.parent;
    s.immediateRender = Z(o.immediateRender), t < 2 ? s.runBackwards = 1 : s.startAt = e[n - 1];
  }
  return new I(e[0], s, e[n + 1]);
}, Mt = function(t, e) {
  return t || t === 0 ? e(t) : e;
}, ze = function(t, e, i) {
  return i < t ? t : i > e ? e : i;
}, W = function(t, e) {
  return !Y(t) || !(e = us.exec(t)) ? "" : e[1];
}, ws = function(t, e, i) {
  return Mt(i, function(r) {
    return ze(t, e, r);
  });
}, pi = [].slice, Gr = function(t, e) {
  return t && gt(t) && "length" in t && (!e && !t.length || t.length - 1 in t && gt(t[0])) && !t.nodeType && t !== ft;
}, Cs = function(t, e, i) {
  return i === void 0 && (i = []), t.forEach(function(r) {
    var n;
    return Y(r) && !e || Gr(r, 1) ? (n = i).push.apply(n, ct(r)) : i.push(r);
  }) || i;
}, ct = function(t, e, i) {
  return D && !e && D.selector ? D.selector(t) : Y(t) && !i && (ci || !le()) ? pi.call((e || Oi).querySelectorAll(t), 0) : X(t) ? Cs(t, i) : Gr(t) ? pi.call(t, 0) : t ? [t] : [];
}, gi = function(t) {
  return t = ct(t)[0] || Se("Invalid scope") || {}, function(e) {
    var i = t.current || t.nativeElement || t;
    return ct(e, i.querySelectorAll ? i : i === t ? Se("Invalid scope") || Oi.createElement("div") : t);
  };
}, Zr = function(t) {
  return t.sort(function() {
    return 0.5 - Math.random();
  });
}, Qr = function(t) {
  if (F(t))
    return t;
  var e = gt(t) ? t : {
    each: t
  }, i = Ht(e.ease), r = e.from || 0, n = parseFloat(e.base) || 0, s = {}, o = r > 0 && r < 1, l = isNaN(r) || o, h = e.axis, u = r, c = r;
  return Y(r) ? u = c = {
    center: 0.5,
    edges: 0.5,
    end: 1
  }[r] || 0 : !o && l && (u = r[0], c = r[1]), function(f, _, p) {
    var d = (p || e).length, g = s[d], v, y, x, w, m, C, k, T, b;
    if (!g) {
      if (b = e.grid === "auto" ? 0 : (e.grid || [1, ut])[1], !b) {
        for (k = -ut; k < (k = p[b++].getBoundingClientRect().left) && b < d; )
          ;
        b < d && b--;
      }
      for (g = s[d] = [], v = l ? Math.min(b, d) * u - 0.5 : r % b, y = b === ut ? 0 : l ? d * c / b - 0.5 : r / b | 0, k = 0, T = ut, C = 0; C < d; C++)
        x = C % b - v, w = y - (C / b | 0), g[C] = m = h ? Math.abs(h === "y" ? w : x) : Rr(x * x + w * w), m > k && (k = m), m < T && (T = m);
      r === "random" && Zr(g), g.max = k - T, g.min = T, g.v = d = (parseFloat(e.amount) || parseFloat(e.each) * (b > d ? d - 1 : h ? h === "y" ? d / b : b : Math.max(b, d / b)) || 0) * (r === "edges" ? -1 : 1), g.b = d < 0 ? n - d : n, g.u = W(e.amount || e.each) || 0, i = i && d < 0 ? hn(i) : i;
    }
    return d = (g[f] - g.min) / g.max || 0, R(g.b + (i ? i(d) : d) * g.v) + g.u;
  };
}, mi = function(t) {
  var e = Math.pow(10, ((t + "").split(".")[1] || "").length);
  return function(i) {
    var r = R(Math.round(parseFloat(i) / t) * t * e);
    return (r - r % 1) / e + (bt(i) ? 0 : W(i));
  };
}, Jr = function(t, e) {
  var i = X(t), r, n;
  return !i && gt(t) && (r = i = t.radius || ut, t.values ? (t = ct(t.values), (n = !bt(t[0])) && (r *= r)) : t = mi(t.increment)), Mt(e, i ? F(t) ? function(s) {
    return n = t(s), Math.abs(n - s) <= r ? n : s;
  } : function(s) {
    for (var o = parseFloat(n ? s.x : s), l = parseFloat(n ? s.y : 0), h = ut, u = 0, c = t.length, f, _; c--; )
      n ? (f = t[c].x - o, _ = t[c].y - l, f = f * f + _ * _) : f = Math.abs(t[c] - o), f < h && (h = f, u = c);
    return u = !r || h <= r ? t[u] : s, n || u === s || bt(s) ? u : u + W(s);
  } : mi(t));
}, tn = function(t, e, i, r) {
  return Mt(X(t) ? !e : i === !0 ? !!(i = 0) : !r, function() {
    return X(t) ? t[~~(Math.random() * t.length)] : (i = i || 1e-5) && (r = i < 1 ? Math.pow(10, (i + "").length - 2) : 1) && Math.floor(Math.round((t - i / 2 + Math.random() * (e - t + i * 0.99)) / i) * i * r) / r;
  });
}, ks = function() {
  for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++)
    e[i] = arguments[i];
  return function(r) {
    return e.reduce(function(n, s) {
      return s(n);
    }, r);
  };
}, Ts = function(t, e) {
  return function(i) {
    return t(parseFloat(i)) + (e || W(i));
  };
}, As = function(t, e, i) {
  return rn(t, e, 0, 1, i);
}, en = function(t, e, i) {
  return Mt(i, function(r) {
    return t[~~e(r)];
  });
}, Ss = function a(t, e, i) {
  var r = e - t;
  return X(t) ? en(t, a(0, t.length), e) : Mt(i, function(n) {
    return (r + (n - t) % r) % r + t;
  });
}, Ps = function a(t, e, i) {
  var r = e - t, n = r * 2;
  return X(t) ? en(t, a(0, t.length - 1), e) : Mt(i, function(s) {
    return s = (n + (s - t) % n) % n || 0, t + (s > r ? n - s : s);
  });
}, $e = function(t) {
  return t.replace(as, function(e) {
    var i = e.indexOf("[") + 1, r = e.substring(i || 7, i ? e.indexOf("]") : e.length - 1).split(ls);
    return tn(i ? r : +r[0], i ? 0 : +r[1], +r[2] || 1e-5);
  });
}, rn = function(t, e, i, r, n) {
  var s = e - t, o = r - i;
  return Mt(n, function(l) {
    return i + ((l - t) / s * o || 0);
  });
}, $s = function a(t, e, i, r) {
  var n = isNaN(t + e) ? 0 : function(_) {
    return (1 - _) * t + _ * e;
  };
  if (!n) {
    var s = Y(t), o = {}, l, h, u, c, f;
    if (i === !0 && (r = 1) && (i = null), s)
      t = {
        p: t
      }, e = {
        p: e
      };
    else if (X(t) && !X(e)) {
      for (u = [], c = t.length, f = c - 2, h = 1; h < c; h++)
        u.push(a(t[h - 1], t[h]));
      c--, n = function(p) {
        p *= c;
        var d = Math.min(f, ~~p);
        return u[d](p - d);
      }, i = e;
    } else r || (t = se(X(t) ? [] : {}, t));
    if (!u) {
      for (l in e)
        Fi.call(o, t, l, "get", e[l]);
      n = function(p) {
        return Ui(p, o) || (s ? t.p : t);
      };
    }
  }
  return Mt(i, n);
}, cr = function(t, e, i) {
  var r = t.labels, n = ut, s, o, l;
  for (s in r)
    o = r[s] - e, o < 0 == !!i && o && n > (o = Math.abs(o)) && (l = s, n = o);
  return l;
}, nt = function(t, e, i) {
  var r = t.vars, n = r[e], s = D, o = t._ctx, l, h, u;
  if (n)
    return l = r[e + "Params"], h = r.callbackScope || t, i && St.length && Ke(), o && (D = o), u = l ? n.apply(h, l) : n.call(h), D = s, u;
}, pe = function(t) {
  return $t(t), t.scrollTrigger && t.scrollTrigger.kill(!!j), t.progress() < 1 && nt(t, "onInterrupt"), t;
}, Qt, nn = [], sn = function(t) {
  if (t)
    if (t = !t.name && t.default || t, Ei() || t.headless) {
      var e = t.name, i = F(t), r = e && !i && t.init ? function() {
        this._props = [];
      } : t, n = {
        init: Pe,
        render: Ui,
        add: Fi,
        kill: Ks,
        modifier: Ys,
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
        lt(r, lt(je(t, n), s)), se(r.prototype, se(n, je(t, s))), it[r.prop = e] = r, t.targetTest && (Ie.push(r), Di[e] = 1), e = (e === "css" ? "CSS" : e.charAt(0).toUpperCase() + e.substr(1)) + "Plugin";
      }
      Ir(e, r), t.register && t.register(et, r, J);
    } else
      nn.push(t);
}, P = 255, ge = {
  aqua: [0, P, P],
  lime: [0, P, 0],
  silver: [192, 192, 192],
  black: [0, 0, 0],
  maroon: [128, 0, 0],
  teal: [0, 128, 128],
  blue: [0, 0, P],
  navy: [0, 0, 128],
  white: [P, P, P],
  olive: [128, 128, 0],
  yellow: [P, P, 0],
  orange: [P, 165, 0],
  gray: [128, 128, 128],
  purple: [128, 0, 128],
  green: [0, 128, 0],
  red: [P, 0, 0],
  pink: [P, 192, 203],
  cyan: [0, P, P],
  transparent: [P, P, P, 0]
}, ni = function(t, e, i) {
  return t += t < 0 ? 1 : t > 1 ? -1 : 0, (t * 6 < 1 ? e + (i - e) * t * 6 : t < 0.5 ? i : t * 3 < 2 ? e + (i - e) * (2 / 3 - t) * 6 : e) * P + 0.5 | 0;
}, on = function(t, e, i) {
  var r = t ? bt(t) ? [t >> 16, t >> 8 & P, t & P] : 0 : ge.black, n, s, o, l, h, u, c, f, _, p;
  if (!r) {
    if (t.substr(-1) === "," && (t = t.substr(0, t.length - 1)), ge[t])
      r = ge[t];
    else if (t.charAt(0) === "#") {
      if (t.length < 6 && (n = t.charAt(1), s = t.charAt(2), o = t.charAt(3), t = "#" + n + n + s + s + o + o + (t.length === 5 ? t.charAt(4) + t.charAt(4) : "")), t.length === 9)
        return r = parseInt(t.substr(1, 6), 16), [r >> 16, r >> 8 & P, r & P, parseInt(t.substr(7), 16) / 255];
      t = parseInt(t.substr(1), 16), r = [t >> 16, t >> 8 & P, t & P];
    } else if (t.substr(0, 3) === "hsl") {
      if (r = p = t.match(or), !e)
        l = +r[0] % 360 / 360, h = +r[1] / 100, u = +r[2] / 100, s = u <= 0.5 ? u * (h + 1) : u + h - u * h, n = u * 2 - s, r.length > 3 && (r[3] *= 1), r[0] = ni(l + 1 / 3, n, s), r[1] = ni(l, n, s), r[2] = ni(l - 1 / 3, n, s);
      else if (~t.indexOf("="))
        return r = t.match(Lr), i && r.length < 4 && (r[3] = 1), r;
    } else
      r = t.match(or) || ge.transparent;
    r = r.map(Number);
  }
  return e && !p && (n = r[0] / P, s = r[1] / P, o = r[2] / P, c = Math.max(n, s, o), f = Math.min(n, s, o), u = (c + f) / 2, c === f ? l = h = 0 : (_ = c - f, h = u > 0.5 ? _ / (2 - c - f) : _ / (c + f), l = c === n ? (s - o) / _ + (s < o ? 6 : 0) : c === s ? (o - n) / _ + 2 : (n - s) / _ + 4, l *= 60), r[0] = ~~(l + 0.5), r[1] = ~~(h * 100 + 0.5), r[2] = ~~(u * 100 + 0.5)), i && r.length < 4 && (r[3] = 1), r;
}, an = function(t) {
  var e = [], i = [], r = -1;
  return t.split(Pt).forEach(function(n) {
    var s = n.match(Zt) || [];
    e.push.apply(e, s), i.push(r += s.length + 1);
  }), e.c = i, e;
}, dr = function(t, e, i) {
  var r = "", n = (t + r).match(Pt), s = e ? "hsla(" : "rgba(", o = 0, l, h, u, c;
  if (!n)
    return t;
  if (n = n.map(function(f) {
    return (f = on(f, e, 1)) && s + (e ? f[0] + "," + f[1] + "%," + f[2] + "%," + f[3] : f.join(",")) + ")";
  }), i && (u = an(t), l = i.c, l.join(r) !== u.c.join(r)))
    for (h = t.replace(Pt, "1").split(Zt), c = h.length - 1; o < c; o++)
      r += h[o] + (~l.indexOf(o) ? n.shift() || s + "0,0,0,0)" : (u.length ? u : n.length ? n : i).shift());
  if (!h)
    for (h = t.split(Pt), c = h.length - 1; o < c; o++)
      r += h[o] + n[o];
  return r + h[c];
}, Pt = (function() {
  var a = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", t;
  for (t in ge)
    a += "|" + t + "\\b";
  return new RegExp(a + ")", "gi");
})(), Es = /hsl[a]?\(/, ln = function(t) {
  var e = t.join(" "), i;
  if (Pt.lastIndex = 0, Pt.test(e))
    return i = Es.test(e), t[1] = dr(t[1], i), t[0] = dr(t[0], i, an(t[1])), !0;
}, Ee, rt = (function() {
  var a = Date.now, t = 500, e = 33, i = a(), r = i, n = 1e3 / 240, s = n, o = [], l, h, u, c, f, _, p = function d(g) {
    var v = a() - r, y = g === !0, x, w, m, C;
    if ((v > t || v < 0) && (i += v - e), r += v, m = r - i, x = m - s, (x > 0 || y) && (C = ++c.frame, f = m - c.time * 1e3, c.time = m = m / 1e3, s += x + (x >= n ? 4 : n - x), w = 1), y || (l = h(d)), w)
      for (_ = 0; _ < o.length; _++)
        o[_](m, f, C, g);
  };
  return c = {
    time: 0,
    frame: 0,
    tick: function() {
      p(!0);
    },
    deltaRatio: function(g) {
      return f / (1e3 / (g || 60));
    },
    wake: function() {
      Nr && (!ci && Ei() && (ft = ci = window, Oi = ft.document || {}, at.gsap = et, (ft.gsapVersions || (ft.gsapVersions = [])).push(et.version), Vr(Ye || ft.GreenSockGlobals || !ft.gsap && ft || {}), nn.forEach(sn)), u = typeof requestAnimationFrame < "u" && requestAnimationFrame, l && c.sleep(), h = u || function(g) {
        return setTimeout(g, s - c.time * 1e3 + 1 | 0);
      }, Ee = 1, p(2));
    },
    sleep: function() {
      (u ? cancelAnimationFrame : clearTimeout)(l), Ee = 0, h = Pe;
    },
    lagSmoothing: function(g, v) {
      t = g || 1 / 0, e = Math.min(v || 33, t);
    },
    fps: function(g) {
      n = 1e3 / (g || 240), s = c.time * 1e3 + n;
    },
    add: function(g, v, y) {
      var x = v ? function(w, m, C, k) {
        g(w, m, C, k), c.remove(x);
      } : g;
      return c.remove(g), o[y ? "unshift" : "push"](x), le(), x;
    },
    remove: function(g, v) {
      ~(v = o.indexOf(g)) && o.splice(v, 1) && _ >= v && _--;
    },
    _listeners: o
  }, c;
})(), le = function() {
  return !Ee && rt.wake();
}, A = {}, Os = /^[\d.\-M][\d.\-,\s]/, Ms = /["']/g, Ds = function(t) {
  for (var e = {}, i = t.substr(1, t.length - 3).split(":"), r = i[0], n = 1, s = i.length, o, l, h; n < s; n++)
    l = i[n], o = n !== s - 1 ? l.lastIndexOf(",") : l.length, h = l.substr(0, o), e[r] = isNaN(h) ? h.replace(Ms, "").trim() : +h, r = l.substr(o + 1).trim();
  return e;
}, Rs = function(t) {
  var e = t.indexOf("(") + 1, i = t.indexOf(")"), r = t.indexOf("(", e);
  return t.substring(e, ~r && r < i ? t.indexOf(")", i + 1) : i);
}, zs = function(t) {
  var e = (t + "").split("("), i = A[e[0]];
  return i && e.length > 1 && i.config ? i.config.apply(null, ~t.indexOf("{") ? [Ds(e[1])] : Rs(t).split(",").map(Yr)) : A._CE && Os.test(t) ? A._CE("", t) : i;
}, hn = function(t) {
  return function(e) {
    return 1 - t(1 - e);
  };
}, un = function a(t, e) {
  for (var i = t._first, r; i; )
    i instanceof G ? a(i, e) : i.vars.yoyoEase && (!i._yoyo || !i._repeat) && i._yoyo !== e && (i.timeline ? a(i.timeline, e) : (r = i._ease, i._ease = i._yEase, i._yEase = r, i._yoyo = e)), i = i._next;
}, Ht = function(t, e) {
  return t && (F(t) ? t : A[t] || zs(t)) || e;
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
  return Q(t, function(o) {
    A[o] = at[o] = n, A[s = o.toLowerCase()] = i;
    for (var l in n)
      A[s + (l === "easeIn" ? ".in" : l === "easeOut" ? ".out" : ".inOut")] = A[o + "." + l] = n[l];
  }), n;
}, cn = function(t) {
  return function(e) {
    return e < 0.5 ? (1 - t(1 - e * 2)) / 2 : 0.5 + t((e - 0.5) * 2) / 2;
  };
}, si = function a(t, e, i) {
  var r = e >= 1 ? e : 1, n = (i || (t ? 0.3 : 0.45)) / (e < 1 ? e : 1), s = n / ui * (Math.asin(1 / r) || 0), o = function(u) {
    return u === 1 ? 1 : r * Math.pow(2, -10 * u) * os((u - s) * n) + 1;
  }, l = t === "out" ? o : t === "in" ? function(h) {
    return 1 - o(1 - h);
  } : cn(o);
  return n = ui / n, l.config = function(h, u) {
    return a(t, h, u);
  }, l;
}, oi = function a(t, e) {
  e === void 0 && (e = 1.70158);
  var i = function(s) {
    return s ? --s * s * ((e + 1) * s + e) + 1 : 0;
  }, r = t === "out" ? i : t === "in" ? function(n) {
    return 1 - i(1 - n);
  } : cn(i);
  return r.config = function(n) {
    return a(t, n);
  }, r;
};
Q("Linear,Quad,Cubic,Quart,Quint,Strong", function(a, t) {
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
A.Linear.easeNone = A.none = A.Linear.easeIn;
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
  return -(Rr(1 - a * a) - 1);
});
jt("Sine", function(a) {
  return a === 1 ? 1 : -ss(a * rs) + 1;
});
jt("Back", oi("in"), oi("out"), oi());
A.SteppedEase = A.steps = at.SteppedEase = {
  config: function(t, e) {
    t === void 0 && (t = 1);
    var i = 1 / t, r = t + (e ? 0 : 1), n = e ? 1 : 0, s = 1 - $;
    return function(o) {
      return ((r * ze(0, s, o) | 0) + n) * i;
    };
  }
};
ne.ease = A["quad.out"];
Q("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(a) {
  return Ri += a + "," + a + "Params,";
});
var dn = function(t, e) {
  this.id = ns++, t._gsap = this, this.target = t, this.harness = e, this.get = e ? e.get : Br, this.set = e ? e.getSetter : Ii;
}, Oe = /* @__PURE__ */ (function() {
  function a(e) {
    this.vars = e, this._delay = +e.delay || 0, (this._repeat = e.repeat === 1 / 0 ? -2 : e.repeat || 0) && (this._rDelay = e.repeatDelay || 0, this._yoyo = !!e.yoyo || !!e.yoyoEase), this._ts = 1, ae(this, +e.duration, 1, 1), this.data = e.data, D && (this._ctx = D, D.data.push(this)), Ee || rt.wake();
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
      for (ti(this, i), !n._dp || n.parent || qr(n, this); n && n.parent; )
        n.parent._time !== n._start + (n._ts >= 0 ? n._tTime / n._ts : (n.totalDuration() - n._tTime) / -n._ts) && n.totalTime(n._tTime, !0), n = n.parent;
      !this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && i < this._tDur || this._ts < 0 && i > 0 || !this._tDur && !i) && _t(this._dp, this, this._start - this._delay);
    }
    return (this._tTime !== i || !this._dur && !r || this._initted && Math.abs(this._zTime) === $ || !this._initted && this._dur && i || !i && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = i), Hr(this, i, r)), this;
  }, t.time = function(i, r) {
    return arguments.length ? this.totalTime(Math.min(this.totalDuration(), i + hr(this)) % (this._dur + this._rDelay) || (i ? this._dur : 0), r) : this._time;
  }, t.totalProgress = function(i, r) {
    return arguments.length ? this.totalTime(this.totalDuration() * i, r) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() >= 0 && this._initted ? 1 : 0;
  }, t.progress = function(i, r) {
    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - i : i) + hr(this), r) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0;
  }, t.iteration = function(i, r) {
    var n = this.duration() + this._rDelay;
    return arguments.length ? this.totalTime(this._time + (i - 1) * n, r) : this._repeat ? oe(this._tTime, n) + 1 : 1;
  }, t.timeScale = function(i, r) {
    if (!arguments.length)
      return this._rts === -$ ? 0 : this._rts;
    if (this._rts === i)
      return this;
    var n = this.parent && this._ts ? qe(this.parent._time, this) : this._tTime;
    return this._rts = +i || 0, this._ts = this._ps || i === -$ ? 0 : this._rts, this.totalTime(ze(-Math.abs(this._delay), this.totalDuration(), n), r !== !1), Je(this), gs(this);
  }, t.paused = function(i) {
    return arguments.length ? (this._ps !== i && (this._ps = i, i ? (this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0) : (le(), this._ts = this._rts, this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== $ && (this._tTime -= $)))), this) : this._ps;
  }, t.startTime = function(i) {
    if (arguments.length) {
      this._start = R(i);
      var r = this.parent || this._dp;
      return r && (r._sort || !this.parent) && _t(r, this, this._start - this._delay), this;
    }
    return this._start;
  }, t.endTime = function(i) {
    return this._start + (Z(i) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
  }, t.rawTime = function(i) {
    var r = this.parent || this._dp;
    return r ? i && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? qe(r.rawTime(i), this) : this._tTime : this._tTime;
  }, t.revert = function(i) {
    i === void 0 && (i = ds);
    var r = j;
    return j = i, Li(this) && (this.timeline && this.timeline.revert(i), this.totalTime(-0.01, i.suppressEvents)), this.data !== "nested" && i.kill !== !1 && this.kill(), j = r, this;
  }, t.globalTime = function(i) {
    for (var r = this, n = arguments.length ? i : r.rawTime(); r; )
      n = r._start + n / (Math.abs(r._ts) || 1), r = r._dp;
    return !this.parent && this._sat ? this._sat.globalTime(i) : n;
  }, t.repeat = function(i) {
    return arguments.length ? (this._repeat = i === 1 / 0 ? -2 : i, ur(this)) : this._repeat === -2 ? 1 / 0 : this._repeat;
  }, t.repeatDelay = function(i) {
    if (arguments.length) {
      var r = this._time;
      return this._rDelay = i, ur(this), r ? this.time(r) : this;
    }
    return this._rDelay;
  }, t.yoyo = function(i) {
    return arguments.length ? (this._yoyo = i, this) : this._yoyo;
  }, t.seek = function(i, r) {
    return this.totalTime(ht(this, i), Z(r));
  }, t.restart = function(i, r) {
    return this.play().totalTime(i ? -this._delay : 0, Z(r)), this._dur || (this._zTime = -$), this;
  }, t.play = function(i, r) {
    return i != null && this.seek(i, r), this.reversed(!1).paused(!1);
  }, t.reverse = function(i, r) {
    return i != null && this.seek(i || this.totalDuration(), r), this.reversed(!0).paused(!1);
  }, t.pause = function(i, r) {
    return i != null && this.seek(i, r), this.paused(!0);
  }, t.resume = function() {
    return this.paused(!1);
  }, t.reversed = function(i) {
    return arguments.length ? (!!i !== this.reversed() && this.timeScale(-this._rts || (i ? -$ : 0)), this) : this._rts < 0;
  }, t.invalidate = function() {
    return this._initted = this._act = 0, this._zTime = -$, this;
  }, t.isActive = function() {
    var i = this.parent || this._dp, r = this._start, n;
    return !!(!i || this._ts && this._initted && i.isActive() && (n = i.rawTime(!0)) >= r && n < this.endTime(!0) - $);
  }, t.eventCallback = function(i, r, n) {
    var s = this.vars;
    return arguments.length > 1 ? (r ? (s[i] = r, n && (s[i + "Params"] = n), i === "onUpdate" && (this._onUpdate = r)) : delete s[i], this) : s[i];
  }, t.then = function(i) {
    var r = this, n = r._prom;
    return new Promise(function(s) {
      var o = F(i) ? i : Kr, l = function() {
        var u = r.then;
        r.then = null, n && n(), F(o) && (o = o(r)) && (o.then || o === r) && (r.then = u), s(o), r.then = u;
      };
      r._initted && r.totalProgress() === 1 && r._ts >= 0 || !r._tTime && r._ts < 0 ? l() : r._prom = l;
    });
  }, t.kill = function() {
    pe(this);
  }, a;
})();
lt(Oe.prototype, {
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
  _zTime: -$,
  _prom: 0,
  _ps: !1,
  _rts: 1
});
var G = /* @__PURE__ */ (function(a) {
  Dr(t, a);
  function t(i, r) {
    var n;
    return i === void 0 && (i = {}), n = a.call(this, i) || this, n.labels = {}, n.smoothChildTiming = !!i.smoothChildTiming, n.autoRemoveChildren = !!i.autoRemoveChildren, n._sort = Z(i.sortChildren), z && _t(i.parent || z, vt(n), r), i.reversed && n.reverse(), i.paused && n.paused(!0), i.scrollTrigger && Wr(vt(n), i.scrollTrigger), n;
  }
  var e = t.prototype;
  return e.to = function(r, n, s) {
    return we(0, arguments, this), this;
  }, e.from = function(r, n, s) {
    return we(1, arguments, this), this;
  }, e.fromTo = function(r, n, s, o) {
    return we(2, arguments, this), this;
  }, e.set = function(r, n, s) {
    return n.duration = 0, n.parent = this, xe(n).repeatDelay || (n.repeat = 0), n.immediateRender = !!n.immediateRender, new I(r, n, ht(this, s), 1), this;
  }, e.call = function(r, n, s) {
    return _t(this, I.delayedCall(0, r, n), s);
  }, e.staggerTo = function(r, n, s, o, l, h, u) {
    return s.duration = n, s.stagger = s.stagger || o, s.onComplete = h, s.onCompleteParams = u, s.parent = this, new I(r, s, ht(this, l)), this;
  }, e.staggerFrom = function(r, n, s, o, l, h, u) {
    return s.runBackwards = 1, xe(s).immediateRender = Z(s.immediateRender), this.staggerTo(r, n, s, o, l, h, u);
  }, e.staggerFromTo = function(r, n, s, o, l, h, u, c) {
    return o.startAt = s, xe(o).immediateRender = Z(o.immediateRender), this.staggerTo(r, n, o, l, h, u, c);
  }, e.render = function(r, n, s) {
    var o = this._time, l = this._dirty ? this.totalDuration() : this._tDur, h = this._dur, u = r <= 0 ? 0 : R(r), c = this._zTime < 0 != r < 0 && (this._initted || !h), f, _, p, d, g, v, y, x, w, m, C, k;
    if (this !== z && u > l && r >= 0 && (u = l), u !== this._tTime || s || c) {
      if (o !== this._time && h && (u += this._time - o, r += this._time - o), f = u, w = this._start, x = this._ts, v = !x, c && (h || (o = this._zTime), (r || !n) && (this._zTime = r)), this._repeat) {
        if (C = this._yoyo, g = h + this._rDelay, this._repeat < -1 && r < 0)
          return this.totalTime(g * 100 + r, n, s);
        if (f = R(u % g), u === l ? (d = this._repeat, f = h) : (m = R(u / g), d = ~~m, d && d === m && (f = h, d--), f > h && (f = h)), m = oe(this._tTime, g), !o && this._tTime && m !== d && this._tTime - m * g - this._dur <= 0 && (m = d), C && d & 1 && (f = h - f, k = 1), d !== m && !this._lock) {
          var T = C && m & 1, b = T === (C && d & 1);
          if (d < m && (T = !T), o = T ? 0 : u % h ? h : u, this._lock = 1, this.render(o || (k ? 0 : R(d * g)), n, !h)._lock = 0, this._tTime = u, !n && this.parent && nt(this, "onRepeat"), this.vars.repeatRefresh && !k && (this.invalidate()._lock = 1, m = d), o && o !== this._time || v !== !this._ts || this.vars.onRepeat && !this.parent && !this._act)
            return this;
          if (h = this._dur, l = this._tDur, b && (this._lock = 2, o = T ? h : -1e-4, this.render(o, !0), this.vars.repeatRefresh && !k && this.invalidate()), this._lock = 0, !this._ts && !v)
            return this;
          un(this, k);
        }
      }
      if (this._hasPause && !this._forcing && this._lock < 2 && (y = bs(this, R(o), R(f)), y && (u -= f - (f = y._start))), this._tTime = u, this._time = f, this._act = !x, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = r, o = 0), !o && u && h && !n && !m && (nt(this, "onStart"), this._tTime !== u))
        return this;
      if (f >= o && r >= 0)
        for (_ = this._first; _; ) {
          if (p = _._next, (_._act || f >= _._start) && _._ts && y !== _) {
            if (_.parent !== this)
              return this.render(r, n, s);
            if (_.render(_._ts > 0 ? (f - _._start) * _._ts : (_._dirty ? _.totalDuration() : _._tDur) + (f - _._start) * _._ts, n, s), f !== this._time || !this._ts && !v) {
              y = 0, p && (u += this._zTime = -$);
              break;
            }
          }
          _ = p;
        }
      else {
        _ = this._last;
        for (var S = r < 0 ? r : f; _; ) {
          if (p = _._prev, (_._act || S <= _._end) && _._ts && y !== _) {
            if (_.parent !== this)
              return this.render(r, n, s);
            if (_.render(_._ts > 0 ? (S - _._start) * _._ts : (_._dirty ? _.totalDuration() : _._tDur) + (S - _._start) * _._ts, n, s || j && Li(_)), f !== this._time || !this._ts && !v) {
              y = 0, p && (u += this._zTime = S ? -$ : $);
              break;
            }
          }
          _ = p;
        }
      }
      if (y && !n && (this.pause(), y.render(f >= o ? 0 : -$)._zTime = f >= o ? 1 : -1, this._ts))
        return this._start = w, Je(this), this.render(r, n, s);
      this._onUpdate && !n && nt(this, "onUpdate", !0), (u === l && this._tTime >= this.totalDuration() || !u && o) && (w === this._start || Math.abs(x) !== Math.abs(this._ts)) && (this._lock || ((r || !h) && (u === l && this._ts > 0 || !u && this._ts < 0) && $t(this, 1), !n && !(r < 0 && !o) && (u || o || !l) && (nt(this, u === l && r >= 0 ? "onComplete" : "onReverseComplete", !0), this._prom && !(u < l && this.timeScale() > 0) && this._prom())));
    }
    return this;
  }, e.add = function(r, n) {
    var s = this;
    if (bt(n) || (n = ht(this, n, r)), !(r instanceof Oe)) {
      if (X(r))
        return r.forEach(function(o) {
          return s.add(o, n);
        }), this;
      if (Y(r))
        return this.addLabel(r, n);
      if (F(r))
        r = I.delayedCall(0, r);
      else
        return this;
    }
    return this !== r ? _t(this, r, n) : this;
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
    return Y(r) ? this.removeLabel(r) : F(r) ? this.killTweensOf(r) : (r.parent === this && Qe(this, r), r === this._recent && (this._recent = this._last), Bt(this));
  }, e.totalTime = function(r, n) {
    return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = R(rt.time - (this._ts > 0 ? r / this._ts : (this.totalDuration() - r) / -this._ts))), a.prototype.totalTime.call(this, r, n), this._forcing = 0, this) : this._tTime;
  }, e.addLabel = function(r, n) {
    return this.labels[r] = ht(this, n), this;
  }, e.removeLabel = function(r) {
    return delete this.labels[r], this;
  }, e.addPause = function(r, n, s) {
    var o = I.delayedCall(0, n || Pe, s);
    return o.data = "isPause", this._hasPause = 1, _t(this, o, ht(this, r));
  }, e.removePause = function(r) {
    var n = this._first;
    for (r = ht(this, r); n; )
      n._start === r && n.data === "isPause" && $t(n), n = n._next;
  }, e.killTweensOf = function(r, n, s) {
    for (var o = this.getTweensOf(r, s), l = o.length; l--; )
      Ct !== o[l] && o[l].kill(r, n);
    return this;
  }, e.getTweensOf = function(r, n) {
    for (var s = [], o = ct(r), l = this._first, h = bt(n), u; l; )
      l instanceof I ? fs(l._targets, o) && (h ? (!Ct || l._initted && l._ts) && l.globalTime(0) <= n && l.globalTime(l.totalDuration()) > n : !n || l.isActive()) && s.push(l) : (u = l.getTweensOf(o, n)).length && s.push.apply(s, u), l = l._next;
    return s;
  }, e.tweenTo = function(r, n) {
    n = n || {};
    var s = this, o = ht(s, r), l = n, h = l.startAt, u = l.onStart, c = l.onStartParams, f = l.immediateRender, _, p = I.to(s, lt({
      ease: n.ease || "none",
      lazy: !1,
      immediateRender: !1,
      time: o,
      overwrite: "auto",
      duration: n.duration || Math.abs((o - (h && "time" in h ? h.time : s._time)) / s.timeScale()) || $,
      onStart: function() {
        if (s.pause(), !_) {
          var g = n.duration || Math.abs((o - (h && "time" in h ? h.time : s._time)) / s.timeScale());
          p._dur !== g && ae(p, g, 0, 1).render(p._time, !0, !0), _ = 1;
        }
        u && u.apply(p, c || []);
      }
    }, n));
    return f ? p.render(0) : p;
  }, e.tweenFromTo = function(r, n, s) {
    return this.tweenTo(n, lt({
      startAt: {
        time: ht(this, r)
      }
    }, s));
  }, e.recent = function() {
    return this._recent;
  }, e.nextLabel = function(r) {
    return r === void 0 && (r = this._time), cr(this, ht(this, r));
  }, e.previousLabel = function(r) {
    return r === void 0 && (r = this._time), cr(this, ht(this, r), 1);
  }, e.currentLabel = function(r) {
    return arguments.length ? this.seek(r, !0) : this.previousLabel(this._time + $);
  }, e.shiftChildren = function(r, n, s) {
    s === void 0 && (s = 0);
    var o = this._first, l = this.labels, h;
    for (r = R(r); o; )
      o._start >= s && (o._start += r, o._end += r), o = o._next;
    if (n)
      for (h in l)
        l[h] >= s && (l[h] += r);
    return Bt(this);
  }, e.invalidate = function(r) {
    var n = this._first;
    for (this._lock = 0; n; )
      n.invalidate(r), n = n._next;
    return a.prototype.invalidate.call(this, r);
  }, e.clear = function(r) {
    r === void 0 && (r = !0);
    for (var n = this._first, s; n; )
      s = n._next, this.remove(n), n = s;
    return this._dp && (this._time = this._tTime = this._pTime = 0), r && (this.labels = {}), Bt(this);
  }, e.totalDuration = function(r) {
    var n = 0, s = this, o = s._last, l = ut, h, u, c;
    if (arguments.length)
      return s.timeScale((s._repeat < 0 ? s.duration() : s.totalDuration()) / (s.reversed() ? -r : r));
    if (s._dirty) {
      for (c = s.parent; o; )
        h = o._prev, o._dirty && o.totalDuration(), u = o._start, u > l && s._sort && o._ts && !s._lock ? (s._lock = 1, _t(s, o, u - o._delay, 1)._lock = 0) : l = u, u < 0 && o._ts && (n -= u, (!c && !s._dp || c && c.smoothChildTiming) && (s._start += R(u / s._ts), s._time -= u, s._tTime -= u), s.shiftChildren(-u, !1, -1 / 0), l = 0), o._end > n && o._ts && (n = o._end), o = h;
      ae(s, s === z && s._time > n ? s._time : n, 1, 1), s._dirty = 0;
    }
    return s._tDur;
  }, t.updateRoot = function(r) {
    if (z._ts && (Hr(z, qe(r, z)), Ur = rt.frame), rt.frame >= ar) {
      ar += ot.autoSleep || 120;
      var n = z._first;
      if ((!n || !n._ts) && ot.autoSleep && rt._listeners.length < 2) {
        for (; n && !n._ts; )
          n = n._next;
        n || rt.sleep();
      }
    }
  }, t;
})(Oe);
lt(G.prototype, {
  _lock: 0,
  _hasPause: 0,
  _forcing: 0
});
var Ls = function(t, e, i, r, n, s, o) {
  var l = new J(this._pt, t, e, 0, 1, vn, null, n), h = 0, u = 0, c, f, _, p, d, g, v, y;
  for (l.b = i, l.e = r, i += "", r += "", (v = ~r.indexOf("random(")) && (r = $e(r)), s && (y = [i, r], s(y, t, e), i = y[0], r = y[1]), f = i.match(ii) || []; c = ii.exec(r); )
    p = c[0], d = r.substring(h, c.index), _ ? _ = (_ + 1) % 5 : d.substr(-5) === "rgba(" && (_ = 1), p !== f[u++] && (g = parseFloat(f[u - 1]) || 0, l._pt = {
      _next: l._pt,
      p: d || u === 1 ? d : ",",
      //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
      s: g,
      c: p.charAt(1) === "=" ? Jt(g, p) - g : parseFloat(p) - g,
      m: _ && _ < 4 ? Math.round : 0
    }, h = ii.lastIndex);
  return l.c = h < r.length ? r.substring(h, r.length) : "", l.fp = o, (Fr.test(r) || v) && (l.e = 0), this._pt = l, l;
}, Fi = function(t, e, i, r, n, s, o, l, h, u) {
  F(r) && (r = r(n || 0, t, s));
  var c = t[e], f = i !== "get" ? i : F(c) ? h ? t[e.indexOf("set") || !F(t["get" + e.substr(3)]) ? e : "get" + e.substr(3)](h) : t[e]() : c, _ = F(c) ? h ? Us : gn : Vi, p;
  if (Y(r) && (~r.indexOf("random(") && (r = $e(r)), r.charAt(1) === "=" && (p = Jt(f, r) + (W(f) || 0), (p || p === 0) && (r = p))), !u || f !== r || vi)
    return !isNaN(f * r) && r !== "" ? (p = new J(this._pt, t, e, +f || 0, r - (f || 0), typeof c == "boolean" ? Hs : mn, 0, _), h && (p.fp = h), o && p.modifier(o, this, t), this._pt = p) : (!c && !(e in t) && Mi(e, r), Ls.call(this, t, e, f, r, _, l || ot.stringFilter, h));
}, Fs = function(t, e, i, r, n) {
  if (F(t) && (t = Ce(t, n, e, i, r)), !gt(t) || t.style && t.nodeType || X(t) || zr(t))
    return Y(t) ? Ce(t, n, e, i, r) : t;
  var s = {}, o;
  for (o in t)
    s[o] = Ce(t[o], n, e, i, r);
  return s;
}, fn = function(t, e, i, r, n, s) {
  var o, l, h, u;
  if (it[t] && (o = new it[t]()).init(n, o.rawVars ? e[t] : Fs(e[t], r, n, s, i), i, r, s) !== !1 && (i._pt = l = new J(i._pt, n, t, 0, 1, o.render, o, 0, o.priority), i !== Qt))
    for (h = i._ptLookup[i._targets.indexOf(n)], u = o._props.length; u--; )
      h[o._props[u]] = l;
  return o;
}, Ct, vi, Ni = function a(t, e, i) {
  var r = t.vars, n = r.ease, s = r.startAt, o = r.immediateRender, l = r.lazy, h = r.onUpdate, u = r.runBackwards, c = r.yoyoEase, f = r.keyframes, _ = r.autoRevert, p = t._dur, d = t._startAt, g = t._targets, v = t.parent, y = v && v.data === "nested" ? v.vars.targets : g, x = t._overwrite === "auto" && !Pi, w = t.timeline, m, C, k, T, b, S, M, E, O, K, U, V, B;
  if (w && (!f || !n) && (n = "none"), t._ease = Ht(n, ne.ease), t._yEase = c ? hn(Ht(c === !0 ? n : c, ne.ease)) : 0, c && t._yoyo && !t._repeat && (c = t._yEase, t._yEase = t._ease, t._ease = c), t._from = !w && !!r.runBackwards, !w || f && !r.stagger) {
    if (E = g[0] ? Ut(g[0]).harness : 0, V = E && r[E.prop], m = je(r, Di), d && (d._zTime < 0 && d.progress(1), e < 0 && u && o && !_ ? d.render(-1, !0) : d.revert(u && p ? Ve : cs), d._lazy = 0), s) {
      if ($t(t._startAt = I.set(g, lt({
        data: "isStart",
        overwrite: !1,
        parent: v,
        immediateRender: !0,
        lazy: !d && Z(l),
        startAt: null,
        delay: 0,
        onUpdate: h && function() {
          return nt(t, "onUpdate");
        },
        stagger: 0
      }, s))), t._startAt._dp = 0, t._startAt._sat = t, e < 0 && (j || !o && !_) && t._startAt.revert(Ve), o && p && e <= 0 && i <= 0) {
        e && (t._zTime = e);
        return;
      }
    } else if (u && p && !d) {
      if (e && (o = !1), k = lt({
        overwrite: !1,
        data: "isFromStart",
        //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
        lazy: o && !d && Z(l),
        immediateRender: o,
        //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
        stagger: 0,
        parent: v
        //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y: gsap.utils.wrap([-100,100]), stagger: 0.5})
      }, m), V && (k[E.prop] = V), $t(t._startAt = I.set(g, k)), t._startAt._dp = 0, t._startAt._sat = t, e < 0 && (j ? t._startAt.revert(Ve) : t._startAt.render(-1, !0)), t._zTime = e, !o)
        a(t._startAt, $, $);
      else if (!e)
        return;
    }
    for (t._pt = t._ptCache = 0, l = p && Z(l) || l && !p, C = 0; C < g.length; C++) {
      if (b = g[C], M = b._gsap || zi(g)[C]._gsap, t._ptLookup[C] = K = {}, di[M.id] && St.length && Ke(), U = y === g ? C : y.indexOf(b), E && (O = new E()).init(b, V || m, t, U, y) !== !1 && (t._pt = T = new J(t._pt, b, O.name, 0, 1, O.render, O, 0, O.priority), O._props.forEach(function(dt) {
        K[dt] = T;
      }), O.priority && (S = 1)), !E || V)
        for (k in m)
          it[k] && (O = fn(k, m, t, U, b, y)) ? O.priority && (S = 1) : K[k] = T = Fi.call(t, b, k, "get", m[k], U, y, 0, r.stringFilter);
      t._op && t._op[C] && t.kill(b, t._op[C]), x && t._pt && (Ct = t, z.killTweensOf(b, K, t.globalTime(e)), B = !t.parent, Ct = 0), t._pt && l && (di[M.id] = 1);
    }
    S && yn(t), t._onInit && t._onInit(t);
  }
  t._onUpdate = h, t._initted = (!t._op || t._pt) && !B, f && e <= 0 && w.render(ut, !0, !0);
}, Ns = function(t, e, i, r, n, s, o, l) {
  var h = (t._pt && t._ptCache || (t._ptCache = {}))[e], u, c, f, _;
  if (!h)
    for (h = t._ptCache[e] = [], f = t._ptLookup, _ = t._targets.length; _--; ) {
      if (u = f[_][e], u && u.d && u.d._pt)
        for (u = u.d._pt; u && u.p !== e && u.fp !== e; )
          u = u._next;
      if (!u)
        return vi = 1, t.vars[e] = "+=0", Ni(t, o), vi = 0, l ? Se(e + " not eligible for reset") : 1;
      h.push(u);
    }
  for (_ = h.length; _--; )
    c = h[_], u = c._pt || c, u.s = (r || r === 0) && !n ? r : u.s + (r || 0) + s * u.c, u.c = i - u.s, c.e && (c.e = N(i) + W(c.e)), c.b && (c.b = u.s + W(c.b));
}, Vs = function(t, e) {
  var i = t[0] ? Ut(t[0]).harness : 0, r = i && i.aliases, n, s, o, l;
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
  if (X(e))
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
}, Ce = function(t, e, i, r, n) {
  return F(t) ? t.call(e, i, r, n) : Y(t) && ~t.indexOf("random(") ? $e(t) : t;
}, _n = Ri + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert", pn = {};
Q(_n + ",id,stagger,delay,duration,paused,scrollTrigger", function(a) {
  return pn[a] = 1;
});
var I = /* @__PURE__ */ (function(a) {
  Dr(t, a);
  function t(i, r, n, s) {
    var o;
    typeof r == "number" && (n.duration = r, r = n, n = null), o = a.call(this, s ? r : xe(r)) || this;
    var l = o.vars, h = l.duration, u = l.delay, c = l.immediateRender, f = l.stagger, _ = l.overwrite, p = l.keyframes, d = l.defaults, g = l.scrollTrigger, v = l.yoyoEase, y = r.parent || z, x = (X(i) || zr(i) ? bt(i[0]) : "length" in r) ? [i] : ct(i), w, m, C, k, T, b, S, M;
    if (o._targets = x.length ? zi(x) : Se("GSAP target " + i + " not found. https://gsap.com", !ot.nullTargetWarn) || [], o._ptLookup = [], o._overwrite = _, p || f || Fe(h) || Fe(u)) {
      if (r = o.vars, w = o.timeline = new G({
        data: "nested",
        defaults: d || {},
        targets: y && y.data === "nested" ? y.vars.targets : x
      }), w.kill(), w.parent = w._dp = vt(o), w._start = 0, f || Fe(h) || Fe(u)) {
        if (k = x.length, S = f && Qr(f), gt(f))
          for (T in f)
            ~_n.indexOf(T) && (M || (M = {}), M[T] = f[T]);
        for (m = 0; m < k; m++)
          C = je(r, pn), C.stagger = 0, v && (C.yoyoEase = v), M && se(C, M), b = x[m], C.duration = +Ce(h, vt(o), m, b, x), C.delay = (+Ce(u, vt(o), m, b, x) || 0) - o._delay, !f && k === 1 && C.delay && (o._delay = u = C.delay, o._start += u, C.delay = 0), w.to(b, C, S ? S(m, b, x) : 0), w._ease = A.none;
        w.duration() ? h = u = 0 : o.timeline = 0;
      } else if (p) {
        xe(lt(w.vars.defaults, {
          ease: "none"
        })), w._ease = Ht(p.ease || r.ease || "none");
        var E = 0, O, K, U;
        if (X(p))
          p.forEach(function(V) {
            return w.to(x, V, ">");
          }), w.duration();
        else {
          C = {};
          for (T in p)
            T === "ease" || T === "easeEach" || Is(T, p[T], C, p.easeEach);
          for (T in C)
            for (O = C[T].sort(function(V, B) {
              return V.t - B.t;
            }), E = 0, m = 0; m < O.length; m++)
              K = O[m], U = {
                ease: K.e,
                duration: (K.t - (m ? O[m - 1].t : 0)) / 100 * h
              }, U[T] = K.v, w.to(x, U, E), E += U.duration;
          w.duration() < h && w.to({}, {
            duration: h - w.duration()
          });
        }
      }
      h || o.duration(h = w.duration());
    } else
      o.timeline = 0;
    return _ === !0 && !Pi && (Ct = vt(o), z.killTweensOf(x), Ct = 0), _t(y, vt(o), n), r.reversed && o.reverse(), r.paused && o.paused(!0), (c || !h && !p && o._start === R(y._time) && Z(c) && ms(vt(o)) && y.data !== "nested") && (o._tTime = -$, o.render(Math.max(0, -u) || 0)), g && Wr(vt(o), g), o;
  }
  var e = t.prototype;
  return e.render = function(r, n, s) {
    var o = this._time, l = this._tDur, h = this._dur, u = r < 0, c = r > l - $ && !u ? l : r < $ ? 0 : r, f, _, p, d, g, v, y, x, w;
    if (!h)
      ys(this, r, n, s);
    else if (c !== this._tTime || !r || s || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== u || this._lazy) {
      if (f = c, x = this.timeline, this._repeat) {
        if (d = h + this._rDelay, this._repeat < -1 && u)
          return this.totalTime(d * 100 + r, n, s);
        if (f = R(c % d), c === l ? (p = this._repeat, f = h) : (g = R(c / d), p = ~~g, p && p === g ? (f = h, p--) : f > h && (f = h)), v = this._yoyo && p & 1, v && (w = this._yEase, f = h - f), g = oe(this._tTime, d), f === o && !s && this._initted && p === g)
          return this._tTime = c, this;
        p !== g && (x && this._yEase && un(x, v), this.vars.repeatRefresh && !v && !this._lock && f !== d && this._initted && (this._lock = s = 1, this.render(R(d * p), !0).invalidate()._lock = 0));
      }
      if (!this._initted) {
        if (Xr(this, u ? r : f, s, n, c))
          return this._tTime = 0, this;
        if (o !== this._time && !(s && this.vars.repeatRefresh && p !== g))
          return this;
        if (h !== this._dur)
          return this.render(r, n, s);
      }
      if (this._tTime = c, this._time = f, !this._act && this._ts && (this._act = 1, this._lazy = 0), this.ratio = y = (w || this._ease)(f / h), this._from && (this.ratio = y = 1 - y), !o && c && !n && !g && (nt(this, "onStart"), this._tTime !== c))
        return this;
      for (_ = this._pt; _; )
        _.r(y, _.d), _ = _._next;
      x && x.render(r < 0 ? r : x._dur * x._ease(f / this._dur), n, s) || this._startAt && (this._zTime = r), this._onUpdate && !n && (u && fi(this, r, n, s), nt(this, "onUpdate")), this._repeat && p !== g && this.vars.onRepeat && !n && this.parent && nt(this, "onRepeat"), (c === this._tDur || !c) && this._tTime === c && (u && !this._onUpdate && fi(this, r, !0, !0), (r || !h) && (c === this._tDur && this._ts > 0 || !c && this._ts < 0) && $t(this, 1), !n && !(u && !o) && (c || o || v) && (nt(this, c === l ? "onComplete" : "onReverseComplete", !0), this._prom && !(c < l && this.timeScale() > 0) && this._prom()));
    }
    return this;
  }, e.targets = function() {
    return this._targets;
  }, e.invalidate = function(r) {
    return (!r || !this.vars.runBackwards) && (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(r), a.prototype.invalidate.call(this, r);
  }, e.resetTo = function(r, n, s, o, l) {
    Ee || rt.wake(), this._ts || this.play();
    var h = Math.min(this._dur, (this._dp._time - this._start) * this._ts), u;
    return this._initted || Ni(this, h), u = this._ease(h / this._dur), Ns(this, r, n, s, o, u, h, l) ? this.resetTo(r, n, s, o, 1) : (ti(this, 0), this.parent || jr(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0), this.render(0));
  }, e.kill = function(r, n) {
    if (n === void 0 && (n = "all"), !r && (!n || n === "all"))
      return this._lazy = this._pt = 0, this.parent ? pe(this) : this.scrollTrigger && this.scrollTrigger.kill(!!j), this;
    if (this.timeline) {
      var s = this.timeline.totalDuration();
      return this.timeline.killTweensOf(r, n, Ct && Ct.vars.overwrite !== !0)._first || pe(this), this.parent && s !== this.timeline.totalDuration() && ae(this, this._dur * this.timeline._tDur / s, 0, 1), this;
    }
    var o = this._targets, l = r ? ct(r) : o, h = this._ptLookup, u = this._pt, c, f, _, p, d, g, v;
    if ((!n || n === "all") && ps(o, l))
      return n === "all" && (this._pt = 0), pe(this);
    for (c = this._op = this._op || [], n !== "all" && (Y(n) && (d = {}, Q(n, function(y) {
      return d[y] = 1;
    }), n = d), n = Vs(o, n)), v = o.length; v--; )
      if (~l.indexOf(o[v])) {
        f = h[v], n === "all" ? (c[v] = n, p = f, _ = {}) : (_ = c[v] = c[v] || {}, p = n);
        for (d in p)
          g = f && f[d], g && ((!("kill" in g.d) || g.d.kill(d) === !0) && Qe(this, g, "_pt"), delete f[d]), _ !== "all" && (_[d] = 1);
      }
    return this._initted && !this._pt && u && pe(this), this;
  }, t.to = function(r, n) {
    return new t(r, n, arguments[2]);
  }, t.from = function(r, n) {
    return we(1, arguments);
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
    return we(2, arguments);
  }, t.set = function(r, n) {
    return n.duration = 0, n.repeatDelay || (n.repeat = 0), new t(r, n);
  }, t.killTweensOf = function(r, n, s) {
    return z.killTweensOf(r, n, s);
  }, t;
})(Oe);
lt(I.prototype, {
  _targets: [],
  _lazy: 0,
  _startAt: 0,
  _op: 0,
  _onInit: 0
});
Q("staggerTo,staggerFrom,staggerFromTo", function(a) {
  I[a] = function() {
    var t = new G(), e = pi.call(arguments, 0);
    return e.splice(a === "staggerFromTo" ? 5 : 4, 0, 0), t[a].apply(t, e);
  };
});
var Vi = function(t, e, i) {
  return t[e] = i;
}, gn = function(t, e, i) {
  return t[e](i);
}, Us = function(t, e, i, r) {
  return t[e](r.fp, i);
}, Bs = function(t, e, i) {
  return t.setAttribute(e, i);
}, Ii = function(t, e) {
  return F(t[e]) ? gn : $i(t[e]) && t.setAttribute ? Bs : Vi;
}, mn = function(t, e) {
  return e.set(e.t, e.p, Math.round((e.s + e.c * t) * 1e6) / 1e6, e);
}, Hs = function(t, e) {
  return e.set(e.t, e.p, !!(e.s + e.c * t), e);
}, vn = function(t, e) {
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
}, Ui = function(t, e) {
  for (var i = e._pt; i; )
    i.r(t, i.d), i = i._next;
}, Ys = function(t, e, i, r) {
  for (var n = this._pt, s; n; )
    s = n._next, n.p === r && n.modifier(t, e, i), n = s;
}, Ks = function(t) {
  for (var e = this._pt, i, r; e; )
    r = e._next, e.p === t && !e.op || e.op === t ? Qe(this, e, "_pt") : e.dep || (i = 1), e = r;
  return !i;
}, js = function(t, e, i, r) {
  r.mSet(t, e, r.m.call(r.tween, i, r.mt), r);
}, yn = function(t) {
  for (var e = t._pt, i, r, n, s; e; ) {
    for (i = e._next, r = n; r && r.pr > e.pr; )
      r = r._next;
    (e._prev = r ? r._prev : s) ? e._prev._next = e : n = e, (e._next = r) ? r._prev = e : s = e, e = i;
  }
  t._pt = n;
}, J = /* @__PURE__ */ (function() {
  function a(e, i, r, n, s, o, l, h, u) {
    this.t = i, this.s = n, this.c = s, this.p = r, this.r = o || mn, this.d = l || this, this.set = h || Vi, this.pr = u || 0, this._next = e, e && (e._prev = this);
  }
  var t = a.prototype;
  return t.modifier = function(i, r, n) {
    this.mSet = this.mSet || this.set, this.set = js, this.m = i, this.mt = n, this.tween = r;
  }, a;
})();
Q(Ri + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function(a) {
  return Di[a] = 1;
});
at.TweenMax = at.TweenLite = I;
at.TimelineLite = at.TimelineMax = G;
z = new G({
  sortChildren: !1,
  defaults: ne,
  autoRemoveChildren: !0,
  id: "root",
  smoothChildTiming: !0
});
ot.stringFilter = ln;
var Yt = [], Ue = {}, qs = [], fr = 0, Ws = 0, ai = function(t) {
  return (Ue[t] || qs).map(function(e) {
    return e();
  });
}, yi = function() {
  var t = Date.now(), e = [];
  t - fr > 2 && (ai("matchMediaInit"), Yt.forEach(function(i) {
    var r = i.queries, n = i.conditions, s, o, l, h;
    for (o in r)
      s = ft.matchMedia(r[o]).matches, s && (l = 1), s !== n[o] && (n[o] = s, h = 1);
    h && (i.revert(), l && e.push(i));
  }), ai("matchMediaRevert"), e.forEach(function(i) {
    return i.onMatch(i, function(r) {
      return i.add(null, r);
    });
  }), fr = t, ai("matchMedia"));
}, bn = /* @__PURE__ */ (function() {
  function a(e, i) {
    this.selector = i && gi(i), this.data = [], this._r = [], this.isReverted = !1, this.id = Ws++, e && this.add(e);
  }
  var t = a.prototype;
  return t.add = function(i, r, n) {
    F(i) && (n = r, r = i, i = F);
    var s = this, o = function() {
      var h = D, u = s.selector, c;
      return h && h !== s && h.data.push(s), n && (s.selector = gi(n)), D = s, c = r.apply(s, arguments), F(c) && s._r.push(c), D = h, s.selector = u, s.isReverted = !1, c;
    };
    return s.last = o, i === F ? o(s, function(l) {
      return s.add(null, l);
    }) : i ? s[i] = o : o;
  }, t.ignore = function(i) {
    var r = D;
    D = null, i(this), D = r;
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
        h = n.data[l], h instanceof G ? h.data !== "nested" && (h.scrollTrigger && h.scrollTrigger.revert(), h.kill()) : !(h instanceof I) && h.revert && h.revert(i);
      n._r.forEach(function(u) {
        return u(i, n);
      }), n.isReverted = !0;
    })() : this.data.forEach(function(o) {
      return o.kill && o.kill();
    }), this.clear(), r)
      for (var s = Yt.length; s--; )
        Yt[s].id === this.id && Yt.splice(s, 1);
  }, t.revert = function(i) {
    this.kill(i || {});
  }, a;
})(), Xs = /* @__PURE__ */ (function() {
  function a(e) {
    this.contexts = [], this.scope = e, D && D.data.push(this);
  }
  var t = a.prototype;
  return t.add = function(i, r, n) {
    gt(i) || (i = {
      matches: i
    });
    var s = new bn(0, n || this.scope), o = s.conditions = {}, l, h, u;
    D && !s.selector && (s.selector = D.selector), this.contexts.push(s), r = s.add("onMatch", r), s.queries = i;
    for (h in i)
      h === "all" ? u = 1 : (l = ft.matchMedia(i[h]), l && (Yt.indexOf(s) < 0 && Yt.push(s), (o[h] = l.matches) && (u = 1), l.addListener ? l.addListener(yi) : l.addEventListener("change", yi)));
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
      return sn(r);
    });
  },
  timeline: function(t) {
    return new G(t);
  },
  getTweensOf: function(t, e) {
    return z.getTweensOf(t, e);
  },
  getProperty: function(t, e, i, r) {
    Y(t) && (t = ct(t)[0]);
    var n = Ut(t || {}).get, s = i ? Kr : Yr;
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
    var s = it[e], o = Ut(t), l = o.harness && (o.harness.aliases || {})[e] || e, h = s ? function(u) {
      var c = new s();
      Qt._pt = 0, c.init(t, i ? u + i : u, Qt, 0, [t]), c.render(1, c), Qt._pt && Ui(1, Qt);
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
    return z.getTweensOf(t, !0).length > 0;
  },
  defaults: function(t) {
    return t && t.ease && (t.ease = Ht(t.ease, ne.ease)), lr(ne, t || {});
  },
  config: function(t) {
    return lr(ot, t || {});
  },
  registerEffect: function(t) {
    var e = t.name, i = t.effect, r = t.plugins, n = t.defaults, s = t.extendTimeline;
    (r || "").split(",").forEach(function(o) {
      return o && !it[o] && !at[o] && Se(e + " effect requires " + o + " plugin.");
    }), ri[e] = function(o, l, h) {
      return i(ct(o), lt(l || {}, n), h);
    }, s && (G.prototype[e] = function(o, l, h) {
      return this.add(ri[e](o, gt(l) ? l : (h = l) && {}, this), h);
    });
  },
  registerEase: function(t, e) {
    A[t] = Ht(e);
  },
  parseEase: function(t, e) {
    return arguments.length ? Ht(t, e) : A;
  },
  getById: function(t) {
    return z.getById(t);
  },
  exportRoot: function(t, e) {
    t === void 0 && (t = {});
    var i = new G(t), r, n;
    for (i.smoothChildTiming = Z(t.smoothChildTiming), z.remove(i), i._dp = 0, i._time = i._tTime = z._time, r = z._first; r; )
      n = r._next, (e || !(!r._dur && r instanceof I && r.vars.onComplete === r._targets[0])) && _t(i, r, r._start - r._delay), r = n;
    return _t(z, i, 0), i;
  },
  context: function(t, e) {
    return t ? new bn(t, e) : D;
  },
  matchMedia: function(t) {
    return new Xs(t);
  },
  matchMediaRefresh: function() {
    return Yt.forEach(function(t) {
      var e = t.conditions, i, r;
      for (r in e)
        e[r] && (e[r] = !1, i = 1);
      i && t.revert();
    }) || yi();
  },
  addEventListener: function(t, e) {
    var i = Ue[t] || (Ue[t] = []);
    ~i.indexOf(e) || i.push(e);
  },
  removeEventListener: function(t, e) {
    var i = Ue[t], r = i && i.indexOf(e);
    r >= 0 && i.splice(r, 1);
  },
  utils: {
    wrap: Ss,
    wrapYoyo: Ps,
    distribute: Qr,
    random: tn,
    snap: Jr,
    normalize: As,
    getUnit: W,
    clamp: ws,
    splitColor: on,
    toArray: ct,
    selector: gi,
    mapRange: rn,
    pipe: ks,
    unitize: Ts,
    interpolate: $s,
    shuffle: Zr
  },
  install: Vr,
  effects: ri,
  ticker: rt,
  updateRoot: G.updateRoot,
  plugins: it,
  globalTimeline: z,
  core: {
    PropTween: J,
    globals: Ir,
    Tween: I,
    Timeline: G,
    Animation: Oe,
    getCache: Ut,
    _removeLinkedListItem: Qe,
    reverting: function() {
      return j;
    },
    context: function(t) {
      return t && D && (D.data.push(t), t._ctx = D), D;
    },
    suppressOverwrites: function(t) {
      return Pi = t;
    }
  }
};
Q("to,from,fromTo,delayedCall,set,killTweensOf", function(a) {
  return We[a] = I[a];
});
rt.add(G.updateRoot);
Qt = We.to({}, {
  duration: 0
});
var Gs = function(t, e) {
  for (var i = t._pt; i && i.p !== e && i.op !== e && i.fp !== e; )
    i = i._next;
  return i;
}, Zs = function(t, e) {
  var i = t._targets, r, n, s;
  for (r in e)
    for (n = i.length; n--; )
      s = t._ptLookup[n][r], s && (s = s.d) && (s._pt && (s = Gs(s, r)), s && s.modifier && s.modifier(e[r], t, i[n], r));
}, li = function(t, e) {
  return {
    name: t,
    headless: 1,
    rawVars: 1,
    //don't pre-process function-based values or "random()" strings.
    init: function(r, n, s) {
      s._onInit = function(o) {
        var l, h;
        if (Y(n) && (l = {}, Q(n, function(u) {
          return l[u] = 1;
        }), n = l), e) {
          l = {};
          for (h in n)
            l[h] = e(n[h]);
          n = l;
        }
        Zs(o, n);
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
}, li("roundProps", mi), li("modifiers"), li("snap", Jr)) || We;
I.version = G.version = et.version = "3.14.2";
Nr = 1;
Ei() && le();
A.Power0;
A.Power1;
A.Power2;
A.Power3;
A.Power4;
A.Linear;
A.Quad;
A.Cubic;
A.Quart;
A.Quint;
A.Strong;
A.Elastic;
A.Back;
A.SteppedEase;
A.Bounce;
A.Sine;
A.Expo;
A.Circ;
/*!
 * CSSPlugin 3.14.2
 * https://gsap.com
 *
 * Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/
var _r, kt, te, Bi, It, pr, Hi, Qs = function() {
  return typeof window < "u";
}, xt = {}, Nt = 180 / Math.PI, ee = Math.PI / 180, Wt = Math.atan2, gr = 1e8, Yi = /([A-Z])/g, Js = /(left|right|width|margin|padding|x)/i, to = /[\s,\(]\S/, pt = {
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
}, xn = function(t, e) {
  return e.set(e.t, e.p, t ? e.e : e.b, e);
}, wn = function(t, e) {
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
}, L = "transform", tt = L + "Origin", co = function a(t, e) {
  var i = this, r = this.target, n = r.style, s = r._gsap;
  if (t in xt && n) {
    if (this.tfm = this.tfm || {}, t !== "transform")
      t = pt[t] || t, ~t.indexOf(",") ? t.split(",").forEach(function(o) {
        return i.tfm[o] = yt(r, o);
      }) : this.tfm[t] = s.x ? s[t] : yt(r, t), t === tt && (this.tfm.zOrigin = s.zOrigin);
    else
      return pt.transform.split(",").forEach(function(o) {
        return a.call(i, o, e);
      });
    if (this.props.indexOf(L) >= 0)
      return;
    s.svg && (this.svgo = r.getAttribute("data-svg-origin"), this.props.push(tt, e, "")), t = L;
  }
  (n || e) && this.props.push(t, e, n[t]);
}, Cn = function(t) {
  t.translate && (t.removeProperty("translate"), t.removeProperty("scale"), t.removeProperty("rotate"));
}, fo = function() {
  var t = this.props, e = this.target, i = e.style, r = e._gsap, n, s;
  for (n = 0; n < t.length; n += 3)
    t[n + 1] ? t[n + 1] === 2 ? e[t[n]](t[n + 2]) : e[t[n]] = t[n + 2] : t[n + 2] ? i[t[n]] = t[n + 2] : i.removeProperty(t[n].substr(0, 2) === "--" ? t[n] : t[n].replace(Yi, "-$1").toLowerCase());
  if (this.tfm) {
    for (s in this.tfm)
      r[s] = this.tfm[s];
    r.svg && (r.renderTransform(), e.setAttribute("data-svg-origin", this.svgo || "")), n = Hi(), (!n || !n.isStart) && !i[L] && (Cn(i), r.zOrigin && i[tt] && (i[tt] += " " + r.zOrigin + "px", r.zOrigin = 0, r.renderTransform()), r.uncache = 1);
  }
}, kn = function(t, e) {
  var i = {
    target: t,
    props: [],
    revert: fo,
    save: co
  };
  return t._gsap || et.core.getCache(t), e && t.style && t.nodeType && e.split(",").forEach(function(r) {
    return i.save(r);
  }), i;
}, Tn, xi = function(t, e) {
  var i = kt.createElementNS ? kt.createElementNS((e || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), t) : kt.createElement(t);
  return i && i.style ? i : kt.createElement(t);
}, st = function a(t, e, i) {
  var r = getComputedStyle(t);
  return r[e] || r.getPropertyValue(e.replace(Yi, "-$1").toLowerCase()) || r.getPropertyValue(e) || !i && a(t, he(e) || e, 1) || "";
}, mr = "O,Moz,ms,Ms,Webkit".split(","), he = function(t, e, i) {
  var r = e || It, n = r.style, s = 5;
  if (t in n && !i)
    return t;
  for (t = t.charAt(0).toUpperCase() + t.substr(1); s-- && !(mr[s] + t in n); )
    ;
  return s < 0 ? null : (s === 3 ? "ms" : s >= 0 ? mr[s] : "") + t;
}, wi = function() {
  Qs() && window.document && (_r = window, kt = _r.document, te = kt.documentElement, It = xi("div") || {
    style: {}
  }, xi("div"), L = he(L), tt = L + "Origin", It.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0", Tn = !!he("perspective"), Hi = et.core.reverting, Bi = 1);
}, vr = function(t) {
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
}, An = function(t) {
  var e, i;
  try {
    e = t.getBBox();
  } catch {
    e = vr(t), i = 1;
  }
  return e && (e.width || e.height) || i || (e = vr(t)), e && !e.width && !e.x && !e.y ? {
    x: +yr(t, ["x", "cx", "x1"]) || 0,
    y: +yr(t, ["y", "cy", "y1"]) || 0,
    width: 0,
    height: 0
  } : e;
}, Sn = function(t) {
  return !!(t.getCTM && (!t.parentNode || t.ownerSVGElement) && An(t));
}, Et = function(t, e) {
  if (e) {
    var i = t.style, r;
    e in xt && e !== tt && (e = L), i.removeProperty ? (r = e.substr(0, 2), (r === "ms" || e.substr(0, 6) === "webkit") && (e = "-" + e), i.removeProperty(r === "--" ? e : e.replace(Yi, "-$1").toLowerCase())) : i.removeAttribute(e);
  }
}, Tt = function(t, e, i, r, n, s) {
  var o = new J(t._pt, e, i, 0, 1, s ? wn : xn);
  return t._pt = o, o.b = r, o.e = n, t._props.push(i), o;
}, br = {
  deg: 1,
  rad: 1,
  turn: 1
}, _o = {
  grid: 1,
  flex: 1
}, Ot = function a(t, e, i, r) {
  var n = parseFloat(i) || 0, s = (i + "").trim().substr((n + "").length) || "px", o = It.style, l = Js.test(e), h = t.tagName.toLowerCase() === "svg", u = (h ? "client" : "offset") + (l ? "Width" : "Height"), c = 100, f = r === "px", _ = r === "%", p, d, g, v;
  if (r === s || !n || br[r] || br[s])
    return n;
  if (s !== "px" && !f && (n = a(t, e, i, "px")), v = t.getCTM && Sn(t), (_ || s === "%") && (xt[e] || ~e.indexOf("adius")))
    return p = v ? t.getBBox()[l ? "width" : "height"] : t[u], N(_ ? n / p * c : n / 100 * p);
  if (o[l ? "width" : "height"] = c + (f ? s : r), d = r !== "rem" && ~e.indexOf("adius") || r === "em" && t.appendChild && !h ? t : t.parentNode, v && (d = (t.ownerSVGElement || {}).parentNode), (!d || d === kt || !d.appendChild) && (d = kt.body), g = d._gsap, g && _ && g.width && l && g.time === rt.time && !g.uncache)
    return N(n / g.width * c);
  if (_ && (e === "height" || e === "width")) {
    var y = t.style[e];
    t.style[e] = c + r, p = t[u], y ? t.style[e] = y : Et(t, e);
  } else
    (_ || s === "%") && !_o[st(d, "display")] && (o.position = st(t, "position")), d === t && (o.position = "static"), d.appendChild(It), p = It[u], d.removeChild(It), o.position = "absolute";
  return l && _ && (g = Ut(d), g.time = rt.time, g.width = d[u]), N(f ? p * n / c : p && n ? c / p * n : 0);
}, yt = function(t, e, i, r) {
  var n;
  return Bi || wi(), e in pt && e !== "transform" && (e = pt[e], ~e.indexOf(",") && (e = e.split(",")[0])), xt[e] && e !== "transform" ? (n = De(t, r), n = e !== "transformOrigin" ? n[e] : n.svg ? n.origin : Ge(st(t, tt)) + " " + n.zOrigin + "px") : (n = t.style[e], (!n || n === "auto" || r || ~(n + "").indexOf("calc(")) && (n = Xe[e] && Xe[e](t, e, i) || st(t, e) || Br(t, e) || (e === "opacity" ? 1 : 0))), i && !~(n + "").trim().indexOf(" ") ? Ot(t, e, n, i) + i : n;
}, po = function(t, e, i, r) {
  if (!i || i === "none") {
    var n = he(e, t, 1), s = n && st(t, n, 1);
    s && s !== i ? (e = n, i = s) : e === "borderColor" && (i = st(t, "borderTopColor"));
  }
  var o = new J(this._pt, t.style, e, 0, 1, vn), l = 0, h = 0, u, c, f, _, p, d, g, v, y, x, w, m;
  if (o.b = i, o.e = r, i += "", r += "", r.substring(0, 6) === "var(--" && (r = st(t, r.substring(4, r.indexOf(")")))), r === "auto" && (d = t.style[e], t.style[e] = r, r = st(t, e) || r, d ? t.style[e] = d : Et(t, e)), u = [i, r], ln(u), i = u[0], r = u[1], f = i.match(Zt) || [], m = r.match(Zt) || [], m.length) {
    for (; c = Zt.exec(r); )
      g = c[0], y = r.substring(l, c.index), p ? p = (p + 1) % 5 : (y.substr(-5) === "rgba(" || y.substr(-5) === "hsla(") && (p = 1), g !== (d = f[h++] || "") && (_ = parseFloat(d) || 0, w = d.substr((_ + "").length), g.charAt(1) === "=" && (g = Jt(_, g) + w), v = parseFloat(g), x = g.substr((v + "").length), l = Zt.lastIndex - x.length, x || (x = x || ot.units[e] || w, l === r.length && (r += x, o.e += x)), w !== x && (_ = Ot(t, e, d, x) || 0), o._pt = {
        _next: o._pt,
        p: y || h === 1 ? y : ",",
        //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
        s: _,
        c: v - _,
        m: p && p < 4 || e === "zIndex" ? Math.round : 0
      });
    o.c = l < r.length ? r.substring(l, r.length) : "";
  } else
    o.r = e === "display" && r === "none" ? wn : xn;
  return Fr.test(r) && (o.e = 0), this._pt = o, o;
}, xr = {
  top: "0%",
  bottom: "100%",
  left: "0%",
  right: "100%",
  center: "50%"
}, go = function(t) {
  var e = t.split(" "), i = e[0], r = e[1] || "50%";
  return (i === "top" || i === "bottom" || r === "left" || r === "right") && (t = i, i = r, r = t), e[0] = xr[i] || i, e[1] = xr[r] || r, e.join(" ");
}, mo = function(t, e) {
  if (e.tween && e.tween._time === e.tween._dur) {
    var i = e.t, r = i.style, n = e.u, s = i._gsap, o, l, h;
    if (n === "all" || n === !0)
      r.cssText = "", l = 1;
    else
      for (n = n.split(","), h = n.length; --h > -1; )
        o = n[h], xt[o] && (l = 1, o = o === "transformOrigin" ? tt : L), Et(i, o);
    l && (Et(i, L), s && (s.svg && i.removeAttribute("transform"), r.scale = r.rotate = r.translate = "none", De(i, 1), s.uncache = 1, Cn(r)));
  }
}, Xe = {
  clearProps: function(t, e, i, r, n) {
    if (n.data !== "isFromStart") {
      var s = t._pt = new J(t._pt, e, i, 0, 0, mo);
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
}, Me = [1, 0, 0, 1, 0, 0], Pn = {}, $n = function(t) {
  return t === "matrix(1, 0, 0, 1, 0, 0)" || t === "none" || !t;
}, wr = function(t) {
  var e = st(t, L);
  return $n(e) ? Me : e.substr(7).match(Lr).map(N);
}, Ki = function(t, e) {
  var i = t._gsap || Ut(t), r = t.style, n = wr(t), s, o, l, h;
  return i.svg && t.getAttribute("transform") ? (l = t.transform.baseVal.consolidate().matrix, n = [l.a, l.b, l.c, l.d, l.e, l.f], n.join(",") === "1,0,0,1,0,0" ? Me : n) : (n === Me && !t.offsetParent && t !== te && !i.svg && (l = r.display, r.display = "block", s = t.parentNode, (!s || !t.offsetParent && !t.getBoundingClientRect().width) && (h = 1, o = t.nextElementSibling, te.appendChild(t)), n = wr(t), l ? r.display = l : Et(t, "display"), h && (o ? s.insertBefore(t, o) : s ? s.appendChild(t) : te.removeChild(t))), e && n.length > 6 ? [n[0], n[1], n[4], n[5], n[12], n[13]] : n);
}, Ci = function(t, e, i, r, n, s) {
  var o = t._gsap, l = n || Ki(t, !0), h = o.xOrigin || 0, u = o.yOrigin || 0, c = o.xOffset || 0, f = o.yOffset || 0, _ = l[0], p = l[1], d = l[2], g = l[3], v = l[4], y = l[5], x = e.split(" "), w = parseFloat(x[0]) || 0, m = parseFloat(x[1]) || 0, C, k, T, b;
  i ? l !== Me && (k = _ * g - p * d) && (T = w * (g / k) + m * (-d / k) + (d * y - g * v) / k, b = w * (-p / k) + m * (_ / k) - (_ * y - p * v) / k, w = T, m = b) : (C = An(t), w = C.x + (~x[0].indexOf("%") ? w / 100 * C.width : w), m = C.y + (~(x[1] || x[0]).indexOf("%") ? m / 100 * C.height : m)), r || r !== !1 && o.smooth ? (v = w - h, y = m - u, o.xOffset = c + (v * _ + y * d) - v, o.yOffset = f + (v * p + y * g) - y) : o.xOffset = o.yOffset = 0, o.xOrigin = w, o.yOrigin = m, o.smooth = !!r, o.origin = e, o.originIsAbsolute = !!i, t.style[tt] = "0px 0px", s && (Tt(s, o, "xOrigin", h, w), Tt(s, o, "yOrigin", u, m), Tt(s, o, "xOffset", c, o.xOffset), Tt(s, o, "yOffset", f, o.yOffset)), t.setAttribute("data-svg-origin", w + " " + m);
}, De = function(t, e) {
  var i = t._gsap || new dn(t);
  if ("x" in i && !e && !i.uncache)
    return i;
  var r = t.style, n = i.scaleX < 0, s = "px", o = "deg", l = getComputedStyle(t), h = st(t, tt) || "0", u, c, f, _, p, d, g, v, y, x, w, m, C, k, T, b, S, M, E, O, K, U, V, B, dt, Le, ce, de, Dt, Wi, mt, Rt;
  return u = c = f = d = g = v = y = x = w = 0, _ = p = 1, i.svg = !!(t.getCTM && Sn(t)), l.translate && ((l.translate !== "none" || l.scale !== "none" || l.rotate !== "none") && (r[L] = (l.translate !== "none" ? "translate3d(" + (l.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (l.rotate !== "none" ? "rotate(" + l.rotate + ") " : "") + (l.scale !== "none" ? "scale(" + l.scale.split(" ").join(",") + ") " : "") + (l[L] !== "none" ? l[L] : "")), r.scale = r.rotate = r.translate = "none"), k = Ki(t, i.svg), i.svg && (i.uncache ? (dt = t.getBBox(), h = i.xOrigin - dt.x + "px " + (i.yOrigin - dt.y) + "px", B = "") : B = !e && t.getAttribute("data-svg-origin"), Ci(t, B || h, !!B || i.originIsAbsolute, i.smooth !== !1, k)), m = i.xOrigin || 0, C = i.yOrigin || 0, k !== Me && (M = k[0], E = k[1], O = k[2], K = k[3], u = U = k[4], c = V = k[5], k.length === 6 ? (_ = Math.sqrt(M * M + E * E), p = Math.sqrt(K * K + O * O), d = M || E ? Wt(E, M) * Nt : 0, y = O || K ? Wt(O, K) * Nt + d : 0, y && (p *= Math.abs(Math.cos(y * ee))), i.svg && (u -= m - (m * M + C * O), c -= C - (m * E + C * K))) : (Rt = k[6], Wi = k[7], ce = k[8], de = k[9], Dt = k[10], mt = k[11], u = k[12], c = k[13], f = k[14], T = Wt(Rt, Dt), g = T * Nt, T && (b = Math.cos(-T), S = Math.sin(-T), B = U * b + ce * S, dt = V * b + de * S, Le = Rt * b + Dt * S, ce = U * -S + ce * b, de = V * -S + de * b, Dt = Rt * -S + Dt * b, mt = Wi * -S + mt * b, U = B, V = dt, Rt = Le), T = Wt(-O, Dt), v = T * Nt, T && (b = Math.cos(-T), S = Math.sin(-T), B = M * b - ce * S, dt = E * b - de * S, Le = O * b - Dt * S, mt = K * S + mt * b, M = B, E = dt, O = Le), T = Wt(E, M), d = T * Nt, T && (b = Math.cos(T), S = Math.sin(T), B = M * b + E * S, dt = U * b + V * S, E = E * b - M * S, V = V * b - U * S, M = B, U = dt), g && Math.abs(g) + Math.abs(d) > 359.9 && (g = d = 0, v = 180 - v), _ = N(Math.sqrt(M * M + E * E + O * O)), p = N(Math.sqrt(V * V + Rt * Rt)), T = Wt(U, V), y = Math.abs(T) > 2e-4 ? T * Nt : 0, w = mt ? 1 / (mt < 0 ? -mt : mt) : 0), i.svg && (B = t.getAttribute("transform"), i.forceCSS = t.setAttribute("transform", "") || !$n(st(t, L)), B && t.setAttribute("transform", B))), Math.abs(y) > 90 && Math.abs(y) < 270 && (n ? (_ *= -1, y += d <= 0 ? 180 : -180, d += d <= 0 ? 180 : -180) : (p *= -1, y += y <= 0 ? 180 : -180)), e = e || i.uncache, i.x = u - ((i.xPercent = u && (!e && i.xPercent || (Math.round(t.offsetWidth / 2) === Math.round(-u) ? -50 : 0))) ? t.offsetWidth * i.xPercent / 100 : 0) + s, i.y = c - ((i.yPercent = c && (!e && i.yPercent || (Math.round(t.offsetHeight / 2) === Math.round(-c) ? -50 : 0))) ? t.offsetHeight * i.yPercent / 100 : 0) + s, i.z = f + s, i.scaleX = N(_), i.scaleY = N(p), i.rotation = N(d) + o, i.rotationX = N(g) + o, i.rotationY = N(v) + o, i.skewX = y + o, i.skewY = x + o, i.transformPerspective = w + s, (i.zOrigin = parseFloat(h.split(" ")[2]) || !e && i.zOrigin || 0) && (r[tt] = Ge(h)), i.xOffset = i.yOffset = 0, i.force3D = ot.force3D, i.renderTransform = i.svg ? yo : Tn ? En : vo, i.uncache = 0, i;
}, Ge = function(t) {
  return (t = t.split(" "))[0] + " " + t[1];
}, hi = function(t, e, i) {
  var r = W(e);
  return N(parseFloat(e) + parseFloat(Ot(t, "x", i + "px", r))) + r;
}, vo = function(t, e) {
  e.z = "0px", e.rotationY = e.rotationX = "0deg", e.force3D = 0, En(t, e);
}, Lt = "0deg", _e = "0px", Ft = ") ", En = function(t, e) {
  var i = e || this, r = i.xPercent, n = i.yPercent, s = i.x, o = i.y, l = i.z, h = i.rotation, u = i.rotationY, c = i.rotationX, f = i.skewX, _ = i.skewY, p = i.scaleX, d = i.scaleY, g = i.transformPerspective, v = i.force3D, y = i.target, x = i.zOrigin, w = "", m = v === "auto" && t && t !== 1 || v === !0;
  if (x && (c !== Lt || u !== Lt)) {
    var C = parseFloat(u) * ee, k = Math.sin(C), T = Math.cos(C), b;
    C = parseFloat(c) * ee, b = Math.cos(C), s = hi(y, s, k * b * -x), o = hi(y, o, -Math.sin(C) * -x), l = hi(y, l, T * b * -x + x);
  }
  g !== _e && (w += "perspective(" + g + Ft), (r || n) && (w += "translate(" + r + "%, " + n + "%) "), (m || s !== _e || o !== _e || l !== _e) && (w += l !== _e || m ? "translate3d(" + s + ", " + o + ", " + l + ") " : "translate(" + s + ", " + o + Ft), h !== Lt && (w += "rotate(" + h + Ft), u !== Lt && (w += "rotateY(" + u + Ft), c !== Lt && (w += "rotateX(" + c + Ft), (f !== Lt || _ !== Lt) && (w += "skew(" + f + ", " + _ + Ft), (p !== 1 || d !== 1) && (w += "scale(" + p + ", " + d + Ft), y.style[L] = w || "translate(0, 0)";
}, yo = function(t, e) {
  var i = e || this, r = i.xPercent, n = i.yPercent, s = i.x, o = i.y, l = i.rotation, h = i.skewX, u = i.skewY, c = i.scaleX, f = i.scaleY, _ = i.target, p = i.xOrigin, d = i.yOrigin, g = i.xOffset, v = i.yOffset, y = i.forceCSS, x = parseFloat(s), w = parseFloat(o), m, C, k, T, b;
  l = parseFloat(l), h = parseFloat(h), u = parseFloat(u), u && (u = parseFloat(u), h += u, l += u), l || h ? (l *= ee, h *= ee, m = Math.cos(l) * c, C = Math.sin(l) * c, k = Math.sin(l - h) * -f, T = Math.cos(l - h) * f, h && (u *= ee, b = Math.tan(h - u), b = Math.sqrt(1 + b * b), k *= b, T *= b, u && (b = Math.tan(u), b = Math.sqrt(1 + b * b), m *= b, C *= b)), m = N(m), C = N(C), k = N(k), T = N(T)) : (m = c, T = f, C = k = 0), (x && !~(s + "").indexOf("px") || w && !~(o + "").indexOf("px")) && (x = Ot(_, "x", s, "px"), w = Ot(_, "y", o, "px")), (p || d || g || v) && (x = N(x + p - (p * m + d * k) + g), w = N(w + d - (p * C + d * T) + v)), (r || n) && (b = _.getBBox(), x = N(x + r / 100 * b.width), w = N(w + n / 100 * b.height)), b = "matrix(" + m + "," + C + "," + k + "," + T + "," + x + "," + w + ")", _.setAttribute("transform", b), y && (_.style[L] = b);
}, bo = function(t, e, i, r, n) {
  var s = 360, o = Y(n), l = parseFloat(n) * (o && ~n.indexOf("rad") ? Nt : 1), h = l - r, u = r + h + "deg", c, f;
  return o && (c = n.split("_")[1], c === "short" && (h %= s, h !== h % (s / 2) && (h += h < 0 ? s : -s)), c === "cw" && h < 0 ? h = (h + s * gr) % s - ~~(h / s) * s : c === "ccw" && h > 0 && (h = (h - s * gr) % s - ~~(h / s) * s)), t._pt = f = new J(t._pt, e, i, r, h, eo), f.e = u, f.u = "deg", t._props.push(i), f;
}, Cr = function(t, e) {
  for (var i in e)
    t[i] = e[i];
  return t;
}, xo = function(t, e, i) {
  var r = Cr({}, i._gsap), n = "perspective,force3D,transformOrigin,svgOrigin", s = i.style, o, l, h, u, c, f, _, p;
  r.svg ? (h = i.getAttribute("transform"), i.setAttribute("transform", ""), s[L] = e, o = De(i, 1), Et(i, L), i.setAttribute("transform", h)) : (h = getComputedStyle(i)[L], s[L] = e, o = De(i, 1), s[L] = h);
  for (l in xt)
    h = r[l], u = o[l], h !== u && n.indexOf(l) < 0 && (_ = W(h), p = W(u), c = _ !== p ? Ot(i, l, h, p) : parseFloat(h), f = parseFloat(u), t._pt = new J(t._pt, o, l, c, f - c, bi), t._pt.u = p || 0, t._props.push(l));
  Cr(o, r);
};
Q("padding,margin,Width,Radius", function(a, t) {
  var e = "Top", i = "Right", r = "Bottom", n = "Left", s = (t < 3 ? [e, i, r, n] : [e + n, e + i, r + i, r + n]).map(function(o) {
    return t < 2 ? a + o : "border" + o + a;
  });
  Xe[t > 1 ? "border" + a : a] = function(o, l, h, u, c) {
    var f, _;
    if (arguments.length < 4)
      return f = s.map(function(p) {
        return yt(o, p, h);
      }), _ = f.join(" "), _.split(f[0]).length === 5 ? f[0] : _;
    f = (u + "").split(" "), _ = {}, s.forEach(function(p, d) {
      return _[p] = f[d] = f[d] || f[(d - 1) / 2 | 0];
    }), o.init(l, _, c);
  };
});
var On = {
  name: "css",
  register: wi,
  targetTest: function(t) {
    return t.style && t.nodeType;
  },
  init: function(t, e, i, r, n) {
    var s = this._props, o = t.style, l = i.vars.startAt, h, u, c, f, _, p, d, g, v, y, x, w, m, C, k, T, b;
    Bi || wi(), this.styles = this.styles || kn(t), T = this.styles.props, this.tween = i;
    for (d in e)
      if (d !== "autoRound" && (u = e[d], !(it[d] && fn(d, e, i, r, t, n)))) {
        if (_ = typeof u, p = Xe[d], _ === "function" && (u = u.call(i, r, t, n), _ = typeof u), _ === "string" && ~u.indexOf("random(") && (u = $e(u)), p)
          p(this, t, d, u, i) && (k = 1);
        else if (d.substr(0, 2) === "--")
          h = (getComputedStyle(t).getPropertyValue(d) + "").trim(), u += "", Pt.lastIndex = 0, Pt.test(h) || (g = W(h), v = W(u), v ? g !== v && (h = Ot(t, d, h, v) + v) : g && (u += g)), this.add(o, "setProperty", h, u, r, n, 0, 0, d), s.push(d), T.push(d, 0, o[d]);
        else if (_ !== "undefined") {
          if (l && d in l ? (h = typeof l[d] == "function" ? l[d].call(i, r, t, n) : l[d], Y(h) && ~h.indexOf("random(") && (h = $e(h)), W(h + "") || h === "auto" || (h += ot.units[d] || W(yt(t, d)) || ""), (h + "").charAt(1) === "=" && (h = yt(t, d))) : h = yt(t, d), f = parseFloat(h), y = _ === "string" && u.charAt(1) === "=" && u.substr(0, 2), y && (u = u.substr(2)), c = parseFloat(u), d in pt && (d === "autoAlpha" && (f === 1 && yt(t, "visibility") === "hidden" && c && (f = 0), T.push("visibility", 0, o.visibility), Tt(this, o, "visibility", f ? "inherit" : "hidden", c ? "inherit" : "hidden", !c)), d !== "scale" && d !== "transform" && (d = pt[d], ~d.indexOf(",") && (d = d.split(",")[0]))), x = d in xt, x) {
            if (this.styles.save(d), b = u, _ === "string" && u.substring(0, 6) === "var(--") {
              if (u = st(t, u.substring(4, u.indexOf(")"))), u.substring(0, 5) === "calc(") {
                var S = t.style.perspective;
                t.style.perspective = u, u = st(t, "perspective"), S ? t.style.perspective = S : Et(t, "perspective");
              }
              c = parseFloat(u);
            }
            if (w || (m = t._gsap, m.renderTransform && !e.parseTransform || De(t, e.parseTransform), C = e.smoothOrigin !== !1 && m.smooth, w = this._pt = new J(this._pt, o, L, 0, 1, m.renderTransform, m, 0, -1), w.dep = 1), d === "scale")
              this._pt = new J(this._pt, m, "scaleY", m.scaleY, (y ? Jt(m.scaleY, y + c) : c) - m.scaleY || 0, bi), this._pt.u = 0, s.push("scaleY", d), d += "X";
            else if (d === "transformOrigin") {
              T.push(tt, 0, o[tt]), u = go(u), m.svg ? Ci(t, u, 0, C, 0, this) : (v = parseFloat(u.split(" ")[2]) || 0, v !== m.zOrigin && Tt(this, m, "zOrigin", m.zOrigin, v), Tt(this, o, d, Ge(h), Ge(u)));
              continue;
            } else if (d === "svgOrigin") {
              Ci(t, u, 1, C, 0, this);
              continue;
            } else if (d in Pn) {
              bo(this, m, d, f, y ? Jt(f, y + u) : u);
              continue;
            } else if (d === "smoothOrigin") {
              Tt(this, m, "smooth", m.smooth, u);
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
            g = (h + "").substr((f + "").length), c || (c = 0), v = W(u) || (d in ot.units ? ot.units[d] : g), g !== v && (f = Ot(t, d, h, v)), this._pt = new J(this._pt, x ? m : o, d, f, (y ? Jt(f, y + c) : c) - f, !x && (v === "px" || d === "zIndex") && e.autoRound !== !1 ? no : bi), this._pt.u = v || 0, x && b !== u ? (this._pt.b = h, this._pt.e = b, this._pt.r = ro) : g !== v && v !== "%" && (this._pt.b = h, this._pt.r = io);
          else if (d in o)
            po.call(this, t, d, h, y ? y + u : u);
          else if (d in t)
            this.add(t, d, h || t[d], y ? y + u : u, r, n);
          else if (d !== "parseTransform") {
            Mi(d, u);
            continue;
          }
          x || (d in o ? T.push(d, 0, o[d]) : typeof t[d] == "function" ? T.push(d, 2, t[d]()) : T.push(d, 1, h || t[d])), s.push(d);
        }
      }
    k && yn(this);
  },
  render: function(t, e) {
    if (e.tween._time || !Hi())
      for (var i = e._pt; i; )
        i.r(t, i.d), i = i._next;
    else
      e.styles.revert();
  },
  get: yt,
  aliases: pt,
  getSetter: function(t, e, i) {
    var r = pt[e];
    return r && r.indexOf(",") < 0 && (e = r), e in xt && e !== tt && (t._gsap.x || yt(t, "x")) ? i && pr === i ? e === "scale" ? lo : ao : (pr = i || {}) && (e === "scale" ? ho : uo) : t.style && !$i(t.style[e]) ? so : ~e.indexOf("-") ? oo : Ii(t, e);
  },
  core: {
    _removeProperty: Et,
    _getMatrix: Ki
  }
};
et.utils.checkPrefix = he;
et.core.getStyleSaver = kn;
(function(a, t, e, i) {
  var r = Q(a + "," + t + "," + e, function(n) {
    xt[n] = 1;
  });
  Q(t, function(n) {
    ot.units[n] = "deg", Pn[n] = 1;
  }), pt[r[13]] = a + "," + t, Q(i, function(n) {
    var s = n.split(":");
    pt[s[1]] = r[s[0]];
  });
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
Q("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(a) {
  ot.units[a] = "px";
});
et.registerPlugin(On);
var Gt = et.registerPlugin(On) || et;
Gt.core.Tween;
var wo = Object.defineProperty, ji = (a, t, e, i) => {
  for (var r = void 0, n = a.length - 1, s; n >= 0; n--)
    (s = a[n]) && (r = s(t, e, r) || r);
  return r && wo(t, e, r), r;
};
const kr = [
  { name: "YouTube", icon: "youtube", package: "com.google.android.youtube.tv" },
  { name: "Netflix", icon: "netflix", package: "com.netflix.ninja" },
  { name: "IPTV", icon: "tv", package: "ru.iptvremote.android.iptv" }
], Tr = {
  "com.google.android.youtube.tv": { label: "YouTube", color: "#FF0000" },
  "com.netflix.ninja": { label: "Netflix", color: "#E50914" },
  "ru.iptvremote.android.iptv": { label: "IPTV", color: "#4fc3f7" },
  "com.google.android.tvlauncher": { label: "Home", color: "#4285F4" },
  "com.sony.dtv.tvx": { label: "Live TV", color: "#0077B5" },
  "com.disney.disneyplus": { label: "Disney+", color: "#113CCF" },
  "com.amazon.amazonvideo.livingroom": { label: "Prime Video", color: "#00A8E1" },
  "com.apple.atve.androidtv.appletv": { label: "Apple TV", color: "#555555" },
  "com.plexapp.android": { label: "Plex", color: "#E5A00D" }
}, q = {
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
  netflix: '<svg viewBox="0 0 111 30" fill="currentColor"><path d="M105.062 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 8.31c-1.812-.28-3.624-.436-5.405-.625l6.062-13.5L93.5 0h5.28l3.062 7.874L105 0h5.343l-5.28 14.28zM90.311 0h-4.968v27.25c1.687.094 3.374.156 5.125.156V0zm-14.406 0h-4.968v24.938c1.687.094 3.374.156 5.125.156V0zM70.999 0h-4.969v22.625c1.688.094 3.375.156 5.125.156V0zM56.124 0h-4.969v20.313c1.688.093 3.375.155 5.125.155V0zM41.062 0h-4.969v17.969c1.688.094 3.375.156 5.125.156V0zM24.999 0h-4.969v15.656c1.688.094 3.375.156 5.125.156V0zM10.937 0H6v13.344c1.688.093 3.375.155 5.125.155V0z"/></svg>',
  tv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="13" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>'
}, Co = {
  youtube: "app-youtube.png",
  netflix: "app-netflix.png",
  tv: "app-iptv.png"
}, ko = "/local/bravia-tv-remote/assets", qi = class qi extends be {
  constructor() {
    super(...arguments), this._showIndicator = !1, this._swipeStartX = 0, this._swipeStartY = 0, this._SWIPE_THRESHOLD = 30, this._boundPointerDown = this._onDpadPointerDown.bind(this), this._boundPointerUp = this._onDpadPointerUp.bind(this), this._audioContext = null;
  }
  /* ── HA card API ────────────────────────────────────────────── */
  static getStubConfig() {
    return { entity: "media_player.android_tv_192_168_11_26", apps: kr };
  }
  setConfig(t) {
    if (!t.entity)
      throw new Error("bravia-tv-remote: 'entity' is required");
    this._config = { ...t }, this._apps = t.apps ?? kr;
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
    const t = Tr[this._appId];
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
    this._showFeedback(), this._isOn ? this._callService("media_player", "turn_off") : this._callService("media_player", "turn_on");
  }
  _playPause() {
    this._showFeedback(), this._callService("media_player", "media_play_pause");
  }
  _volumeUp() {
    this._showFeedback(), this._callService("media_player", "volume_up");
  }
  _volumeDown() {
    this._showFeedback(), this._callService("media_player", "volume_down");
  }
  _volumeMute() {
    this._showFeedback(), this._callService("media_player", "volume_mute", {
      is_volume_muted: !this._isMuted
    });
  }
  _sendKey(t) {
    this._showFeedback(), this._callService("androidtv", "adb_command", {
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
    this._showFeedback(), this._callService("androidtv", "adb_command", {
      command: `monkey -p ${t} -c android.intent.category.LAUNCHER 1`
    });
  }
  _playClickSound() {
    try {
      this._audioContext || (this._audioContext = new AudioContext());
      const t = this._audioContext, e = t.createOscillator(), i = t.createGain();
      e.connect(i), i.connect(t.destination), e.frequency.value = 800, e.type = "sine", i.gain.setValueAtTime(0.1, t.currentTime), i.gain.exponentialRampToValueAtTime(0.01, t.currentTime + 0.1), e.start(t.currentTime), e.stop(t.currentTime + 0.1);
    } catch (t) {
      console.warn("Audio feedback not available:", t);
    }
  }
  _showFeedback() {
    this._playClickSound(), this._showIndicator = !0, setTimeout(() => {
      this._showIndicator = !1;
    }, 800);
  }
  firstUpdated() {
    const t = this.shadowRoot.querySelector(".dpad-disc");
    t && (t.addEventListener("pointerdown", this._boundPointerDown), t.addEventListener("pointerup", this._boundPointerUp));
    const e = this.shadowRoot.querySelector(".remote-body");
    e && e.addEventListener("click", (i) => {
      const r = i.target.closest(".ctrl-btn, .app-btn, .vol-rocker-btn, .color-btn");
      r && Gt.fromTo(
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
    }[o](), Gt.timeline().to(s, { ...l, duration: 0.12, ease: "power2.out" }).to(s, { x: 0, y: 0, duration: 0.25, ease: "elastic.out(1, 0.5)" });
    const u = this.shadowRoot.querySelector(`.dpad-arrow.${o}`);
    u && Gt.fromTo(
      u,
      { color: "rgba(255,255,255,0.8)" },
      { color: "rgba(255,255,255,0.25)", duration: 0.4 }
    );
  }
  _animateOk() {
    const t = this.shadowRoot.querySelector(".dpad-ok");
    t && Gt.fromTo(
      t,
      { scale: 0.9 },
      { scale: 1, duration: 0.35, ease: "elastic.out(1, 0.5)" }
    ), this._dpadCenter();
  }
  _animateDpadArrow(t) {
    const e = this.shadowRoot.querySelector(`.dpad-arrow.${t}`);
    e && Gt.fromTo(
      e,
      { scale: 0.85, color: "rgba(255,255,255,0.8)" },
      { scale: 1, color: "rgba(255,255,255,0.25)", duration: 0.3, ease: "elastic.out(1, 0.4)" }
    ), { up: () => this._dpadUp(), down: () => this._dpadDown(), left: () => this._dpadLeft(), right: () => this._dpadRight() }[t]();
  }
  /* ── Render ─────────────────────────────────────────────────── */
  render() {
    if (!this._config)
      return qt`<ha-card><div>Loading…</div></ha-card>`;
    const t = this._isOn ? "on" : "off";
    return this._mediaTitle, this._mediaArtist, this._entityPicture, this._appName, qt`
      <ha-card>
        <!-- Feedback Indicator -->
        <div class="feedback-indicator ${this._showIndicator ? "active" : ""}"></div>

        <div class="remote-body">

          <!-- Power button -->
          <div class="top-row">
            <button class="ctrl-btn power-btn ${t}" @click="${this._togglePower}" title="Power">
              <span .innerHTML="${q.power}"></span>
            </button>
          </div>

          <!-- App launchers -->
          <div class="app-launchers">
            ${this._apps.map((e) => {
      const i = this._appId === e.package, r = Tr[e.package]?.color ?? "#4fc3f7", n = Co[e.icon], s = n ? `${ko}/${n}` : "";
      return qt`
                <button
                  class="app-btn ${e.icon} ${i ? "active" : ""}"
                  style="--active-color: ${r}"
                  @click="${() => this._launchApp(e.package)}"
                >
                  ${s ? qt`<img src="${s}" alt="${e.name}" />` : qt`<span .innerHTML="${q[e.icon] || q.play}"></span>`}
                  ${e.icon === "tv" ? qt`<span class="label">${e.name}</span>` : ""}
                </button>
              `;
    })}
          </div>

          <!-- D-pad disc -->
          <div class="remote-section">
            <div class="dpad-container">
              <div class="dpad-disc"></div>
              <button class="dpad-arrow up" @click="${() => this._animateDpadArrow("up")}">
                <span .innerHTML="${q.up}"></span>
              </button>
              <button class="dpad-arrow left" @click="${() => this._animateDpadArrow("left")}">
                <span .innerHTML="${q.left}"></span>
              </button>
              <button class="dpad-ok" @click="${this._animateOk}">OK</button>
              <button class="dpad-arrow right" @click="${() => this._animateDpadArrow("right")}">
                <span .innerHTML="${q.right}"></span>
              </button>
              <button class="dpad-arrow down" @click="${() => this._animateDpadArrow("down")}">
                <span .innerHTML="${q.down}"></span>
              </button>
            </div>
          </div>

          <!-- Back + Home -->
          <div class="remote-section" style="margin-top: 8px;">
            <div class="nav-row">
              <div class="labeled-btn">
                <button class="ctrl-btn sm" @click="${this._goBack}" title="Back">
                  <span .innerHTML="${q.back}"></span>
                </button>
                <span class="btn-label">Back</span>
              </div>
              <div class="labeled-btn">
                <button class="ctrl-btn sm" @click="${this._goHome}" title="Home">
                  <span .innerHTML="${q.home}"></span>
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
                  <span .innerHTML="${q[this._isMuted ? "mute" : "volume-x"]}"></span>
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
                  <span .innerHTML="${q.rewind}"></span>
                </button>
                <span class="btn-label">Rew</span>
              </div>
              <div class="labeled-btn">
                <button class="ctrl-btn md" @click="${this._playPause}" title="Play/Pause">
                  <span .innerHTML="${q[this._isPlaying ? "pause" : "play"]}"></span>
                </button>
                <span class="btn-label">Play</span>
              </div>
              <div class="labeled-btn">
                <button class="ctrl-btn sm" @click="${this._mediaFastForward}" title="Fast Forward">
                  <span .innerHTML="${q["fast-forward"]}"></span>
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
                  <span .innerHTML="${q["skip-back"]}"></span>
                </button>
                <span class="btn-label">Prev</span>
              </div>
              <div class="labeled-btn">
                <button class="ctrl-btn sm" @click="${this._playPause}" title="Pause">
                  <span .innerHTML="${q.pause}"></span>
                </button>
                <span class="btn-label">Pause</span>
              </div>
              <div class="labeled-btn">
                <button class="ctrl-btn sm" @click="${this._mediaNext}" title="Next">
                  <span .innerHTML="${q["skip-forward"]}"></span>
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
qi.styles = Dn`
    :host {
      display: block;
      --text-primary: #e0e0e0;
      --text-secondary: #777;
      --text-dim: #444;
      --accent: #4fc3f7;
      --youtube: #ff0000;
      --netflix: #e50914;
      --iptv: #4fc3f7;
    }

    ha-card {
      background: transparent;
      border: none;
      box-shadow: none;
      padding: 24px 0;
      position: relative;
    }

    /* ── Feedback Indicator ──────────────────── */

    .feedback-indicator {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #4caf50;
      box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
      opacity: 0;
      transition: opacity 0.2s ease;
      z-index: 1000;
    }

    .feedback-indicator.active {
      opacity: 1;
      animation: pulse 0.8s ease-out;
    }

    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
      }
      50% {
        box-shadow: 0 0 0 8px rgba(76, 175, 80, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
      }
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
let ue = qi;
ji([
  Or({ attribute: !1 })
], ue.prototype, "hass");
ji([
  Mr()
], ue.prototype, "_config");
ji([
  Mr()
], ue.prototype, "_showIndicator");
customElements.get("bravia-tv-remote") || customElements.define("bravia-tv-remote", ue);
typeof window < "u" && (window.customCards = window.customCards || [], window.customCards.some((a) => a.type === "bravia-tv-remote") || window.customCards.push({
  type: "bravia-tv-remote",
  name: "Bravia TV Remote",
  description: "Full remote control for Sony Bravia Android TV with ADB integration"
}));
export {
  ue as BraviaTvRemote
};
//# sourceMappingURL=bravia-tv-remote.js.map
