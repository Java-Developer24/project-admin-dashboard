import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const UserDataDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userData, setUserData] = useState({});
  const [isBlocked, setIsBlocked] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [newBalance, setNewBalance] = useState(""); // State for new balance

  const navigateToUsersData = () => navigate("/users-data");

  const fetchUser = async () => {
    try {
      const user = await axios.get(`http://localhost:3000/api/user/get-user?userId=${id}`);
      setUserData(user.data);
      setIsBlocked(user.data.blocked);
      setNewBalance(user.data.balance); // Initialize new balance
    } catch (error) {
      console.error("Failed to fetch user data");
    }
  };
  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleBlockToggle = async () => {
    try {
      // Construct the payload conditionally
      const payload = {
        userId: id,
        blocked: !isBlocked,
      };
  
      // Add blocked_reason only if the user is being blocked
      if (!isBlocked) {
        payload.blocked_reason = "Blocked by Admin";
      }
  
      const response = await axios.post("http://localhost:3000/api/user/block-user", payload);
  
      if (response.data.status === "SUCCESS") {
        setIsBlocked(!isBlocked);
      }
    } catch (error) {
      console.error("Failed to update block status:", error);
    }
  };
  

  const handleEditClick = () => {
    setNewBalance(userData.balance); // Set balance to current value when editing starts
    setIsEditing(true);
  };

  const handleBalanceChange = (e) => {
    setNewBalance(e.target.value);
  };

  const handleSave = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/user/update-user-balance", {
        userId: id,
        new_balance: parseFloat(newBalance), // Ensure balance is a number
      });
      if (response.status === 200) {
        setUserData((prevData) => ({ ...prevData, balance: newBalance }));
        setIsEditing(false); // Return to previous state after successful update
      }
    } catch (error) {
      console.error("Failed to update balance:", error);
    }
  };

  const handleDelete = async () => {
    const deleteUserPromise = new Promise((resolve, reject) => {
      const deleteUserRequest = async () => {
        try {
          const response = await axios.delete(
            `/block-fraud-clear?userId=${id}`
          );
          if (response.status === 200) {
            // Redirect to users data page or show success message
            fetchUser();
          }
          resolve(response);
        } catch (error) {
          reject(error);
        }
      };
      deleteUserRequest();
    });

    await toast.promise(deleteUserPromise, {
      loading: "Deleting Data...",
      success: (r) => {
        return r.data.message;
      },
      error: (error) => {
        const errorMessage =
          error.response?.data?.error ||
          "Error Deleting data. Please try again.";
        return errorMessage;
      },
    });
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
          onClick={navigateToUsersData}
          className="text-sm font-normal text-[#8C8C8C] !no-underline p-1 h-0 flex gap-2"
        >
          <Icon.arrowLeft className="w-4 h-4" /> User Data Details
        </Button>
      </div>

      <div className="flex items-center justify-center pt-[1rem]">
        <div className="bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark">
          <div className="w-full flex items-center justify-between px-4">
            <div className="flex flex-col items-center justify-center gap-1">
              <h5 className="font-normal text-[#757575]">Block on/off</h5>
              <Switch checked={isBlocked} onCheckedChange={handleBlockToggle} />
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <h5 className="font-normal text-[#757575]">Edit Profile</h5>
              <Icon.edit
                className="w-5 h-5 cursor-pointer"
                onClick={handleEditClick}
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <h5 className="font-normal text-[#757575]">Delete User</h5>

              <Icon.trash
                className="w-5 h-5 cursor-pointer text-red-600"
                onClick={handleDelete}
              />
            </div>
          </div>

          <div className="mt-[1.5rem] w-full border-[10px] border-[#444444] rounded-lg">
            <table className="w-full table-auto">
              <tbody>
                <tr>
                  <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                    User ID
                  </td>
                  <td
                    className="border-b-2 border-[#949494] p-3"
                    style={wrapStyle}
                  >
                    {userData._id}
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
                    {userData.email}
                  </td>
                </tr>
                <tr>
                  <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                    Login Type
                  </td>
                  <td
                    className="border-b-2 border-[#949494] p-3"
                    style={wrapStyle}
                  >
                    {userData.googleId ? "Google" : "Email"}
                  </td>
                </tr>
                <tr>
                  <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                    Balance
                  </td>
                  <td
                    className="border-b-2 border-[#949494] p-3"
                    style={wrapStyle}
                  >
                    {isEditing ? (
                      <Input
                        type="number"
                        value={newBalance}
                        onChange={handleBalanceChange}
                        className="w-full p-2 border rounded-md no-arrows"
                      />
                    ) : (
                      userData.balance
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                    Api Key
                  </td>
                  <td
                    className="border-b-2 border-[#949494] p-3"
                    style={wrapStyle}
                  >
                    {userData.api_key}
                  </td>
                </tr>
                <tr>
                  <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                    Trx Address
                  </td>
                  <td
                    className="border-b-2 border-[#949494] p-3"
                    style={wrapStyle}
                  >
                    {userData.trxAddress}
                  </td>
                </tr>
                <tr>
                  <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                    Trx Private Key
                  </td>
                  <td
                    className="border-b-2 border-[#949494] p-3"
                    style={wrapStyle}
                  >
                    {userData.trxPrivateKey}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 px-5 text-[#959595]">Joined</td>
                  <td className="p-3" style={wrapStyle}>
                    {moment(userData.createdAt).format("DD/MM/YYYY hh:mm:ss A")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {isEditing && (
            <div className="w-full flex items-center justify-center gap-4 mt-8">
              <Button
                className="py-1 px-8 text-xs bg-[#129BFF] text-white hover:bg-[#129BFF]"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                className="py-1 px-6 text-xs !rounded-md border-2 border-white font-normal hover:!bg-white hover:text-black transition-colors duration-200 ease-in-out"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AppLayout()(UserDataDetails);
