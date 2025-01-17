import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SnapLoader } from "@/components/layout/Loaders";

const ActiveOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [remainingTime, setRemainingTime] = useState(0);
  const [buttonStates,setButtonStates ]=useState()

  useEffect(() => {
    fetchOrders();
  }, []);
   // Poll transactions every 5 seconds
   useEffect(() => {
    const interval = setInterval(fetchTransactions, 1000);
    return () => clearInterval(interval); // Clear interval on component unmount
  }, [transactions]);

  const fetchOrders = async () => {
    try {
      // Fetch all active orders
      const ordersResponse = await axios.get("/api/history/history-admin-api/get-all-active-orders");
      const ordersWithUsers = await Promise.all(
        ordersResponse.data.map(async (order) => {
          // Fetch user details for each order
          console.log(order)
          const userResponse = await axios.get(`/api/user/user-admin-api/get-user?userId=${order.userId}`);
          console.log(userResponse)
          return {
            ...order,
            userEmail: userResponse.data.email,
            apiKey: userResponse.data.api_key
          };
        })
      );
      setOrders(ordersWithUsers);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setLoading(false);
    }
  };

       // Fetch the latest transactions


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



  

  const handleCancel = async (apiKey, numberId, server,orderId) => {
    try {
      await axios.get(`/api/service/number-cancel?api_key=${apiKey}&id=${numberId}&server=${server}`);
      fetchOrders(); // Refresh orders after cancellation
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId))
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  const handleForceDelete = async (userId, numberId, number,server,orderId) => {
    try {
      await axios.delete(`/api/user/admin-api/delete-user-number-data/force-delete?userId=${userId}&numberId=${numberId}&number=${number}&server=${server}`);
      fetchOrders(); // Refresh orders after deletion
      // Remove the deleted order from the state
    setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId)); 
    } catch (error) {
      console.error("Failed to force delete order:", error);
    }
  };

  // const handleBuyAgain = async (userId) => {
  //   try {
  //     await axios.post(`https://project-backend-xo17.onrender.com/api/orders/buy-again?userId=${userId}`);
  //     fetchOrders(); // Refresh orders after buying again
  //   } catch (error) {
  //     console.error("Failed to buy again:", error);
  //   }
  // };

  const filteredOrders = orders.filter(order => 
    order.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
 // Fetch transactions for all active orders
 const fetchTransactions = async () => {
 

  try {
    const transactionResponses = await Promise.all(
      orders.map((order) =>
        axios.get(
          `/api/history/transaction-history-user?userId=${order.userId}`
        )
      )
    );

    const allTransactions = transactionResponses.flatMap(
      (response) => response.data
    );

    setTransactions(allTransactions);
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
  }
};
 // Extract OTPs from transactions based on `numberId`
 const getOTPFromTransaction = (numberId) => {
  const relatedTransactions = transactions.filter(
    (transaction) => transaction.id === numberId
  );

  if (!relatedTransactions.length) return ["Waiting for SMS"];

  const otpList = relatedTransactions
    .map((transaction) => transaction.otp)
    .filter((otp) => otp);

  return otpList.length ? otpList : ["Waiting for SMS"];
};
  return (
    <>
      <div className="w-full my-4 flex items-center justify-between">
        <Button
          variant="link"
          onClick={() => navigate("/")}
          className="text-sm font-normal text-[#8C8C8C] !no-underline p-1 h-0 flex gap-2"
        >
          <Icon.arrowLeft className="w-4 h-4" /> Active Orders
        </Button>
      </div>

      <div className="flex items-center justify-center pt-[1rem]">
        <div className="bg-transparent w-full max-w-2xl rounded-lg mb-[60px] border-none dark">
          {/* Search Bar */}
          <div className="w-full flex bg-[#18191c] rounded-2xl px-2 items-center justify-center h-[50px] mb-3">
            <Icon.search className="w-4 h-4 text-primary" />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[85%] h-[50px] ml-2 text-sm bg-transparent border-0 text-white placeholder:text-primary focus:outline-none"
            />
            {searchQuery && (
              <Icon.circleX
                className="text-primary cursor-pointer"
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <SnapLoader />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center">
              <span className="text-[#38D9BA] text-2xl font-bold">No</span>
              <span className="text-white text-2xl font-bold ml-2">Active Orders</span>
            </div>
          ) : (
            filteredOrders.map((order) => (
              
              <div key={order._id} className=" w-full max-w-[520px] flex flex-col items-center border-2 border-[#1b1d21] bg-[#121315] rounded-2xl p-5 ml-12">
                <div className="border-b border-gray-700 pb-4 mb-4">
                  <h3 className="text-white text-lg font-semibold">User: {order.userEmail}</h3>
                </div>
                
                <div className="w-full flex flex-col items-center px-4 mb-4 text-sm font-normal gap-y-2">
                  <div className="w-full flex text-center items-center justify-between">
                    <span className="text-gray-400">Service:</span>
                    <span className="text-white">{order.service}</span>
                  </div>
                  <hr className="border-[#888888] border w-full" />
                  <div className="w-full flex text-center items-center justify-between">
                    <span className="text-gray-400">Server:</span>
                    <span className="text-white">{order.server}</span>
                  </div>
                  <hr className="border-[#888888] border w-full" />
                  <div className="w-full flex text-center items-center justify-between">
                    <span className="text-gray-400">Price:</span>
                    <span className="text-white">₹{order.price}</span>
                  </div>
                  
                  <hr className="border-[#888888] border w-full" />

                  <div className="w-full flex border rounded-2xl items-center justify-center h-[45px]">
              <div className="py-4 px-5 flex w-full gap-4 items-center justify-center rounded-lg text-xl font-medium">
                  <span className="text-white">{order.number}</span>
                  <button className="text-primary hover:text-primary/80">
                  
                  </button>
                </div>
              </div>
                  
                  <div className="w-full flex rounded-2xl items-center justify-center h-[60px]">
              <div className="bg-transparent max-w-56 py-4 px-5 flex w-full items-center justify-between rounded-lg">
                <p className=" font-normal text-lg	">Remaining Time</p>
                <Countdown
                      expirationTime={order.expirationTime}
                      orderId={order._id}
                    />
              </div>
              </div>
              <div className="w-full flex bg-[#444444] border-2 border-[#888888] rounded-2xl items-center justify-center max-h-[100px] overflow-y-scroll hide-scrollbar">
                  <div className="w-full h-full flex flex-col items-center">
                  <p>OTP: {getOTPFromTransaction(order.numberId).join(", ")}</p>
                  </div>
                </div>
                  <div className="bg-transparent pt-4 flex w-full items-center justify-center gap-4">
                    <Button
                      onClick={() => handleForceDelete(order.userId, order.numberId, order.number,order.server,order._id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      Force Delete
                    </Button>
                    <Button
                      onClick={() => handleCancel(order.apiKey, order.numberId, order.server,order._id)}
                      className="w-full bg-[#38D9BA] hover:bg-[#38D9BA]/80 text-white"
                    >
                      Cancel
                    </Button>
                    {/* <Button
                      onClick={() => handleBuyAgain(order.userId)}
                      className="w-full border border-[#38D9BA] text-[#38D9BA] hover:bg-[#38D9BA]/10"
                    >
                      Buy Again
                    </Button> */}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default AppLayout()(ActiveOrders);