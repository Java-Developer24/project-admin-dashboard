import{r as i,j as l}from"./index--FpPv6_1.js";function w(e,t,{checkForDefaultPrevented:n=!0}={}){return function(r){if(e==null||e(r),n===!1||!r.defaultPrevented)return t==null?void 0:t(r)}}function $(e,t){const n=i.createContext(t);function o(u){const{children:s,...c}=u,f=i.useMemo(()=>c,Object.values(c));return l.jsx(n.Provider,{value:f,children:s})}function r(u){const s=i.useContext(n);if(s)return s;if(t!==void 0)return t;throw new Error(`\`${u}\` must be used within \`${e}\``)}return o.displayName=e+"Provider",[o,r]}function g(e,t=[]){let n=[];function o(u,s){const c=i.createContext(s),f=n.length;n=[...n,s];function a(d){const{scope:x,children:b,...h}=d,v=(x==null?void 0:x[e][f])||c,p=i.useMemo(()=>h,Object.values(h));return l.jsx(v.Provider,{value:p,children:b})}function S(d,x){const b=(x==null?void 0:x[e][f])||c,h=i.useContext(b);if(h)return h;if(s!==void 0)return s;throw new Error(`\`${d}\` must be used within \`${u}\``)}return a.displayName=u+"Provider",[a,S]}const r=()=>{const u=n.map(s=>i.createContext(s));return function(c){const f=(c==null?void 0:c[e])||u;return i.useMemo(()=>({[`__scope${e}`]:{...c,[e]:f}}),[c,f])}};return r.scopeName=e,[o,P(r,...t)]}function P(...e){const t=e[0];if(e.length===1)return t;const n=()=>{const o=e.map(r=>({useScope:r(),scopeName:r.scopeName}));return function(u){const s=o.reduce((c,{useScope:f,scopeName:a})=>{const d=f(u)[`__scope${a}`];return{...c,...d}},{});return i.useMemo(()=>({[`__scope${t.scopeName}`]:s}),[s])}};return n.scopeName=t.scopeName,n}function C(e){const t=i.useRef(e);return i.useEffect(()=>{t.current=e}),i.useMemo(()=>(...n)=>{var o;return(o=t.current)==null?void 0:o.call(t,...n)},[])}function j({prop:e,defaultProp:t,onChange:n=()=>{}}){const[o,r]=y({defaultProp:t,onChange:n}),u=e!==void 0,s=u?e:o,c=C(n),f=i.useCallback(a=>{if(u){const d=typeof a=="function"?a(e):a;d!==e&&c(d)}else r(a)},[u,e,r,c]);return[s,f]}function y({defaultProp:e,onChange:t}){const n=i.useState(e),[o]=n,r=i.useRef(o),u=C(t);return i.useEffect(()=>{r.current!==o&&(u(o),r.current=o)},[o,r,u]),n}function M(e){const t=i.useRef({value:e,previous:e});return i.useMemo(()=>(t.current.value!==e&&(t.current.previous=t.current.value,t.current.value=e),t.current.previous),[e])}var z=globalThis!=null&&globalThis.document?i.useLayoutEffect:()=>{};function R(e){const[t,n]=i.useState(void 0);return z(()=>{if(e){n({width:e.offsetWidth,height:e.offsetHeight});const o=new ResizeObserver(r=>{if(!Array.isArray(r)||!r.length)return;const u=r[0];let s,c;if("borderBoxSize"in u){const f=u.borderBoxSize,a=Array.isArray(f)?f[0]:f;s=a.inlineSize,c=a.blockSize}else s=e.offsetWidth,c=e.offsetHeight;n({width:s,height:c})});return o.observe(e,{box:"border-box"}),()=>o.unobserve(e)}else n(void 0)},[e]),t}export{w as a,$ as b,g as c,j as d,M as e,R as f,C as g,z as u};
