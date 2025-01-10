import React, { useEffect, useState } from "react";
import { LayoutLoader } from "@/components/layout/Loaders";
import axios from "axios";
import AddServiceDiscount from "@/pages/AddServiceDiscount";

const AddServiceDiscountWrapper = () => {
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await axios.get("/api/service/get-service-data-admin");
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
