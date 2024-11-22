import{A as u,u as b,r as l,j as e,B as f,I as c,a as j}from"./index-DP5l2bTG.js";const w=()=>{const d=b(),i=()=>d("/"),[x,m]=l.useState([]),[t,o]=l.useState("");l.useEffect(()=>{(async()=>{try{const r=await j.get("/get-all-blocked-users");m(r.data.data)}catch(r){console.error("Failed to fetch blocked users data",r)}})()},[]);const h=s=>{o(s.target.value)},p=()=>{o("")},n=x.filter(s=>s.email.toLowerCase().includes(t.toLowerCase())),a={wordBreak:"break-word",whiteSpace:"normal",overflowWrap:"break-word"};return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"w-full my-4 flex items-center justify-between",children:e.jsxs(f,{variant:"link",onClick:i,className:"text-sm font-normal text-[#8C8C8C] !no-underline p-1 h-0 flex gap-2",children:[e.jsx(c.arrowLeft,{className:"w-4 h-4"}),"Blocked Users"]})}),e.jsx("div",{className:"flex items-center justify-center pt-[1rem]",children:e.jsxs("div",{className:"bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark",children:[e.jsxs("div",{className:"w-full flex bg-[#18191c] rounded-2xl px-2 items-center justify-center h-[50px] mb-3",children:[e.jsx(c.search,{className:"w-4 h-4 text-primary"}),e.jsx("input",{type:"text",placeholder:"Search...",value:t,onChange:h,className:"w-[85%] h-[50px] ml-2 text-sm bg-transparent border-0 text-white placeholder:text-primary focus:outline-none"}),t!==""?e.jsx(c.circleX,{className:"text-primary cursor-pointer",onClick:p}):""]}),n.length>0?n.map((s,r)=>e.jsx("div",{className:"mt-[1.5rem] w-full border-[10px] border-[#444444] rounded-lg",children:e.jsx("table",{className:"w-full table-auto",children:e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{className:"border-b-2 border-[#949494] p-3 px-5 text-[#959595]",children:"SL No"}),e.jsx("td",{className:"border-b-2 border-[#949494] p-3",style:a,children:r+1})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"border-b-2 border-[#949494] p-3 px-5 text-[#959595]",children:"Email"}),e.jsx("td",{className:"border-b-2 border-[#949494] p-3",style:a,children:s.email})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"p-3 px-5 text-[#959595]",children:"Blocked Reason"}),e.jsx("td",{className:"p-3",style:a,children:s.blocked_reason})]})]})})},r)):e.jsx("div",{className:"text-white text-center h-full flex items-center justify-center",children:"No blocked users found"})]})})]})},k=u()(w);export{k as default};
