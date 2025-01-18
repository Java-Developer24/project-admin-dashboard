import React, { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { useNavigate } from "react-router-dom";
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
import { Label } from "@radix-ui/react-label";

const Discount = () => {
  const navigate = useNavigate();
  const [selectedDiscountType, setSelectedDiscountType] = useState("");
  const [selectedServer, setSelectedServer] = useState("");
  const [servers, setServers] = useState([]);
  const token = localStorage.getItem("token"); // Retrieve the token from localStorage or another storage method
  const [activeDiscounts, setActiveDiscounts] = useState({
    serverDiscounts: [],
    serviceDiscounts: [],
    userDiscounts: []
  });

  const discountTypes = [
    { value: "server", label: "Server Discount" },
    { value: "service", label: "Service Discount" },
    { value: "user", label: "User Discount" }
  ];

  useEffect(() => {
    // Fetch servers
    const fetchServers = async () => {
      try {
        const response = await axios.get("/api/server/admin-api/server-data-get/get-server", {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to the Authorization header
          },
        });
        const availableServers = response.data
          .filter(server => server.server !== 0)
          .map(server => ({
            value: server.server.toString(),
            label: `Server ${server.server}`
          }));
        setServers(availableServers);
      } catch (error) {
        console.error("Failed to fetch servers:", error);
      }
    };

    // Fetch active discounts
    const fetchActiveDiscounts = async () => {
      try {
        const [serverDiscounts, serviceDiscounts, userDiscounts] = await Promise.all([
          await axios.get("/api/server/admin-api/server-discount-update/get-server-discount", {
            headers: {
              Authorization: `Bearer ${token}`, // Add token to the Authorization header
            },
          }),
          await axios.get("/api/service/admin-api/server-discount-data/get-all-service-discount", {
            headers: {
              Authorization: `Bearer ${token}`, // Add token to the Authorization header
            },
          }),
          await axios.get("/api/user/admin-api/user-discount-data/get-all-user-discount", {
            headers: {
              Authorization: `Bearer ${token}`, // Add token to the Authorization header
            },
          })
        ]);

        setActiveDiscounts({
          serverDiscounts: serverDiscounts.data || [],
          serviceDiscounts: serviceDiscounts.data || [],
          userDiscounts: userDiscounts.data || []
        });
      } catch (error) {
        console.error("Failed to fetch active discounts:", error);
      }
    };

    fetchServers();
    fetchActiveDiscounts();
  }, []);

  const navigateBack = () => navigate("/");

  const handleDiscountTypeChange = (value) => {
    setSelectedDiscountType(value);
    setSelectedServer("");
    
    if (value === "user") {
      navigate("/discount/user");
    }
  };

  const handleServerChange = (value) => {
    setSelectedServer(value);
    if (selectedDiscountType === "server") {
      navigate(`/discount/server/${value}`);
    } else if (selectedDiscountType === "service") {
      navigate(`/discount/service/${value}`);
    }
  };

 // In src/pages/Discount.jsx

// Modify the renderActiveDiscounts function to make items clickable:

const renderActiveDiscounts = () => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Active Discounts</h3>
      
      {/* Server Discounts */}
      {activeDiscounts.serverDiscounts.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium mb-2">Server Discounts</h4>
          <div className="bg-[#282828] p-4 rounded-lg">
            {activeDiscounts.serverDiscounts.map((discount, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center mb-2 cursor-pointer hover:bg-[#333333] p-2 rounded"
                onClick={() => navigate(`/discount/server/${discount.server}`)}
              >
                <span>Server {discount.server}</span>
                <span>Rs {discount.discount}.00</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Discounts */}
      {activeDiscounts.serviceDiscounts.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium mb-2">Service Discounts</h4>
          <div className="bg-[#282828] p-4 rounded-lg">
            {activeDiscounts.serviceDiscounts.map((discount, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center mb-2 cursor-pointer hover:bg-[#333333] p-2 rounded"
                onClick={() => navigate(`/discount/service/${discount.server}`)}
              >
                <span>{discount.service}</span>
                <div>
                  <span>Server {discount.server}</span>
                  <span className="ml-4">Rs {discount.discount}.00</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Discounts */}
      {activeDiscounts.userDiscounts.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium mb-2">User Discounts</h4>
          <div className="bg-[#282828] p-4 rounded-lg">
            {activeDiscounts.userDiscounts.map((discount, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center mb-2 cursor-pointer hover:bg-[#333333] p-2 rounded"
                onClick={() => navigate(`/discount/user/${discount.userId._id}`)}
              >
                <span>{discount.userId.email}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

  return (
    <>
      <div className="w-full my-2">
        <Button
          variant="link"
          onClick={navigateBack}
          className="text-sm font-normal text-[#8C8C8C] !no-underline p-1 h-0 flex gap-2"
        >
          <Icon.arrowLeft className="w-4 h-4" /> Discount
        </Button>
      </div>
      <div className="flex items-center justify-center pt-[1rem]">
        <div className="bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark">
          <div className="space-y-4">
            {/* Discount Type Dropdown */}
            <div>
              <Label className="text-[#9d9d9d] mb-2">Select Discount Type</Label>
              <Select value={selectedDiscountType} onValueChange={handleDiscountTypeChange}>
                <SelectTrigger className="w-full dark bg-[#282828]">
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent className="dark bg-[#1e1e1e]">
                  <SelectGroup>
                    {discountTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Server Selection Dropdown */}
            {selectedDiscountType && selectedDiscountType !== "user" && (
              <div>
                <Label className="text-[#9d9d9d] mb-2">Select Server</Label>
                <Select value={selectedServer} onValueChange={handleServerChange}>
                  <SelectTrigger className="w-full dark bg-[#282828]">
                    <SelectValue placeholder="Select server" />
                  </SelectTrigger>
                  <SelectContent className="dark bg-[#1e1e1e]">
                    <SelectGroup>
                      {servers.map((server) => (
                        <SelectItem key={server.value} value={server.value}>
                          {server.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Active Discounts Section */}
          {renderActiveDiscounts()}
        </div>
      </div>
    </>
  );
};

export default AppLayout()(Discount);