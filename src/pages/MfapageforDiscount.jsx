import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useAuth } from "@/utils/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import toast from "react-hot-toast";
import AppLayout from "@/components/layout/AppLayout";

const MfapageforDiscount = () => {
  const [mfaCode, setMfaCode] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isMFAEnabled, setIsMFAEnabled] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const tempEmail = localStorage.getItem('tempEmail');
   
    if (!tempEmail) {
      navigate('/login');
      return;
    }

   
    console.log(tempEmail)
    // First check if MFA is already enabled for this user
    const checkMFAStatus = async (tempEmail) => {
      try {
        const response = await fetch("https://project-backend-1-93ag.onrender.com/api/mfa/status", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data.is2FAEnabled)
        if (data.is2FAEnabled ) {
          setIsMFAEnabled(true);
        } else {
          const tempEmail = localStorage.getItem('tempEmail');
          // If MFA is not enabled, get setup QR code
          const setupResponse = await fetch("https://project-backend-1-93ag.onrender.com/api/mfa/enable", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },body: JSON.stringify({ tempEmail }),
          });
          
          const setupData = await setupResponse.json();
          if (setupData) {
           console.log(setupData)
             // Check what is logged in the console

            setQrCodeUrl(setupData.qrCodeUrl);
          }
        }
      } catch (error) {
        console.error("Error checking MFA status:", error);
        toast.error("Failed to check MFA status");
      }
    };

    checkMFAStatus();
  }, [navigate]);

  const handleVerifyMFA = async (e) => {
    const tempEmail = localStorage.getItem('tempEmail');
    e.preventDefault();
    try {
      console.log(tempEmail)
      const response = await fetch("https://project-backend-1-93ag.onrender.com/api/mfa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tempEmail,mfaCode }),
      });

      const data = await response.json();

      if (data.message==="2FA verified successfully. Access granted.") {
        login();

        navigate("/discount")
        toast.success(
          isMFAEnabled ? "MFA verification successful" : "MFA setup successful",
          { autoClose: 5000 } // 5000 milliseconds = 5 seconds
        );
      } else {
        toast.error("Invalid MFA code");
      }
    } catch (error) {
      console.error("MFA verification error:", error);
      toast.error("Failed to verify MFA code");
    }
  };

  return (
    <div className="flex items-center justify-center pt-[4rem]">
      <Card className="bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark">
        <CardHeader>
          <CardTitle className="text-center text-[28px] font-medium">
            {isMFAEnabled ? "Enter MFA Code" : "Setup MFA Authentication"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {!isMFAEnabled && qrCodeUrl && (
            <div className="mb-6">
              <p className="text-[#9d9d9d] mb-4 text-center">
                Scan this QR code with your authenticator app
              </p>
              <div className="flex justify-center mb-4">
                <img 
                       src={qrCodeUrl} // The base64 string already includes the data:image/png;base64 prefix
                          alt="MFA QR Code" 
                      className="w-48 h-48"
                      />
              </div>
            </div>
          )}

          <form onSubmit={handleVerifyMFA}>
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="mfaCode"
                  className="block text-sm text-[#9d9d9d] font-normal py-1"
                >
                  {isMFAEnabled ? "Enter Code from Authenticator" : "Enter Code from Authenticator to Complete Setup"}
                </Label>
                <Input
                  id="mfaCode"
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="w-full h-12 pl-3 rounded-lg !text-[#9d9d9d] !placeholder-[#9d9d9d] bg-transparent border-[#e0effe] focus:border-none"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                variant="login"
                className="w-full text-sm font-normal mt-4"
              >
                {isMFAEnabled ? "Verify Code" : "Complete MFA Setup"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppLayout()(MfapageforDiscount);
