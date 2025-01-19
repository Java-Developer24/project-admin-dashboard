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
import Modal from "@/components/ui/Modal";

import { SnapLoader } from "@/components/layout/Loaders";


const UserDataDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userData, setUserData] = useState({});
  const [isBlocked, setIsBlocked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newBalance, setNewBalance] = useState("");
  const [isEditingDBBalance, setIsEditingDBBalance] = useState(false); // State for DBbalance edit mode
  const [newDBBalance, setNewDBBalance] = useState(""); // State for new DBbalance
  const [showModal, setShowModal] = useState(false);
  const [blockReason, setBlockReason] = useState("");

  const [loading, setLoading] = useState(true); // State to handle the loading state
  const navigateToUsersData = () => navigate("/users-data");
  const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage after login

  const fetchUser = async () => {
    try {
      const user = await axios.get(`/api/user/user-admin-api/get-user?userId=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      });
      setUserData(user.data);
      setIsBlocked(user.data.blocked);
      setNewBalance(user.data.balance); // Initialize balance
      setNewDBBalance(user.data.dbBalance || ""); // Initialize DBbalance
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch user data");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleFetchBlockReason = async () => {
    try {
      const response = await axios.get("/api/user/admin-api/user-block-data/get-all-blocked-users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        const userBlockDetails = response.data.find(user => user.email ); // Match email instead of userId
        if (userBlockDetails) {
          setBlockReason(userBlockDetails.blocked_reason); // Adjusted key to match the response field
          setShowModal(true);
          
        } else {
          toast.error("No block details found for this user.");
        }
      } else {
        console.error("Failed to fetch block details:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching block details:", error);
    }
  };
  

  const handleBlockToggle = async () => {
    try {
      const payload = {
        userId: id,
        blocked: !isBlocked,
        blocked_reason: !isBlocked ? "Blocked by Admin" : null,
      };
      const response = await axios.post(
        "/api/user/admin-api/user-block-status-update/block-user",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        }
      );

      if (response.data.status === "SUCCESS") {
        setIsBlocked(!isBlocked);
        setShowModal(false);
        toast.success("User block status updated successfully.");
      }
    } catch (error) {
      console.error("Failed to update block status:", error);
    }
  };

  const handleBlockButtonClick = () => {
    if (isBlocked) {
      handleFetchBlockReason();
    } else {
      handleBlockToggle();
    }
  };
  
  const handleEditClick = () => {
    setNewBalance(userData.balance);
    setIsEditing(true);
  };

  const handleBalanceChange = (e) => {
    setNewBalance(e.target.value);
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        "/api/user/admin-api/user-balance-change/update-user-balance",
        {
          userId: id,
          new_balance: parseFloat(newBalance),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        }
      );
      if (response.status === 200) {
        setUserData((prevData) => ({ ...prevData, balance: newBalance }));
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update balance:", error);
    }
  };

  const handleEditDBClick = () => {
    setNewDBBalance(userData.balance );
    setIsEditingDBBalance(true);
  };

  const handleDBBalanceChange = (e) => {
    setNewDBBalance(e.target.value);
  };

  const handleSaveDBBalance = async () => {
    try {
      const response = await axios.post("/api/user/admin-api/user-db-balance-change/update-user-balances", {
        userId: id,
        new_db_balance: parseFloat(newDBBalance),
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      });
      if (response.status === 200) {
        setUserData((prevData) => ({ ...prevData, dbBalance: newDBBalance }));
        setIsEditingDBBalance(false);
        fetchUser();
      }
    } catch (error) {
      console.error("Failed to update DBbalance:", error);
    }
  };


  const handleViewOrders = () => {
     navigate(`/orders/${id}`);
     }

  const handleDeleteUserData = async () => {
    const deleteUserPromise = new Promise((resolve, reject) => {
      const deleteUserRequest = async () => {
        try {
          const response = await axios.delete(
            `/api/block/admin-api/user-block-fraud/data-clear/block-fraud-clear?userId=${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Add the token to the Authorization header
              },
            }
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
  const handleDeleteUserAccount = async () => {
    const deleteUserPromise = new Promise((resolve, reject) => {
      const deleteUserRequest = async () => {
        try {
          const response = await axios.delete(
            `/api/user/admin-api/user-acct-remove/delete-user-account?userId=${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Add the token to the Authorization header
              },
            }
          );
          if (response.status === 200) {
            navigate("/users-data")
           
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
      {loading ? (
            <div className="h-screen flex items-center justify-center">
            <SnapLoader />
          </div>
          ) : (
      <div className="flex items-center justify-center pt-[1rem]">
        <div className="bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark">
        <div className="w-full flex items-center justify-between px-4">
            <div className="flex flex-col items-center justify-center gap-1">
              <h5 className="font-normal text-[#757575]">Block on/off</h5>
              <Switch checked={isBlocked} onCheckedChange={handleBlockButtonClick} />
            </div>



 {/* Modal for showing block reason */}
 <Modal isOpen={showModal} onClose={() => setShowModal(false)}   title="Block Reason">
        <p className="text-white font- text-lg mb-4">{blockReason}</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button className=" py-2 bg-red-600 hover:bg-red-500 text-white font-heavy  rounded-lg " onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button className=" bg-green-600 hover:bg-green-500 text-white font  rounded-lg" onClick={handleBlockToggle}>Unblock User</Button>
        </div>
      </Modal>




            {/* <div className="flex flex-col items-center justify-center gap-1">
              <h5 className="font-normal text-[#757575]">Edit Profile</h5>
              <Icon.edit
                className="w-5 h-5 cursor-pointer"
                onClick={handleEditClick}
              />
            </div> */}
            <div className="flex flex-col items-center justify-center gap-1">
              <h5 className="font-normal text-[#757575]">Delete User Data</h5>

              <Icon.trash
                className="w-5 h-5 cursor-pointer text-red-600"
                onClick={handleDeleteUserData}
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <h5 className="font-normal text-[#757575]">Delete User</h5>

              <Icon.trash
                className="w-5 h-5 cursor-pointer text-red-600"
                onClick={handleDeleteUserAccount}
              />
            </div>
          </div>
          
          <div className="mt-[1.5rem] w-full border-[10px] border-[#444444] rounded-lg">
            <table className="w-full table-auto">
              <tbody>
              <tr className="border-b-2 border-[#949494] p-3">
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
                <tr className="border-b-2 border-[#949494] p-3">
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
                <tr className="border-b-2 border-[#949494] p-3">
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
                <tr className="border-b-2 border-[#949494] p-3">
                  <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                    User Password
                  </td>
                  <td
                    className="border-b-2 border-[#949494] p-3"
                    style={wrapStyle}
                  >
                    {userData.userPassword ? userData.userPassword : "N/A"}


                  </td>
                </tr>
                <tr className="border-b-2 border-[#949494] p-3 w-full">
  <td className="border-b-2 border-[#949494] p-3 px-4 text-[#959595]">Balance</td>

  <td className="border-b-2  p-3 flex items-center justify-between" style={wrapStyle}>
    {isEditing ? (
      <Input
        type="number"
        value={newBalance}
        onChange={handleBalanceChange}
        className="w-full p-2 border rounded-md no-arrows mr-5"
      />
    ) : (
      userData.balance
    )}
    
  </td>
  <td>
    <Icon.edit
      className="text-white cursor-pointer w-5 h-5"
      onClick={handleEditClick}
    /></td>
</tr>

                <tr className="border-b-2 border-[#949494] p-3">
                  <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">DB Balance</td>
                  <td className="border-b-2 border-[#949494] p-3" style={wrapStyle}>
                    {isEditingDBBalance ? (
                      <Input
                        type="number"
                        value={newDBBalance}
                        onChange={handleDBBalanceChange}
                        className="w-full p-2 border rounded-md no-arrows"
                      />
                    ) : (
                      userData.balance 
                    )}
                  </td>
                  <td>
                    {!isEditingDBBalance &&
                      (
                      <Icon.edit className="text-white cursor-pointer w-5 h-5 mr-3"  onClick={handleEditDBClick} />
                    )}
                  </td>
                </tr>

                <tr className="border-b-2 border-[#949494] p-3">
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
                <tr className="border-b-2 border-[#949494] p-3">
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
                <tr className="border-b-2 border-[#949494] p-3">
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
          <div className="flex justify-center w-full h-full mt-6  ">
              <Button className="  py-6 bg-green-600 hover:bg-green-500 text-white font  rounded-lg" onClick={() => navigate(`/recharge-history/${id}`)}>Recharge History</Button>
              <Button
      className="py-6 ml-7 bg-green-600 hover:bg-green-500 text-white font rounded-lg transition"
      onClick={handleViewOrders} // Pass userId to AdminDashboard
    >
       My Orders
    </Button>
              <Button className=" py-6    ml-8 bg-green-600 hover:bg-green-500 text-white font rounded-lg transition" onClick={() => navigate(`/sms-history/${id}`)}>SMS History</Button>
            </div>
          {isEditingDBBalance && (
                      <div className="w-full flex items-center justify-center gap-4 mt-8">
                   <Button onClick={handleSaveDBBalance} className="py-1 px-8 text-xs bg-[#129BFF] text-white hover:bg-[#129BFF]">Save</Button>
                    <Button onClick={() => setIsEditingDBBalance(false)} className="py-1 px-6 text-xs !rounded-md border-2 border-white font-normal hover:!bg-white hover:text-black transition-colors duration-200 ease-in-out">Cancel</Button>
                    </div>
                        )}
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
      </div>)}


    </>
  );
};

export default AppLayout()(UserDataDetails);
