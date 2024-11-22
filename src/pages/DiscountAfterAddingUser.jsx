import AppLayout from "@/components/layout/AppLayout";
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

const Limiter = ({ limit, onLimitChange }) => {
  return (
    <Select value={String(limit)} onValueChange={onLimitChange}>
      <SelectTrigger className="w-[px] dark bg-transparent">
        <SelectValue>{limit}</SelectValue>
      </SelectTrigger>
      <SelectContent className="dark bg-[#1e1e1e]">
        <SelectGroup>
          <SelectLabel className="font-normal">Limit</SelectLabel>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="30">30</SelectItem>
          <SelectItem value="50">50</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const DiscountAfterAddingUser = () => {
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [userDiscounts, setUserDiscounts] = useState([]);
  const navigate = useNavigate();

  const fetchUserDiscounts = async () => {
    try {
      const response = await axios.get("/users/get-all-discounts");
      const data = await response.data;
      setUserDiscounts(data);
    } catch (error) {
      console.error("Failed to fetch user discounts:", error);
    }
  };

  useEffect(() => {
    fetchUserDiscounts();
  }, []);

  const navigateToHome = () => navigate("/discount");

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

  const uniqueEmails = new Set();
  const filteredData = userDiscounts
    .filter(({ userId: { email } }) => {
      if (!uniqueEmails.has(email.toLowerCase())) {
        uniqueEmails.add(email.toLowerCase());
        return true;
      }
      return false;
    })
    .filter(({ userId: { email } }) =>
      email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const selectedData = filteredData.slice(startIndex, startIndex + limit);

  const handleClick = () => {
    navigate("/discount/user/add-discount");
  };

  const handleRowClick = (userId) => {
    navigate(`/discount/user/${userId}`);
  };

  return (
    <>
      <div className="w-full my-2 flex items-center justify-between">
        <Button
          variant="link"
          onClick={navigateToHome}
          className="text-sm font-normal text-[#8C8C8C] !no-underline p-1 h-0 flex gap-2"
        >
          <Icon.arrowLeft className="w-4 h-4" /> Discount
        </Button>

        <div className="flex items-center gap-2 font-normal">
          <p className="text-sm text-[#8C8C8C]">Limit:</p>
          <Limiter limit={limit} onLimitChange={handleLimitChange} />
        </div>
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
          <div className="overflow-y-auto max-h-[calc(100vh-17rem)] text-left">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="p-3 font-normal text-[#8C8C8C]">SL No</th>
                  <th className="p-3  font-normal text-[#8C8C8C]">Email</th>
                </tr>
              </thead>
              <tbody>
                {selectedData.map(({ userId: { email, _id } }, index) => (
                  <tr
                    key={_id}
                    onClick={() => handleRowClick(_id)}
                    className="cursor-pointer"
                  >
                    <td className="border-t-2 border-[#4B4B4B] p-3">
                      {startIndex + index + 1}
                    </td>
                    <td className="border-t-2 border-[#4B4B4B] p-3">{email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-full max-w-2xl mt-4 flex justify-between fixed bottom-0 p-6 bg-black">
          <Button
            className="py-1 px-6 text-xs !rounded-md border-2 border-white font-normal hover:!bg-white hover:text-black transition-colors duration-200 ease-in-out"
            onClick={handleClick}
          >
            Add Discount
          </Button>
          <div>
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
      </div>
    </>
  );
};

export default AppLayout()(DiscountAfterAddingUser);
