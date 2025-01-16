const createPDF = async (machineData: string[]) => {
  try {
    const response = await fetch("/pdf/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(machineData),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error calling pdf Monkey API:", error);
  }
};

export { createPDF };
