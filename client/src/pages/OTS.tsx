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
  const { loading, error, data: AllReportData, refetch } = useQuery(GET_ALL_REPORTS);

  useEffect(() => {
    checkLogin();
    refetch();
  }, []);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <main className="flex-shrink-0">
      {loginCheck && auth.getRole() === "supervisor" ? (
        AllReportData.getAllReports.length === 0 ? (
          <h2 style={{ marginTop: "4rem" }}>No reports found...</h2>
        ) : (
          <Stack gap="8" direction="row" wrap="wrap">
            {AllReportData.getAllReports.map((data: OTSProps) => (
              <OTS_Card
                key={data._id}
                date={new Date(data.date).toISOString().split("T")[0]}
                shift={data.shiftNumber}
                creatorId={data.assignedUserId}
                savedMachines={data.savedMachines}
                _id={data._id}
              />
            ))}
          </Stack>
        )
      ) : (
        <h1 style={{ marginTop: "20px" }}>
          Unauthorized user! Please login as supervisor to access this page.
        </h1>
      )}
    </main>
  );
};

export default OTS;
