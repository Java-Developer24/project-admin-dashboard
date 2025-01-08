import axios from "axios";
import toast from "react-hot-toast";

const AdminDashboard = async (userId) => {
  try {
    if (userId) {
      console.log(userId)
      // Redirect to frontend route with userId
      window.open(`http://localhost:5174/admin-auth-login?userId=${userId}`, '_blank');      // Changed `token` to `userId`
    } else {
      throw new Error("User ID is missing");
    }
  } catch (error) {
    toast.error("Failed to login as user. Please try again.");
  }
};

export default AdminDashboard;
