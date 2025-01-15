import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const navigateToService = () => navigate("/service");
  const navigateToRechargeHistory = () => navigate("/recharge-history");
  const navigateToUsersData = () => navigate("/users-data");
  const navigateToSMSHistory = () => navigate("/sms-history");
  const navigateToAdminPanel = () => navigate("/admin-panel");
  const navigateToDiscount = () => navigate("/discount");
  const navigateToUnsendTrx = () => navigate("/unsend-trx");
  const navigateToBlockedUser = () => navigate("/blocked-users");

  const [totalAmount, setTotalAmount] = useState("0.00"); // State to store the total amount
  const [totalUsers, setTotalUsers] = useState("0");
  const [trnSuccess, setTrnSuccess] = useState("0");
  const [trnCancel, setTrnCancel] = useState("0");
  const [trnPending, setTrnPending] = useState("0");
  const [blockedUser, setBlockedUser] = useState("");
  const [totalRechargeAmount, setTotalRechargeAmount] = useState("0.00"); // State to store the total amount

  useEffect(() => {
    // Fetch users data on component mount
    const fetchUsers = async () => {
      try {
        const [usersResponse, totalUsersCount, transactions, blockedUserCount,totalRechargeAmount] =
          await Promise.all([
            axios.get("/api/user/admin-api/all-users/get-all-users"),
            axios.get(`/api/user/admin-api/total-users/total-user-count`),
            axios.get("/api/history//history-admin-api/transaction-count/transaction-history-count"),
            axios.get("/api/user/user-admin-api/blocked-users/get-all-blocked-users-count"),
            axios.get("/api/history/history-admin-api/recharge-balance/get-total-recharge-balance"),
          ]);
  
        const usersData = usersResponse.data;
  
        // Calculate the total balance of all users
        const totalBalance = usersData.reduce(
          (accumulator, user) => accumulator + user.balance,
          0
        );
  
        setTotalUsers(totalUsersCount.data.totalUserCount);
        setTotalAmount(totalBalance.toFixed(2)); // Update total amount state
        setTrnSuccess(transactions.data.successCount);
        setTrnCancel(transactions.data.cancelledCount);
        setTrnPending(transactions.data.pendingCount);
        setTotalRechargeAmount(totalRechargeAmount.data.totalAmount)
        
        const blockedUsers = blockedUserCount.data?.blockedUser || 0;
        setBlockedUser(blockedUsers);
       
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchUsers();
  }, []);
  

  return (
    <div className="flex items-center justify-center pt-[1rem]">
      <div className="bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark">
        <h3 className="font-normal text-base text-[#8C8C8C]">
          Total Balance:{" "}
          <span className="text-sm text-white font-normal">₹{totalAmount}</span>
        </h3>
        
        <h3 className="text-[#A5A5A5] text-sm">
          Total Recharge:{" "}
          <span className="text-white font-normal text-sm">₹{totalRechargeAmount}</span>
        </h3>
        
        <h3 className="font-normal text-base text-[#8C8C8C]">
          Total Users:{" "}
          <span className="text-sm text-white font-normal">{totalUsers}</span>
        </h3>
        
        <h3 className="font-normal text-base text-[#8C8C8C]">
          Total Selling:{" "}
          <span className="text-sm text-white font-normal">{trnSuccess}</span>
        </h3>
        <h3 className="font-normal text-base text-[#8C8C8C]">
          Total Cancel:{" "}
          <span className="text-sm text-white font-normal">{trnCancel}</span>
        </h3>
        <h3 className="font-normal text-base text-[#8C8C8C]">
          Total Pending:{" "}
          <span className="text-sm text-white font-normal">{trnPending}</span>
        </h3>
        <h3 className="font-normal text-base text-[#8C8C8C]">
  Blocked User:{" "}
  <span className="text-sm text-white font-normal">
    {blockedUser}
  </span>
</h3>


        <h3 className="font-normal text-sm text-[#8C8C8C] mt-2">
          Manage Website:
        </h3>

        <div className=" flex flex-col items-center gap-2">
          <Button
            variant="login"
            onClick={navigateToService}
            className="w-full text-sm font-normal h-14 text-white bg-[#282828] hover:bg-[#212121] !justify-between"
          >
            Service List
            <Icon.arrowRight className="w-4 h-4" />
          </Button>
          {/* <Button
            variant="login"
            onClick={navigateToRechargeHistory}
            className="w-full text-sm font-normal h-14 text-white bg-[#282828] hover:bg-[#212121] !justify-between"
          >
            Recharge History
            <Icon.arrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="login"
            onClick={navigateToSMSHistory}
            className="w-full text-sm font-normal h-14 text-white bg-[#282828] hover:bg-[#212121] !justify-between"
          >
            SMS History
            <Icon.arrowRight className="w-4 h-4" />
          </Button> */}
          <Button
            variant="login"
            onClick={navigateToUsersData}
            className="w-full text-sm font-normal h-14 text-white bg-[#282828] hover:bg-[#212121] !justify-between"
          >
            Users Data
            <Icon.arrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="login"
            onClick={() => navigate('/active-orders')}
            className="w-full text-sm font-normal h-14 text-white bg-[#282828] hover:bg-[#212121] !justify-between"
          >
            Active Orders
            <Icon.arrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="login"
            onClick={navigateToAdminPanel}
            className="w-full text-sm font-normal h-14 text-white bg-[#282828] hover:bg-[#212121] !justify-between"
          >
            Admin Panel
            <Icon.arrowRight className="w-4 h-4" />
          </Button>
          <Button
  variant="login"
  onClick={() => navigate('/server-balances')}
  className="w-full text-sm font-normal h-14 text-white bg-[#282828] hover:bg-[#212121] !justify-between"
>
  Server Balances
  <Icon.arrowRight className="w-4 h-4" />
</Button>
          <Button
            variant="login"
            onClick={navigateToDiscount}
            className="w-full text-sm font-normal h-14 text-white bg-[#282828] hover:bg-[#212121] !justify-between"
          >
            Discount
            <Icon.arrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="login"
            onClick={navigateToUnsendTrx}
            className="w-full text-sm font-normal h-14 text-white bg-[#282828] hover:bg-[#212121] !justify-between"
          >
            Unsend Trx
            <Icon.arrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="login"
            onClick={navigateToBlockedUser}
            className="w-full text-sm font-normal h-14 text-white bg-[#282828] hover:bg-[#212121] !justify-between"
          >
            Blocked Users
            <Icon.arrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppLayout()(Home);
