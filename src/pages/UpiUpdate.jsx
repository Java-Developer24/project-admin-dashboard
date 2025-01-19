import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const UpiUpdate = () => {
  const [newUpi, setNewUpi] = useState("");
  const[upiApi,setUPIApi]=useState("")
  const[newUPI,setNewUPI]=useState("")
  const [api, setApi] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage after login
  const navigate = useNavigate();
  const getApi = () =>
    axios
  .get("/api/recharge/admin-api/recharge-api-data/get-recharge-api?type=upi", {
    headers: {
      Authorization: `Bearer ${token}`, // Add the token to the Authorization header
    },
  })
  .then((response) => {
    setApi(response.data.api_key);
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
    getApi();
  }, []);

  const getUPIApi = () =>
    axios
      .get("/api/config/admin-api/upi-min-amt/min-upi-amount")
      .then((response) => {
        setUPIApi(response.data.minUpiAmount);
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
        getUPIApi();
      }, []);
    

  const navigateToAdminPanel = () => navigate("/admin-panel");

  

  const handleSubmit1 = async (e) => {
    e.preventDefault();
    const upiUpdatePromise = new Promise((resolve, reject) => {
      const upiUpdate = async () => {
        try {
          const response = await axios.post(
            "/api/config/admin-api/min-upi-amt-update/min-upi-amount",
            { minUpiAmount: newUPI },
            {
              headers: {
                Authorization: `Bearer ${token}`, // Add the token to the Authorization header
              },
            }
          );
          setNewUPI("");
          getUPIApi();
          resolve(response);
        } catch (error) {
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
          reject(error);
        }
      };

      upiUpdate();
    });
    await toast.promise(upiUpdatePromise, {
      loading: "updating upi...",
      success: (r) => {
        return r.data.message;
      },
      error: (error) => {
        const errorMessage =
          error.response?.data?.error ||
          "Error updating upi. Please try again.";
        return errorMessage;
      },
    });
  };

   

  const handleSubmit = async (e) => {
    e.preventDefault();
    const upiUpdatePromise = new Promise((resolve, reject) => {
      const upiUpdate = async () => {
        try {
          const response = await axios.post(
            "/api/recharge/admin-api/recharge-data-update-api/update-recharge-api",
            {
              recharge_type: "upi",
              newUpiId: newUpi, // Use the newApiKey state
            },
            {
              headers: {
                Authorization: `Bearer ${token}`, // Add the token to the Authorization header
              },
            }
          );
          setNewUpi("");
          getApi();
          resolve(response);
        } catch (error) {
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
          reject(error);
        }
      };

      upiUpdate();
    });
    await toast.promise(upiUpdatePromise, {
      loading: "updating upi...",
      success: (r) => {
        return r.data.message;
      },
      error: (error) => {
        const errorMessage =
          error.response?.data?.error ||
          "Error updating upi. Please try again.";
        return errorMessage;
      },
    });
  };

  return (
    <>
      <div className="w-full my-4 flex items-center justify-between">
        <Button
          variant="link"
          onClick={navigateToAdminPanel}
          className="text-sm font-normal text-[#8C8C8C] !no-underline p-1 h-0 flex gap-2"
        >
          <Icon.arrowLeft className="w-4 h-4" /> Update UPI
        </Button>
      </div>
      <div className="flex items-center justify-center pt-[1rem]">
        <div className="bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="currentUpi"
                  className="block text-base text-[#9d9d9d] font-normal py-3"
                >
                  Current UPI
                </Label>
                <Input
                  id="currentUpi"
                  type="text"
                  disabled
                  className="w-full h-12 pl-3 rounded-lg disabled:text-white disabled:!border-[#e0effe] focus:border-none disabled:opacity-100 disabled:bg-[#9D9D9D]/50"
                  value={api}
                />
              </div>
              {!selectedFile && (
                <div>
                  <Label
                    htmlFor="newUpi"
                    className="block text-base text-[#9d9d9d] font-normal py-3"
                  >
                    Enter New UPI
                  </Label>
                  <Input
                    id="newUpi"
                    type="text"
                    placeholder="Enter new UPI"
                    className="w-full h-12 pl-3 rounded-lg text-[#9d9d9d] !placeholder-[#9d9d9d] bg-transparent border-[#e0effe] focus:border-none"
                    required
                    value={newUpi}
                    onChange={(e) => setNewUpi(e.target.value)}
                  />
                </div>
              )}
            </div>
            

            {!selectedFile && (
              <div className="w-full flex items-center justify-center gap-4 mt-8">
                <Button
                  type="submit"
                  className="py-1 px-8 text-xs bg-[#129BFF] text-white hover:bg-[#129BFF]"
                >
                  Save
                </Button>
                <Button
                  type="button"
                  className="py-1 px-6 text-xs !rounded-md border-2 border-white font-normal hover:!bg-white hover:text-black transition-colors duration-200 ease-in-out"
                  onClick={navigateToAdminPanel}
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
          <form onSubmit={handleSubmit1}>
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="currentUpi"
                  className="block text-base text-[#9d9d9d] font-normal py-3"
                >
                  Current UPI Min Value
                </Label>
                <Input
                  id="currentUpi"
                  type="text"
                  disabled
                  className="w-full h-12 pl-3 rounded-lg disabled:text-white disabled:!border-[#e0effe] focus:border-none disabled:opacity-100 disabled:bg-[#9D9D9D]/50"
                  value={upiApi}
                />
              </div>
              {!selectedFile && (
                <div>
                  <Label
                    htmlFor="newUpi"
                    className="block text-base text-[#9d9d9d] font-normal py-3"
                  >
                    Enter New UPI Min Value
                  </Label>
                  <Input
                    id="newUpi"
                    type="text"
                    placeholder="Enter new UPI"
                    className="w-full h-12 pl-3 rounded-lg text-[#9d9d9d] !placeholder-[#9d9d9d] bg-transparent border-[#e0effe] focus:border-none"
                    required
                    value={newUPI}
                    onChange={(e) => setNewUPI(e.target.value)}
                  />
                </div>
              )}
            </div>
            

            {!selectedFile && (
              <div className="w-full flex items-center justify-center gap-4 mt-8">
                <Button
                  type="submit"
                  className="py-1 px-8 text-xs bg-[#129BFF] text-white hover:bg-[#129BFF]"
                >
                  Save
                </Button>
                <Button
                  type="button"
                  className="py-1 px-6 text-xs !rounded-md border-2 border-white font-normal hover:!bg-white hover:text-black transition-colors duration-200 ease-in-out"
                  onClick={navigateToAdminPanel}
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default AppLayout()(UpiUpdate);
