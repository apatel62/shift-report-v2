const getPDF = async (id: string) => {
  try {
    const response = await fetch("/pdf/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error calling pdf Monkey API:", error);
  }
};

export { getPDF };
