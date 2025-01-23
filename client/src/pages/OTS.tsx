import OTS_Card from "@/components/OTS_Card";
import { Stack } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { GET_ALL_REPORTS } from "@/utils/queries";
import { Machine } from "../models/Machine";

interface OTSProps {
  _id: string;
  shiftNumber: string;
  date: Date;
  assignedUserId: string;
  savedMachines: Machine[];
}

const OTS = () => {
  const { loading, error, data: AllReportData } = useQuery(GET_ALL_REPORTS);
  console.log(AllReportData);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <main className="flex-shrink-0">
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
    </main>
  );
};

export default OTS;
