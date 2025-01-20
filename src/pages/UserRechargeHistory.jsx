import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

const UserRechargeHistory = () => {
  const navigate = useNavigate();
  const [rechargeHistory, setRechargeHistory] = useState([]);
  const [userData, setUserData] = useState({});

  const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage after login
  const { id } = useParams();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const rechargeResponse = await axios.get(
          `/api/history/admin-api/recharge-user-history/get-user-recharge-history?userId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the Authorization header
            },
          }
        );
        const sortedData = rechargeResponse.data.sort((a, b) => {
          const dateA = moment(a.date_time, "DD/MM/YYYY hh:mm:ss A").toDate();
          const dateB = moment(b.date_time, "DD/MM/YYYY hh:mm:ss A").toDate();
          return dateB - dateA; // Descending order
        });
        setRechargeHistory(sortedData);
      } catch (error) {
        console.error("Failed to fetch history data");
      }
    };
    const fetchUser = async () => {
      try {
        const user = await axios.get(`/api/user/user-admin-api/get-user?userId=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        });
        setUserData(user.data);
      } catch (error) {
        console.error("Failed to fetch user data");
      }
    };

    fetchHistory();
    fetchUser();
  }, [id]);

  const handleDelete = async (id) => {
       try {
        await axios.delete(
          `/api/history/admin-api/recharge-history-delete/delete-recharge-history?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the Authorization header
            },
          }
        );
        
        setRechargeHistory(prevsmsDetails => prevsmsDetails.filter(item => item.transaction_id !== id));
         console.log("After delete:", rechargeHistory);
        
        
      } catch (error) {
        console.error("Failed to delete recharge history:", error);
    }
     };

  const navigateToRechargeHistory = () => navigate("/recharge-history");
  const wrapStyle = {
    wordBreak: "break-word",
    whiteSpace: "normal",
    overflowWrap: "break-word",
  };
  return (
    <>
      <div className="w-full my-4 flex items-center justify-between">
        <Button
          variant="link"
          onClick={() => navigate(`/users-data/${id}`)}
          className="text-sm font-normal text-[#8C8C8C] !no-underline p-1 h-0 flex gap-2"
        >
          <Icon.arrowLeft className="w-4 h-4" /> User Recharge History
        </Button>
      </div>
      <div className="flex items-center justify-center pt-[1rem]">
        <div className="bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark">
          <div className="bg-[#484848] text-sm py-3 px-5 flex mb-4 w-full items-center justify-between rounded-lg">
            <h3 className="font-medium pr-4 border-r">Email</h3>

            <p className="font-normal pl-4 text-[#9B9B9B]" style={wrapStyle}>
              {userData.email}
            </p>
          </div>

          <div className="w-full flex items-center justify-center gap-6 my-6">
            <p className="text-[#959595]">Balance:</p>
            <span className="text-white">{userData.balance}</span>
          </div>
          {rechargeHistory.length > 0 ? (
            rechargeHistory.map((history, index) => (
              <div
                className="mt-[1.5rem] w-full border-[10px] border-[#444444] rounded-lg"
                key={history.transaction_id}
              >
                <table className="w-full table-auto">
                  <tbody>
                    <tr>
                      <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                        Transaction ID
                      </td>
                      <td className="border-b-2 border-[#949494] p-3 " style={wrapStyle}>
                        <span>{history.transaction_id}</span>
                       
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                        Amount
                      </td>
                      <td
                        className="border-b-2 border-[#949494] p-3"
                        style={wrapStyle}
                      >
                        {history.amount}
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                        Type
                      </td>
                      <td
                        className="border-b-2 border-[#949494] p-3"
                        style={wrapStyle}
                      >
                        {history.payment_type}
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                        Date & Time
                      </td>
                      <td
                        className="border-b-2 border-[#949494] p-3"
                        style={wrapStyle}
                      >
                        {moment(history.date_time, "DD/MM/YYYY hh:mm:ss A").format("DD/MM/YYYY hh:mm:ss A") }
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b-2 border-[#949494]  px-5 text-[#959595]">Status</td>
                      <td className="border-b-2 border-[#949494] p-3   ">
                      <td 	 className="justify-between	 items-center flex" style={wrapStyle}>
                        <span>{history.status}</span>
                        
                        <Button 
                          onClick={(e) => { e.stopPropagation();handleDelete(history.transaction_id);
                         }}
                       >
                         <Icon.trash className=" w-4 h-4 text-red-600 " />
                      </Button>
                     
                      </td>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <div className="text-white text-center h-full flex items-center justify-center">
              No history available
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AppLayout()(UserRechargeHistory);
