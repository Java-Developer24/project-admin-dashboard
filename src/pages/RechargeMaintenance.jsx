import AppLayout from "@/components/layout/AppLayout";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Switch } from "@/components/ui/Switch"; // Assuming you have a Switch component
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RechargeMaintenance = () => {
  const navigate = useNavigate();
  const [rechargeTypes, setRechargeTypes] = useState([
    { type: "upi", status: false },
    { type: "trx", status: false },
  ]);

  useEffect(() => {
    fetchAllMaintenanceStatuses();
  }, []);

  const fetchAllMaintenanceStatuses = async () => {
    try {
      const responses = await Promise.all(
        rechargeTypes.map((type) =>
          axios.get(`https://project-backend-xo17.onrender.com/api/recharge/get-recharge-maintenance?rechargeType=${type.type}`)
        )
      );
      const updatedTypes = responses.map((response, index) => ({
        ...rechargeTypes[index],
        status: response.data.maintenance,
      }));
      setRechargeTypes(updatedTypes);
    } catch (error) {
      console.error("Error fetching maintenance statuses:", error);
    }
  };

  const toggleMaintenanceStatus = async (rechargeType, newStatus) => {
    try {
      await axios.post(`https://project-backend-xo17.onrender.com/api/recharge/updateRechargeMaintence`, {
        rechargeType,
        status: newStatus,
      });
      setRechargeTypes((prevTypes) =>
        prevTypes.map((type) =>
          type.type === rechargeType ? { ...type, status: newStatus } : type
        )
      );
    } catch (error) {
      console.error("Error toggling maintenance status:", error);
    }
  };

  const handleSwitchChange = (rechargeType, checked) => {
    toggleMaintenanceStatus(rechargeType, checked);
  };

  const navigateToAdminPanel = () => navigate("/admin-panel");

  return (
    <>
      <div className="w-full my-4 flex items-center justify-between">
        <Button
          variant="link"
          onClick={navigateToAdminPanel}
          className="text-sm font-normal text-[#8C8C8C] !no-underline p-1 h-0 flex gap-2"
        >
          <Icon.arrowLeft className="w-4 h-4" /> Recharge Maintenance
        </Button>
      </div>

      <div className="flex items-center justify-center pt-[1rem]">
        <div className="bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark">
          <div className="my-4">
            {rechargeTypes.map((type) => (
              <div
                key={type.type}
                className={buttonVariants({
                  variant: "login",
                  className:
                    "w-full text-sm font-normal h-14 text-white !bg-[#282828] !hover:bg-[#282828] !justify-between !transform-none",
                })}
              >
                {type.type.toUpperCase()}
                <Switch

                  checked={type.status}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(type.type, checked)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AppLayout()(RechargeMaintenance);
