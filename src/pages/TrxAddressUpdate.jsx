import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const TrxAddressUpdate = () => {
  const [newTrxAddress, setNewTrxAddress] = useState("");
  const [trxAddress, setTrxAddress] = useState("");
  const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage after login
  const navigate = useNavigate();
  const getTrxAddress = () =>
    axios
  .get("/api/recharge/admin-api/recharge-api-data-trx/get-recharge-trx?type=trx", {
    headers: {
      Authorization: `Bearer ${token}`, // Include token in Authorization header
    },
  })
  .then((response) => {
    setTrxAddress(response.data.api_key);
  })
  .catch((error) => {
    console.error("Error fetching servers:", error);
    if (error.response) {
      // Server responded with a status other than 2xx
      toast.error(error.response.data.message || "Failed to update OTP check setting");
    } else if (error.request) {
      // Request was made but no response was received
      toast.error("No response received from server");
    } else {
      // Something went wrong in setting up the request
      toast.error(`Error: ${error.message}`);
    }
  });

  useEffect(() => {
    // Fetch servers when the component mounts
    getTrxAddress();
  }, []);

  const navigateToAdminPanel = () => navigate("/admin-panel");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/recharge/admin-api/recharge-data-update-trx/update-recharge-trx", 
        {
          recharge_type: "trx",
          api_key: trxAddress,
          newTrxAddress
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        }
      );
      setNewTrxAddress("");
      getTrxAddress();
      console.log(response.data);
      // Handle success case
    } catch (error) {
      console.error("Failed to update API key:", error);
      // Handle error case
    }
  };

  return (
    <>
      <div className="w-full my-4 flex items-center justify-between">
        <Button
          variant="link"
          onClick={navigateToAdminPanel}
          className="text-sm font-normal text-[#8C8C8C] !no-underline p-1 h-0 flex gap-2"
        >
          <Icon.arrowLeft className="w-4 h-4" /> Update TRX Address
        </Button>
      </div>
      <div className="flex items-center justify-center pt-[1rem]">
        <div className="bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="currentTrxAddress"
                  className="block text-base text-[#9d9d9d] font-normal py-3"
                >
                  Current TRX Address
                </Label>
                <Input
                  id="currentTrxAddress"
                  type="text"
                  disabled
                  className="w-full h-12 pl-3 rounded-lg disabled:text-white disabled:!border-[#e0effe] focus:border-none disabled:opacity-100 disabled:bg-[#9D9D9D]/50"
                  value={trxAddress}
                />
              </div>
              <div>
                <Label
                  htmlFor="newTrxAddress"
                  className="block text-base text-[#9d9d9d] font-normal py-3"
                >
                  Enter New TRX Address
                </Label>
                <Input
                  id="newTrxAddress"
                  type="text"
                  placeholder="80"
                  required
                  className="w-full h-12 pl-3 rounded-lg text-[#9d9d9d] !placeholder-[#9d9d9d] bg-transparent border-[#e0effe] focus:border-none"
                  value={newTrxAddress}
                  onChange={(e) => setNewTrxAddress(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full flex items-center justify-center gap-4 mt-8">
              <Button className="py-1 px-8 text-xs bg-[#129BFF] text-white hover:bg-[#129BFF]">
                Save
              </Button>
              <Button
                className="py-1 px-6 text-xs !rounded-md border-2 border-white font-normal hover:!bg-white hover:text-black transition-colors duration-200 ease-in-out"
                onClick={navigateToAdminPanel}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AppLayout()(TrxAddressUpdate);
