import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/utils/AuthContext";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

const AddDiscount = () => {
  const navigate = useNavigate();
  const { email: userEmail, setEmail: setUserEmail } = useAuth();

  const navigateToDiscount = () => {
    navigate("/discount/user");
    setUserEmail("");
  };

  const [email, setEmail] = useState("" || userEmail);
  const [margin, setMargin] = useState("");
  const [serviceList, setServiceList] = useState([]);
  const [selectedService, setSelectedService] = useState(
    serviceList.length > 0 ? serviceList[0].name : ""
  );
  const [serverList, setServerList] = useState([]);
  const [selectedServer, setSelectedServer] = useState("");

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await axios.get("https://project-backend-xo17.onrender.com/api/service/get-service-data-admin");
        setServiceList(response.data);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchServiceData();
  }, []);

  const handleServiceChange = (newService) => {
    setSelectedService(newService);
    const service = serviceList.find((s) => s.name === newService);
    if (service) {
      setServerList(service.servers);
      setSelectedServer(
        service.servers.length > 0 ? service.servers[0].serverNumber : ""
      );
    } else {
      setServerList([]);
      setSelectedServer("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const discount = parseFloat(margin);
    if (isNaN(discount)) {
      alert("Please enter a valid margin.");
      return;
    }

    try {
      await axios.post("https://project-backend-xo17.onrender.com/api/user/add-user-discount", {
        email,
        service: selectedService,
        server: selectedServer,
        discount,
      });

      navigateToDiscount();
    } catch (error) {
      console.error("Error adding or updating discount:", error);
      alert("An error occurred while adding or updating the discount.");
    }
  };

  return (
    <>
      <div className="w-full my-4 flex items-center justify-between">
        <Button
          variant="link"
          onClick={navigateToDiscount}
          className="text-sm font-normal text-[#8C8C8C] !no-underline p-1 h-0 flex gap-2"
        >
          <Icon.arrowLeft className="w-4 h-4" /> Add Discount
        </Button>
      </div>
      <div className="flex items-center justify-center pt-[1rem]">
        <div className="bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="email"
                  className="block text-base text-[#9d9d9d] font-normal py-3"
                >
                  User Email
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="abc@gmail.com"
                  className="w-full h-12 pl-3 rounded-lg text-[#9d9d9d] !placeholder-[#9d9d9d] bg-transparent border-[#e0effe] focus:border-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="serviceName"
                  className="block text-base text-[#9d9d9d] font-normal py-3"
                >
                  Service Name
                </Label>
                <ServiceDropdown
                  selectedService={selectedService}
                  onServiceChange={handleServiceChange}
                  serviceList={serviceList}
                />
              </div>

              {serverList.length > 0 && (
                <div>
                  <Label
                    htmlFor="serverNumber"
                    className="block text-base text-[#9d9d9d] font-normal py-3"
                  >
                    Server Number
                  </Label>
                  <ServerDropdown
                    selectedServer={selectedServer}
                    onServerChange={setSelectedServer}
                    serverList={serverList}
                  />
                </div>
              )}

              <div>
                <Label
                  htmlFor="margin"
                  className="block text-base text-[#9d9d9d] font-normal py-3"
                >
                  Margin
                </Label>
                <Input
                  id="margin"
                  type="text"
                  placeholder="-1.2"
                  className="w-full h-12 pl-3 rounded-lg text-[#9d9d9d] !placeholder-[#9d9d9d] bg-transparent border-[#e0effe] focus:border-none"
                  value={margin}
                  onChange={(e) => setMargin(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="w-full flex items-center justify-center gap-4 mt-8">
              <Button className="py-1 px-8 text-xs bg-[#129BFF] text-white hover:bg-[#129BFF]">
                Add
              </Button>
              <Button
                type="button"
                onClick={navigateToDiscount}
                className="py-1 px-6 text-xs !rounded-md border-2 border-white font-normal hover:!bg-white hover:text-black transition-colors duration-200 ease-in-out"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AppLayout()(AddDiscount);

const ServiceDropdown = ({ selectedService, onServiceChange, serviceList }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = serviceList.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative">
      <Button
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between h-12 pl-3 rounded-lg text-[#9d9d9d] bg-transparent border border-[#e0effe] !transform-none"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
      >
        {selectedService || "Select service..."}
        <Icon.arrowUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-[#1e1e1e] rounded-lg shadow-lg border border-[#888888]">
          <div className="p-2">
            <Input
              type="text"
              placeholder="Search service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 p-2 mb-2 rounded-lg text-[#9d9d9d] bg-transparent border border-[#e0effe] focus:outline-none"
            />
            {filteredServices.length === 0 && (
              <div className="text-[#9d9d9d] p-2">No service found.</div>
            )}
            <ul className="max-h-40 overflow-y-auto">
              {filteredServices.map((service) => (
                <li
                  key={service.name}
                  onClick={() => {
                    onServiceChange(service.name);
                    setOpen(false);
                  }}
                  className={cn(
                    "cursor-pointer p-2 rounded hover:bg-[#2e2e2e]",
                    selectedService === service.name && "bg-[#2e2e2e]"
                  )}
                >
                  {service.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

const ServerDropdown = ({ selectedServer, onServerChange, serverList }) => {
  return (
    <Select value={selectedServer} onValueChange={onServerChange}>
      <SelectTrigger className="w-full dark bg-[#282828] h-12 pl-3 rounded-lg text-[#9d9d9d] !placeholder-[#9d9d9d] bg-transparent border border-[#e0effe] justify-between">
        <SelectValue>{selectedServer}</SelectValue>
      </SelectTrigger>
      <SelectContent className="dark bg-[#1e1e1e]">
        <SelectGroup>
          <SelectLabel className="font-normal">Service Name</SelectLabel>
          {serverList.map((server) => (
            <SelectItem key={server.serverNumber} value={server.serverNumber}>
              {server.serverNumber}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
