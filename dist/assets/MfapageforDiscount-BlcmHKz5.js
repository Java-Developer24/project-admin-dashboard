import{A as y,r as a,d as F,u as b,j as e,B as v,_ as o}from"./index--FpPv6_1.js";import{I as M}from"./Input-C-s0KhfE.js";import{L as S}from"./Label-B-Rr7N0l.js";import{C as N,a as w,b as E,c as k}from"./Card-Cj6dnJIu.js";import"./index-ny5ticeX.js";import"./index-DiOThvEn.js";const L=()=>{const[l,C]=a.useState(""),[d,x]=a.useState(""),[c,p]=a.useState(!1),[n,u]=a.useState(!1),[j,g]=a.useState(!0),{login:m}=F(),i=b();a.useEffect(()=>{const s=localStorage.getItem("tempEmail");if(!s){i("/login");return}(async()=>{try{const t=await(await fetch("https://backendapi.tech-developer.online/api/mfa/status",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tempEmail:s})})).json();if(t.success&&t.is2FAEnabled&&t.is2FASetupComplete)p(!0),u(!0);else if(t.success&&t.is2FAEnabled&&!t.is2FASetupComplete){p(!0),u(!1);const h=await(await fetch("https://backendapi.tech-developer.online/api/mfa/enable",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tempEmail:s})})).json();h.qrCodeUrl&&x(h.qrCodeUrl)}else t.success&&!t.is2FAEnabled?(m(),setTimeout(()=>{i("/discount")},2e3)):o.error("Unexpected MFA state. Please contact support.")}catch(r){console.error("Error checking MFA status:",r),o.error("Failed to check MFA status.")}finally{g(!1)}})()},[i]);const A=async s=>{s.preventDefault();const f=localStorage.getItem("tempEmail");try{(await(await fetch("https://backendapi.tech-developer.online/api/mfa/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tempEmail:f,mfaCode:l})})).json()).message==="2FA verified successfully. Access granted."?(setTimeout(()=>{o.success(c?"MFA verification successful":"MFA setup successful",{duration:2e3})},100),m(),i("/discount")):o.error("Invalid MFA code.")}catch(r){console.error("Error verifying MFA:",r),o.error("Failed to verify MFA code.")}};return j?e.jsx("div",{className:"flex items-center justify-center h-screen",children:e.jsx("div",{className:"flex items-center justify-center",children:e.jsxs("svg",{className:"w-16 h-16 animate-spin text-gray-900/50",viewBox:"0 0 64 64",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[e.jsx("path",{d:"M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z",stroke:"currentColor",strokeWidth:"5",strokeLinecap:"round",strokeLinejoin:"round"}),e.jsx("path",{d:"M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762",stroke:"currentColor",strokeWidth:"5",strokeLinecap:"round",strokeLinejoin:"round",className:"text-teal-500"})]})})}):e.jsx("div",{className:"flex items-center justify-center pt-[4rem]",children:e.jsxs(N,{className:"bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark",children:[e.jsx(w,{children:e.jsx(E,{className:"text-center text-[28px] font-medium",children:c?n?"Enter MFA Code":"Setup MFA Authentication":"MFA Disabled"})}),e.jsx(k,{className:"p-6",children:c?e.jsxs(e.Fragment,{children:[!n&&d&&e.jsxs("div",{className:"mb-6",children:[e.jsx("p",{className:"text-[#9d9d9d] mb-4 text-center",children:"Scan this QR code with your authenticator app"}),e.jsx("div",{className:"flex justify-center mb-4",children:e.jsx("img",{src:d,alt:"MFA QR Code",className:"w-48 h-48"})})]}),e.jsx("form",{onSubmit:A,children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx(S,{htmlFor:"mfaCode",className:"block text-sm text-[#9d9d9d] font-normal py-1",children:n?"Enter Code from Authenticator":"Enter Code to Complete Setup"}),e.jsx(M,{id:"mfaCode",type:"text",placeholder:"Enter 6-digit code",className:"w-full h-12 pl-3 rounded-lg !text-[#9d9d9d] !placeholder-[#9d9d9d] bg-transparent border-[#e0effe] focus:border-none",value:l,onChange:s=>C(s.target.value),required:!0})]}),e.jsx(v,{type:"submit",variant:"login",className:"w-full text-sm font-normal mt-4",children:n?"Verify Code":"Complete MFA Setup"})]})})]}):e.jsx("div",{className:"text-center text-[#9d9d9d]",children:e.jsx("p",{children:"MFA is disabled. Redirecting you to the Discount page..."})})})]})})},P=y()(L);export{P as default};
