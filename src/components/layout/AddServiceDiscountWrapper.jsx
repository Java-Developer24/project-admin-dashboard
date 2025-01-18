import React, { useEffect, useState } from "react";
import { LayoutLoader } from "@/components/layout/Loaders";
import axios from "axios";
import AddServiceDiscount from "@/pages/AddServiceDiscount";

const AddServiceDiscountWrapper = () => {
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token"); // Retrieve the token from localStorage

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await axios.get("/api/service/admin-api/service-data/get-service-data-admin", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });
        setServiceData(response.data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, []);

  if (loading) {
    return <LayoutLoader />;
  }

  return <AddServiceDiscount serviceList={serviceData} />;
};

export default AddServiceDiscountWrapper;
