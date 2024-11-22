import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute = ({ children, isAuthenticated, redirect = "/login" }) => {
  if (!isAuthenticated) return <Navigate to={redirect} />;

  return children ? children : <Outlet />;
};

export default ProtectRoute;
