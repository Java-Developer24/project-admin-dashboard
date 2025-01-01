import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddService = () => {
  const [serviceName, setServiceName] = useState("");
  const [serverNumber9, setServerNumber9] = useState("");
  const navigate = useNavigate();

  const navigateToService = () => navigate("/service");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const addServicePromise = new Promise((resolve, reject) => {
      const addService = async () => {
        try {
          // Submit to addccpayServiceNameData API
          const response = await axios.post("http://localhost:3000/api/service/addService", {
            name: serviceName,
            serviceName: serverNumber9,
          });
          resolve(response);
        } catch (error) { 
          reject(error);
        }
      };

      addService();
    });
    await toast.promise(addServicePromise, {
      loading: "Fetching Data...",
      success: (r) => {
        setServiceName("");
        setServerNumber9("");
        return r.data.message || "Service added successfully!";
      },
      error: (error) => {
        const errorMessage =
          error.response?.data?.error ||
          "Error Fetching data. Please try again.";
        return errorMessage;
      },
    });
  };

  return (
    <>
      <div className="w-full my-2">
        <Button
          variant="link"
          onClick={navigateToService}
          className="text-sm font-normal text-[#8C8C8C] !no-underline p-1 h-0 flex gap-2"
        >
          <Icon.arrowLeft className="w-4 h-4" /> Service List
        </Button>
      </div>

      <div className="flex items-center justify-center pt-[1rem]">
        <div className="bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark">
          <h5 className="font-normal text-base text-[#757575]">Add Service</h5>

          <form onSubmit={handleSubmit} className="my-4">
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="serviceName"
                  className="block text-base text-[#9d9d9d] font-normal py-3"
                >
                  Service Name
                </Label>
                <Input
                  id="serviceName"
                  type="text"
                  placeholder="Enter service name"
                  className="w-full h-12 pl-3 rounded-lg text-[#9d9d9d] !placeholder-[#9d9d9d] bg-transparent border-[#e0effe] focus:border-none"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="serverNumber9"
                  className="block text-base text-[#9d9d9d] font-normal py-3"
                >
                  Server Number 9
                </Label>
                <Input
                  id="serverNumber9"
                  type="text"
                  placeholder="Enter name for server 9"
                  className="w-full h-12 pl-3 rounded-lg text-[#9d9d9d] !placeholder-[#9d9d9d] bg-transparent border-[#e0effe] focus:border-none"
                  value={serverNumber9}
                  onChange={(e) => setServerNumber9(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="w-full flex items-center justify-center gap-4 mt-8">
              <Button
                type="submit"
                className="py-1 px-8 text-xs bg-[#129BFF] text-white hover:bg-[#129BFF]"
              >
                Save
              </Button>
              <Button
                type="button"
                onClick={navigateToService}
                className="py-1 px-6 text-xs !rounded-md border-2 border-white font-normal hover:!bg-white hover:text-black transition-colors duration-200 ease-in-out"
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

export default AppLayout()(AddService);
