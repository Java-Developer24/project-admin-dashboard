import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "@/index.css";
import { AuthProvider } from "./utils/AuthContext.jsx";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
    <Toaster position="top-right" 
        containerStyle={{
          marginTop: '60px', // Moves the toaster lower
        }}
        toastOptions={{
          style: {
            fontSize: '14px', // Set your desired font size
          },
        }}
        
        
        reverseOrder={false} />
      <App />
    </AuthProvider>
  </React.StrictMode>
);
