import React, { useState } from "react";
import { HistoryData } from "../interfaces/HistoryData";
import { useMutation } from "@apollo/client";
import { GET_HISTORY, CREATE_PDF, GET_PDF } from "../utils/mutations";

const ShiftHistory = () => {
  const [historyParams, setHistoryParams] = useState<HistoryData | undefined>({
    startDate: null,
    endDate: null,
    selectedMachines: [],
    interval: null,
  });
  const filteredTable = document
    ?.querySelector("table")
    ?.querySelector("tbody"); //grabs the tbody tag from the table

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [filterText, setFilterText] = useState<string>("");

  const [isCheckboxVisible, setIsCheckboxVisible] = useState<boolean>(false);

  const [isAllChecked, setIsAllChecked] = useState<boolean>(false);
  const [isM1Checked, setIsM1Checked] = useState<boolean>(false);
  const [isM2Checked, setIsM2Checked] = useState<boolean>(false);
  const [isM3Checked, setIsM3Checked] = useState<boolean>(false);
  const [isM4Checked, setIsM4Checked] = useState<boolean>(false);
  const [isM5Checked, setIsM5Checked] = useState<boolean>(false);

  const [filterValue, setFilterValue] = useState<number>(0);
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const [isSubmitVisible, setIsSubmitVisible] = useState<boolean>(false);

  const [isDownloadVisible, setIsDownloadVisible] = useState<boolean>(false);
  const [isTableVisible, setIsTableVisible] = useState<boolean>(false);
  const [downloadURL, setDownloadURL] = useState<string>("");

  const isValidDateFormat = (date: string) => {
    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    return regex.test(date);
  };

  const [getHistory] = useMutation(GET_HISTORY);
  const [createPDF] = useMutation(CREATE_PDF);
  const [getPDF] = useMutation(GET_PDF);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    const parsedStartDate = e.target.value;
    setHistoryParams((prev) =>
      prev
        ? { ...prev, startDate: `${parsedStartDate}T00:00:00.000Z` }
        : undefined
    );
    if (isValidDateFormat(e.target.value) && isValidDateFormat(endDate)) {
      setIsCheckboxVisible(true);
    } else {
      setIsCheckboxVisible(false);
      setIsFilterVisible(false);
      setFilterValue(0);
      setIsSubmitVisible(false);
      setIsAllChecked(false);
      setIsM1Checked(false);
      setIsM2Checked(false);
      setIsM3Checked(false);
      setIsM4Checked(false);
      setIsM5Checked(false);
      setIsDownloadVisible(false);
      setIsTableVisible(false);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    const parsedEndDate = e.target.value;
    setHistoryParams((prev) =>
      prev ? { ...prev, endDate: `${parsedEndDate}T10:00:00.000Z` } : undefined
    );
    if (isValidDateFormat(startDate) && isValidDateFormat(e.target.value)) {
      setIsCheckboxVisible(true);
    } else {
      setIsCheckboxVisible(false);
      setIsFilterVisible(false);
      setFilterValue(0);
      setIsSubmitVisible(false);
      setIsAllChecked(false);
      setIsM1Checked(false);
      setIsM2Checked(false);
      setIsM3Checked(false);
      setIsM4Checked(false);
      setIsM5Checked(false);
      setIsDownloadVisible(false);
      setIsTableVisible(false);
    }
  };

  const handleAllChange = () => {
    if (isValidDateFormat(startDate) && isValidDateFormat(endDate)) {
      if (isAllChecked) {
        setIsAllChecked(false);
        setIsFilterVisible(false);
        setFilterValue(0);
        setIsSubmitVisible(false);
        setIsDownloadVisible(false);
        setIsTableVisible(false);
      } else {
        if (
          isM1Checked ||
          isM2Checked ||
          isM3Checked ||
          isM4Checked ||
          isM5Checked
        ) {
          setIsAllChecked(true);
          setIsFilterVisible(true);
          setIsM1Checked(false);
          setIsM2Checked(false);
          setIsM3Checked(false);
          setIsM4Checked(false);
          setIsM5Checked(false);
        } else {
          setIsAllChecked(true);
          setIsFilterVisible(true);
        }
      }
    } else {
      setIsAllChecked(false);
      setIsCheckboxVisible(false);
      setIsFilterVisible(false);
      setFilterValue(0);
      setIsSubmitVisible(false);
      setIsDownloadVisible(false);
      setIsTableVisible(false);
    }
  };

  const handleM1Change = () => {
    const newM1Checked = !isM1Checked;
    setIsM1Checked(newM1Checked);

    if (isValidDateFormat(startDate) && isValidDateFormat(endDate)) {
      if (!newM1Checked) {
        if (isM2Checked || isM3Checked || isM4Checked || isM5Checked) {
          setIsFilterVisible(true);
        } else {
          setIsFilterVisible(false);
          setFilterValue(0);
          setIsSubmitVisible(false);
          setIsDownloadVisible(false);
          setIsTableVisible(false);
        }
      } else {
        if (isM2Checked && isM3Checked && isM4Checked && isM5Checked) {
          setIsAllChecked(true);
          setIsM1Checked(false);
          setIsM2Checked(false);
          setIsM3Checked(false);
          setIsM4Checked(false);
          setIsM5Checked(false);
        } else {
          setIsAllChecked(false);
          setIsFilterVisible(true);
        }
      }
    } else {
      setIsM1Checked(false);
      setIsM2Checked(false);
      setIsM3Checked(false);
      setIsM4Checked(false);
      setIsM5Checked(false);
      setIsFilterVisible(false);
      setFilterValue(0);
      setIsSubmitVisible(false);
      setIsDownloadVisible(false);
      setIsTableVisible(false);
    }
  };

  const handleM2Change = () => {
    const newM2Checked = !isM2Checked;
    setIsM2Checked(newM2Checked);

    if (isValidDateFormat(startDate) && isValidDateFormat(endDate)) {
      if (!newM2Checked) {
        if (isM1Checked || isM3Checked || isM4Checked || isM5Checked) {
          setIsFilterVisible(true);
        } else {
          setIsFilterVisible(false);
          setFilterValue(0);
          setIsSubmitVisible(false);
          setIsDownloadVisible(false);
          setIsTableVisible(false);
        }
      } else {
        if (isM1Checked && isM3Checked && isM4Checked && isM5Checked) {
          setIsAllChecked(true);
          setIsM1Checked(false);
          setIsM2Checked(false);
          setIsM3Checked(false);
          setIsM4Checked(false);
          setIsM5Checked(false);
        } else {
          setIsAllChecked(false);
          setIsFilterVisible(true);
        }
      }
    } else {
      setIsM1Checked(false);
      setIsM2Checked(false);
      setIsM3Checked(false);
      setIsM4Checked(false);
      setIsM5Checked(false);
      setIsFilterVisible(false);
      setFilterValue(0);
      setIsSubmitVisible(false);
      setIsDownloadVisible(false);
      setIsTableVisible(false);
    }
  };

  const handleM3Change = () => {
    const newM3Checked = !isM3Checked;
    setIsM3Checked(newM3Checked);

    if (isValidDateFormat(startDate) && isValidDateFormat(endDate)) {
      if (!newM3Checked) {
        if (isM1Checked || isM2Checked || isM4Checked || isM5Checked) {
          setIsFilterVisible(true);
        } else {
          setIsFilterVisible(false);
          setFilterValue(0);
          setIsSubmitVisible(false);
          setIsDownloadVisible(false);
          setIsTableVisible(false);
        }
      } else {
        if (isM1Checked && isM2Checked && isM4Checked && isM5Checked) {
          setIsAllChecked(true);
          setIsM1Checked(false);
          setIsM2Checked(false);
          setIsM3Checked(false);
          setIsM4Checked(false);
          setIsM5Checked(false);
        } else {
          setIsAllChecked(false);
          setIsFilterVisible(true);
        }
      }
    } else {
      setIsM1Checked(false);
      setIsM2Checked(false);
      setIsM3Checked(false);
      setIsM4Checked(false);
      setIsM5Checked(false);
      setIsFilterVisible(false);
      setFilterValue(0);
      setIsSubmitVisible(false);
      setIsDownloadVisible(false);
      setIsTableVisible(false);
    }
  };

  const handleM4Change = () => {
    const newM4Checked = !isM4Checked;
    setIsM4Checked(newM4Checked);

    if (isValidDateFormat(startDate) && isValidDateFormat(endDate)) {
      if (!newM4Checked) {
        if (isM1Checked || isM2Checked || isM3Checked || isM5Checked) {
          setIsFilterVisible(true);
        } else {
          setIsFilterVisible(false);
          setFilterValue(0);
          setIsSubmitVisible(false);
          setIsDownloadVisible(false);
          setIsTableVisible(false);
        }
      } else {
        if (isM1Checked && isM2Checked && isM3Checked && isM5Checked) {
          setIsAllChecked(true);
          setIsM1Checked(false);
          setIsM2Checked(false);
          setIsM3Checked(false);
          setIsM4Checked(false);
          setIsM5Checked(false);
        } else {
          setIsAllChecked(false);
          setIsFilterVisible(true);
        }
      }
    } else {
      setIsM1Checked(false);
      setIsM2Checked(false);
      setIsM3Checked(false);
      setIsM4Checked(false);
      setIsM5Checked(false);
      setIsFilterVisible(false);
      setFilterValue(0);
      setIsSubmitVisible(false);
      setIsDownloadVisible(false);
      setIsTableVisible(false);
    }
  };

  const handleM5Change = () => {
    const newM5Checked = !isM5Checked;
    setIsM5Checked(newM5Checked);

    if (isValidDateFormat(startDate) && isValidDateFormat(endDate)) {
      if (!newM5Checked) {
        if (isM1Checked || isM2Checked || isM3Checked || isM4Checked) {
          setIsFilterVisible(true);
        } else {
          setIsFilterVisible(false);
          setFilterValue(0);
          setIsSubmitVisible(false);
          setIsDownloadVisible(false);
          setIsTableVisible(false);
        }
      } else {
        if (isM1Checked && isM2Checked && isM3Checked && isM4Checked) {
          setIsAllChecked(true);
          setIsM1Checked(false);
          setIsM2Checked(false);
          setIsM3Checked(false);
          setIsM4Checked(false);
          setIsM5Checked(false);
        } else {
          setIsAllChecked(false);
          setIsFilterVisible(true);
        }
      }
    } else {
      setIsM1Checked(false);
      setIsM2Checked(false);
      setIsM3Checked(false);
      setIsM4Checked(false);
      setIsM5Checked(false);
      setIsFilterVisible(false);
      setFilterValue(0);
      setIsSubmitVisible(false);
      setIsDownloadVisible(false);
      setIsTableVisible(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFilter = Number(e.target.value);
    setFilterValue(selectedFilter);
    setHistoryParams((prev) =>
      prev ? { ...prev, interval: selectedFilter } : undefined
    );
    if (selectedFilter !== 0) {
      setIsSubmitVisible(true);
    } else {
      setIsSubmitVisible(false);
      setIsDownloadVisible(false);
      setIsTableVisible(false);
    }
  };

  const processReportsDaily = (reports: any) => {
    const result: any[] = [];

    reports.forEach((report: any) => {
      const dateStr = new Date(report.date).toISOString().split("T")[0];

      let dateGroup = result.find((item) => item.date === dateStr);

      if (!dateGroup) {
        dateGroup = { date: dateStr, machines: [] };
        result.push(dateGroup);
      }

      report.savedMachines.forEach((machineData: any) => {
        const { machine, partsMade } = machineData;

        let machineRecord = dateGroup.machines.find(
          (m: any) => m.machine === machine
        );

        if (machineRecord) {
          machineRecord.partsMade += partsMade;
        } else {
          dateGroup.machines.push({ machine, partsMade });
        }
      });
    });

    return result;
  };

  const getWeekNumber = (date: Date) => {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor(
      (date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
    );
    return Math.floor(days / 7) + 1;
  };

  const processReportsWeekly = (reports: any) => {
    const result: any[] = [];

    const firstReportDate = new Date(reports[0].date);
    const firstWeekNumber = getWeekNumber(firstReportDate);

    reports.forEach((report: any) => {
      const date = new Date(report.date);
      const weekNumber = getWeekNumber(date);
      const weekStr = `Week ${weekNumber - firstWeekNumber + 1}`;

      let weekGroup = result.find((item) => item.week === weekStr);

      if (!weekGroup) {
        weekGroup = { week: weekStr, machines: [] };
        result.push(weekGroup);
      }

      report.savedMachines.forEach((machineData: any) => {
        const { machine, partsMade } = machineData;

        let machineRecord = weekGroup.machines.find(
          (m: any) => m.machine === machine
        );

        if (machineRecord) {
          machineRecord.partsMade += partsMade;
        } else {
          weekGroup.machines.push({ machine, partsMade });
        }
      });
    });

    return result;
  };

  const processReportsMonthly = (reports: any) => {
    const result: any[] = [];

    reports.forEach((report: any) => {
      const date = new Date(report.date);
      const yearMonthStr = `${date.getFullYear()} ${date.toLocaleString(
        "default",
        { month: "short" }
      )}`;

      let monthGroup = result.find((item) => item.month === yearMonthStr);

      if (!monthGroup) {
        monthGroup = { month: yearMonthStr, machines: [] };
        result.push(monthGroup);
      }

      report.savedMachines.forEach((machineData: any) => {
        const { machine, partsMade } = machineData;

        let machineRecord = monthGroup.machines.find(
          (m: any) => m.machine === machine
        );

        if (machineRecord) {
          machineRecord.partsMade += partsMade;
        } else {
          monthGroup.machines.push({ machine, partsMade });
        }
      });
    });

    return result;
  };

  const handleSubmitPress = async () => {
    // Build the selectedMachines array locally
    let updatedSelectedMachines: string[] = [];
    let pdfURL: string | null = null;
    let pdfId: string = "";
    setDownloadURL("");
    setIsTableVisible(false);
    if (filteredTable) {
      filteredTable.innerHTML = "";
    }
    if (isAllChecked) {
      updatedSelectedMachines = [
        "Machine 1",
        "Machine 2",
        "Machine 3",
        "Machine 4",
        "Machine 5",
      ];
    } else {
      if (isM1Checked) updatedSelectedMachines.push("Machine 1");
      if (isM2Checked) updatedSelectedMachines.push("Machine 2");
      if (isM3Checked) updatedSelectedMachines.push("Machine 3");
      if (isM4Checked) updatedSelectedMachines.push("Machine 4");
      if (isM5Checked) updatedSelectedMachines.push("Machine 5");
    }

    // Handle undefined for startDate and endDate
    const startDate = historyParams?.startDate ?? null;
    const endDate = historyParams?.endDate ?? null;
    const interval = historyParams?.interval ?? null;

    // Update state with the finalized selectedMachines and handle null values for dates
    const updatedParams = {
      selectedMachines: updatedSelectedMachines,
      startDate: startDate,
      endDate: endDate,
      interval: interval,
    };

    setHistoryParams(updatedParams); // Update state synchronously

    // Use the updatedParams directly for the API call
    const { data: historyData } = await getHistory({
      variables: { history: updatedParams },
    });

    setIsDownloadVisible(true);
    if (historyData.getHistory) {
      if (updatedParams.interval === 1) {
        //aggregate daily data
        const dailyReport = processReportsDaily(historyData.getHistory);
        setFilterText("Date");
        for (let i = 0; i < dailyReport.length; i++) {
          for (let j = 0; j < dailyReport[i].machines.length; j++) {
            const tr = document.createElement("tr");
            const td1 = document.createElement("td");
            const td2 = document.createElement("td");
            const td3 = document.createElement("td");
            td1.textContent = dailyReport[i].date;
            td2.textContent = dailyReport[i].machines[j].machine;
            td3.textContent = dailyReport[i].machines[j].partsMade;
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            filteredTable?.appendChild(tr);
          }
        }
        const { data: pdfData } = await createPDF({
          variables: { create: dailyReport },
        });

        if (pdfData.createPDF) {
          pdfId = pdfData.createPDF;
          setIsTableVisible(true);
        }
      } else if (updatedParams.interval === 2) {
        //aggregate weekly data
        const weeklyReport = processReportsWeekly(historyData.getHistory);
        setFilterText("Week");
        for (let i = 0; i < weeklyReport.length; i++) {
          for (let j = 0; j < weeklyReport[i].machines.length; j++) {
            const tr = document.createElement("tr");
            const td1 = document.createElement("td");
            const td2 = document.createElement("td");
            const td3 = document.createElement("td");
            td1.textContent = weeklyReport[i].week;
            td2.textContent = weeklyReport[i].machines[j].machine;
            td3.textContent = weeklyReport[i].machines[j].partsMade;
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            filteredTable?.appendChild(tr);
          }
        }
        const { data: pdfData } = await createPDF({
          variables: { create: weeklyReport },
        });

        if (pdfData.createPDF) {
          pdfId = pdfData.createPDF;
          setIsTableVisible(true);
        }
      } else if (updatedParams.interval === 3) {
        //aggregate monthly data
        const monthlyReport = processReportsMonthly(historyData.getHistory);
        setFilterText("Month");
        for (let i = 0; i < monthlyReport.length; i++) {
          for (let j = 0; j < monthlyReport[i].machines.length; j++) {
            const tr = document.createElement("tr");
            const td1 = document.createElement("td");
            const td2 = document.createElement("td");
            const td3 = document.createElement("td");
            td1.textContent = monthlyReport[i].month;
            td2.textContent = monthlyReport[i].machines[j].machine;
            td3.textContent = monthlyReport[i].machines[j].partsMade;
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            filteredTable?.appendChild(tr);
          }
        }
        const { data: pdfData } = await createPDF({
          variables: { create: monthlyReport },
        });

        if (pdfData.createPDF) {
          pdfId = pdfData.createPDF;
          setIsTableVisible(true);
        }
      }
    }

    pdfURL = await pollPDFReady(pdfId);
    if (pdfURL) {
      setDownloadURL(pdfURL);
    }
  };

  const pollPDFReady = async (pdfId: string): Promise<string | null> => {
    const maxRetries = 10;
    const retryDelay = 3000; // 3 seconds between retries

    await new Promise((resolve) => setTimeout(resolve, retryDelay)); // Wait before starting to check
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const { data } = await getPDF({
        variables: { docId: pdfId },
      });

      if (data.getPDF) {
        return data.getPDF; // Exit if PDF is ready
      }

      await new Promise((resolve) => setTimeout(resolve, retryDelay)); // Wait before retrying
    }

    console.error("PDF generation failed after maximum retries.");
    return null;
  };

  const handlePdfDownload = async () => {
    //download pdf link
    if (downloadURL) {
      window.open(downloadURL, "_blank"); // Open PDF in a new tab
    }
  };

  return (
    <>
      <main className="flex-shrink-0">
        <div className="datepicker">
          <div className="row justify-content-center">
            <div className="col-lg-3 col-sm-6">
              <label htmlFor="startDate">From</label>
              <input
                id="startDate"
                className="form-control"
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
              />
              {/* <span id="startDateSelected">{startDate}</span> */}
            </div>
            <div className="col-lg-3 col-sm-6">
              <label htmlFor="endDate">To</label>
              <input
                id="endDate"
                className="form-control"
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
              />
              {/* <span id="endDateSelected">{endDate}</span> */}
            </div>
          </div>
        </div>
        {/* Filter by machine checkbox question */}
        <div
          className="filter-checkbox"
          style={{ display: isCheckboxVisible ? "block" : "none" }}
        >
          <h2>Filter by machine:</h2>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="inlineCheckbox1"
              value="all"
              checked={isAllChecked}
              onChange={handleAllChange}
            />
            <label className="form-check-label" htmlFor="inlineCheckbox1">
              ALL
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="inlineCheckbox2"
              value="Machine 1"
              checked={isM1Checked}
              onChange={handleM1Change}
            />
            <label className="form-check-label" htmlFor="inlineCheckbox2">
              Machine 1
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="inlineCheckbox3"
              value="Machine 2"
              checked={isM2Checked}
              onChange={handleM2Change}
            />
            <label className="form-check-label" htmlFor="inlineCheckbox3">
              Machine 2
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="inlineCheckbox4"
              value="Machine 3"
              checked={isM3Checked}
              onChange={handleM3Change}
            />
            <label className="form-check-label" htmlFor="inlineCheckbox4">
              Machine 3
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="inlineCheckbox5"
              value="Machine 4"
              checked={isM4Checked}
              onChange={handleM4Change}
            />
            <label className="form-check-label" htmlFor="inlineCheckbox5">
              Machine 4
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="inlineCheckbox6"
              value="Machine 5"
              checked={isM5Checked}
              onChange={handleM5Change}
            />
            <label className="form-check-label" htmlFor="inlineCheckbox6">
              Machine 5
            </label>
          </div>
        </div>
        {/* Filter by daily, weekly, or monthly select question  */}
        <div
          className="filter-by"
          style={{ display: isFilterVisible ? "block" : "none" }}
        >
          <h2>Filter by daily, weekly, or monthly:</h2>
          <select
            id="filter-select"
            className="form-select form-select-lg mb-3 form-custom"
            aria-label=".form-select-lg example"
            value={filterValue}
            onChange={handleFilterChange}
          >
            <option value={0} disabled className="select-placeholder">
              Select option
            </option>
            <option value={1}>Daily</option>
            <option value={2}>Weekly</option>
            <option value={3}>Monthly</option>
          </select>
        </div>
        {/* Submit button  */}
        <button
          type="submit"
          className="btn btn-lg btn-block btn-custom"
          style={{ display: isSubmitVisible ? "block" : "none" }}
          onClick={handleSubmitPress}
        >
          View Table
        </button>
        <div className="table-section">
          {/* PDF download link  */}
          {downloadURL ? (
            <a href="#" onClick={handlePdfDownload}>
              Download Filtered History
            </a>
          ) : (
            <p
              className="wait-text"
              style={{ display: isDownloadVisible ? "inline" : "none" }}
            >
              Generating PDF ...
            </p>
          )}
          {/* Filtered table  */}
          <table
            className="table-custom"
            style={{ display: isTableVisible ? "block" : "none" }}
          >
            <thead>
              <tr>
                <td>{filterText}</td>
                <td>Machine</td>
                <td>Parts Produced</td>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default ShiftHistory;
