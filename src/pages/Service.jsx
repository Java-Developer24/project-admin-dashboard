import AppLayout from "@/components/layout/AppLayout";
import { SnapLoader } from "@/components/layout/Loaders";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Switch } from "@/components/ui/Switch";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Service = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openService, setOpenService] = useState(null);
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await axios.get("https://project-backend-xo17.onrender.com/api/service/get-service-data-admin");
        setServiceData(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err.message);
        setLoading(false);
      }
    };

    fetchServiceData();
  }, []);

  const navigateBack = () => navigate("/");
  const navigateToAddService = () => navigate("/service/add-service");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
    setOpenService(null);
  };

  const handleServiceClick = (service) => {
    setOpenService((prevService) =>
      prevService === service.name ? null : service.name
    );
  };

  const getFilteredServices = () => {
    if (!searchQuery) {
      return serviceData;
    }

    return serviceData.filter((service) =>
      service.name.toLowerCase().includes(searchQuery)
    );
  };

  const filteredServices = getFilteredServices();

  const clearSearch = () => {
    setSearchQuery("");
    setOpenService(null);
  };

  const handleSwitchChange = async (name, serverNumber, currentBlockStatus) => {
    try {
      await axios.post("https://project-backend-xo17.onrender.com/api/service/updateService", {
        name,
        serverNumber,
        block: !currentBlockStatus,
      });

      setServiceData((prevData) =>
        prevData.map((service) => {
          if (service.name === name) {
            return {
              ...service,
              servers: service.servers.map((server) =>
                server.serverNumber === serverNumber
                  ? { ...server, block: !currentBlockStatus }
                  : server
              ),
            };
          }
          return service;
        })
      );
    } catch (error) {
      console.error("Error updating block status:", error);
    }
  };

  const handleDeleteService = async (name) => {
    const deleteServicePromise = new Promise((resolve, reject) => {
      const deleteService = async () => {
        try {
          const response = await axios.post("https://project-backend-xo17.onrender.com/api/service/deleteService", { name });
          setServiceData((prevData) =>
            prevData.filter((service) => service.name !== name)
          );
          resolve(response);
        } catch (error) {
          reject(error);
        }
      };

      deleteService();
    });

    await toast.promise(deleteServicePromise, {
      loading: "Deleting service...",
      success: (r) => {
        return r.data.message;
      },
      error: (error) => {
        const errorMessage =
          error.response?.data?.error ||
          "Error Deleting data. Please try again.";
        return errorMessage;
      },
    });
  };

  return (
    <>
      <div className="w-full my-2">
        <Button
          variant="link"
          onClick={navigateBack}
          className="text-sm font-normal text-[#8C8C8C] !no-underline p-1 h-0 flex gap-2"
        >
          <Icon.arrowLeft className="w-4 h-4" /> Service List
        </Button>
      </div>
      <div className="flex items-center justify-center pt-[1rem]">
        <div className="bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark">
          <div className="flex items-center justify-end gap-4 my-4">
            <p className="text-[#A5A5A5]">
              Total services:{" "}
              <span className="text-white font-normal">
                {serviceData.length}
              </span>
            </p>
          </div>
          <div className="w-full flex bg-[#18191c] rounded-2xl px-2 items-center justify-center h-[50px] mb-3">
            <Icon.search className="w-4 h-4 text-primary" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-[85%] h-[50px] ml-2 text-sm bg-transparent border-0 text-white placeholder:text-primary focus:outline-none"
            />
            {searchQuery !== "" ? (
              <Icon.circleX
                className="text-primary cursor-pointer"
                onClick={clearSearch}
              />
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-col w-full relative h-[450px] md:h-[340px]">
            <div className="w-full flex items-center justify-between">
              <h5 className="p-3">Service List</h5>
              <Button
                variant="link"
                onClick={navigateToAddService}
                className="text-sm font-normal text-[#397CFF] !no-underline p-1 h-0"
              >
                + Add New Service
              </Button>
            </div>
            <div className="rounded-2xl flex flex-col overflow-y-auto hide-scrollbar h-full">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <SnapLoader />
                </div>
              ) : filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <div
                    className="bg-[#282828] py-4 px-5 mb-1 w-full items-center justify-between rounded-lg flex flex-col"
                    key={service.name}
                  >
                    <div className="flex items-center justify-between w-full">
                      <h3 className="capitalize font-medium">{service.name}</h3>
                      <div className="flex items-center gap-2">
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => handleServiceClick(service)}
                        >
                          <Icon.arrowUp
                            className={`w-5 h-5 transform transition-transform ${
                              openService === service.name ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                        <Icon.trash
                          className="w-5 h-5 cursor-pointer text-red-500"
                          onClick={() => handleDeleteService(service.name)}
                        />
                      </div>
                    </div>
                    {openService === service.name && (
                      <div className="bg-[#282828] pt-4 flex flex-col border-t my-1 border-white w-full items-center justify-between ">
                        <div className="flex w-full items-center justify-between ">
                          <h3 className="font-normal text-sm text-[#757575]">
                            Service Available on:
                          </h3>
                          <p className="font-normal text-sm text-[#757575]">
                            Price:
                          </p>
                        </div>
                        {service.servers.map((server) => (
                          <div className="w-full" key={server._id}>
                            <div className="flex w-full items-center justify-between my-2">
                              <div className="flex items-center gap-3">
                                <p className="font-normal text-sm">
                                  Server {server.serverNumber}
                                </p>
                                <Switch
                                  checked={server.block}
                                  onCheckedChange={() =>
                                    handleSwitchChange(
                                      service.name,
                                      server.serverNumber,
                                      server.block
                                    )
                                  }
                                />
                              </div>
                              <p className="font-normal text-sm">
                                {server.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-white">No services found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppLayout()(Service);
