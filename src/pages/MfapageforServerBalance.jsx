import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useAuth } from "@/utils/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import toast from "react-hot-toast";
import AppLayout from "@/components/layout/AppLayout";

const MfapageforServerBalance = () => {
  const [mfaCode, setMfaCode] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isMFAEnabled, setIsMFAEnabled] = useState(false);
  const [isMFASetupComplete, setIsMFASetupComplete] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const tempEmail = localStorage.getItem("tempEmail");

    if (!tempEmail) {
      navigate("/login");
      return;
    }

    // Function to check MFA status
    const checkMFAStatus = async () => {
      try {
        const response = await fetch("https://backendapi.tech-developer.online/api/mfa/status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tempEmail }),
        });

        const data = await response.json();

        if (data.success && data.is2FAEnabled && data.is2FASetupComplete) {
          // MFA is fully enabled and set up
          setIsMFAEnabled(true);
          setIsMFASetupComplete(true);
        } else if (data.success && data.is2FAEnabled && !data.is2FASetupComplete) {
          // MFA is enabled but not set up
          setIsMFAEnabled(true);
          setIsMFASetupComplete(false);

          const setupResponse = await fetch("https://backendapi.tech-developer.online/api/mfa/enable", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tempEmail }),
          });

          const setupData = await setupResponse.json();
          if (setupData.qrCodeUrl) {
            setQrCodeUrl(setupData.qrCodeUrl); // Show QR code for setup
          }
        } else if (data.success && !data.is2FAEnabled) {
          // MFA is disabled
          
          login();
          setTimeout(() => {
            navigate("/server-balances");// Redirect to desired page
          }, 2000);
        } else {
          // Handle unexpected states
          toast.error("Unexpected MFA state. Please contact support.");
        }
      } catch (error) {
        console.error("Error checking MFA status:", error);
        toast.error("Failed to check MFA status.");
      } finally {
        setLoading(false); // Set loading to false once the API call is done
      }
    };

    checkMFAStatus();
  }, [navigate]);

  const handleVerifyMFA = async (e) => {
    e.preventDefault();
    const tempEmail = localStorage.getItem("tempEmail");

    try {
      const response = await fetch("https://backendapi.tech-developer.online/api/mfa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tempEmail, mfaCode }),
      });

      const data = await response.json();

      if (data.message === "2FA verified successfully. Access granted.") {
        setTimeout(() => {
          toast.success(
            isMFAEnabled ? "MFA verification successful" : "MFA setup successful",
            {
              duration: 2000, // Toast stays visible for 5 seconds
            }
          );
        }, 100); 
        login();
        
          navigate("/server-balances");// Navigate to the main page
     
        
        
      } else {
        toast.error("Invalid MFA code.");
      }
    } catch (error) {
      console.error("Error verifying MFA:", error);
      toast.error("Failed to verify MFA code.");
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
        <div className="flex items-center justify-center">
          <svg className="w-16 h-16 animate-spin text-gray-900/50" viewBox="0 0 64 64" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
              stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path
              d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
              stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
              className="text-teal-500">
            </path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center pt-[4rem]">
      <Card className="bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark">
        <CardHeader>
          <CardTitle className="text-center text-[28px] font-medium">
            {isMFAEnabled
              ? isMFASetupComplete
                ? "Enter MFA Code"
                : "Setup MFA Authentication"
              : "MFA Disabled"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {!isMFAEnabled ? (
            <div className="text-center text-[#9d9d9d]">
              <p>MFA is disabled. Redirecting you to the Server Balance page...</p>
            </div>
          ) : (
            <>
              {/* Show QR code only if MFA is enabled but not set up */}
              {!isMFASetupComplete && qrCodeUrl && (
                <div className="mb-6">
                  <p className="text-[#9d9d9d] mb-4 text-center">
                    Scan this QR code with your authenticator app
                  </p>
                  <div className="flex justify-center mb-4">
                    <img src={qrCodeUrl} alt="MFA QR Code" className="w-48 h-48" />
                  </div>
                </div>
              )}

              {/* Show form for code input when MFA setup is pending or completed */}
              <form onSubmit={handleVerifyMFA}>
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="mfaCode"
                      className="block text-sm text-[#9d9d9d] font-normal py-1"
                    >
                      {isMFASetupComplete
                        ? "Enter Code from Authenticator"
                        : "Enter Code to Complete Setup"}
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
                    {isMFASetupComplete ? "Verify Code" : "Complete MFA Setup"}
                  </Button>
                </div>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppLayout()(MfapageforServerBalance);
