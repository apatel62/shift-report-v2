// import { useQuery } from "@apollo/client";
// import { GET_ALL_REPORTS } from "@/utils/queries";
import { Machine } from "../models/Machine";
import { OTSMachine } from "@/models/OTSMachine";
import { OTSReport } from "@/models/OTSReport";
import auth from "../utils/auth";
import { useState, useEffect } from "react";
import { HStack } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

interface OTSViewProps {
  _id: string;
  shiftNumber: string;
  date: Date | null;
  assignedUserId: string;
  savedMachines: Machine[];
}

const OTSView = () => {
  const [newOTSReport, setNewOTSReport] = useState<OTSReport | undefined>({
    shiftNumber: "",
    date: null,
    assignedUserId: null,
    machines: [],
  });
  const location = useLocation();
  const { shiftNumber, date, savedMachines } = location.state as OTSViewProps;

  const [newOTSMachines, setNewOTSMachines] = useState<OTSMachine[]>([]);

  const [loginCheck, setLoginCheck] = useState(false);
  const checkLogin = () => {
    const isLoggedIn = auth.loggedIn();
    if (isLoggedIn) {
      setLoginCheck(true);
    }
  };

  const handleShiftChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedShift = Number(event.target.value);
    setNewOTSReport((prev) =>
      prev
        ? {
            ...prev,
            shiftNumber: selectedShift.toString(),
            assignedUserId: localStorage.getItem("userId") as string,
          }
        : undefined
    );
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDate = e.target.value;
    let time = "06:00:00.000Z";
    if (newOTSReport?.shiftNumber === "2") {
      time = "07:00:00.000Z";
    }
    const finalformattedDate = new Date(`${rawDate}T${time}`);
    setNewOTSReport((prev) =>
      prev ? { ...prev, date: finalformattedDate } : undefined
    );
  };

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

  const handleSubmitPress = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setNewOTSReport((prev) =>
      prev
        ? {
            ...prev,
            assignedUserId: localStorage.getItem("userId"),
            machines: newOTSMachines,
          }
        : undefined
    );
    console.log(newOTSReport);
  };

  return (
    <main className="flex-shrink-0">
      {loginCheck && auth.getRole() === "supervisor" ? (
        <>
          {/* Shift select question */}
          <div>
            <h2>Shift Number:</h2>
            <select
              id="shift-option"
              className="form-select form-select-lg mb-3 form-custom"
              aria-label=".form-select-lg example"
              value={shiftNumber?.toString()}
              onChange={handleShiftChange}
            >
              <option value={1}>Shift 1</option>
              <option value={2}>Shift 2</option>
            </select>

            <div className="datepicker">
              <div className="row justify-content-center">
                <div className="col-lg-3 col-sm-6">
                  <label htmlFor="startDate">From</label>
                  <input
                    id="ots-date"
                    className="form-control"
                    type="date"
                    value={date?.toString()}
                    onChange={handleDateChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <HStack>
            {savedMachines.map((data: Machine, index: number) => (
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
                  <h2>Machine Status</h2>
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
                    <option value={"UP"}>Up</option>
                    <option value={"DOWN"}>Down</option>
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
                      value={Number(data?.partsMade)}
                      onChange={(e) => {
                        const updatedPartsMade = Number(e.target.value);

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
                      onChange={(e) => {
                        const updatedLotNumber = Number(e.target.value);

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
          <button
            type="submit"
            className="btn btn-lg btn-block btn-custom"
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
