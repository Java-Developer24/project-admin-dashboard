import AppLayout from "@/components/layout/AppLayout";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";

const AddServiceDiscount = ({ serviceList }) => {
  const params = useParams();
  const serverId = parseInt(params.id); // Get the serverId from URL params and convert it to an integer
  const navigate = useNavigate();

  const [margin, setMargin] = useState("");
  const [discount, setDiscount] = useState([]);
  const [selectedService, setSelectedService] = useState(serviceList[0]?.name || "");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token"); // Retrieve the token from localStorage
  const navigateBack = () => navigate("/discount");

  const fetchDiscounts = async () => {
    try {
      const response = await axios.get("/api/service/admin-api/server-discount-data/get-all-service-discount", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      setDiscount(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching discounts:", error);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const discountAmount = parseFloat(margin);
      if (isNaN(discountAmount)) {
        alert("Please enter a valid discount amount.");
        return;
      }

      await axios.post("/api/service/admin-api/updating-service-discount/add-service-discount", {
        service: selectedService,
        server: serverId,
        discount: discountAmount,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      setSelectedService(serviceList[0]?.name || "");
      setMargin("");
      fetchDiscounts();
    } catch (error) {
      console.error("Error adding service discount:", error);
      alert("An error occurred while updating the discount.");
    }
  };

  const handleDelete = async (service, server) => {
    try {
      await axios.delete(`/api/service/admin-api/service-discount-removal/delete-service-discount?service=${service}&server=${server}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      fetchDiscounts();
      alert("Service discount deleted successfully");
    } catch (error) {
      console.error("Error deleting service discount:", error);
      alert("An error occurred while deleting the discount.");
    }
  };

  // Filter services based on the selected server ID
  const filteredServiceList = serverId 
    ? serviceList.filter(service => 
        service.servers.some(server => server.serverNumber === serverId.toString())
      ) // Only show services containing the selected server ID
    : serviceList;

  useEffect(() => {
    console.log("Current discounts state:", discount); // Log the current state of discount
  }, [discount]);

  return (
    <>
      <div className="w-full my-4 flex items-center justify-between">
        <Button
          variant="link"
          onClick={navigateBack}
          className="text-sm font-normal text-[#8C8C8C] !no-underline p-1 h-0 flex gap-2"
        >
          <Icon.arrowLeft className="w-4 h-4" /> Service Discount
        </Button>
      </div>
      <div className="flex items-center justify-center pt-[1rem]">
        <div className="w-full max-w-md rounded-lg mb-[60px]">
          <div className="flex items-center text-base">
            <p className="text-white w-40">Selected Server:</p>
            <span className="text-[#959595]">Server {serverId}</span>
          </div>

          <form onSubmit={handleSubmit} className="my-4">
            <div className="space-y-2">
              <p className="block text-base text-[#9d9d9d] font-normal pt-3">
                Service Name
              </p>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full h-12 pl-3 pr-10 text-left bg-transparent border border-[#e0effe] rounded-lg text-[#9d9d9d]"
                >
                  {selectedService || "Select service..."}
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute z-10 mt-2 w-full bg-[#1e1e1e] border border-[#888888] rounded-lg shadow-lg">
                    <input
                      type="text"
                      placeholder="Search service..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-2 text-[#9d9d9d] bg-transparent border-b border-[#888888]"
                    />
                    <ul className="max-h-60 overflow-y-auto">
                      {filteredServiceList
                        .filter((service) =>
                          service.name.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((service) => (
                          <li
                            key={service.name}
                            onClick={() => {
                              setSelectedService(service.name);
                              setDropdownOpen(false);
                              setSearchTerm("");
                            }}
                            className={`px-4 py-2 cursor-pointer hover:bg-[#2e2e2e] ${
                              selectedService === service.name
                                ? "bg-[#2e2e2e] text-white"
                                : "text-[#9d9d9d]"
                            }`}
                          >
                            {service.name}
                          </li>
                        ))}
                      {!filteredServiceList.some((service) =>
                        service.name.toLowerCase().includes(searchTerm.toLowerCase())
                      ) && (
                        <li className="px-4 py-2 text-[#9d9d9d]">
                          No service found.
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="discount"
                  className="block text-base text-[#9d9d9d] font-normal py-3"
                >
                  Discount
                </label>
                <input
                  id="discount"
                  type="text"
                  placeholder="2"
                  className="w-full h-12 pl-3 rounded-lg text-[#9d9d9d] placeholder-[#9d9d9d] bg-transparent border border-[#e0effe]"
                  value={margin}
                  onChange={(e) => setMargin(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full flex items-center justify-center gap-4 mt-8">
              <Button className="py-1 px-8 text-xs bg-[#129BFF] text-white hover:bg-[#129BFF]">
                Add
              </Button>
              <Button
                type="button"
                onClick={navigateBack} // Added type="button" to prevent form submission
                className="py-1 px-6 text-xs !rounded-md border-2 border-white font-normal hover:!bg-white hover:text-black transition-colors duration-200 ease-in-out"
              >
                Cancel
              </Button>
            </div>
          </form>

          <hr className="border-[#888888] w-full mt-8 mb-4" />

          <div>
            <p className="text-[#A5A5A5] text-sm my-3">Records</p>
            <table className="w-full text-center border-collapse text-sm">
              <thead className="sticky top-0">
                <tr className="text-[#A5A5A5] h-12 border-b border-[#373737]">
                  <th className="p-2 font-normal">Server</th>
                  <th className="p-2 font-normal">Service</th>
                  <th className="p-2 font-normal">Discount</th>
                  <th className="p-2 font-normal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {discount
                  .filter((discount) => discount.server.toString())
                  .map((discount, index) => (
                    <tr key={index} className="h-12 border-b border-[#373737]">
                      <td className="p-2 font-normal text-sm">
                        {serverId}
                      </td>
                      <td className="p-2 font-normal text-sm">
                        {discount.service}
                      </td>
                      <td className="p-2 font-normal text-sm">
                        {discount.discount}
                      </td>
                      <td className="p-2 font-normal text-sm">
                        <Button
                          onClick={() =>
                            handleDelete(discount.service, discount.server)
                          }
                        >
                          <Icon.trash className="w-4 h-4 text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppLayout()(AddServiceDiscount);
