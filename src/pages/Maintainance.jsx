import AppLayout from "@/components/layout/AppLayout";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Switch } from "@/components/ui/Switch";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Maintenance = () => {
  const navigate = useNavigate();
  const [servers, setServers] = useState([]); // To store server data
  const [loading, setLoading] = useState(true); // To handle loading state
  const [masterMaintenace, setMasterMaintenace] = useState(false); // To handle master maintenance status

  const navigateBack = () => navigate("/admin-panel");

  useEffect(() => {
    // Fetch server data
    const fetchServers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/server/get-server"); // Call the API endpoint
        setServers(response.data); // Set server data
        // Find the master maintenance status
        const masterServer = response.data.find(
          (server) => server.server === 0
        );
        setMasterMaintenace(masterServer?.maintenance || false); // Set master maintenance status
      } catch (error) {
        console.error("Failed to fetch servers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, []);

  const handleMasterSwitchChange = async (isChecked) => {
    try {
      await axios.post(`http://localhost:3000/api/service/maintenance-all-servers`, {
        server: 0, // Server 0 for master maintenance
        maintenance: isChecked,
      }); // Update master maintenance status
      setMasterMaintenace(isChecked);
      setServers((prevServers) =>
        prevServers.map((server) =>
          server.server !== 0 ? { ...server, maintenance: isChecked } : server
        )
      );
    } catch (error) {
      console.error("Failed to update master maintenance status:", error);
    }
  };

  const handleSwitchChange = async (serverNumber, isChecked) => {
    try {
      await axios.post(`http://localhost:3000/api/service/maintainance-server`, {
        serverNumber: serverNumber,
        maintenance: isChecked,
      }); // Update server block status
      setServers((prevServers) =>
        prevServers.map((server) =>
          server.server === serverNumber
            ? { ...server, maintenance: isChecked }
            : server
        )
      );
    } catch (error) {
      console.error("Failed to update server maintenance status:", error);
    }
  };

  return (
    <>
      <div className="w-full my-2">
        <Button
          variant="link"
          onClick={navigateBack}
          className="text-sm font-normal text-[#8C8C8C] !no-underline p-1 h-0 flex gap-2"
        >
          <Icon.arrowLeft className="w-4 h-4" /> Maintenance
        </Button>
      </div>
      <div className="flex items-center justify-center pt-[1rem]">
        <div className="bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark">
          <div className="w-full flex items-center justify-between px-4">
            <h5 className="font-normal text-base text-[#757575]">
              Master Maintenance
            </h5>
            <Switch
              checked={masterMaintenace}
              onCheckedChange={(checked) => handleMasterSwitchChange(checked)}
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            {loading ? (
              <div>Loading...</div>
            ) : (
              servers
                .filter((server) => server.server !== 0) // Exclude master server
                .map((server) => (
                  <div
                    key={server.server}
                    className={buttonVariants({
                      variant: "login",
                      className:
                        "w-full text-sm font-normal h-14 text-white !bg-[#282828] !hover:bg-[#282828] !justify-between !transform-none",
                    })}
                  >
                    Server {server.server}
                    <Switch
                      checked={server.maintenance}
                      onCheckedChange={(checked) =>
                        handleSwitchChange(server.server, checked)
                      }
                    />
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AppLayout()(Maintenance);
