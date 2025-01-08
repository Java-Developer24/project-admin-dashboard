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
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/user/orders?userId=${id}`);
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
 

  const fetchUser = async () => {
    try {
      const user = await axios.get(`http://localhost:3000/api/user/get-user?userId=${id}`);
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
      await axios.get(`http://localhost:3000/api/service/number-cancel?api_key=${apiKey}&id=${orderData.numberId}&server=${orderData.server}`);
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
      await axios.delete(`http://localhost:3000/api/user/force-delete?userId=${id}&numberId=${numberId}&number=${number}`);
      navigate(`/users-data/${id}`);
    } catch (error) {
      console.error("Failed to force delete order:", error);
    }
  };

  const handleBuyAgain = async () => {
    try {
      await axios.post(`http://localhost:3000/api/orders/buy-again?userId=${id}`);
      const response = await axios.get(`http://localhost:3000/api/orders?userId=${id}`);
      setOrderData(response.data);
    } catch (error) {
      console.error("Failed to buy again:", error);
    }
  };

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
          <div className="bg-[#1a1a1a] w-full max-w-md rounded-lg p-6 shadow-lg">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Service:</span>
                <span className="text-white">{orderData.service}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Server:</span>
                <span className="text-white">{orderData.server}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Price:</span>
                <span className="text-white">₹{orderData.price}</span>
              </div>
              
              <div className="bg-[#2a2a2a] p-4 rounded-lg mt-4">
                <div className="flex justify-center items-center space-x-2">
                  <span className="text-white">{orderData.number}</span>
                  <button className="text-primary hover:text-primary/80">
                  
                  </button>
                </div>
              </div>

              <div className="text-center mt-4">
                <p className="text-gray-400">Remaining Time</p>
                <Countdown
                      expirationTime={orderData.expirationTime}
                      orderId={orderData._id}
                    />
              </div>


              <div className="flex flex-col gap-3 mt-6">
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
                <Button
                  onClick={handleBuyAgain}
                  className="w-full border border-[#38D9BA] text-[#38D9BA] hover:bg-[#38D9BA]/10"
                >
                  Buy Again
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AppLayout()(Orders);