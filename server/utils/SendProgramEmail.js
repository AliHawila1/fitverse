import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const SendProgramEmail = async (userEmail, programName, sheetLink) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"FitVerse Gym" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Your Fitness Program is Ready!",
    html: `
      <p>Thank you for choosing FitVerse Gym.</p>
      <p>Your fitness program, <b>${programName}</b>, is ready.</p>
      <p>Access your plan here:</p>
      <p><a href="${sheetLink}" target="_blank">${sheetLink}</a></p>
      <p>Stay committed to your fitness journey!</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};
