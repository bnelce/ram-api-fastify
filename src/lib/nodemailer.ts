import dotenv from "dotenv";
import nodemailer, { Transporter } from "nodemailer";

dotenv.config();

// Interface para o payload do email
interface EmailPayload {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// Função para criar o transporter do Nodemailer
const createTransporter = (): Transporter => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "465", 10),
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Função para enviar email
export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}: EmailPayload): Promise<{
  success: boolean;
  message: string;
  info?: any;
  error?: any;
}> => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, message: "Email enviado com sucesso!", info };
  } catch (error) {
    return { success: false, message: "Erro ao enviar email", error };
  }
};
