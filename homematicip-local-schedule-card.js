function t(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),n=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:d,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,_=globalThis,g=_.trustedTypes,v=g?g.emptyScript:"",E=_.reactiveElementPolyfillSupport,f=(t,e)=>t,m={toAttribute(t,e){switch(e){case Boolean:t=t?v:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},y=(t,e)=>!d(t,e),$={attribute:!0,type:String,converter:m,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let A=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);n?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...h(t),...u(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),n=e.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:m).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:m;this._$Em=s;const o=n.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const s=this.constructor,n=this[t];if(i??=s.getPropertyOptions(t),!((i.hasChanged??y)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==n||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[f("elementProperties")]=new Map,A[f("finalized")]=new Map,E?.({ReactiveElement:A}),(_.reactiveElementVersions??=[]).push("2.1.1");const S=globalThis,b=S.trustedTypes,x=b?b.createPolicy("lit-html",{createHTML:t=>t}):void 0,w="$lit$",D=`lit$${Math.random().toFixed(9).slice(2)}$`,T="?"+D,N=`<${T}>`,I=document,C=()=>I.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,L="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,k=/-->/g,M=/>/g,F=RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,P=/"/g,V=/^(?:script|style|textarea|title)$/i,Y=(t,...e)=>({_$litType$:1,strings:t,values:e}),W=Symbol.for("lit-noChange"),z=Symbol.for("lit-nothing"),j=new WeakMap,B=I.createTreeWalker(I,129);function Z(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==x?x.createHTML(e):e}const X=(t,e)=>{const i=t.length-1,s=[];let n,o=2===e?"<svg>":3===e?"<math>":"",r=R;for(let e=0;e<i;e++){const i=t[e];let a,d,l=-1,c=0;for(;c<i.length&&(r.lastIndex=c,d=r.exec(i),null!==d);)c=r.lastIndex,r===R?"!--"===d[1]?r=k:void 0!==d[1]?r=M:void 0!==d[2]?(V.test(d[2])&&(n=RegExp("</"+d[2],"g")),r=F):void 0!==d[3]&&(r=F):r===F?">"===d[0]?(r=n??R,l=-1):void 0===d[1]?l=-2:(l=r.lastIndex-d[2].length,a=d[1],r=void 0===d[3]?F:'"'===d[3]?P:H):r===P||r===H?r=F:r===k||r===M?r=R:(r=F,n=void 0);const h=r===F&&t[e+1].startsWith("/>")?" ":"";o+=r===R?i+N:l>=0?(s.push(a),i.slice(0,l)+w+i.slice(l)+D+h):i+D+(-2===l?e:h)}return[Z(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class G{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const r=t.length-1,a=this.parts,[d,l]=X(t,e);if(this.el=G.createElement(d,i),B.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=B.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(w)){const e=l[o++],i=s.getAttribute(t).split(D),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:r[2],strings:i,ctor:"."===r[1]?tt:"?"===r[1]?et:"@"===r[1]?it:Q}),s.removeAttribute(t)}else t.startsWith(D)&&(a.push({type:6,index:n}),s.removeAttribute(t));if(V.test(s.tagName)){const t=s.textContent.split(D),e=t.length-1;if(e>0){s.textContent=b?b.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],C()),B.nextNode(),a.push({type:2,index:++n});s.append(t[e],C())}}}else if(8===s.nodeType)if(s.data===T)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(D,t+1));)a.push({type:7,index:n}),t+=D.length-1}n++}}static createElement(t,e){const i=I.createElement("template");return i.innerHTML=t,i}}function K(t,e,i=t,s){if(e===W)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const o=O(e)?void 0:e._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=K(t,n._$AS(t,e.values),n,s)),e}let J=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??I).importNode(e,!0);B.currentNode=s;let n=B.nextNode(),o=0,r=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new q(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new st(n,this,t)),this._$AV.push(e),a=i[++r]}o!==a?.index&&(n=B.nextNode(),o++)}return B.currentNode=I,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}};class q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=z,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),O(t)?t===z||null==t||""===t?(this._$AH!==z&&this._$AR(),this._$AH=z):t!==this._$AH&&t!==W&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==z&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(I.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=G.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new J(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=j.get(t.strings);return void 0===e&&j.set(t.strings,e=new G(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new q(this.O(C()),this.O(C()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=z,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=z}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(void 0===n)t=K(this,t,e,0),o=!O(t)||t!==this._$AH&&t!==W,o&&(this._$AH=t);else{const s=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=K(this,s[i+r],e,r),a===W&&(a=this._$AH[r]),o||=!O(a)||a!==this._$AH[r],a===z?t=z:t!==z&&(t+=(a??"")+n[r+1]),this._$AH[r]=a}o&&!s&&this.j(t)}j(t){t===z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===z?void 0:t}}class et extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==z)}}class it extends Q{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=K(this,t,e,0)??z)===W)return;const i=this._$AH,s=t===z&&i!==z||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==z&&(i===z||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const nt={I:q},ot=S.litHtmlPolyfillSupport;ot?.(G,q),(S.litHtmlVersions??=[]).push("3.3.1");const rt=globalThis;let at=class extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new q(e.insertBefore(C(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return W}};at._$litElement$=!0,at.finalized=!0,rt.litElementHydrateSupport?.({LitElement:at});const dt=rt.litElementPolyfillSupport;dt?.({LitElement:at}),(rt.litElementVersions??=[]).push("4.2.1");const lt={attribute:!0,type:String,converter:m,reflect:!1,hasChanged:y},ct=(t=lt,e,i)=>{const{kind:s,metadata:n}=i;let o=globalThis.litPropertyMetadata.get(n);if(void 0===o&&globalThis.litPropertyMetadata.set(n,o=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const n=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,n,t)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const n=this[s];e.call(this,i),this.requestUpdate(s,n,t)}}throw Error("Unsupported decorator location: "+s)};function ht(t){return(e,i)=>"object"==typeof i?ct(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function ut(t){return ht({...t,state:!0,attribute:!1})}class pt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}const{I:_t}=nt,gt=()=>document.createComment(""),vt=(t,e,i)=>{const s=t._$AA.parentNode,n=void 0===e?t._$AB:e._$AA;if(void 0===i){const e=s.insertBefore(gt(),n),o=s.insertBefore(gt(),n);i=new _t(e,o,t,t.options)}else{const e=i._$AB.nextSibling,o=i._$AM,r=o!==t;if(r){let e;i._$AQ?.(t),i._$AM=t,void 0!==i._$AP&&(e=t._$AU)!==o._$AU&&i._$AP(e)}if(e!==n||r){let t=i._$AA;for(;t!==e;){const e=t.nextSibling;s.insertBefore(t,n),t=e}}}return i},Et=(t,e,i=t)=>(t._$AI(e,i),t),ft={},mt=t=>{t._$AR(),t._$AA.remove()},yt=(t,e,i)=>{const s=new Map;for(let n=e;n<=i;n++)s.set(t[n],n);return s},$t=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends pt{constructor(t){if(super(t),2!==t.type)throw Error("repeat() can only be used in text expressions")}dt(t,e,i){let s;void 0===i?i=e:void 0!==e&&(s=e);const n=[],o=[];let r=0;for(const e of t)n[r]=s?s(e,r):r,o[r]=i(e,r),r++;return{values:o,keys:n}}render(t,e,i){return this.dt(t,e,i).values}update(t,[e,i,s]){const n=(t=>t._$AH)(t),{values:o,keys:r}=this.dt(e,i,s);if(!Array.isArray(n))return this.ut=r,o;const a=this.ut??=[],d=[];let l,c,h=0,u=n.length-1,p=0,_=o.length-1;for(;h<=u&&p<=_;)if(null===n[h])h++;else if(null===n[u])u--;else if(a[h]===r[p])d[p]=Et(n[h],o[p]),h++,p++;else if(a[u]===r[_])d[_]=Et(n[u],o[_]),u--,_--;else if(a[h]===r[_])d[_]=Et(n[h],o[_]),vt(t,d[_+1],n[h]),h++,_--;else if(a[u]===r[p])d[p]=Et(n[u],o[p]),vt(t,n[h],n[u]),u--,p++;else if(void 0===l&&(l=yt(r,p,_),c=yt(a,h,u)),l.has(a[h]))if(l.has(a[u])){const e=c.get(r[p]),i=void 0!==e?n[e]:null;if(null===i){const e=vt(t,n[h]);Et(e,o[p]),d[p]=e}else d[p]=Et(i,o[p]),vt(t,n[h],i),n[e]=null;p++}else mt(n[u]),u--;else mt(n[h]),h++;for(;p<=_;){const e=vt(t,d[_+1]);Et(e,o[p]),d[p++]=e}for(;h<=u;){const t=n[h++];null!==t&&mt(t)}return this.ut=r,((t,e=ft)=>{t._$AH=e})(t,d),W}});var At;!function(t){t[t.SUNDAY=1]="SUNDAY",t[t.MONDAY=2]="MONDAY",t[t.TUESDAY=4]="TUESDAY",t[t.WEDNESDAY=8]="WEDNESDAY",t[t.THURSDAY=16]="THURSDAY",t[t.FRIDAY=32]="FRIDAY",t[t.SATURDAY=64]="SATURDAY"}(At||(At={}));const St=["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"],bt={SUNDAY:At.SUNDAY,MONDAY:At.MONDAY,TUESDAY:At.TUESDAY,WEDNESDAY:At.WEDNESDAY,THURSDAY:At.THURSDAY,FRIDAY:At.FRIDAY,SATURDAY:At.SATURDAY};var xt,wt,Dt;function Tt(t){const e=[];for(const i of St)t.includes(bt[i])&&e.push(i);return e}function Nt(t){return Boolean(t.WEEKDAY&&t.WEEKDAY.length>0&&t.TARGET_CHANNELS&&t.TARGET_CHANNELS.length>0)}function It(t,e){return{...e,groupNo:t,weekdayNames:Tt(e.WEEKDAY),timeString:(i=e.FIXED_HOUR,s=e.FIXED_MINUTE,`${i.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`),isActive:Nt(e)};var i,s}!function(t){t[t.SUNRISE=0]="SUNRISE",t[t.SUNSET=1]="SUNSET"}(xt||(xt={})),function(t){t[t.FIXED_TIME=0]="FIXED_TIME",t[t.ASTRO=1]="ASTRO"}(wt||(wt={})),function(t){t[t.MS_100=0]="MS_100",t[t.SEC_1=1]="SEC_1",t[t.SEC_5=2]="SEC_5",t[t.SEC_10=3]="SEC_10",t[t.MIN_1=4]="MIN_1",t[t.MIN_5=5]="MIN_5",t[t.MIN_10=6]="MIN_10",t[t.HOUR_1=7]="HOUR_1"}(Dt||(Dt={}));const Ct={en:{weekdays:{short:{monday:"Mo",tuesday:"Tu",wednesday:"We",thursday:"Th",friday:"Fr",saturday:"Sa",sunday:"Su"},long:{monday:"Monday",tuesday:"Tuesday",wednesday:"Wednesday",thursday:"Thursday",friday:"Friday",saturday:"Saturday",sunday:"Sunday"}},categories:{SWITCH:"Switch",LOCK:"Lock",LIGHT:"Light",COVER:"Cover",VALVE:"Valve"},ui:{schedule:"Schedule",loading:"Loading schedule data...",entityNotFound:"Entity {entity} not found",clickToEdit:"Click on a day to edit its schedule",edit:"Edit {weekday}",cancel:"Cancel",save:"Save",addTimeBlock:"+ Add Time Block",copySchedule:"Copy schedule",pasteSchedule:"Paste schedule",undo:"Undo",redo:"Redo",undoShortcut:"Undo (Ctrl+Z)",redoShortcut:"Redo (Ctrl+Y)",toggleCompactView:"Compact view",toggleFullView:"Full view",exportSchedule:"Export",importSchedule:"Import",exportTooltip:"Export schedule to JSON file",importTooltip:"Import schedule from JSON file",exportSuccess:"Schedule exported successfully",importSuccess:"Schedule imported successfully",unsavedChanges:"Unsaved changes",saveAll:"Save all",discard:"Discard",enableDragDrop:"Enable drag & drop mode",disableDragDrop:"Disable drag & drop mode",confirmDiscardChanges:"You have unsaved changes. Do you want to discard them?",level:"Level",slat:"Slat Position",addEvent:"Add Event",editEvent:"Edit Event",time:"Time",duration:"Duration",state:"State",weekdays:"Weekdays",channels:"Target Channels",confirmDelete:"Are you sure you want to delete this event?"},errors:{failedToChangeProfile:"Failed to change profile: {error}",failedToSaveSchedule:"Failed to save schedule: {error}",failedToPasteSchedule:"Failed to paste schedule: {error}",invalidSchedule:"Invalid schedule: {error}",failedToExport:"Failed to export schedule: {error}",failedToImport:"Failed to import schedule: {error}",invalidImportFile:"Invalid file format. Please select a JSON file.",invalidImportFormat:"Invalid JSON format in file.",invalidImportData:"Invalid schedule data: {error}"},warnings:{title:"Validation Warnings",noWarnings:"No issues detected"}},de:{weekdays:{short:{monday:"Mo",tuesday:"Di",wednesday:"Mi",thursday:"Do",friday:"Fr",saturday:"Sa",sunday:"So"},long:{monday:"Montag",tuesday:"Dienstag",wednesday:"Mittwoch",thursday:"Donnerstag",friday:"Freitag",saturday:"Samstag",sunday:"Sonntag"}},categories:{SWITCH:"Schalter",LOCK:"Schloss",LIGHT:"Licht",COVER:"Rollladen",VALVE:"Ventil"},ui:{schedule:"Zeitplan",loading:"Zeitplandaten werden geladen...",entityNotFound:"Entität {entity} nicht gefunden",clickToEdit:"Klicken Sie auf einen Tag, um den Zeitplan zu bearbeiten",edit:"{weekday} bearbeiten",cancel:"Abbrechen",save:"Speichern",addTimeBlock:"+ Zeitblock hinzufügen",copySchedule:"Zeitplan kopieren",pasteSchedule:"Zeitplan einfügen",undo:"Rückgängig",redo:"Wiederholen",undoShortcut:"Rückgängig (Strg+Z)",redoShortcut:"Wiederholen (Strg+Y)",toggleCompactView:"Kompaktansicht",toggleFullView:"Vollansicht",exportSchedule:"Exportieren",importSchedule:"Importieren",exportTooltip:"Zeitplan als JSON-Datei exportieren",importTooltip:"Zeitplan aus JSON-Datei importieren",exportSuccess:"Zeitplan erfolgreich exportiert",importSuccess:"Zeitplan erfolgreich importiert",unsavedChanges:"Ungespeicherte Änderungen",saveAll:"Alle speichern",discard:"Verwerfen",enableDragDrop:"Drag & Drop Modus aktivieren",disableDragDrop:"Drag & Drop Modus deaktivieren",confirmDiscardChanges:"Sie haben ungespeicherte Änderungen. Möchten Sie diese verwerfen?",level:"Stufe",slat:"Lamellenposition",addEvent:"Ereignis hinzufügen",editEvent:"Ereignis bearbeiten",time:"Zeit",duration:"Dauer",state:"Zustand",weekdays:"Wochentage",channels:"Zielkanäle",confirmDelete:"Möchten Sie dieses Ereignis wirklich löschen?"},errors:{failedToChangeProfile:"Fehler beim Wechseln des Profils: {error}",failedToSaveSchedule:"Fehler beim Speichern des Zeitplans: {error}",failedToPasteSchedule:"Fehler beim Einfügen des Zeitplans: {error}",invalidSchedule:"Ungültiger Zeitplan: {error}",failedToExport:"Fehler beim Exportieren des Zeitplans: {error}",failedToImport:"Fehler beim Importieren des Zeitplans: {error}",invalidImportFile:"Ungültiges Dateiformat. Bitte wählen Sie eine JSON-Datei.",invalidImportFormat:"Ungültiges JSON-Format in der Datei.",invalidImportData:"Ungültige Zeitplandaten: {error}"},warnings:{title:"Validierungswarnungen",noWarnings:"Keine Probleme erkannt"}}};function Ot(t){const e=t.toLowerCase().split("-")[0];return Ct[e]||Ct.en}let Ut=class extends at{constructor(){super(...arguments),this._isLoading=!1,this._translations=Ot("en"),this._showEditor=!1}setConfig(t){const e=[],i=t=>{if(!t)return;const i=t.trim();i&&(e.includes(i)||e.push(i))};if(i(t.entity),Array.isArray(t.entities)&&t.entities.forEach(t=>i(t)),0===e.length)throw new Error("You need to define at least one entity");e.sort((t,e)=>t.localeCompare(e));const s=this._activeEntityId,n=e[0],o=s&&e.includes(s)?s:n;this._config={editable:!0,hour_format:"24",time_step_minutes:15,...t,entity:n,entities:[...e]},this._activeEntityId=o,this._editingEvent=void 0,this._editingGroupNo=void 0,this._showEditor=!1,this._updateLanguage()}_updateLanguage(){let t="en";this._config?.language?t=this._config.language:this.hass?.language?t=this.hass.language:this.hass?.locale?.language&&(t=this.hass.locale.language),this._translations=Ot(t)}shouldUpdate(t){if(t.has("hass")){const e=t.get("hass");if(this.hass&&e){if(this.hass.language===e.language&&this.hass.locale?.language===e.locale?.language||this._updateLanguage(),this._activeEntityId){const t=e.states?.[this._activeEntityId],i=this.hass.states?.[this._activeEntityId];t!==i&&this._updateScheduleData()}}else this.hass&&!e&&this._updateScheduleData()}return t.has("_activeEntityId")&&this._updateScheduleData(),!0}_updateScheduleData(){if(!this._activeEntityId||!this.hass?.states)return this._scheduleData=void 0,void(this._category=void 0);const t=this.hass.states[this._activeEntityId];if(!t)return this._scheduleData=void 0,void(this._category=void 0);const e=t.attributes;this._scheduleData=e.schedule_data,this._category=e.datapoint_category}_getEntityName(t){const e=this.hass?.states?.[t];return e?.attributes?.friendly_name||t}_handleEntityChange(t){this._activeEntityId=t.target.value,this._closeEditor()}_handleAddEvent(){const t=function(t){const e={ASTRO_OFFSET:0,ASTRO_TYPE:xt.SUNRISE,CONDITION:wt.FIXED_TIME,FIXED_HOUR:0,FIXED_MINUTE:0,TARGET_CHANNELS:[],WEEKDAY:[],LEVEL:0};return"COVER"===t?(e.LEVEL=0,e.LEVEL_2=0):"SWITCH"===t?(e.DURATION_BASE=Dt.MS_100,e.DURATION_FACTOR=0,e.LEVEL=0):"LIGHT"===t?(e.DURATION_BASE=Dt.MS_100,e.DURATION_FACTOR=0,e.RAMP_TIME_BASE=Dt.MS_100,e.RAMP_TIME_FACTOR=0,e.LEVEL=0):"VALVE"===t&&(e.LEVEL=0),e}(this._category),e=this._scheduleData?Object.keys(this._scheduleData).map(t=>parseInt(t,10)):[],i=e.length>0?Math.max(...e):0;this._editingGroupNo=i+1,this._editingEvent={...t},this._showEditor=!0}_handleEditEvent(t){this._editingGroupNo=t.groupNo,this._editingEvent={...t},this._showEditor=!0}_handleDeleteEvent(t){if(!confirm(this._translations.ui.confirmDelete||"Delete this event?"))return;const e={...this._scheduleData};delete e[t.groupNo.toString()],this._saveSchedule(e)}_closeEditor(){this._showEditor=!1,this._editingEvent=void 0,this._editingGroupNo=void 0}_handleSaveEvent(){if(!this._editingEvent||void 0===this._editingGroupNo)return;const t=function(t,e){const i=[];return(t.FIXED_HOUR<0||t.FIXED_HOUR>23)&&i.push({field:"FIXED_HOUR",message:"Hour must be between 0 and 23"}),(t.FIXED_MINUTE<0||t.FIXED_MINUTE>59)&&i.push({field:"FIXED_MINUTE",message:"Minute must be between 0 and 59"}),t.CONDITION===wt.ASTRO&&(t.ASTRO_OFFSET<-120||t.ASTRO_OFFSET>120)&&i.push({field:"ASTRO_OFFSET",message:"Astro offset must be between -120 and 120 minutes"}),"SWITCH"===e||"LOCK"===e?0!==t.LEVEL&&1!==t.LEVEL&&i.push({field:"LEVEL",message:"Level must be 0 or 1 for switch/lock"}):(t.LEVEL<0||t.LEVEL>1)&&i.push({field:"LEVEL",message:"Level must be between 0.0 and 1.0"}),"COVER"===e&&void 0!==t.LEVEL_2&&(t.LEVEL_2<0||t.LEVEL_2>1)&&i.push({field:"LEVEL_2",message:"Slat position must be between 0.0 and 1.0"}),t.WEEKDAY&&0!==t.WEEKDAY.length||i.push({field:"WEEKDAY",message:"At least one weekday must be selected"}),t.TARGET_CHANNELS&&0!==t.TARGET_CHANNELS.length||i.push({field:"TARGET_CHANNELS",message:"At least one target channel must be selected"}),i}(this._editingEvent,this._category);if(t.length>0)return void alert(`Validation errors:\n${t.map(t=>`- ${t.field}: ${t.message}`).join("\n")}`);const e={...this._scheduleData,[this._editingGroupNo.toString()]:this._editingEvent};this._saveSchedule(e),this._closeEditor()}async _saveSchedule(t){if(this._activeEntityId&&this.hass){this._isLoading=!0;try{const e=function(t){const e={};for(const[i,s]of Object.entries(t)){const t=parseInt(i,10);isNaN(t)||(e[t]=s)}return e}(t);await this.hass.callService("homematicip_local","set_schedule",{entity_id:this._activeEntityId,schedule:e}),this._scheduleData=t}catch(t){alert(`Failed to save schedule: ${t}`)}finally{this._isLoading=!1}}}_updateEditingEvent(t){this._editingEvent&&(this._editingEvent={...this._editingEvent,...t},this.requestUpdate())}_groupEventsByWeekday(){const t=new Map;if(!this._scheduleData)return t;const e=function(t){const e=[];for(const[i,s]of Object.entries(t)){const t=parseInt(i,10);isNaN(t)||e.push(It(t,s))}return e.sort((t,e)=>60*t.FIXED_HOUR+t.FIXED_MINUTE-(60*e.FIXED_HOUR+e.FIXED_MINUTE)),e}(this._scheduleData);for(const i of e)for(const e of i.weekdayNames)t.has(e)||t.set(e,[]),t.get(e).push(i);return t}_renderEntitySelector(){return!this._config?.entities||this._config.entities.length<=1?Y``:Y`
      <div class="entity-selector">
        <select @change=${this._handleEntityChange} .value=${this._activeEntityId||""}>
          ${this._config.entities.map(t=>Y`
              <option value=${t} ?selected=${t===this._activeEntityId}>
                ${this._getEntityName(t)}
              </option>
            `)}
        </select>
      </div>
    `}_renderScheduleList(){if(!this._scheduleData)return Y`<div class="no-data">${this._translations.ui.loading}</div>`;const t=this._groupEventsByWeekday();return 0===t.size?Y`
        <div class="no-data">
          <p>No schedule events configured</p>
          ${this._config?.editable?Y`<button @click=${this._handleAddEvent} class="add-button">
                ${this._translations.ui.addEvent||"Add Event"}
              </button>`:""}
        </div>
      `:Y`
      <div class="schedule-list">
        ${this._config?.editable?Y`<div class="toolbar">
              <button @click=${this._handleAddEvent} class="add-button">
                ${this._translations.ui.addEvent||"Add Event"}
              </button>
            </div>`:""}
        ${St.map(e=>{const i=t.get(e)||[];return 0===i.length?Y``:Y`
            <div class="weekday-section">
              <div class="weekday-header">
                ${this._translations.weekdays.long[e.toLowerCase()]}
              </div>
              <div class="events-table">
                <div class="events-header">
                  <div class="col-time">${this._translations.ui.time||"Time"}</div>
                  <div class="col-duration">${this._translations.ui.duration||"Duration"}</div>
                  <div class="col-level">${this._translations.ui.state||"State"}</div>
                  ${this._config?.editable?Y`<div class="col-actions"></div>`:""}
                </div>
                ${$t(i,t=>t.groupNo,t=>this._renderEvent(t))}
              </div>
            </div>
          `})}
      </div>
    `}_renderEvent(t){const e=(i=t.LEVEL,"SWITCH"===(s=this._category)||"LOCK"===s?0===i?"Off":"On":`${Math.round(100*i)}%`);var i,s;const n=void 0!==t.DURATION_BASE&&void 0!==t.DURATION_FACTOR?function(t,e){const i=function(t,e){return{[Dt.MS_100]:100,[Dt.SEC_1]:1e3,[Dt.SEC_5]:5e3,[Dt.SEC_10]:1e4,[Dt.MIN_1]:6e4,[Dt.MIN_5]:3e5,[Dt.MIN_10]:6e5,[Dt.HOUR_1]:36e5}[t]*e}(t,e);return i<1e3?`${i}ms`:i<6e4?`${(i/1e3).toFixed(1)}s`:i<36e5?`${(i/6e4).toFixed(1)}m`:`${(i/36e5).toFixed(1)}h`}(t.DURATION_BASE,t.DURATION_FACTOR):"-";return Y`
      <div class="event-row ${t.isActive?"active":"inactive"}">
        <div class="col-time">${t.timeString}</div>
        <div class="col-duration">${n}</div>
        <div class="col-level">
          ${e}
          ${void 0!==t.LEVEL_2?Y`<span class="level-2"
                >, ${this._translations.ui.slat}: ${Math.round(100*t.LEVEL_2)}%</span
              >`:""}
        </div>
        ${this._config?.editable?Y`<div class="col-actions">
              <button @click=${()=>this._handleEditEvent(t)} class="icon-button" title="Edit">
                ✏️
              </button>
              <button
                @click=${()=>this._handleDeleteEvent(t)}
                class="icon-button"
                title="Delete"
              >
                🗑️
              </button>
            </div>`:""}
      </div>
    `}_renderEditor(){if(!this._showEditor||!this._editingEvent)return Y``;const t=!this._scheduleData?.[this._editingGroupNo?.toString()||""];return Y`
      <div class="editor-overlay" @click=${this._closeEditor}>
        <div class="editor-dialog" @click=${t=>t.stopPropagation()}>
          <div class="editor-header">
            <h3>
              ${t?this._translations.ui.addEvent:this._translations.ui.editEvent}
            </h3>
            <button @click=${this._closeEditor} class="close-button">✕</button>
          </div>
          <div class="editor-content">
            ${this._renderTimeFields()} ${this._renderWeekdayFields()} ${this._renderLevelFields()}
            ${this._renderDurationFields()} ${this._renderChannelFields()}
          </div>
          <div class="editor-footer">
            <button @click=${this._closeEditor} class="button-secondary">
              ${this._translations.ui.cancel||"Cancel"}
            </button>
            <button @click=${this._handleSaveEvent} class="button-primary">
              ${this._translations.ui.save||"Save"}
            </button>
          </div>
        </div>
      </div>
    `}_renderTimeFields(){if(!this._editingEvent)return Y``;const t=`${String(this._editingEvent.FIXED_HOUR).padStart(2,"0")}:${String(this._editingEvent.FIXED_MINUTE).padStart(2,"0")}`;return Y`
      <div class="form-group">
        <label>${this._translations.ui.time||"Time"}</label>
        <input
          type="time"
          .value=${t}
          @change=${t=>{const e=function(t){const e=t.split(":");if(2!==e.length)throw new Error(`Invalid time format: ${t}`);const i=parseInt(e[0],10),s=parseInt(e[1],10);if(isNaN(i)||isNaN(s)||i<0||i>23||s<0||s>59)throw new Error(`Invalid time values: ${t}`);return{hour:i,minute:s}}(t.target.value);this._updateEditingEvent({FIXED_HOUR:e.hour,FIXED_MINUTE:e.minute})}}
        />
      </div>
    `}_renderWeekdayFields(){return this._editingEvent?Y`
      <div class="form-group">
        <label>${this._translations.ui.weekdays||"Weekdays"}</label>
        <div class="weekday-checkboxes">
          ${St.map(t=>{const e=At[t],i=this._editingEvent.WEEKDAY.includes(e);return Y`
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  .checked=${i}
                  @change=${t=>{const i=t.target.checked,s=[...this._editingEvent.WEEKDAY];if(i&&!s.includes(e))s.push(e);else if(!i){const t=s.indexOf(e);t>-1&&s.splice(t,1)}this._updateEditingEvent({WEEKDAY:s})}}
                />
                ${this._translations.weekdays.short[t.toLowerCase()]}
              </label>
            `})}
        </div>
      </div>
    `:Y``}_renderLevelFields(){return this._editingEvent?Y`
      <div class="form-group">
        <label>${this._translations.ui.state||"State"}</label>
        ${"SWITCH"===this._category||"LOCK"===this._category?Y`
              <select
                .value=${String(this._editingEvent.LEVEL)}
                @change=${t=>{const e=parseInt(t.target.value,10);this._updateEditingEvent({LEVEL:e})}}
              >
                <option value="0">Off</option>
                <option value="1">On</option>
              </select>
            `:Y`
              <input
                type="range"
                min="0"
                max="100"
                .value=${String(Math.round(100*this._editingEvent.LEVEL))}
                @input=${t=>{const e=parseInt(t.target.value,10)/100;this._updateEditingEvent({LEVEL:e})}}
              />
              <span>${Math.round(100*this._editingEvent.LEVEL)}%</span>
            `}
      </div>
      ${"COVER"===this._category?Y`
            <div class="form-group">
              <label>${this._translations.ui.slat||"Slat Position"}</label>
              <input
                type="range"
                min="0"
                max="100"
                .value=${String(Math.round(100*(this._editingEvent.LEVEL_2||0)))}
                @input=${t=>{const e=parseInt(t.target.value,10)/100;this._updateEditingEvent({LEVEL_2:e})}}
              />
              <span>${Math.round(100*(this._editingEvent.LEVEL_2||0))}%</span>
            </div>
          `:""}
    `:Y``}_renderDurationFields(){return this._editingEvent?"SWITCH"!==this._category&&"LIGHT"!==this._category?Y``:Y`
      <div class="form-group">
        <label>${this._translations.ui.duration||"Duration"}</label>
        <input
          type="number"
          min="0"
          .value=${String(this._editingEvent.DURATION_FACTOR||0)}
          @input=${t=>{const e=parseInt(t.target.value,10);this._updateEditingEvent({DURATION_FACTOR:e})}}
        />
        <select
          .value=${String(this._editingEvent.DURATION_BASE||Dt.MS_100)}
          @change=${t=>{const e=parseInt(t.target.value,10);this._updateEditingEvent({DURATION_BASE:e})}}
        >
          <option value=${Dt.MS_100}>× 100ms</option>
          <option value=${Dt.SEC_1}>× 1s</option>
          <option value=${Dt.SEC_5}>× 5s</option>
          <option value=${Dt.SEC_10}>× 10s</option>
          <option value=${Dt.MIN_1}>× 1m</option>
          <option value=${Dt.MIN_5}>× 5m</option>
          <option value=${Dt.MIN_10}>× 10m</option>
          <option value=${Dt.HOUR_1}>× 1h</option>
        </select>
      </div>
    `:Y``}_renderChannelFields(){return this._editingEvent?Y`
      <div class="form-group">
        <label>${this._translations.ui.channels||"Target Channels"}</label>
        <input
          type="text"
          .value=${this._editingEvent.TARGET_CHANNELS.join(", ")}
          @input=${t=>{const e=t.target.value.split(",").map(t=>parseInt(t.trim(),10)).filter(t=>!isNaN(t));this._updateEditingEvent({TARGET_CHANNELS:e})}}
          placeholder="1, 2, 4, 8"
        />
      </div>
    `:Y``}render(){if(!this._config)return Y``;const t=this._config.name||this._getEntityName(this._activeEntityId||"");return Y`
      <ha-card>
        <div class="card-header">
          <div class="card-title">${t}</div>
        </div>
        <div class="card-content">
          ${this._renderEntitySelector()} ${this._renderScheduleList()}
        </div>
      </ha-card>
      ${this._renderEditor()}
    `}static get styles(){return r`
      :host {
        display: block;
      }

      ha-card {
        padding: 16px;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .card-title {
        font-size: 24px;
        font-weight: 500;
      }

      .entity-selector {
        margin-bottom: 16px;
      }

      .entity-selector select {
        width: 100%;
        padding: 8px;
        font-size: 14px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
      }

      .no-data {
        text-align: center;
        padding: 32px;
        color: var(--secondary-text-color);
      }

      .toolbar {
        margin-bottom: 16px;
        display: flex;
        justify-content: flex-end;
      }

      .add-button {
        padding: 8px 16px;
        background: var(--primary-color);
        color: var(--text-primary-color);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
      }

      .add-button:hover {
        opacity: 0.9;
      }

      .schedule-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .weekday-section {
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        overflow: hidden;
      }

      .weekday-header {
        background: var(--primary-color);
        color: var(--text-primary-color);
        padding: 8px 16px;
        font-weight: 500;
      }

      .events-table {
        display: flex;
        flex-direction: column;
      }

      .events-header {
        display: grid;
        grid-template-columns: 80px 100px 1fr 80px;
        gap: 12px;
        padding: 8px 16px;
        background: var(--secondary-background-color);
        font-weight: 500;
        font-size: 13px;
        color: var(--secondary-text-color);
      }

      .events-header.no-actions {
        grid-template-columns: 80px 100px 1fr;
      }

      .event-row {
        display: grid;
        grid-template-columns: 80px 100px 1fr 80px;
        gap: 12px;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid var(--divider-color);
      }

      .event-row.no-actions {
        grid-template-columns: 80px 100px 1fr;
      }

      .event-row:last-child {
        border-bottom: none;
      }

      .event-row.inactive {
        opacity: 0.5;
      }

      .col-time {
        font-weight: 500;
      }

      .col-duration {
        color: var(--secondary-text-color);
      }

      .col-level .level-2 {
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }

      .col-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }

      .icon-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        font-size: 16px;
        opacity: 0.7;
      }

      .icon-button:hover {
        opacity: 1;
      }

      /* Editor Overlay */
      .editor-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .editor-dialog {
        background: var(--card-background-color);
        border-radius: 8px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow: auto;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      .editor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid var(--divider-color);
      }

      .editor-header h3 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
      }

      .close-button {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: var(--secondary-text-color);
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .close-button:hover {
        color: var(--primary-text-color);
      }

      .editor-content {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .form-group label {
        font-weight: 500;
        font-size: 14px;
      }

      .form-group input[type="time"],
      .form-group input[type="text"],
      .form-group input[type="number"],
      .form-group select {
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 14px;
      }

      .form-group input[type="range"] {
        width: 100%;
      }

      .weekday-checkboxes {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      .checkbox-label {
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        font-size: 14px;
      }

      .checkbox-label input[type="checkbox"] {
        cursor: pointer;
      }

      .editor-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding: 16px;
        border-top: 1px solid var(--divider-color);
      }

      .button-primary,
      .button-secondary {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
      }

      .button-primary {
        background: var(--primary-color);
        color: var(--text-primary-color);
      }

      .button-primary:hover {
        opacity: 0.9;
      }

      .button-secondary {
        background: transparent;
        color: var(--primary-text-color);
        border: 1px solid var(--divider-color);
      }

      .button-secondary:hover {
        background: var(--secondary-background-color);
      }
    `}getCardSize(){return 4}static getConfigElement(){return document.createElement("homematicip-local-schedule-card-editor")}static getStubConfig(){return{entity:"",editable:!0,hour_format:"24"}}};t([ht({attribute:!1})],Ut.prototype,"hass",void 0),t([ut()],Ut.prototype,"_config",void 0),t([ut()],Ut.prototype,"_scheduleData",void 0),t([ut()],Ut.prototype,"_activeEntityId",void 0),t([ut()],Ut.prototype,"_category",void 0),t([ut()],Ut.prototype,"_isLoading",void 0),t([ut()],Ut.prototype,"_translations",void 0),t([ut()],Ut.prototype,"_editingEvent",void 0),t([ut()],Ut.prototype,"_editingGroupNo",void 0),t([ut()],Ut.prototype,"_showEditor",void 0),Ut=t([(t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)})("homematicip-local-schedule-card")],Ut),window.customCards=window.customCards||[],window.customCards.push({type:"homematicip-local-schedule-card",name:"HomematicIP Local Schedule Card",description:"A custom card for Homematic(IP) Local schedules (switch, valve, cover, light, lock)"});export{Ut as HomematicScheduleCard};
