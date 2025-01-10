import AppLayout from "@/components/layout/AppLayout";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Switch } from "@/components/ui/Switch";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BlockStatus = () => {
  const navigate = useNavigate();
  const [blockTypes, setBlockTypes] = useState([
    { type: "Number_Cancel", status: false, name: "Number Cancel" },
    { type: "User_Fraud", status: false, name: "User Fraud" },
  ]);

  useEffect(() => {
    fetchAllBlockeStatuses();
  }, []);

  const fetchAllBlockeStatuses = async () => {
    try {
      const responses = await Promise.all(
        blockTypes.map((type) =>
          axios.get(`/api/block/get-block-status?blockType=${type.type}`)
        )
      );
      const updatedTypes = responses.map((response, index) => ({
        ...blockTypes[index],
        status: response.data.status,
      }));
      setBlockTypes(updatedTypes);
    } catch (error) {
      console.error("Error fetching block statuses:", error);
    }
  };

  const toggleBlockStatus = async (blockTypes, newStatus) => {
    try {
      await axios.post(`/api/block/block-status-toggle`, {
        blockType: blockTypes,
        status: newStatus,
      });
      setBlockTypes((prevTypes) =>
        prevTypes.map((type) =>
          type.type === blockTypes ? { ...type, status: newStatus } : type
        )
      );
    } catch (error) {
      console.error("Error toggling block status:", error);
    }
  };

  const handleSwitchChange = (rechargeType, checked) => {
    toggleBlockStatus(rechargeType, checked);
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
          <Icon.arrowLeft className="w-4 h-4" /> Block Status
        </Button>
      </div>

      <div className="flex items-center justify-center pt-[1rem]">
        <div className="bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark">
          <div className="my-4">
            {blockTypes.map((type) => (
              <div
                key={type.type}
                className={buttonVariants({
                  variant: "login",
                  className:
                    "w-full text-sm font-normal h-14 text-white !bg-[#282828] !hover:bg-[#282828] !justify-between !transform-none",
                })}
              >
                {type.name.toUpperCase()}
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

export default AppLayout()(BlockStatus);
