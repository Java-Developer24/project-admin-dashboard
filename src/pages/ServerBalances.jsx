import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ServerBalances = () => {
  const navigate = useNavigate();
  const [balances, setBalances] = useState({
    server1: { balance: 0, currency: 'p' },
    server2: { balance: 0, currency: 'p' },
    server3: { balance: 0, currency: '$' },
    server4: { balance: 0, currency: 'p' },
    server5: { balance: 0, currency: 'p' },
    server6: { balance: 0, currency: 'p' },
    server7: { balance: 0, currency: '$' },
    server8: { balance: 0, currency: 'p' },
    
  });
  const [loading, setLoading] = useState(true);

  const serverNames = {
    server1: "FastSMS",
    server2: "5sim",
    server3: "SMSHUB",
   
    server4: "GRIZZLYSMS",
    server5: "TEMPNUMBER",
    server7: "SMSBOWER",
    server6: "SMS-ACTIVATE.guru",
    server8: "CCPAY",
    
  };

  const fetchBalances = async () => {
    try {
      setLoading(true);
      // Single request to backend that will handle all API calls
      const response = await axios.get("/api/server/server-balances");
      setBalances(response.data);
    } catch (error) {
      console.error("Error fetching balances:", error);
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
        <div className="bg-transparent w-full max-w-4xl rounded-lg mb-[60px] border-none dark">
          {loading ? (
            <div className="text-center text-gray-400">Loading balances...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(balances).map(([server, data], index) => (
                  <div
                    key={server}
                    className="bg-[#282828] p-6 rounded-lg shadow-lg hover:bg-[#2a2a2a] transition-colors"
                  >
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-white">
                          Server {index + 1}
                        </h3>
                        <span className="text-sm text-gray-400">
                          {serverNames[server]}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Balance:</span>
                        <span className="text-xl font-bold text-primary">
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
