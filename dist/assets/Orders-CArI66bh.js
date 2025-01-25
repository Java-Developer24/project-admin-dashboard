import{A as C,u as T,a as k,r as a,b as o,j as e,B as x,I as A}from"./index--FpPv6_1.js";const B=()=>{const m=T(),{id:n}=k(),[g,b]=a.useState({}),[r,v]=a.useState(null);a.useState([]);const[f,h]=a.useState(0),[F,p]=a.useState();a.useEffect(()=>{(async()=>{try{const t=await o.get(`/api/user/admin-api/get-orders-data/orders?userId=${n}`);v(t.data[0]),t.data&&t.data.remainingTime&&h(t.data.remainingTime)}catch(t){console.error("Failed to fetch order data:",t)}})(),y()},[n]);const y=async()=>{try{const s=await o.get(`/api/user/user-admin-api/get-user?userId=${n}`);b(s.data)}catch{console.error("Failed to fetch user data")}};a.useEffect(()=>{let s;return f>0&&(s=setInterval(()=>{h(t=>t<=1?(clearInterval(s),0):t-1)},1e3)),()=>{s&&clearInterval(s)}},[f]);const j=s=>{const t=new Date,l=new Date(s)-t;if(l<=0)return"00:00";const i=Math.floor(l/6e4),c=Math.floor(l%6e4/1e3);return`${i<10?"0":""}${i}:${c<10?"0":""}${c}`},N=({expirationTime:s,orderId:t})=>{const[l,i]=a.useState(()=>j(s));return a.useEffect(()=>{const c=()=>{const d=j(s);i(w=>w!==d?(d==="00:00"?p(u=>({...u,[t]:!0})):d.split(":")[0]<="18"&&p(u=>({...u,[t]:!0})),d):w)};c();const S=setInterval(c,1e3);return()=>clearInterval(S)},[s,t]),e.jsx("span",{className:"font-mono",children:l})},$=g.api_key,D=async s=>{try{await o.get(`/api/service/number-cancel?api_key=${s}&id=${r.numberId}&server=${r.server}`),m(`/users-data/${n}`)}catch(t){console.error("Failed to cancel order:",t)}},I=async(s,t)=>{try{await o.delete(`/api/user/admin-api/delete-user-number-data/force-delete?userId=${n}&numberId=${s}&number=${t}&server=${r.server}`),m(`/users-data/${n}`)}catch(l){console.error("Failed to force delete order:",l)}};return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"w-full my-4 flex items-center justify-between",children:e.jsxs(x,{variant:"link",onClick:()=>m(`/users-data/${n}`),className:"text-sm font-normal text-[#8C8C8C] !no-underline p-1 h-0 flex gap-2",children:[e.jsx(A.arrowLeft,{className:"w-4 h-4"})," Back to User"]})}),e.jsx("div",{className:"flex items-center justify-center pt-[1rem]",children:!r||Array.isArray(r)&&r.length===0?e.jsxs("div",{className:"text-center",children:[e.jsx("span",{className:"text-[#38D9BA] text-2xl font-bold",children:"No"}),e.jsx("span",{className:"text-white text-2xl font-bold ml-2",children:"Active Orders"})]}):e.jsx("div",{className:"w-full max-w-[520px] flex flex-col items-center border-2 border-[#1b1d21] bg-[#121315] rounded-2xl p-5",children:e.jsxs("div",{className:"w-full flex flex-col items-center px-4 mb-4 text-sm font-normal gap-y-2",children:[e.jsxs("div",{className:"w-full flex text-center items-center justify-between",children:[e.jsx("span",{className:"text-gray-400",children:"Service:"}),e.jsx("span",{className:"text-white",children:r.service})]}),e.jsx("hr",{className:"border-[#888888] border w-full"}),e.jsxs("div",{className:"w-full flex text-center items-center justify-between",children:[e.jsx("span",{className:"text-gray-400",children:"Server:"}),e.jsx("span",{className:"text-white",children:r.server})]}),e.jsx("hr",{className:"border-[#888888] border w-full"}),e.jsxs("div",{className:"w-full flex text-center items-center justify-between",children:[e.jsx("p",{children:"Price:"}),e.jsxs("span",{children:[" ₹",r.price]})]}),e.jsx("div",{className:"w-full flex border rounded-2xl items-center justify-center h-[45px]",children:e.jsxs("div",{className:"py-4 px-5 flex w-full gap-4 items-center justify-center rounded-lg text-xl font-medium",children:[e.jsx("span",{className:"text-white",children:r.number}),e.jsx("button",{className:"text-primary hover:text-primary/80"})]})}),e.jsx("div",{className:"w-full flex rounded-2xl items-center justify-center h-[60px]",children:e.jsxs("div",{className:"bg-transparent max-w-56 py-4 px-5 flex w-full items-center justify-between rounded-lg",children:[e.jsx("p",{className:"text-gray-400",children:"Remaining Time"}),e.jsx(N,{expirationTime:r.expirationTime,orderId:r._id})]})}),e.jsxs("div",{className:"bg-transparent pt-4 flex w-full items-center justify-center gap-4",children:[e.jsx(x,{onClick:()=>I(r.numberId,r.number),className:"w-full bg-red-600 hover:bg-red-700 text-white",children:"Force Delete"}),e.jsx(x,{onClick:()=>D($),className:"w-full bg-[#38D9BA] hover:bg-[#38D9BA]/80 text-white",children:"Cancel"})]})]})})})]})},O=C()(B);export{O as default};