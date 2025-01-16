import { HistoryData } from "../interfaces/HistoryData";

const postHistory = async (historyInfo: HistoryData) => {
  try {
    const response = await fetch("/history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(historyInfo),
    });

    const result = await response.json();
    if (result) {
      return result;
    } else {
      console.error("Failed to retrieve history", result);
    }
  } catch (error) {
    console.error("Error calling history API:", error);
  }
};

export { postHistory };
