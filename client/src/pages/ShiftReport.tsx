import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";

import { useOutletContext } from "react-router-dom";
import auth from "../utils/auth";
import type { User } from "../models/User";
import { Report } from "../models/Report";
import { Machine } from "../models/Machine";
import { useMutation } from "@apollo/client";
import {
  LOGIN_USER,
  CREATE_REPORT,
  SAVE_MACHINE,
  SEND_EMAIL,
} from "../utils/mutations";

interface ModalContextType {
  showSuccessModal: boolean;
  showEmailModal: boolean;
  setShowSuccessModal: (value: boolean) => void;
  setShowEmailModal: (value: boolean) => void;
  isUpChecked: boolean;
  isDownChecked: boolean;
  isUpDownVisible: boolean;
  isPartsVisible: boolean;
  isComButVisible: boolean;
  setIsUpChecked: (value: boolean) => void;
  setIsDownChecked: (value: boolean) => void;
  setIsUpDownVisible: (value: boolean) => void;
  setIsPartsVisible: (value: boolean) => void;
  setIsComButVisible: (value: boolean) => void;
  machineValue: string;
  setMachineValue: (value: string) => void;
  comments: string;
  setComments: (value: string) => void;
  shiftLocked: boolean;
  setShiftLocked: (value: boolean) => void;
  sendEmail: boolean;
  setSendEmail: (value: boolean) => void;
}

