/* eslint-disable react/display-name */
import React from "react";
import Header from "./Header";
import { Toaster } from "react-hot-toast";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    return (
      <>
        {/* <Title /> */}
        
        <Header />
        <Toaster position="top-right" reverseOrder={false} />
        <div className="md:container px-[1rem] h-[calc(100vh - 4rem)]">
          <WrappedComponent {...props} />
        </div>
      </>
    );
  };
};

export default AppLayout;
