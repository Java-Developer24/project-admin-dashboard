import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UnsendTrx = () => {
  const navigate = useNavigate();
  const navigateToHome = () => navigate("/");
  const [unsendTrx, setUnsendTrx] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const rechargeResponse = await axios.get("http://localhost:3000/api/unsendtrx/unsend-trx");
        setUnsendTrx(rechargeResponse.data.data);
      } catch (error) {
        console.error("Failed to fetch history data", error);
      }
    };

    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/unsendtrx/unsend-trx?id=${id}`);
      setUnsendTrx((prevUnsendTrx) =>
        prevUnsendTrx.filter((trx) => trx._id !== id)
      );
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const filteredTrx = unsendTrx.filter((trx) =>
    trx.email.toLowerCase().includes(searchQuery.toLowerCase())
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
          Unsend Trx
        </Button>
      </div>

      <div className="flex items-center justify-center pt-[1rem]">
        <div className="bg-transparent w-full max-w-md rounded-lg mb-[60px] border-none dark">
          <div className="w-full flex bg-[#18191c] rounded-2xl px-2 items-center justify-center h-[50px] mb-3">
            <Icon.search className="w-4 h-4 text-primary" />
            <input
              type="text"
              placeholder="Search by email..."
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
          {filteredTrx.length > 0 ? (
            filteredTrx.map((history, index) => (
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
                        {history.email}
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
                        {history.trxAddress}
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                        Private Key
                      </td>
                      <td
                        className="border-b-2 border-[#949494] p-3"
                        style={wrapStyle}
                      >
                        {history.trxPrivateKey}
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                        Date & Time
                      </td>
                      <td
                        className="border-b-2 border-[#949494] p-3"
                        style={wrapStyle}
                      >
                        {moment(history.createdAt).format(
                          "DD/MM/YYYY hh:mm:ss A"
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 px-5 text-[#959595]">Action</td>
                      <td className="p-3">
                        <Button onClick={() => handleDelete(history._id)}>
                          <Icon.trash className="w-4 h-4 text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <div className="text-white text-center h-full flex items-center justify-center">
              No data available
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AppLayout()(UnsendTrx);