const ShiftReport = () => {
  const [newReport, setNewReport] = useState<Report | undefined>({
    shiftNumber: "",
    date: null,
    assignedUserId: null,
  });

  const [createReport] = useMutation(CREATE_REPORT);

  const [newMachine, setNewMachine] = useState<Machine | undefined>({
    machine: "",
    machineStatus: "",
    partsMade: null,
    comments: null,
  });

  const [saveMachine] = useMutation(SAVE_MACHINE);

  const [shiftValue, setShiftValue] = useState<number>(0);
  const [partsMade, setPartsMade] = useState("");

  const [isMachineVisible, setIsMachineVisible] = useState<boolean>(false);

  const {
    isUpChecked,
    isDownChecked,
    isUpDownVisible,
    isPartsVisible,
    isComButVisible,
    setIsUpChecked,
    setIsDownChecked,
    setIsUpDownVisible,
    setIsPartsVisible,
    setIsComButVisible,
    setShowSuccessModal,
    machineValue,
    setMachineValue,
    comments,
    setComments,
    shiftLocked,
    sendEmail,
    setSendEmail,
  } = useOutletContext<ModalContextType>();

  const [loginCheck, setLoginCheck] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loginUser] = useMutation(LOGIN_USER);

  const checkLogin = () => {
    const isLoggedIn = auth.loggedIn();
    if (isLoggedIn) {
      setLoginCheck(true);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const [sendGrid] = useMutation(SEND_EMAIL);
  const sendGridEmail = async () => {
    try {
      const reportId = localStorage.getItem("reportId");
      if (reportId) {
        const { data } = await sendGrid({
          variables: { reportId },
        });
        if (data.sendEmail._id) {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Error calling send-email request:", error);
    }
  };

  useEffect(() => {
    if (sendEmail === true) {
      sendGridEmail();
      setSendEmail(false);
    }
  }, [sendEmail]);

  const [loginData, setLoginData] = useState<User>({
    username: "",
    password: "",
  });

  const handleLoginChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setLoginError(false);
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const username = loginData.username;
      const password = loginData.password;
      const { data } = await loginUser({
        variables: { username, password },
      });
      if (data.login.token) {
        auth.login(data.login.token);
      } else {
        setLoginError(true);
      }
    } catch (err) {
      console.error("Failed to login", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLoginSubmit(e);
    }
  };

  const handleShiftChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedShift = Number(event.target.value);
    setShiftValue(selectedShift);
    setNewReport((prev) =>
      prev ? { ...prev, shiftNumber: selectedShift.toString() } : undefined
    );

    setNewMachine({
      machine: "",
      machineStatus: "",
      partsMade: null,
      comments: null,
    });
    
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const hour = currentDate.getHours();
    let time = "06:00:00.000Z";
    if (hour >= 16) {
      time = "07:00:00.000Z";
    }
    const finalformattedDate = `${year}-${month}-${day}T${time}`;
    setNewReport((prev) =>
      prev
        ? {
            ...prev,
            assignedUserId: localStorage.getItem("userId") as string,
            date: new Date(finalformattedDate),
          }
        : undefined
    );
    if (selectedShift !== 0) {
      setIsMachineVisible(true);
    } else {
      setIsMachineVisible(false);
    }
  };

  const handleMachineChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    const validMachineOptions = [
      "Machine 1",
      "Machine 2",
      "Machine 3",
      "Machine 4",
      "Machine 5",
    ];

    setNewMachine((prev) => (prev ? { ...prev, machine: value } : undefined));

    const isValidMachine = validMachineOptions.includes(value);
    setMachineValue(value);

    if (value !== "" && isValidMachine) {
      setIsUpDownVisible(true);
    } else {
      setIsUpDownVisible(false);
      setIsUpChecked(false);
      setIsDownChecked(false);
      setIsPartsVisible(false);
      setPartsMade("");
      setIsComButVisible(false);
    }
  };

  const handleUpChange = () => {
    if (machineValue !== "") {
      setIsUpChecked(true);
      setIsDownChecked(false);
      setIsPartsVisible(true);
    } else {
      setIsUpChecked(false);
      setIsPartsVisible(false);
    }
  };

  const handleDownChange = () => {
    if (machineValue !== "") {
      setIsUpChecked(false);
      setIsDownChecked(true);
      setIsPartsVisible(true);
    } else {
      setIsDownChecked(false);
      setIsPartsVisible(false);
    }
  };

  useEffect(() => {
    if (!isUpChecked && !isDownChecked && machineValue !== "") {
      setPartsMade("");
      setIsComButVisible(false);
    }
    if (isUpChecked) {
      setNewMachine((prev) =>
        prev ? { ...prev, machineStatus: "UP" } : undefined
      );
    } else {
      setNewMachine((prev) =>
        prev ? { ...prev, machineStatus: "DOWN" } : undefined
      );
    }
  }, [isUpChecked, isDownChecked, machineValue]);

  const handlePartsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //const value = Number(event.target.value);
    setPartsMade(event.target.value);
    if (event.target.value === "") {
      setIsComButVisible(false);
    } else {
      setIsComButVisible(true);
    }
    setNewMachine((prev) =>
      prev
        ? { ...prev, partsMade: Number.parseInt(event.target.value) }
        : undefined
    );
  };

  const handleCommentsChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setComments(event.target.value);
    setNewMachine((prev) =>
      prev ? { ...prev, comments: event.target.value } : undefined
    );
  };

  const handleSubmitPress = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    //grabs reportId from localStorage if there
    const reportMade = localStorage.getItem("reportId");

    if (!reportMade) {
      //creates a new report only if reportId not in localStorage
      const { data: reportData } = await createReport({
        variables: { report: newReport },
      });
      if (reportData.createReport) {
        localStorage.setItem("reportId", reportData.createReport._id); //saves new report's id to localStorage
      }
    }

    //saves machine to recently created report
    const { data: machineData } = await saveMachine({
      variables: { machine: newMachine },
    });

    if (machineData.saveMachine) {
      setShowSuccessModal(true);
    }
  };

  return (
    <>
      {/* Main content where the form questions are presented */}
      <main className="flex-shrink-0">
        {!loginCheck ? (
          <div className="login-notice">
            <form className="login-form" onSubmit={handleLoginSubmit}>
              <h4>Username</h4>
              <input
                type="text"
                name="username"
                className="form-control form-custom-1"
                value={loginData.username || ""}
                onKeyDown={handleKeyDown}
                onChange={handleLoginChange}
              />
              <h4>Password</h4>
              <input
                type="password"
                name="password"
                className="form-control form-custom-1"
                value={loginData.password || ""}
                onKeyDown={handleKeyDown}
                onChange={handleLoginChange}
              />
            </form>
            <h3
              className="login-error"
              style={{ display: loginError ? "block" : "none" }}
            >
              Invalid username and/or password!
            </h3>
            <button
              type="submit"
              className="btn  btn-lg btn-block btn-custom-1"
              onClick={handleLoginSubmit}
            >
              Login
            </button>
          </div>
        ) : (
          <div>
            <h2 className="shift-title">Shift:</h2>
            {/* Shift select question */}
            <select
              id="shift-option"
              className="form-select form-select-lg mb-3 form-custom"
              aria-label=".form-select-lg example"
              value={shiftValue}
              onChange={handleShiftChange}
              disabled={shiftLocked}
            >
              <option value={0} disabled className="select-placeholder">
                Select shift
              </option>
              <option value={1}>Shift 1</option>
              <option value={2}>Shift 2</option>
            </select>

            {/* Machine filter & select question */}
            <div
              className="machine"
              style={{ display: isMachineVisible ? "block" : "none" }}
            >
              <h2>Machine:</h2>
              <input
                className="form-control form-custom"
                list="machineOptions"
                id="machine-option"
                placeholder="Type to search category..."
                value={machineValue}
                onChange={handleMachineChange}
              />
              <datalist id="machineOptions">
                <option value="Machine 1" />
                <option value="Machine 2" />
                <option value="Machine 3" />
                <option value="Machine 4" />
                <option value="Machine 5" />
              </datalist>
            </div>

            {/* Up Down checkbox question */}
            <div
              className="up-down"
              style={{ display: isUpDownVisible ? "block" : "none" }}
            >
              <h2>Up or Down:</h2>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="inlineRadio1"
                  value="up"
                  checked={isUpChecked}
                  onChange={handleUpChange}
                />
                <label className="form-check-label" htmlFor="inlineRadio1">
                  Up
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="inlineRadio2"
                  value="down"
                  checked={isDownChecked}
                  onChange={handleDownChange}
                />
                <label className="form-check-label" htmlFor="inlineRadio2">
                  Down
                </label>
              </div>
            </div>

            {/* Parts Made question */}
            {isPartsVisible && (
              <div className="parts-produced">
                <h2>Parts Made:</h2>
                <div className="production">
                  <input
                    id="parts-made"
                    type="number"
                    className="form-control form-custom"
                    step="1"
                    value={partsMade}
                    onChange={handlePartsChange}
                  />
                </div>
              </div>
            )}

            {/* Comments & submit button questions */}
            <div
              className="comments-button"
              style={{ display: isComButVisible ? "block" : "none" }}
            >
              <h2>Comments:</h2>
              <textarea
                id="comments"
                className="form-control form-custom-2"
                rows={3}
                cols={50}
                placeholder="Any additional comments..."
                value={comments}
                onChange={handleCommentsChange}
              ></textarea>
              <button
                type="submit"
                className="btn btn-lg btn-block btn-custom"
                onClick={handleSubmitPress}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default ShiftReport;
