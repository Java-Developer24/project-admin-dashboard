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
  const [api, setApi] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const getApi = () =>
    axios
      .get("/get-reacharge-api?type=upi")
      .then((response) => {
        setApi(response.data.api_key);
      })
      .catch((error) => {
        console.error("Error fetching servers:", error);
      });

  useEffect(() => {
    // Fetch servers when the component mounts
    getApi();
  }, []);

  const navigateToAdminPanel = () => navigate("/admin-panel");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleDeleteFile = () => {
    setSelectedFile(null);
  };

  const handleQRSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    const qrSubmitPromise = new Promise((resolve, reject) => {
      const qrSubmit = async () => {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64 = reader.result;
            const response = await axios.post("/update-qr", {
              file: base64,
            });

            setSelectedFile(null);
            resolve(response);
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsDataURL(selectedFile);
      };

      qrSubmit();
    });
    await toast.promise(qrSubmitPromise, {
      loading: "uploading qr...",
      success: (r) => {
        return r.data;
      },
      error: (error) => {
        const errorMessage =
          error.response?.data?.error ||
          "Error, Image Should be less than 50kb.";
        return errorMessage;
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const upiUpdatePromise = new Promise((resolve, reject) => {
      const upiUpdate = async () => {
        try {
          const response = await axios.post("/add-recharge-api", {
            recharge_type: "upi",
            api_key: newUpi, // Use the newApiKey state
          });
          setNewUpi("");
          getApi();
          resolve(response);
        } catch (error) {
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
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange}
            />

            <div className="flex flex-col items-center w-full">
              <Button
                variant="link"
                type="button"
                className="text-sm font-normal text-[#397CFF] !no-underline p-1"
                onClick={handleFileUploadClick}
              >
                Update QR Code
              </Button>
              {selectedFile && (
                <>
                  <div>
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt={selectedFile.name}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>

                  <p className="text-sm truncate w-full text-center">
                    {selectedFile && selectedFile.name}
                  </p>
                  <div className="w-full flex items-center justify-center gap-4 mt-4">
                    <Button
                      type="button"
                      onClick={handleQRSubmit}
                      className="py-1 px-8 text-xs bg-[#129BFF] text-white hover:bg-[#129BFF]"
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      className="py-1 px-6 text-xs !rounded-md border-2 border-white font-normal hover:!bg-white hover:text-black transition-colors duration-200 ease-in-out"
                      onClick={handleDeleteFile}
                    >
                      Delete
                    </Button>
                  </div>
                </>
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
