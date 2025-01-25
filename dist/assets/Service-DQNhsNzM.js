import{A as E,r as c,u as $,j as e,B,I as i,S as P,b as p,_ as m}from"./index--FpPv6_1.js";import{S as z}from"./Switch-ClYcvtk9.js";import"./index-BzNKqasO.js";import"./index-DiOThvEn.js";const F=()=>{const[o,f]=c.useState(""),[j,d]=c.useState(null),[x,h]=c.useState([]),[w,v]=c.useState(!0),N=$(),u=localStorage.getItem("token");c.useEffect(()=>{(async()=>{try{const t=await p.get("/api/service/admin-api/service-data/get-service-data-admin",{headers:{Authorization:`Bearer ${u}`}});h(t.data),v(!1)}catch(t){console.log(err.message),t.response?m.error(t.response.data.message||"Failed to update OTP check setting"):t.request?m.error("No response received from server"):m.error(`Error: ${t.message}`),v(!1)}})()},[]);const S=()=>N("/"),y=s=>{f(s.target.value.toLowerCase()),d(null)},b=s=>{d(t=>t===s.name?null:s.name)},g=o?x.filter(s=>s.name.toLowerCase().includes(o)):x,C=()=>{f(""),d(null)},k=async(s,t,r)=>{try{await p.post("/api/service/admin-api/service-update/updateService",{name:s,serverNumber:t,maintenance:!r},{headers:{Authorization:`Bearer ${u}`}}),h(l=>l.map(n=>n.name===s?{...n,servers:n.servers.map(a=>a.serverNumber===t?{...a,maintenance:!r}:a)}:n))}catch(l){console.error("Error updating block status:",l)}},A=async s=>{const t=new Promise((r,l)=>{(async()=>{try{const a=await p.post("/api/service/admin-api/service-delete/deleteService",{name:s},{headers:{Authorization:`Bearer ${u}`}});h(D=>D.filter(L=>L.name!==s)),r(a)}catch(a){l(a)}})()});await m.promise(t,{loading:"Deleting service...",success:r=>r.data.message,error:r=>{var n,a;return((a=(n=r.response)==null?void 0:n.data)==null?void 0:a.error)||"Error Deleting data. Please try again."}})};return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"w-full my-2",children:e.jsxs(B,{variant:"link",onClick:S,className:"text-sm font-normal text-[#8C8C8C] !no-underline p-1 h-0 flex gap-2",children:[e.jsx(i.arrowLeft,{className:"w-4 h-4"})," Service List"]})}),e.jsx("div",{className:"flex items-center justify-center pt-[1rem]",children:e.jsxs("div",{className:"bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark",children:[e.jsx("div",{className:"flex items-center justify-end gap-4 my-4",children:e.jsxs("p",{className:"text-[#A5A5A5]",children:["Total services:"," ",e.jsx("span",{className:"text-white font-normal",children:x.length})]})}),e.jsxs("div",{className:"w-full flex bg-[#18191c] rounded-2xl px-2 items-center justify-center h-[50px] mb-3",children:[e.jsx(i.search,{className:"w-4 h-4 text-primary"}),e.jsx("input",{type:"text",placeholder:"Search...",value:o,onChange:y,className:"w-[85%] h-[50px] ml-2 text-sm bg-transparent border-0 text-white placeholder:text-primary focus:outline-none"}),o!==""?e.jsx(i.circleX,{className:"text-primary cursor-pointer",onClick:C}):""]}),e.jsx("div",{className:"flex flex-col w-full relative h-[450px] md:h-[340px]",children:e.jsx("div",{className:"rounded-2xl flex flex-col overflow-y-auto hide-scrollbar h-full",children:w?e.jsx("div",{className:"h-full flex items-center justify-center",children:e.jsx(P,{})}):g.length>0?g.map(s=>e.jsxs("div",{className:"bg-[#282828] py-4 px-5 mb-1 w-full items-center justify-between rounded-lg flex flex-col",children:[e.jsxs("div",{className:"flex items-center justify-between w-full",children:[e.jsx("h3",{className:"capitalize font-medium",children:s.name}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"flex items-center cursor-pointer",onClick:()=>b(s),children:e.jsx(i.arrowUp,{className:`w-5 h-5 transform transition-transform ${j===s.name?"rotate-180":""}`})}),e.jsx(i.trash,{className:"w-5 h-5 cursor-pointer text-red-500",onClick:()=>A(s.name)})]})]}),j===s.name&&e.jsxs("div",{className:"bg-[#282828] pt-4 flex flex-col border-t my-1 border-white w-full items-center justify-between ",children:[e.jsxs("div",{className:"flex w-full items-center justify-between ",children:[e.jsx("h3",{className:"font-normal text-sm text-[#757575]",children:"Service Available on:"}),e.jsx("p",{className:"font-normal text-sm text-[#757575]",children:"Price:"})]}),s.servers.map(t=>e.jsx("div",{className:"w-full",children:e.jsxs("div",{className:"flex w-full items-center justify-between my-2",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsxs("p",{className:"font-normal text-sm",children:["Server ",t.serverNumber]}),e.jsx(z,{checked:t.maintenance,onCheckedChange:()=>k(s.name,t.serverNumber,t.maintenance)})]}),e.jsx("p",{className:"font-normal text-sm",children:t.price})]})},t._id))]})]},s.name)):e.jsx("p",{className:"text-center text-white",children:"No services found"})})})]})})]})},T=E()(F);export{T as default};