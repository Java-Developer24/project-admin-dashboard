import AppLayout from "@/components/layout/AppLayout";
import { SnapLoader } from "@/components/layout/Loaders";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UsersData = () => {
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]); // State to store the fetched users
  const [totalAmount, setTotalAmount] = useState("0.00"); // State to store the total amount
  const [totalUsers, setTotalUsers] = useState("0");
  const [loading, setLoading] = useState(true); // State to handle the loading state
  const navigate = useNavigate();

  const navigateToHome = () => navigate("/");

  useEffect(() => {
    // Fetch users data on component mount
    const fetchUsers = async () => {
      try {
        const [usersResponse, totalUsersCount] = await Promise.all([
          axios.get(
            "https://project-backend-xo17.onrender.com/api/user/get-all-users"
          ),
          axios.get(
            `https://project-backend-xo17.onrender.com/api/user/total-user-count`
          ),
        ]);

        const usersData = usersResponse.data;

        // Sort users by `createdAt` in descending order
        const sortedUsers = usersData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Calculate the total balance of all users
        const totalBalance = sortedUsers.reduce(
          (accumulator, user) => accumulator + user.balance,
          0
        );

        setUsers(sortedUsers);
        setTotalUsers(totalUsersCount.data.totalUserCount);
        setTotalAmount(totalBalance.toFixed(2)); // Update total amount state
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleLimitChange = (value) => {
    setLimit(Number(value));
    setCurrentPage(1); // Reset to the first page when limit changes
  };

  const handleNextPage = () => {
    if (currentPage * limit < filteredData.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = (currentPage - 1) * limit;

  const filteredData = users
    .filter((user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const selectedData = filteredData.slice(startIndex, startIndex + limit);

  const handleRowClick = (userId) => {
    navigate(`/users-data/${userId}`);
  };

  const wrapStyle = {
    wordBreak: "break-word",
    whiteSpace: "normal",
    overflowWrap: "break-word",
  };

  return (
    <>
      <div className="w-full my-2 flex items-center justify-between">
        <Button
          variant="link"
          onClick={navigateToHome}
          className="text-sm font-normal text-[#8C8C8C] !no-underline p-1 h-0 flex gap-2"
        >
          <Icon.arrowLeft className="w-4 h-4" /> User Data
        </Button>

        <div className="flex items-center gap-2 font-normal">
          <p className="text-sm text-[#8C8C8C]">Limit:</p>
          <Limiter limit={limit} onLimitChange={handleLimitChange} />
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <p className="text-[#A5A5A5] text-sm">
          Total user:{" "}
          <span className="text-white font-normal text-xs">{totalUsers}</span>
        </p>
        <p className="text-[#A5A5A5] text-sm">
          Total Balance:{" "}
          <span className="text-white font-normal text-xs">₹{totalAmount}</span>
        </p>
      </div>

      <div className="flex flex-col items-center pt-[1rem]">
        <div className="bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark">
          <div className="w-full flex bg-[#18191c] rounded-2xl px-2 items-center justify-center h-[50px] mb-3">
            <Icon.search className="w-4 h-4 text-primary" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-[85%] h-[50px] ml-2 text-sm bg-transparent border-0 text-white placeholder:text-primary focus:outline-none"
            />
            {searchQuery !== "" ? (
              <Icon.circleX
                className="text-primary cursor-pointer"
                onClick={clearSearch}
              />
            ) : (
              ""
            )}
          </div>
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <SnapLoader />
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[calc(100vh-18rem)] mb-2 text-left">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr>
                    <th className="p-3 font-normal text-[#8C8C8C]">SL No</th>
                    <th className="p-3 font-normal text-[#8C8C8C]">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedData.map((user, index) => (
                    <tr
                      key={user._id}
                      onClick={() => handleRowClick(user._id)}
                      className="cursor-pointer hover:bg-[#292929]"
                    >
                      <td className="border-t-2 border-[#4B4B4B] p-3">
                        {(currentPage - 1) * limit + index + 1}
                      </td>
                      <td
                        className="border-t-2 border-[#4B4B4B] p-3"
                        style={wrapStyle}
                      >
                        {user.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="w-full max-w-2xl mt-4 flex justify-center fixed bottom-0 p-4 bg-black">
          <button
            onClick={handlePrevPage}
            className={`px-4 py-2 ${
              currentPage === 1 ? "text-gray-500 cursor-not-allowed" : ""
            }`}
            disabled={currentPage === 1}
          >
            <Icon.left />
          </button>
          <button
            onClick={handleNextPage}
            className={`px-4 py-2 ${
              currentPage * limit >= filteredData.length
                ? "text-gray-500 cursor-not-allowed"
                : ""
            }`}
            disabled={currentPage * limit >= filteredData.length}
          >
            <Icon.right />
          </button>
        </div>
      </div>
    </>
  );
};

export default AppLayout()(UsersData);

const Limiter = ({ limit, onLimitChange }) => {
  return (
    <Select value={String(limit)} onValueChange={onLimitChange}>
      <SelectTrigger className="w-[px] dark bg-transparent">
        <SelectValue>{limit}</SelectValue>
      </SelectTrigger>
      <SelectContent className="dark bg-[#1e1e1e]">
        <SelectGroup>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="30">30</SelectItem>
          <SelectItem value="50">50</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
