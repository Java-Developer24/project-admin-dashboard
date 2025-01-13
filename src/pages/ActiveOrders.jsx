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
  const [searchQuery, setSearchQuery] = useState("");
  const [remainingTime, setRemainingTime] = useState(0);
  const [buttonStates,setButtonStates ]=useState()

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Fetch all active orders
      const ordersResponse = await axios.get("http://localhost:3000/api/history/get-all-active-orders");
      const ordersWithUsers = await Promise.all(
        ordersResponse.data.map(async (order) => {
          // Fetch user details for each order
          console.log(order)
          const userResponse = await axios.get(`https://project-backend-xo17.onrender.com/api/user/get-user?userId=${order.userId}`);
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
      await axios.get(`https://project-backend-xo17.onrender.com/api/service/number-cancel?api_key=${apiKey}&id=${numberId}&server=${server}`);
      fetchOrders(); // Refresh orders after cancellation
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId))
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  const handleForceDelete = async (userId, numberId, number,server,orderId) => {
    try {
      await axios.delete(`http://localhost:3000/api/user/force-delete?userId=${userId}&numberId=${numberId}&number=${number}&server=${server}`);
      fetchOrders(); // Refresh orders after deletion
      // Remove the deleted order from the state
    setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId)); 
    } catch (error) {
      console.error("Failed to force delete order:", error);
    }
  };

  const handleBuyAgain = async (userId) => {
    try {
      await axios.post(`https://project-backend-xo17.onrender.com/api/orders/buy-again?userId=${userId}`);
      fetchOrders(); // Refresh orders after buying again
    } catch (error) {
      console.error("Failed to buy again:", error);
    }
  };

  const filteredOrders = orders.filter(order => 
    order.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <div key={order._id} className="bg-[#1a1a1a] w-full rounded-lg p-6 shadow-lg mb-6">
                <div className="border-b border-gray-700 pb-4 mb-4">
                  <h3 className="text-white text-lg font-semibold">User: {order.userEmail}</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Service:</span>
                    <span className="text-white">{order.service}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Server:</span>
                    <span className="text-white">{order.server}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Price:</span>
                    <span className="text-white">₹{order.price}</span>
                  </div>
                  
                  <div className="bg-[#2a2a2a] p-4 rounded-lg mt-4">
                    <div className="flex justify-center items-center space-x-2">
                      <span className="text-white">{order.number}</span>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                <p className="text-gray-400">Remaining Time</p>
                <Countdown
                      expirationTime={order.expirationTime}
                      orderId={order._id}
                    />
              </div>

                  <div className="flex flex-col gap-3 mt-6">
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
                    <Button
                      onClick={() => handleBuyAgain(order.userId)}
                      className="w-full border border-[#38D9BA] text-[#38D9BA] hover:bg-[#38D9BA]/10"
                    >
                      Buy Again
                    </Button>
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