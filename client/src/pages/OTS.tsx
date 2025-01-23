import OTS_Card from "@/components/OTS_Card";
import { Stack } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { GET_ALL_REPORTS } from "@/utils/queries";
import { Machine } from "../models/Machine";
import auth from "../utils/auth";
import { useState, useEffect } from "react";

interface OTSProps {
  _id: string;
  shiftNumber: string;
  date: Date;
  assignedUserId: string;
  savedMachines: Machine[];
}

const OTS = () => {
  const [loginCheck, setLoginCheck] = useState(false);
  const checkLogin = () => {
    const isLoggedIn = auth.loggedIn();
    if (isLoggedIn) {
      setLoginCheck(true);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);
  const { loading, error, data: AllReportData } = useQuery(GET_ALL_REPORTS);
  console.log(AllReportData);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <main className="flex-shrink-0">
      {loginCheck && auth.getRole() === "supervisor" ? (
        <Stack gap="8" direction="row" wrap="wrap">
          {AllReportData.getAllReports.map((data: OTSProps) => (
            <OTS_Card
              key={data._id}
              date={new Date(data.date).toISOString().split("T")[0]}
              shift={data.shiftNumber}
              creator={data.assignedUserId}
            />
          ))}
        </Stack>
      ) : (
        <h1 style={{ marginTop: '20px' }}>
          Unauthorized user! Please login as supervisor to access this page.
        </h1>
      )}
    </main>
  );
};

export default OTS;
