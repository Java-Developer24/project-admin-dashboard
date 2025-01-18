import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import axios from "axios";
import { Switch } from "@/components/ui/Switch";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Settings = () => {
  const navigate = useNavigate();
  const [banner, setBanner] = useState("");
  const [newBanner, setNewBanner] = useState("");
  const [disclaimer, setDisclaimer] = useState("");
  const [newDisclaimer, setNewDisclaimer] = useState("");
  const [otpTime, setOtpTime] = useState("");
  const [newOtpTime, setNewOtpTime] = useState("");
  const [adminIP, setAdminIP] = useState("");
  const [newAdminIP, setNewAdminIP] = useState("");
  const [checkOtp, setCheckOtp] = useState(false);

  const navigateToAdminPanel = () => navigate("/admin-panel");
  const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage after login
  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [bannerRes, timeRes, ipRes, checkOtpRes] = await Promise.all([
          axios.get("/api/info/admin-api/get-info-banner/banner"),
          axios.get("/api/user/admin-api/otp-timing-data/get-time", {
            headers: {
              Authorization: `Bearer ${token}`, // Add token to Authorization header
            },
          }),
          axios.get("/api/mfa/admin-api/admin-IP-data/get-admin-ip", {
            headers: {
              Authorization: `Bearer ${token}`, // Add token to Authorization header
            },
          }),
          axios.get("/api/server/admin-api/check-otp-data/get-check-otp", {
            headers: {
              Authorization: `Bearer ${token}`, // Add token to Authorization header
            },
          }),
        ]);
       
        setBanner(bannerRes.data.message || "");
        setOtpTime(timeRes.data.otpTimeWindow || "");
        setAdminIP(ipRes.data.adminIp);
        setCheckOtp(checkOtpRes.data.status);
        
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast.error("Failed to fetch current settings");
      }
    };

    fetchSettings();
  }, []);

  const handleCheckOtpToggle = async (checked) => {
    try {
      await axios.post("/api/server/admin-api/check-otp-update/update-check-otp", {
        checkOtp: checked
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to Authorization header
        },
      });
      setCheckOtp(checked);
      toast.success("OTP check setting updated successfully");
    } catch (error) {
      console.error("Error updating OTP check setting:", error);
      toast.error("Failed to update OTP check setting");
    }
  };

  const handleBannerUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/info/admin-api/banner-data-update/update-banner", {
        banner: newBanner
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to the Authorization header
        },
      });
      setBanner(newBanner);
      setNewBanner("");
      toast.success("Banner updated successfully");
    } catch (error) {
      console.error("Error updating banner:", error);
      toast.error("Failed to update banner");
    }
  };

 
  const handleOtpTimeUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/user/admin-api/otp-window-time-update/update-time", {
        time: newOtpTime
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to the Authorization header
        },
      });
      setOtpTime(newOtpTime);
      setNewOtpTime("");
      toast.success("OTP check timing updated successfully");
    } catch (error) {
      console.error("Error updating OTP time:", error);
      toast.error("Failed to update OTP check timing");
    }
  };

  const handleAdminIPUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/mfa/admin-api/admin-IP-update/update-admin-ip", {
        ip: newAdminIP
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to the Authorization header
        },
      });
      setAdminIP(newAdminIP);
      setNewAdminIP("");
      toast.success("Admin IP updated successfully");
    } catch (error) {
      console.error("Error updating Admin IP:", error);
      toast.error("Failed to update Admin IP");
    }
  };

  const fetchServiceData = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      
      // Show toast that services data is being updated
      toast.info("Services data is being updated...");

      // Make API call to fetch and compare services
      const response = await axios.get("/admin-api/service-data-update/fetch-update-compare-services", {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to Authorization header
        },
      });

      // Check for success response
      if (response.status === 200 && response.data.msg) {
        // Show success message from the server in a toast
        toast.success(response.data.msg);
      } else {
        // Handle unexpected responses
        toast.error("Unexpected response from the server.");
      }
    } catch (err) {
      console.error("Error fetching service data:", err);
      // Show error toast for failure
      toast.error("Failed to fetch and update service data.");
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
        <Icon.arrowLeft className="w-4 h-4" /> Settings
      </Button>
    </div>

    <div className="flex items-center justify-center pt-[1rem]">
      <div className="bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark">
        {/* Banner Section */}
        <form onSubmit={handleBannerUpdate} className="mb-8">
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="currentBanner"
                className="block text-base text-[#9d9d9d] font-normal py-3"
              >
                Current Banner
              </Label>
              <Input
                id="currentBanner"
                type="text"
                disabled
                className="w-full h-12 pl-3 rounded-lg disabled:text-white disabled:!border-[#e0effe] focus:border-none disabled:opacity-100 disabled:bg-[#9D9D9D]/50"
                value={banner}
              />
            </div>
            <div>
              <Label
                htmlFor="newBanner"
                className="block text-base text-[#9d9d9d] font-normal py-3"
              >
                New Banner
              </Label>
              <Input
                id="newBanner"
                type="text"
                placeholder="Enter new banner text"
                className="w-full h-12 pl-3 rounded-lg text-[#9d9d9d] !placeholder-[#9d9d9d] bg-transparent border-[#e0effe] focus:border-none"
                value={newBanner}
                onChange={(e) => setNewBanner(e.target.value)}
              />
            </div>
            <div className="flex justify-center gap-4">
              <Button type="submit" className="py-1 px-8 text-xs bg-[#129BFF] text-white hover:bg-[#129BFF]">
                Update Banner
              </Button>
            </div>
          </div>
        </form>

       

        {/* OTP Check Timing Section */}
        <form onSubmit={handleOtpTimeUpdate} className="mb-8">
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="currentOtpTime"
                className="block text-base text-[#9d9d9d] font-normal py-3"
              >
                Current OTP Check Time (seconds)
              </Label>
              <Input
                id="currentOtpTime"
                type="text"
                disabled
                className="w-full h-12 pl-3 rounded-lg disabled:text-white disabled:!border-[#e0effe] focus:border-none disabled:opacity-100 disabled:bg-[#9D9D9D]/50"
                value={otpTime}
              />
            </div>
            <div>
              <Label
                htmlFor="newOtpTime"
                className="block text-base text-[#9d9d9d] font-normal py-3"
              >
                New OTP Check Time (seconds)
              </Label>
              <Input
                id="newOtpTime"
                type="number"
                placeholder="Enter new OTP check time"
                className="w-full h-12 pl-3 rounded-lg text-[#9d9d9d] !placeholder-[#9d9d9d] bg-transparent border-[#e0effe] focus:border-none"
                value={newOtpTime}
                onChange={(e) => setNewOtpTime(e.target.value)}
              />
            </div>
            <div className="flex justify-center gap-4">
              <Button type="submit" className="py-1 px-8 text-xs bg-[#129BFF] text-white hover:bg-[#129BFF]">
                Update OTP Time
              </Button>
            </div>
          </div>
        </form>

        {/* Admin IP Section */}
        <form onSubmit={handleAdminIPUpdate}>
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="currentAdminIP"
                className="block text-base text-[#9d9d9d] font-normal py-3"
              >
                Current Admin IP Address
              </Label>
              <Input
                id="currentAdminIP"
                type="text"
                disabled
                className="w-full h-12 pl-3 rounded-lg disabled:text-white disabled:!border-[#e0effe] focus:border-none disabled:opacity-100 disabled:bg-[#9D9D9D]/50"
                value={adminIP}
              />
            </div>
            <div>
              <Label
                htmlFor="newAdminIP"
                className="block text-base text-[#9d9d9d] font-normal py-3"
              >
                New Admin IP Address
              </Label>
              <Input
                id="newAdminIP"
                type="text"
                placeholder="Enter new admin IP address"
                className="w-full h-12 pl-3 rounded-lg text-[#9d9d9d] !placeholder-[#9d9d9d] bg-transparent border-[#e0effe] focus:border-none"
                value={newAdminIP}
                onChange={(e) => setNewAdminIP(e.target.value)}
              />
            </div>
            <div className="flex justify-center gap-4">
              <Button type="submit" className="py-1 px-8 text-xs bg-[#129BFF] text-white hover:bg-[#129BFF]">
                Update Admin IP
              </Button>
            </div>
          </div>
        </form>
                    <div className="w-full text-sm font-normal h-14 text-white !bg-[#282828] !hover:bg-[#282828] !justify-between !transform-none ounded-lg mb-[60px] border-none dark p-4 mt-8">
                  {/* Add CheckOtp Toggle at the top */}
                  <div className="w-full flex items-center justify-between px-4 mb-8 ">
            <h5 className="w-full text-sm font-normal  text-white  !hover:bg-[#282828] !justify-between ">Check OTP</h5>
            <Switch
              checked={checkOtp}
              onCheckedChange={handleCheckOtpToggle}
            />
          </div>
          </div>
    
          <div className="mt-6 flex justify-center">
          <Label
                
                className="block text-base text-[#9d9d9d] font-normal py-3 pr-3"
              >
                Fetch Services List
              </Label>
              <div className="flex justify-center gap-4">
                <Button
                 onClick={fetchServiceData}
                  className="bg-primary hover:bg-primary/90 text-white"
                 
                >
               Services list
                </Button>
                </div>
              </div>
      </div>
      
    </div>
  </>
  );
};

export default AppLayout()(Settings);