import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AddServerDiscount = () => {
  const [margin, setMargin] = useState("");
  const [discounts, setDiscounts] = useState([]);

  const params = useParams();
  const Id = params.id;

  const navigate = useNavigate();

  const navigateBack = () => navigate("/discount/server");

  const fetchDiscounts = async () => {
    try {
      const response = await axios.get("/server/get-discount");
      setDiscounts(response.data);
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
      const marginPrice = parseFloat(margin);
      if (isNaN(marginPrice)) {
        alert("Please enter a valid margin price.");
        return;
      }

      await axios.post("/server/add-discount", {
        server: Id,
        discount: marginPrice,
      });
      setMargin("");
      fetchDiscounts();
    } catch (error) {
      console.error("Error adding server discount:", error);
      alert("An error occurred while updating the margin price.");
    }
  };

  const handleDelete = async (serverId) => {
    try {
      await axios.delete(`/server/delete-discount?server=${serverId}`);
      setDiscounts(
        discounts.filter((discount) => discount.server !== serverId)
      );
    } catch (error) {
      console.error("Error deleting discount:", error);
      alert("An error occurred while deleting the discount.");
    }
  };

  return (
    <>
      <div className="w-full my-4 flex items-center justify-between">
        <Button
          variant="link"
          onClick={navigateBack}
          className="text-sm font-normal text-[#8C8C8C] !no-underline p-1 h-0 flex gap-2"
        >
          <Icon.arrowLeft className="w-4 h-4" /> Server Discount
        </Button>
      </div>
      <div className="flex items-center justify-center pt-[1rem]">
        <div className="bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark">
          <div className="w-full flex flex-col">
            <div className="flex items-center text-base">
              <p className="text-white w-40">Selected Server:</p>
              <span className="text-[#959595]">Server {Id}</span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="my-4">
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
                placeholder="-1.7"
                className="w-full h-12 pl-3 rounded-lg text-[#9d9d9d] !placeholder-[#9d9d9d] bg-transparent border-[#e0effe] focus:border-none"
                value={margin}
                onChange={(e) => setMargin(e.target.value)}
              />
            </div>

            <div className="w-full flex items-center justify-center gap-4 mt-8">
              <Button className="py-1 px-8 text-xs bg-[#129BFF] text-white hover:bg-[#129BFF]">
                Add
              </Button>
              <Button
                type="button"
                onClick={navigateBack}
                className="py-1 px-6 text-xs !rounded-md border-2 border-white font-normal hover:!bg-white hover:text-black transition-colors duration-200 ease-in-out"
              >
                Cancel
              </Button>
            </div>
          </form>

          <hr className="border-[#888888] border w-full mt-8 mb-4" />

          <div>
            <p className="text-[#A5A5A5] text-sm my-3">Records</p>
            <table className="w-full text-center border-collapse text-sm">
              <thead className="sticky top-0">
                <tr className="text-[#A5A5A5] h-12 border-b border-[#373737]">
                  <th className="p-2 font-normal">Server</th>
                  <th className="p-2 font-normal">Discount</th>
                  <th className="p-2 font-normal">Actions</th>
                </tr>
              </thead>

              <tbody>
                {discounts
                  .filter((discount) => discount.server.toString() === Id)
                  .map((discount) => (
                    <tr
                      className="h-12 border-b border-[#373737]"
                      key={discount.server}
                    >
                      <td className="p-2 font-normal text-sm">
                        {discount.server}
                      </td>
                      <td className="p-2 font-normal text-sm">
                        {discount.discount.toFixed(2)}
                      </td>
                      <td className="p-2 font-normal text-sm">
                        <Button onClick={() => handleDelete(discount.server)}>
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

export default AppLayout()(AddServerDiscount);
