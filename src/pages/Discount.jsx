import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { useNavigate } from "react-router-dom";

const Discount = () => {
  const navigate = useNavigate();

  const navigateBack = () => navigate("/");
  const navigateToServerDisount = () => navigate("/discount/server");
  const navigateToUserDiscount = () => navigate("/discount/user");
  const navigateToServiceDiscount = () => navigate("/discount/service");
  return (
    <>
      <div className="w-full my-2">
        <Button
          variant="link"
          onClick={navigateBack}
          className="text-sm font-normal text-[#8C8C8C] !no-underline p-1 h-0 flex gap-2"
        >
          <Icon.arrowLeft className="w-4 h-4" /> Discount
        </Button>
      </div>
      <div className="flex items-center justify-center pt-[1rem]">
        <div className="bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark">
          <div className=" flex flex-col items-center gap-2">
            <Button
              variant="login"
              onClick={navigateToServerDisount}
              className="w-full text-sm font-normal h-14 text-white bg-[#282828] hover:bg-[#212121] !justify-between"
            >
              Server Discount
              <Icon.arrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="login"
              onClick={navigateToServiceDiscount}
              className="w-full text-sm font-normal h-14 text-white bg-[#282828] hover:bg-[#212121] !justify-between"
            >
              Service Discount
              <Icon.arrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="login"
              onClick={navigateToUserDiscount}
              className="w-full text-sm font-normal h-14 text-white bg-[#282828] hover:bg-[#212121] !justify-between"
            >
              User Discount
              <Icon.arrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppLayout()(Discount);
