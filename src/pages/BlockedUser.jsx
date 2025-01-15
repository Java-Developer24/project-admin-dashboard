import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BlockedUser = () => {
  const navigate = useNavigate();
  const navigateToHome = () => navigate("/");
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        const response = await axios.get("/api/user/admin-api/user-block-data/get-all-blocked-users");
        // Update to use response.data directly, since it's already an array
        setBlockedUsers(response.data); 
      } catch (error) {
        console.error("Failed to fetch blocked users data", error);
      }
    };
  
    fetchBlockedUsers();
  }, []);
  

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const filteredUsers = blockedUsers.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          onClick={navigateToHome}
          className="text-sm font-normal text-[#8C8C8C] !no-underline p-1 h-0 flex gap-2"
        >
          <Icon.arrowLeft className="w-4 h-4" />
          Blocked Users
        </Button>
      </div>

      <div className="flex items-center justify-center pt-[1rem]">
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
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <div
                className="mt-[1.5rem] w-full border-[10px] border-[#444444] rounded-lg"
                key={index}
              >
                <table className="w-full table-auto">
                  <tbody>
                    <tr>
                      <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                        SL No
                      </td>
                      <td
                        className="border-b-2 border-[#949494] p-3"
                        style={wrapStyle}
                      >
                        {index + 1}
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                        Email
                      </td>
                      <td
                        className="border-b-2 border-[#949494] p-3"
                        style={wrapStyle}
                      >
                        {user.email}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 px-5 text-[#959595]">
                        Blocked Reason
                      </td>
                      <td className="p-3" style={wrapStyle}>
                        {user.blocked_reason}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <div className="text-white text-center h-full flex items-center justify-center">
              No blocked users found
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AppLayout()(BlockedUser);
