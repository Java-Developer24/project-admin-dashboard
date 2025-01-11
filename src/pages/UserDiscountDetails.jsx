import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { useAuth } from "@/utils/AuthContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UserDiscountDetails = () => {
  const params = useParams(); // Assuming you're using react-router-dom v6
  const userId = params.id;
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [discounts, setDiscounts] = useState([]);

  const { setEmail } = useAuth();

  useEffect(() => {
    const fetchUserDiscounts = async () => {
      try {
          const response = await axios.get(
            `https://project-backend-xo17.onrender.com/api/user/get-user-discount-details?userId=${userId}`
          );
          const data = await response.data;

        if (data.length > 0) {
          setUserEmail(data[0].userId.email); // Assuming email is populated
          setDiscounts(data);
        }
      } catch (error) {
        console.error("Failed to fetch user discounts:", error);
      }
    };

    fetchUserDiscounts();
  }, [userId]);

  const handleDelete = async (service, server) => {
    try {
      await axios.delete(
        `https://project-backend-xo17.onrender.com/api/user/delete-user-discount?userId=${userId}&service=${service}&server=${server}`
      );



      // Remove the deleted discount from the state
     // Remove the deleted discount from the state
setDiscounts((prevDiscounts) =>
  prevDiscounts.filter(
    (discount) =>
      discount.userId.service !== service || discount.userId.server !== server
  )
);


    } catch (error) {
      console.error("Failed to delete discount:", error);
    }
  };

  const navigateBack = () => navigate("/discount/");

  const handleNavigateToAddDiscount = () => {
    setEmail(userEmail);
    navigate("/discount/user/add-discount");
  };

  return (
    <>
      <div className="w-full my-4 flex items-center justify-between">
        <Button
          variant="link"
          onClick={navigateBack}
          className="text-sm font-normal text-[#8C8C8C] !no-underline p-1 h-0 flex gap-2"
        >
          <Icon.arrowLeft className="w-4 h-4" /> User Discount
        </Button>
      </div>
      <div className="flex items-center justify-center pt-[1rem]">
        <div className="bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark">
          <div className="bg-[#484848] py-4 px-6 flex mb-4 w-full flex-col gap-4 items-center justify-between rounded-lg my-4">
            <div className="border-b border-[#ADADAD] flex items-center justify-between w-full px-4">
              <h3 className="font-medium text-sm tmd:ext-base pr-8">Email</h3>
              <p className="font-normal text-base text-[#9B9B9B]">
                {userEmail}
              </p>
            </div>
            <div className="bg-[#1F1F1F] rounded-lg">
              <table className="w-[20rem] table-auto text-center">
                <thead>
                  <tr>
                    <th className="p-3 font-normal text-[#8C8C8C]">Service</th>
                    <th className="p-3 font-normal text-[#8C8C8C]">Server</th>
                    <th className="p-3 font-normal text-[#8C8C8C]">Margin</th>
                    <th className="p-3 font-normal text-[#8C8C8C]">Action</th>
                  </tr>
                </thead>
                <tbody>
                {discounts.map(({ userId: { service, discount, server } }) => (
  <tr key={service + server}> {/* Use service + server as a unique key */}
    <td className="border-t-2 border-[#4B4B4B] p-3">
      {service}
    </td>
    <td className="border-t-2 border-[#4B4B4B] p-3">
      {server}
    </td>
    <td className="border-t-2 border-[#4B4B4B] p-3">
      {discount}
    </td>
    <td className="border-t-2 border-[#4B4B4B] p-3">
      <Button onClick={() => handleDelete(service, server)}>
        <Icon.trash className="w-4 h-4 text-red-600" />
      </Button>
    </td>
  </tr>
))}
                </tbody>
              </table>
            </div>
            <div className="flex w-full items-center justify-end">
              <Button
                variant="link"
                className="text-sm font-normal text-[#397CFF] !no-underline p-1 h-0"
                onClick={handleNavigateToAddDiscount}
              >
                + Add Discount
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppLayout()(UserDiscountDetails);
