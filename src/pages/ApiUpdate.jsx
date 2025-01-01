import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ApiUpdate = () => {
  const navigate = useNavigate();
  const [newApi, setNewApi] = useState("");
  const [showAddServerForm, setShowAddServerForm] = useState(false);
  const [serverNumberInput, setServerNumberInput] = useState("");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [selectedServer, setSelectedServer] = useState("1"); // Initial selected server set to "1"
  const [servers, setServers] = useState([]);
  const [token, setToken] = useState("");
  const [newToken, setNewToken] = useState("");

  // New state variables for exchange rate and margin
  const [exchangeRate, setExchangeRate] = useState("");
  const [newExchangeRate, setNewExchangeRate] = useState("");
  const [margin, setMargin] = useState("");
  const [newMargin, setNewMargin] = useState("");

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/server/get-server");
        const availableServers = response.data.filter(
          (server) => !server.maintainance && server.server !== 0
        );
        setServers(availableServers);
        if (availableServers.length > 0) {
          setSelectedServer("1"); // Set initial selected server to "1"
        }

        // Fetch exchange rate and margin for the selected server
        if (availableServers.length > 0) {
          fetchExchangeRateAndMargin("1"); // Fetch for the default server initially
        }
      } catch (error) {
        console.error("Failed to fetch servers:", error);
      }
    };
    fetchServers();
  }, []);

  const fetchExchangeRateAndMargin = async (serverNumber) => {
    try {
      const response = await axios.get("http://localhost:3000/api/server/get-server");
      const server = response.data.find(
        (s) => s.server === parseInt(serverNumber)
      );
      if (server) {
        setExchangeRate(server.exchangeRate || "");
        setMargin(server.margin || "");
      }
    } catch (error) {
      console.error("Failed to fetch exchange rate and margin:", error);
    }
  };

  const navigateToAdminPanel = () => navigate("/admin-panel");

  const handleServerChange = (newServer) => {
    setSelectedServer(newServer);
    setNewApi("");
    if (newServer === "9") {
      fetchTokenForServer9();
    }
    fetchExchangeRateAndMargin(newServer); // Fetch exchange rate and margin for the selected server
  };

  const handleAddServerClick = () => {
    setShowAddServerForm(!showAddServerForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/server/update-api-key", {
        server: selectedServer,
        api_key: newApi,
      });
      const response = await axios.get("http://localhost:3000/api/server/get-server");
      const availableServers = response.data.filter(
        (server) => !server.maintainance && server.server !== 0
      );
      setServers(availableServers);
      if (availableServers.length > 0) {
        setSelectedServer("1");
      }
      setNewApi("");
    } catch (error) {
      console.error("Error updating API:", error);
    }
  };

  const handleAddServerSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/server/add-server-data-admin", {
        server: serverNumberInput,
        api_key: apiKeyInput,
      });
      const response = await axios.get("http://localhost:3000/api/server/get-server");
      const availableServers = response.data.filter(
        (server) => !server.maintainance && server.server !== 0
      );
      setServers(availableServers);
      if (availableServers.length > 0) {
        setSelectedServer("1");
      }
      setServerNumberInput("");
      setApiKeyInput("");
      setShowAddServerForm(false);
    } catch (error) {
      console.error("Error adding server:", error);
    }
  };

  const fetchTokenForServer9 = async () => {
    try {
      const response = await axios.get("/get-token-server9");
      setToken(response.data.token);
    } catch (error) {
      console.error("Failed to fetch token for server 9:", error);
    }
  };

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/add-token-server9", {
        token: newToken,
      });
      setNewToken("");
      fetchTokenForServer9();
    } catch (error) {
      console.error("Error updating token for server 9:", error);
    }
  };

  // New handlers for updating exchange rate and margin
  const handleExchangeRateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3000/api/server/update-exchange-rate`, {
        server: selectedServer,
        exchangeRate: newExchangeRate,
      });
      fetchExchangeRateAndMargin(selectedServer);
      setNewExchangeRate(""); // Refresh the exchange rate after updating
    } catch (error) {
      console.error("Error updating exchange rate:", error);
    }
  };

  const handleMarginSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3000/api/server/update-margin-amount`, {
        server: selectedServer,
        margin: newMargin,
      });
      fetchExchangeRateAndMargin(selectedServer); // Refresh the margin after updating
      setNewMargin("");
    } catch (error) {
      console.error("Error updating margin:", error);
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
          <Icon.arrowLeft className="w-4 h-4" /> Update API
        </Button>
      </div>
      <div className="flex items-center justify-center pt-[1rem]">
        <div className="bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark">
          <div className="flex justify-end">
            <Button
              variant="link"
              onClick={handleAddServerClick}
              className="text-sm font-normal text-[#397CFF] !no-underline p-1 h-0"
            >
              {!showAddServerForm ? "+ Add New Server" : "- Back To Server"}
            </Button>
          </div>
          {showAddServerForm ? (
            <form onSubmit={handleAddServerSubmit}>
              <div className="space-y-2">
                <div>
                  <Label
                    htmlFor="serverNumber"
                    className="block text-base text-[#9d9d9d] font-normal py-2"
                  >
                    Server Number
                  </Label>
                  <Input
                    id="serverNumber"
                    type="text"
                    placeholder="Enter server number"
                    className="w-full h-12 pl-3 rounded-lg text-[#9d9d9d] !placeholder-[#9d9d9d] bg-transparent border-[#e0effe] focus:border-none"
                    value={serverNumberInput}
                    onChange={(e) => setServerNumberInput(e.target.value)}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="apiKey"
                    className="block text-base text-[#9d9d9d] font-normal py-2"
                  >
                    API Key
                  </Label>
                  <Input
                    id="apiKey"
                    type="text"
                    placeholder="Enter API Key"
                    className="w-full h-12 pl-3 rounded-lg text-[#9d9d9d] !placeholder-[#9d9d9d] bg-transparent border-[#e0effe] focus:border-none"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full flex items-center justify-center gap-4 mt-8">
                <Button className="py-1 px-8 w-[50%] text-xs bg-[#129BFF] text-white hover:bg-[#129BFF]">
                  Save
                </Button>
              </div>
            </form>
          ) : (
            <form
              onSubmit={
                selectedServer === "9" ? handleTokenSubmit : handleSubmit
              }
            >
              <div className="space-y-2">
                <p className="block text-base text-[#9d9d9d] font-normal pt-3">
                  Select Server
                </p>
                <SelectServer
                  selectedServer={selectedServer}
                  onServerChange={handleServerChange}
                  servers={servers}
                />

                <div>
                  <Label
                    htmlFor="currentApi"
                    className="block text-base text-[#9d9d9d] font-normal py-3"
                  >
                    Current API
                  </Label>
                  <Input
                    id="currentApi"
                    type="text"
                    disabled
                    className="w-full h-12 pl-3 rounded-lg disabled:text-white disabled:!border-[#e0effe] focus:border-none disabled:opacity-100 disabled:bg-[#9D9D9D]/50"
                    value={
                      servers.find(
                        (server) => server.server === parseInt(selectedServer)
                      )?.api_key || ""
                    }
                  />
                </div>
                {!(selectedServer === "9") && (
                  <div>
                    <Label
                      htmlFor="newApi"
                      className="block text-base text-[#9d9d9d] font-normal py-3"
                    >
                      Enter New API
                    </Label>
                    <Input
                      id="newApi"
                      type="text"
                      placeholder="Enter new API Key"
                      className="w-full h-12 pl-3 rounded-lg text-[#9d9d9d] !placeholder-[#9d9d9d] bg-transparent border-[#e0effe] focus:border-none"
                      value={newApi}
                      onChange={(e) => setNewApi(e.target.value)}
                    />
                  </div>
                )}
                {selectedServer === "9" && (
                  <>
                    <div>
                      <Label
                        htmlFor="currentToken"
                        className="block text-base text-[#9d9d9d] font-normal py-3"
                      >
                        Current Token
                      </Label>
                      <Input
                        id="currentToken"
                        type="text"
                        disabled
                        className="w-full h-12 pl-3 rounded-lg disabled:text-white disabled:!border-[#e0effe] focus:border-none disabled:opacity-100 disabled:bg-[#9D9D9D]/50"
                        value={token || ""}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="newToken"
                        className="block text-base text-[#9d9d9d] font-normal py-3"
                      >
                        Enter New Token
                      </Label>
                      <Input
                        id="newToken"
                        type="text"
                        placeholder="Enter new token"
                        className="w-full h-12 pl-3 rounded-lg text-[#9d9d9d] !placeholder-[#9d9d9d] bg-transparent border-[#e0effe] focus"
                        value={newToken}
                        onChange={(e) => setNewToken(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="w-full flex items-center justify-center gap-4 mt-8">
                <Button className="py-1 px-8 text-xs bg-[#129BFF] text-white hover:bg-[#129BFF]">
                  Save
                </Button>
                <Button
                  className="py-1 px-6 text-xs !rounded-md border-2 border-white font-normal hover:!bg-white hover:text-black transition-colors duration-200 ease-in-out"
                  type="button"
                  onClick={navigateToAdminPanel}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* New section for displaying exchange rate and margin */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold">Update Exchange Rate</h2>
            <div className="space-y-2 mt-4">
              <div>
                <Label
                  htmlFor="currentExchangeRate"
                  className="block text-base text-[#9d9d9d] font-normal py-2"
                >
                  Exchange Rate
                </Label>
                <Input
                  id="currentExchangeRate"
                  type="text"
                  value={exchangeRate}
                  disabled
                  className="w-full h-12 pl-3 rounded-lg disabled:text-white disabled:!border-[#e0effe] focus:border-none disabled:opacity-100 disabled:bg-[#9D9D9D]/50"
                />
              </div>

              <form onSubmit={handleExchangeRateSubmit} className="space-y-4">
                <div>
                  <Label
                    htmlFor="newExchangeRate"
                    className="block text-base text-[#9d9d9d] font-normal py-2"
                  >
                    New Exchange Rate
                  </Label>
                  <Input
                    id="newExchangeRate"
                    type="text"
                    required
                    placeholder="Enter new exchange rate"
                    className="w-full h-12 pl-3 rounded-lg text-[#9d9d9d] bg-transparent border-[#e0effe] focus:border-none"
                    value={newExchangeRate}
                    onChange={(e) => setNewExchangeRate(e.target.value)}
                  />
                </div>
                <div className="w-full flex items-center justify-center gap-4 mt-8">
                  <Button className="py-1 px-8 w-[50%] text-xs bg-[#129BFF] text-white hover:bg-[#129BFF]">
                    Update Exchange Rate
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* New section for updating exchange rate and margin */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold">Update Margin</h2>
            <div>
              <Label
                htmlFor="currentMargin"
                className="block text-base text-[#9d9d9d] font-normal py-2"
              >
                Margin
              </Label>
              <Input
                id="currentMargin"
                type="text"
                value={margin}
                disabled
                className="w-full h-12 pl-3 rounded-lg disabled:text-white disabled:!border-[#e0effe] focus:border-none disabled:opacity-100 disabled:bg-[#9D9D9D]/50"
              />
            </div>
            <form onSubmit={handleMarginSubmit} className="mt-4 space-y-4">
              <div>
                <Label
                  htmlFor="newMargin"
                  className="block text-base text-[#9d9d9d] font-normal py-2"
                >
                  New Margin
                </Label>
                <Input
                  id="newMargin"
                  required
                  type="text"
                  placeholder="Enter new margin"
                  className="w-full h-12 pl-3 rounded-lg text-[#9d9d9d] bg-transparent border-[#e0effe] focus:border-none"
                  value={newMargin}
                  onChange={(e) => setNewMargin(e.target.value)}
                />
              </div>
              <div className="w-full flex items-center justify-center gap-4 mt-8">
                <Button className="py-1 px-8 w-[50%] text-xs bg-[#129BFF] text-white hover:bg-[#129BFF]">
                  Update Margin
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

const SelectServer = ({ selectedServer, onServerChange, servers }) => (
  <Select onValueChange={onServerChange} value={selectedServer}>
    <SelectTrigger className="w-full dark bg-[#282828]">
      <SelectValue placeholder="Select Server" />
    </SelectTrigger>
    <SelectContent className="dark bg-[#1e1e1e]">
      <SelectGroup>
        <SelectLabel className="text-[#9d9d9d]">
          Select Available Server
        </SelectLabel>
        {servers.map((server) => (
          <SelectItem
            key={server.server}
            value={server.server.toString()}
            className="text-[#9d9d9d]"
          >
            Server {server.server}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);

export default AppLayout()(ApiUpdate);
