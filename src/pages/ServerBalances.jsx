import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SnapLoader } from "@/components/layout/Loaders";
import toast from "react-hot-toast";

const ServerBalances = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage after login
  const [balances, setBalances] = useState({
    server1: { balance: 0, currency: 'p' },
    server2: { balance: 0, currency: 'p' },
    server3: { balance: 0, currency: '$' },
    server4: { balance: 0, currency: 'p' },
    server5: { balance: 0, currency: 'p' },
    server6: { balance: 0, currency: '$' },
    server7: { balance: 0, currency: 'p' },
    server8: { balance: 0, currency: '$' },
    
  });
  const [loading, setLoading] = useState(true); // State to handle the loading state

  const serverNames = {
    server1: "FastSMS",
    server2: "5sim",
    server3: "SMSHUB",
   
    server4: "GRIZZLYSMS",
    server5: "TEMPNUMBER",
    server6: "SMS-ACTIVATE.guru",
    server7: "SMSBOWER",
    
    server8: "CCPAY",
    
  };

  const fetchBalances = async () => {
    try {
      setLoading(true);
      // Single request to backend that will handle all API calls
      const response  = await axios.get("/api/server/admin-api/balances-get-server/server-balances", {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to the Authorization header
        },
      });
      setBalances(response.data);
    } catch (error) {
      console.error("Error fetching balances:", error);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
    // Refresh balances every 5 minutes
    const interval = setInterval(fetchBalances, 300000);
    return () => clearInterval(interval);
  }, []);

  const navigateToHome = () => navigate("/");

  return (
    <>
      <div className="w-full my-4 flex items-center justify-between">
        <Button
          variant="link"
          onClick={navigateToHome}
          className="text-sm font-normal text-[#8C8C8C] !no-underline p-1 h-0 flex gap-2"
        >
          <Icon.arrowLeft className="w-4 h-4" /> Server Balances
        </Button>
      </div>

      <div className="flex items-center justify-center pt-[1rem]">
        <div className="bg-transparent w-full rounded-lg mb-[60px] border-none dark">
          {loading ? (
            <div className="h-full flex items-center justify-center">
            <SnapLoader />
          </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(balances).map(([server, data], index) => (
                  <div
                    key={server}
                    className="bg-[#282828] p-2 rounded-lg shadow-lg hover:bg-[#2a2a2a] transition-colors"
                  >
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between items-center ">
                        <h3 className="text-sm   text-gray-200">
                          Server {index + 1}
                        </h3>
                        <span className="text-sm text-gray-200">
                          {serverNames[server]}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-200 text-sm">Balance:</span>
                        <span className="text-sm font-bold text-primary">
                          {(data.balance || 0).toFixed(2)} {data.currency || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={fetchBalances}
                  className="bg-primary hover:bg-primary/90 text-white"
                  disabled={loading}
                >
                  {loading ? 'Refreshing...' : 'Refresh Balances'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AppLayout()(ServerBalances);
