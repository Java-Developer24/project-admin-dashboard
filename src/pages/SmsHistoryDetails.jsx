import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

const SmsHistoryDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [smsDetails, setSmsDetails] = useState([]);
  const [userData, setUserData] = useState({});
  const [tranFilter, setTranFilter] = useState("All");

  // State for pagination
  const [transactionLimit, setTransactionLimit] = useState(10);
  const [transactionCurrentPage, setTransactionCurrentPage] = useState(1);
  const [totalUsedAmount, setTotalUsedAmount] = useState(0); // State for total used amount

  const navigateToSmsHistory = () => navigate("/sms-history");
  const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage after login

  useEffect(() => {
    const fetchSmsDetails = async () => {
      try {
        const response = await axios.get(
          `/api/history/admin-api/transaction-history-data/get-transaction-history-admin?userId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the Authorization header
            },
          }
        );
        const data = Array.isArray(response.data) ? response.data : [];
        setSmsDetails(data);
        // Calculate the total used amount for successful orders with OTP
      const totalAmount = data
      .filter((entry) => entry.status === "SUCCESS" && entry.otp.length > 0) // Check if OTP is received
      .reduce((sum, entry) => sum + (parseFloat(entry.price) || 0), 0);
    console.log(totalAmount);
    setTotalUsedAmount(totalAmount);                 
          
        console.log(Array.isArray(response.data) ? response.data : [])
      } catch (error) {
        console.error("Failed to fetch SMS history details:", error);
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

    fetchSmsDetails();
    fetchUser();
  }, [id]);

 // Filter Transaction History
const filterTransactionHistory = (data) => {
  if (!Array.isArray(data)) {
    return [];
  }

  const groupedData = data.reduce((acc, entry) => {
    if (!acc[entry.id]) {
      acc[entry.id] = [];
    }
    acc[entry.id].push(entry);
    return acc;
  }, {});

  const preparedData = Object.values(groupedData).map((entries) => {
    const successEntries = entries.filter((entry) => entry.status === "SUCCESS");
    const cancelledEntries = entries.filter(
      (entry) => entry.status === "CANCELLED"
    );

    const displayEntry =
      cancelledEntries.length > 0
        ? cancelledEntries[0]
        : successEntries.find((entry) => entry.otp.length > 0) || successEntries[0];

    return {
      ...displayEntry,
      otp:
        successEntries
        .flatMap((entry) => entry.otp) // Directly use the OTP string
          .join(`<br><br>`) || "-",
    };
  });

  return preparedData;
};

// Filter and Sort Transaction History
let filteredTransactionHistory = filterTransactionHistory(smsDetails);

if (tranFilter === "Success") {
  filteredTransactionHistory = filteredTransactionHistory.filter(
    (entry) => entry.status === "SUCCESS"
  );
} else if (tranFilter === "Cancelled") {
  filteredTransactionHistory = filteredTransactionHistory.filter(
    (entry) => entry.status === "CANCELLED"
  );
}

// Sorting based on date_time in descending order
const sortedFilteredTransactionHistory = filteredTransactionHistory
  .filter((entry) => entry.date_time) // Ensure valid date_time
  .sort((a, b) => moment(b.date_time).diff(moment(a.date_time)));
// Get Date Range
const getDateRange = (data) => {
  if (data.length === 0) return "No data available";
  const dates = data.map((entry) => moment(entry.date_time));
  const minDate = moment.min(dates);
  const maxDate = moment.max(dates);
  return `${minDate.format("DD/MM/YY")} - ${maxDate.format("DD/MM/YY")}`;
};
  const handleTransactionLimitChange = (value) => {
    setTransactionLimit(Number(value));
    setTransactionCurrentPage(1); // Reset to the first page when limit changes
  };

  // Apply Pagination
const startIndexTransaction = (transactionCurrentPage - 1) * transactionLimit;
const transactionData = sortedFilteredTransactionHistory.slice(
  startIndexTransaction,
  startIndexTransaction + transactionLimit
);

  
    const handleDelete = async (id) => {
      try {
        // Call the delete API
        await axios.delete(
          `/api/history/delete-numberhistory?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the Authorization header
            },
          }
        );
        
        // Update the state to remove the deleted item
      setSmsDetails(prevsmsDetails => prevsmsDetails.filter(item => item.ID !== id));

      } catch (error) {
        console.error("Failed to delete SMS history:", error);
      }
    };
    
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
          <Icon.arrowLeft className="w-4 h-4" /> Sms History Details
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

          <div className="flex items-center justify-center  w-full max-w-md  ">
            <Filter setTranFilter={setTranFilter} transFilter={tranFilter} />
            <p className="min-w-fit text-sm pr-8  ">
              Total: {filteredTransactionHistory.length}
            </p>
            {tranFilter === "Success" && (
    <div className="min-w-fit text-sm">
      Used Balance: ₹{totalUsedAmount.toFixed(2)}
    </div>
  )}
          </div>
          <div className="flex items-center justify-center gap-4">
            <p className="text-[#A5A5A5] text-sm">
              Data:{" "}
              <span className="text-white font-normal text-xs">
                {getDateRange(transactionData)}
              </span>
            </p>
          </div>

          {sortedFilteredTransactionHistory.length > 0 ? (
            sortedFilteredTransactionHistory.map((item, index) => (
              <div
                key={index}
                className="mt-[1.5rem] w-full border-[10px] border-[#444444] rounded-lg"
              >
                <table className="w-full table-auto text-sm">
                  <tbody>
                    <tr>
                      <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                        SL No
                      </td>
                      <td className="border-b-2 border-[#949494] p-3">
                        {index + 1}
                      </td>
                    </tr>
                    <tr>
                    <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                        ID
                      </td>
                      <td
                        className="border-b-2 border-[#949494] p-3"
                        style={wrapStyle}
                      >
                        {item.id}
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                        Number
                      </td>
                      <td
                        className="border-b-2 border-[#949494] p-3"
                        style={wrapStyle}
                      >
                        {item.number}
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                        OTP
                      </td>
                      <td className="border-b-2 border-[#949494] p-3">
                      <span  >{  item.otp??"N/A"}</span>


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
                        {moment(item.date_time).format("DD/MM/YYYY hh:mm:ss A")}

                      </td>
                    </tr>
                    <tr>
                      <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                        Service
                      </td>
                      <td
                        className="border-b-2 border-[#949494] p-3"
                        style={wrapStyle}
                      >
                        {item.service}
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                        Server
                      </td>
                      <td
                        className="border-b-2 border-[#949494] p-3"
                        style={wrapStyle}
                      >
                        {item.server}
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                        Price
                      </td>
                      <td
                        className="border-b-2 border-[#949494] p-3"
                        style={wrapStyle}
                      >
                        {item.price}
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b-2 border-[#949494]  px-5 text-[#959595]">
                        Status
                      </td>
                      
                     
                      <td className="border-b-2 border-[#949494] p-3   ">
                      <td 	 className="justify-between	 items-center flex" style={wrapStyle}>
                        <span>{item.status}</span>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.ID);
                          }}
                        >
                          <Icon.trash className="w-4 h-4 text-red-600" />
                        </Button>
                       </td>
                       </td>
                      
                    </tr>
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <div className="text-center text-[#959595] mt-10 text-lg">
              No transactions found
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const Filter = ({ transFilter, setTranFilter }) => {
  return (
    <Select value={transFilter} onValueChange={(value) => setTranFilter(value)}>
      <SelectTrigger className="dark bg-transparent w-fit">
        <SelectValue>{transFilter}</SelectValue>
      </SelectTrigger>
      <SelectContent className="dark bg-[#1e1e1e]">
        <SelectGroup>
          <SelectLabel className="font-normal">Filter</SelectLabel>
          <SelectItem value="All">All</SelectItem>
          <SelectItem value="Success">Success</SelectItem>
          <SelectItem value="Cancelled">Cancelled</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default AppLayout()(SmsHistoryDetails);
