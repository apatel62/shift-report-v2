import { MachineData } from "../interfaces/MachineData";
import { ApiMessage } from "../interfaces/ApiMessage";
import Auth from "../utils/auth";

const retrieveMachines = async () => {
  try {
    const response = await fetch("/api/machines/", {
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

const retrieveMachine = async (id: number | null): Promise<MachineData> => {
  try {
    const response = await fetch(`/api/machines/${id}`, {
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
    return Promise.reject("Could not fetch singular machine");
  }
};

const createMachine = async (body: MachineData) => {
  try {
    const response = await fetch("/api/machines/", {
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
    console.log("Error from Machine Creation: ", err);
    return Promise.reject("Could not create machine");
  }
};

const updateMachine = async (
  machineId: number,
  body: MachineData
): Promise<MachineData> => {
  try {
    const response = await fetch(`/api/machines/${machineId}`, {
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

const deleteMachine = async (machineId: number): Promise<ApiMessage> => {
  try {
    const response = await fetch(`/api/machines/${machineId}`, {
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
    console.error("Error in deleting machine", err);
    return Promise.reject("Could not delete machine");
  }
};

export {
  createMachine,
  deleteMachine,
  retrieveMachines,
  retrieveMachine,
  updateMachine,
};
