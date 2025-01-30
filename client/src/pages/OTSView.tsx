import { Machine } from "../models/Machine";
import { OTSMachine } from "@/models/OTSMachine";
import { OTSReport } from "@/models/OTSReport";
import auth from "../utils/auth";
import { useState, useEffect } from "react";
import { HStack } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { useMutation } from "@apollo/client";
import {
  CREATE_OTS_REPORT,
  SAVE_OTS_MACHINES,
  REMOVE_REPORT,
} from "../utils/mutations";
import { useNavigate } from "react-router-dom";

interface OTSViewProps {
  _id: string;
  shiftNumber: string;
  date: Date | null;
  assignedUserId: string;
  savedMachines: Machine[];
  reportId: string;
}

const OTSView = () => {
  const location = useLocation();
  const { reportId, shiftNumber, date, savedMachines } =
    location.state as OTSViewProps;
  const navigate = useNavigate();
  const [shiftNumberOTS, setShiftNumberOTS] = useState<number>(
    Number(shiftNumber)
  );
  const [dateOTS, setDateOTS] = useState<string>(date?.toString() ?? "");

  useEffect(() => {
    checkLogin();
    const transformedMachines = savedMachines.map((data: Machine) => ({
      machine: data.machine,
      machineStatus: data.machineStatus,
      partsMade: data.partsMade,
      comments: data.comments,
      lotNumber: null,
    }));
    setNewOTSMachines((prev) => [...prev, ...transformedMachines]);
  }, [savedMachines]);

  const [newOTSReport, setNewOTSReport] = useState<OTSReport | undefined>({
    shiftNumber: shiftNumberOTS.toString(),
    date: date,
    assignedUserId: localStorage.getItem("userId") as string,
  });

  const [newOTSMachines, setNewOTSMachines] = useState<OTSMachine[]>([]);

  const [loginCheck, setLoginCheck] = useState(false);
  const checkLogin = () => {
    const isLoggedIn = auth.loggedIn();
    if (isLoggedIn) {
      setLoginCheck(true);
    }
  };

  const [successOTSReport, setSuccessOTSReport] = useState(false);
  const [OTSReportError, setOTSReportError] = useState(false);
  const [OTSMachinesError, setOTSMachinesError] = useState(false);

  const [createOTSReport] = useMutation(CREATE_OTS_REPORT);
  const [saveOTSMachines] = useMutation(SAVE_OTS_MACHINES);
  const [removeReport] = useMutation(REMOVE_REPORT);

  const handleShiftChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedShift = Number(event.target.value);
    setShiftNumberOTS(selectedShift);
    setNewOTSReport((prev) =>
      prev
        ? {
            ...prev,
            shiftNumber: selectedShift.toString(),
          }
        : undefined
    );
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDate = e.target.value;
    if (!rawDate) {
      setNewOTSReport((prev) => (prev ? { ...prev, date: null } : undefined));
      setDateOTS("");
    } else {
      setDateOTS(rawDate);
      let time = "06:00:00.000Z";
      if (newOTSReport?.shiftNumber === "2") {
        time = "07:00:00.000Z";
      }
      const finalformattedDate = new Date(`${rawDate}T${time}`);
      setNewOTSReport((prev) =>
        prev ? { ...prev, date: finalformattedDate } : undefined
      );
    }
  };

  const handleSubmitPress = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    //TO DO: Create removeReport mutation to remove report if successfully created OTSReport & OTSMachine
    let formErrors: boolean = false;
    if (!newOTSReport?.date || !newOTSReport?.shiftNumber) {
      setOTSReportError(true);
      formErrors = true;
    } else {
      setOTSReportError(false);
    }
    newOTSMachines.forEach((machine) => {
      if (
        !machine.machine ||
        !machine.machineStatus ||
        !machine.partsMade ||
        !machine.lotNumber
      ) {
        setOTSMachinesError(true);
        formErrors = true;
      } else {
        setOTSMachinesError(false);
      }
    });

    if (formErrors === false) {
      const { data: reportOTSData } = await createOTSReport({
        variables: { report: newOTSReport },
      });

      if (reportOTSData.createOTSReport) {
        const { data: machineOTSData } = await saveOTSMachines({
          variables: {
            reportId: reportOTSData.createOTSReport._id,
            machine: newOTSMachines,
          },
        });
        if (machineOTSData.saveOTSMachines) {
          setSuccessOTSReport(true);
          console.log("reportId", reportId);
          const { data: removedReport } = await removeReport({
            variables: { reportId: reportId },
          });
          if (removedReport.removeReport) {
            setTimeout(() => {
              navigate("/OTS");
            }, 2000);
          }
        }
      }
    }
  };

  return (
    <main className="flex-shrink-0">
      {loginCheck && auth.getRole() === "supervisor" ? (
        <>
          {/* Shift select question */}
          <div>
            <h2>Shift Number:</h2>
            <select
              id="ots-shift-option"
              className="form-select form-select-lg mb-3 form-custom"
              aria-label=".form-select-lg example"
              value={shiftNumberOTS}
              onChange={handleShiftChange}
            >
              <option value={1}>Shift 1</option>
              <option value={2}>Shift 2</option>
            </select>

            <div className="datepicker">
              <label htmlFor="startDate">Date:</label>
              <input
                id="ots-date"
                className="form-control"
                type="date"
                value={dateOTS}
                onChange={handleDateChange}
              />
            </div>
          </div>

          <HStack>
            {newOTSMachines.map((data: OTSMachine, index: number) => (
              <div className="machineCol" key={index}>
                {/* Machine filter & select question */}
                <div id="ots-machine">
                  <h2>Machine:</h2>
                  <input
                    className="form-control form-custom"
                    list="machineOptions"
                    id="machine-option"
                    placeholder="Type to search category..."
                    value={data?.machine?.toString()}
                    onChange={(e) => {
                      const updatedMachine = e.target.value;

                      setNewOTSMachines((prev) =>
                        prev.map((machineData, i) => {
                          if (i === index) {
                            return {
                              ...machineData,
                              machine: updatedMachine,
                            };
                          }
                          return machineData;
                        })
                      );
                    }}
                  />
                  <datalist id="machineOptions">
                    <option value="Machine 1" />
                    <option value="Machine 2" />
                    <option value="Machine 3" />
                    <option value="Machine 4" />
                    <option value="Machine 5" />
                  </datalist>
                </div>

                {/* Up/Down select question */}
                <div id="ots-up-down">
                  <h2>Machine Status:</h2>
                  <select
                    id="ots-up-down-select"
                    className="form-select form-select-lg mb-3 form-custom"
                    aria-label=".form-select-lg example"
                    value={data?.machineStatus?.toString()}
                    onChange={(e) => {
                      const updatedMachineStatus = e.target.value;

                      setNewOTSMachines((prev) =>
                        prev.map((machineData, i) => {
                          if (i === index) {
                            return {
                              ...machineData,
                              machineStatus: updatedMachineStatus,
                            };
                          }
                          return machineData;
                        })
                      );
                    }}
                  >
                    <option value={"up"}>Up</option>
                    <option value={"down"}>Down</option>
                  </select>
                </div>

                {/* Parts Made question */}
                <div id="ots-parts-produced">
                  <h2>Parts Made:</h2>
                  <div className="production">
                    <input
                      id="parts-made"
                      type="number"
                      className="form-control form-custom"
                      step="1"
                      value={
                        data?.partsMade !== undefined &&
                        data?.partsMade !== null
                          ? Number(data.partsMade)
                          : ""
                      }
                      onChange={(e) => {
                        const updatedPartsMade =
                          e.target.value === "" ? null : Number(e.target.value);

                        setNewOTSMachines((prev) =>
                          prev.map((machineData, i) => {
                            if (i === index) {
                              return {
                                ...machineData,
                                partsMade: updatedPartsMade,
                              };
                            }
                            return machineData;
                          })
                        );
                      }}
                    />
                  </div>
                </div>

                {/* Comments & submit button questions */}
                <div id="ots-comments-button">
                  <h2>Comments:</h2>
                  <textarea
                    id="comments"
                    className="form-control form-custom-2"
                    rows={3}
                    cols={50}
                    value={data?.comments?.toString()}
                    onChange={(e) => {
                      const updatedComments = e.target.value;

                      setNewOTSMachines((prev) =>
                        prev.map((machineData, i) => {
                          if (i === index) {
                            return {
                              ...machineData,
                              comments: updatedComments,
                            };
                          }
                          return machineData;
                        })
                      );
                    }}
                  ></textarea>
                </div>

                {/* Lot Number question */}
                <div id="ots-lot-number">
                  <h2>Lot Number:</h2>
                  <div className="lot-number">
                    <input
                      id="lot-number"
                      type="number"
                      className="form-control form-custom"
                      step="1"
                      value={data?.lotNumber || ""}
                      onChange={(e) => {
                        const updatedLotNumber =
                          e.target.value === "" ? null : Number(e.target.value);

                        setNewOTSMachines((prev) =>
                          prev.map((machineData, i) => {
                            if (i === index) {
                              return {
                                ...machineData,
                                lotNumber: updatedLotNumber,
                              };
                            }
                            return machineData;
                          })
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </HStack>
          <h3
            className="OTSReport-error"
            style={{ display: OTSReportError ? "block" : "none" }}
          >
            OTS report cannot be saved! Please check if date & shift number are
            correctly selected.
          </h3>
          <h3
            className="OTSMachines-error"
            style={{ display: OTSMachinesError ? "block" : "none" }}
          >
            Failed to approve! Ensure all form fields are entered correctly.
            Comments are optional.
          </h3>
          <h3
            className="success-user"
            style={{ display: successOTSReport ? "block" : "none" }}
          >
            OTS Report Successfully Created & Saved!
          </h3>
          <button
            type="submit"
            className="btn btn-lg btn-block btn-custom ots-submit"
            onClick={handleSubmitPress}
          >
            Submit Approval
          </button>
        </>
      ) : (
        <h1 style={{ marginTop: "20px" }}>
          Unauthorized user! Please login as supervisor to access this page.
        </h1>
      )}
    </main>
  );
};

export default OTSView;
