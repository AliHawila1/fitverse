import { SendProgramEmail } from "../utils/SendProgramEmail.js";

export const createOrder = async (req, res) => {
  const { userEmail, programName } = req.body;
  const sheetLink = "https://docs.google.com/spreadsheets/d/1KpBiDymAkpn6jwZNaY0OR4TURDodVT6MIk6NPzaPPlA/edit?usp=sharing";

  try {
    await SendProgramEmail(userEmail, programName, sheetLink);
    res.json({
      message: "Order created and email sent successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create order and send email",
      error: error.message
    });
  }
};
