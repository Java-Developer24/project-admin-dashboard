import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import React from "react";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();

  const navigateBack = () => navigate("/");
  const navigateToMaintainance = () => navigate("/admin-panel/maintainance");
  const navigateToUpiUpdate = () => navigate("/admin-panel/upi-update");
  const navigateToApiUpdate = () => navigate("/admin-panel/api-update");
  const navigateToTrxAddressUpdate = () =>
    navigate("/admin-panel/trx-address-update");
  const navigateToRechargeMaintenance = () =>
    navigate("/admin-panel/recharge-maintenance");
  const navigateToBlockStatus = () => navigate("/admin-panel/block-status");

  return (
    <>
      <div className="w-full my-2">
        <Button
          variant="link"
          onClick={navigateBack}
          className="text-sm font-normal text-[#8C8C8C] !no-underline p-1 h-0 flex gap-2"
        >
          <Icon.arrowLeft className="w-4 h-4" /> Admin Panel
        </Button>
      </div>
      <div className="flex items-center justify-center pt-[1rem]">
        <div className="bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark">
          <div className=" flex flex-col items-center gap-2">
            <Button
              variant="login"
              onClick={navigateToMaintainance}
              className="w-full text-sm font-normal h-14 text-white bg-[#282828] hover:bg-[#212121] !justify-between"
            >
              Maintainance
              <Icon.arrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="login"
              onClick={navigateToUpiUpdate}
              className="w-full text-sm font-normal h-14 text-white bg-[#282828] hover:bg-[#212121] !justify-between"
            >
              Upi Update
              <Icon.arrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="login"
              onClick={navigateToApiUpdate}
              className="w-full text-sm font-normal h-14 text-white bg-[#282828] hover:bg-[#212121] !justify-between"
            >
              Api Update
              <Icon.arrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="login"
              onClick={navigateToTrxAddressUpdate}
              className="w-full text-sm font-normal h-14 text-white bg-[#282828] hover:bg-[#212121] !justify-between"
            >
              TRX Address Update
              <Icon.arrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="login"
              onClick={navigateToRechargeMaintenance}
              className="w-full text-sm font-normal h-14 text-white bg-[#282828] hover:bg-[#212121] !justify-between"
            >
              Recharge Maintenance
              <Icon.arrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="login"
              onClick={navigateToBlockStatus}
              className="w-full text-sm font-normal h-14 text-white bg-[#282828] hover:bg-[#212121] !justify-between"
            >
              Block Status
              <Icon.arrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppLayout()(AdminPanel);
