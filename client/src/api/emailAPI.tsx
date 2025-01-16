import { useMutation } from "@apollo/client";
import { SEND_EMAIL } from "../utils/mutations";

const [sendEmail] = useMutation(SEND_EMAIL);

const sendGridEmail = async () => {
  try {
    const reportId = localStorage.getItem("reportId");
    if (reportId) {
      const { data } = await sendEmail({
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

export { sendGridEmail };
