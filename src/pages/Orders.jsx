import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";

const Orders = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userData, setUserData] = useState({});
  const [orderData, setOrderData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [remainingTime, setRemainingTime] = useState(0);
  const [buttonStates,setButtonStates ]=useState()

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(`/api/user/admin-api/get-orders-data/orders?userId=${id}`);
        setOrderData(response.data[0]);
       
        if (response.data && response.data.remainingTime) {
          setRemainingTime(response.data.remainingTime);
        }
      } catch (error) {
        console.error("Failed to fetch order data:", error);
      }
    };

    fetchOrderData();
    fetchUser()
  }, [id]);
 
  // Poll transactions every 5 seconds
  // useEffect(() => {
  //   const interval = setInterval(fetchTransactions, 1000);
  //   return () => clearInterval(interval); // Clear interval on component unmount
  // }, [transactions]);
  const fetchUser = async () => {
    try {
      const user = await axios.get(`/api/user/user-admin-api/get-user?userId=${id}`);
      setUserData(user.data);
     
    } catch (error) {
      console.error("Failed to fetch user data");
    }
  };
  useEffect(() => {
    let timer;
    if (remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [remainingTime]);




  const calculateRemainingTime = (expirationTime) => {
    const now = new Date();
    const timeDifference = new Date(expirationTime) - now;
    if (timeDifference <= 0) return "00:00";

    const minutes = Math.floor(timeDifference / 60000);
    const seconds = Math.floor((timeDifference % 60000) / 1000);

    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const Countdown = ({ expirationTime, orderId }) => {
    const [remainingTime, setRemainingTime] = useState(() =>
      calculateRemainingTime(expirationTime)
    );

    useEffect(() => {
      const updateRemainingTime = () => {
        const newRemainingTime = calculateRemainingTime(expirationTime);
        setRemainingTime((prevTime) => {
          if (prevTime !== newRemainingTime) {
            if (newRemainingTime === "00:00") {
              setButtonStates((prevStates) => ({
                ...prevStates,
                [orderId]: true,
              }));
              
            } else if (newRemainingTime.split(":")[0] <= "18") {
              setButtonStates((prevStates) => ({
                ...prevStates,
                [orderId]: true,
              }));
            }
            return newRemainingTime;
          }
          return prevTime;
        });
      };

      updateRemainingTime(); // Initial call
      const interval = setInterval(updateRemainingTime, 1000);

      return () => clearInterval(interval);
    }, [expirationTime, orderId]);

    return <span className="font-mono">{remainingTime}</span>;
  };

 




const apikey=userData.api_key

  const handleCancel = async (apiKey) => {
    try {
      await axios.get(`https://project-backend-xo17.onrender.com/api/service/number-cancel?api_key=${apiKey}&id=${orderData.numberId}&server=${orderData.server}`);
      navigate(`/users-data/${id}`);
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };
// const numberId=orderData.requestId
// console.log(orderData.requestId)
// const number=orderData.number
  const handleForceDelete = async (numberId,number) => {
    try {
      await axios.delete(`/api/user/admin-api/delete-user-number-data/force-delete?userId=${id}&numberId=${numberId}&number=${number}&server=${orderData.server}`);
      navigate(`/users-data/${id}`);
    } catch (error) {
      console.error("Failed to force delete order:", error);
    }
  };

  // const handleBuyAgain = async () => {
  //   try {
  //     await axios.post(`https://project-backend-xo17.onrender.com/api/service/get-number?userId=${id}`);
  //     const response = await axios.get(`https://project-backend-xo17.onrender.com/api/orders?userId=${id}`);
  //     setOrderData(response.data);
  //   } catch (error) {
  //     console.error("Failed to buy again:", error);
  //   }
  // };


   // Fetch transactions for all active orders
//  const fetchTransactions = async () => {
 

//   try {
//     const transactionResponses = await Promise.all(
//       orders.map((order) =>
//         axios.get(
//           `https://project-backend-xo17.onrender.com/api/history/transaction-history-user?userId=${order.userId}`
//         )
//       )
//     );

//     const allTransactions = transactionResponses.flatMap(
//       (response) => response.data
//     );

//     setTransactions(allTransactions);
//   } catch (error) {
//     console.error("Failed to fetch transactions:", error);
//   }
// };
//  // Extract OTPs from transactions based on `numberId`
//  const getOTPFromTransaction = (numberId) => {
//   const relatedTransactions = transactions.filter(
//     (transaction) => transaction.id === numberId
//   );

//   if (!relatedTransactions.length) return ["Waiting for SMS"];

//   const otpList = relatedTransactions
//     .map((transaction) => transaction.otp)
//     .filter((otp) => otp);

//   return otpList.length ? otpList : ["Waiting for SMS"];
// };

  return (
    <>
      <div className="w-full my-4 flex items-center justify-between">
        <Button
          variant="link"
          onClick={() => navigate(`/users-data/${id}`)}
          className="text-sm font-normal text-[#8C8C8C] !no-underline p-1 h-0 flex gap-2"
        >
          <Icon.arrowLeft className="w-4 h-4" /> Back to User
        </Button>
      </div>

      <div className="flex items-center justify-center pt-[1rem]">
        {(!orderData || (Array.isArray(orderData) && orderData.length === 0)) ? (
          <div className="text-center">
            <span className="text-[#38D9BA] text-2xl font-bold">No</span>
            <span className="text-white text-2xl font-bold ml-2">Active Orders</span>
          </div>
        ) : (
          <div className="w-full max-w-[520px] flex flex-col items-center border-2 border-[#1b1d21] bg-[#121315] rounded-2xl p-5">
            <div className="w-full flex flex-col items-center px-4 mb-4 text-sm font-normal gap-y-2">
              <div className="w-full flex text-center items-center justify-between">
                <span className="text-gray-400">Service:</span>
                <span className="text-white">{orderData.service}</span>
              </div>
              <hr className="border-[#888888] border w-full" />
              <div className="w-full flex text-center items-center justify-between">
                <span className="text-gray-400">Server:</span>
                <span className="text-white">{orderData.server}</span>
              </div>
              <hr className="border-[#888888] border w-full" />
                  <div className="w-full flex text-center items-center justify-between">
                  <p>Price:</p>
                  <span> ₹{orderData.price}</span>
              </div>
              
              <div className="w-full flex border rounded-2xl items-center justify-center h-[45px]">
              <div className="py-4 px-5 flex w-full gap-4 items-center justify-center rounded-lg text-xl font-medium">
                  <span className="text-white">{orderData.number}</span>
                  <button className="text-primary hover:text-primary/80">
                  
                  </button>
                </div>
              </div>

              <div className="w-full flex rounded-2xl items-center justify-center h-[60px]">
              <div className="bg-transparent max-w-56 py-4 px-5 flex w-full items-center justify-between rounded-lg">
                <p className="text-gray-400">Remaining Time</p>
                <Countdown
                      expirationTime={orderData.expirationTime}
                      orderId={orderData._id}
                    />
              </div>
              </div>
              {/* <div className="w-full flex bg-[#444444] border-2 border-[#888888] rounded-2xl items-center justify-center max-h-[100px] overflow-y-scroll hide-scrollbar">
                  <div className="w-full h-full flex flex-col items-center">
                  <p>OTP: {getOTPFromTransaction(orderData.numberId).join(", ")}</p>
                  </div>
                </div> */}

              <div className="bg-transparent pt-4 flex w-full items-center justify-center gap-4">
                <Button
                  onClick={()=>handleForceDelete(orderData.numberId,orderData.number)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  Force Delete
                </Button>
                <Button
                  onClick={()=>handleCancel(apikey)}
                  className="w-full bg-[#38D9BA] hover:bg-[#38D9BA]/80 text-white"
                >
                  Cancel
                </Button>
                {/* <Button
                  onClick={handleBuyAgain}
                  className="w-full border border-[#38D9BA] text-[#38D9BA] hover:bg-[#38D9BA]/10"
                >
                  Buy Again
                </Button> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AppLayout()(Orders);