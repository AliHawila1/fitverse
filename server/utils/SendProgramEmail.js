import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const SendProgramEmail = async (userEmail, programName, sheetLink) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,       
        pass: process.env.EMAIL_PASS        
      },
      tls: {
        rejectUnauthorized: false       
      }
    });

    const mailOptions = {
      from: `"Fitverse Gym" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Your Fitness Program is Ready!",
      html: `
        <p>Thank you for choosing Fitverse Gym.</p>
        <p>Your fitness program, <b>${programName}</b>, is ready.</p>
        <p>Access your personalized workout plan and diet sheet here:</p>
        <p><a href="${sheetLink}" target="_blank">${sheetLink}</a></p>
        <p>Stay committed to your fitness journey!</p>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent to:", userEmail, "Response:", info.response);
    return info;
  } catch (error) {
    console.error("Email failed:", error);
    throw error; 
  }
};

SendProgramEmail(
  "alihawila95731@gmail.com",
  "Test Program",
  "https://docs.google.com/spreadsheets/d/1KpBiDymAkpn6jwZNaY0OR4TURDodVT6MIk6NPzaPPlA/edit?usp=sharing"
)
  .then(() => console.log("Test email sent successfully!"))
  .catch((err) => console.log("Test email failed:", err.message));
