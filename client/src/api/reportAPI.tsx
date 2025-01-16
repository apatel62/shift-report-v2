import { ReportData } from "../interfaces/ReportData";
import { ApiMessage } from "../interfaces/ApiMessage";
import Auth from "../utils/auth";

const retrieveReports = async () => {
  try {
    const response = await fetch("/api/reports/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Auth.getToken()}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error("invalid API response, check network tab!");
    }

    return data;
  } catch (err) {
    console.log("Error from data retrieval: ", err);
    return [];
  }
};

const retrieveReport = async (id: number | null): Promise<ReportData> => {
  try {
    const response = await fetch(`/api/reports/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Auth.getToken()}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Could not invalid API response, check network tab!");
    }
    return data;
  } catch (err) {
    console.log("Error from data retrieval: ", err);
    return Promise.reject("Could not fetch singular report");
  }
};

const createReport = async (body: ReportData) => {
  try {
    const response = await fetch("/api/reports/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Auth.getToken()}`,
      },
      body: JSON.stringify(body),
    });
    const data = response.json();
    if (!response.ok) {
      throw new Error("invalid API response, check network tab!");
    }

    return data;
  } catch (err) {
    console.log("Error from Report Creation: ", err);
    return Promise.reject("Could not create report");
  }
};

const updateReport = async (
  reportId: number,
  body: ReportData
): Promise<ReportData> => {
  try {
    const response = await fetch(`/api/reports/${reportId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Auth.getToken()}`,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error("invalid API response, check network tab!");
    }

    return data;
  } catch (err) {
    console.error("Update did not work", err);
    return Promise.reject("Update did not work");
  }
};

const deleteReport = async (reportId: number): Promise<ApiMessage> => {
  try {
    const response = await fetch(`/api/reports/${reportId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Auth.getToken()}`,
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error("invalid API response, check network tab!");
    }

    return data;
  } catch (err) {
    console.error("Error in deleting report", err);
    return Promise.reject("Could not delete report");
  }
};

export {
  createReport,
  deleteReport,
  retrieveReports,
  retrieveReport,
  updateReport,
};
