import ejs from "ejs";
import path from "path";

import config from "@/config";
import { transporter } from "@/lib/nodemailer";
import { logger } from "@/lib/winston";

interface ISendInvoiceEmail {
  email: string;
  patientName: string;
  doctorName: string;
  scheduleDate: string;
  slotStart: string;
  slotEnd: string;
  serialNumber: number;
  invoiceNumber: string;
  amount: string;
  currency: string;
  pdf: Buffer;
}

const sendInvoiceEmail = async (data: ISendInvoiceEmail) => {
  const templatePath = path.join(
    process.cwd(),
    "src/templates/invoice-email.ejs"
  );

  const html = await ejs.renderFile(templatePath, {
    ...data,
    supportEmail: config.email_sender,
    year: new Date().getFullYear(),
  });

  await transporter.sendMail({
    from: config.email_sender,
    to: data.email,
    subject: `Payment Confirmed - HealthNest Invoice ${data.invoiceNumber}`,
    html,
    attachments: [
      {
        filename: `${data.invoiceNumber}.pdf`,
        content: data.pdf,
        contentType: "application/pdf",
      },
    ],
  });
};

export interface ISendPrescriptionEmailPayload {
  to: string;
  patientName: string;
  doctorName: string;
  prescriptionId: string;
  appointmentId: string;
  date: string;
  pdfBuffer: Buffer;
}

/**
 * Send prescription PDF via email to the patient
 */
export const sendPrescriptionEmail = async (
  payload: ISendPrescriptionEmailPayload,
): Promise<void> => {
  try {
    const templatePath = path.join(
      process.cwd(),
      "src/templates/prescription-email.ejs",
    );

    const html = await ejs.renderFile(templatePath, {
      patientName: payload.patientName,
      doctorName: payload.doctorName,
      prescriptionId: payload.prescriptionId,
      appointmentId: payload.appointmentId,
      date: payload.date,
      supportEmail: config.email_sender,
      year: new Date().getFullYear(),
    });

    await transporter.sendMail({
      from: config.email_sender,
      to: payload.to,
      subject: `Your Medical Prescription – HealthNest`,
      html,
      attachments: [
        {
          filename: `Prescription-${payload.prescriptionId.slice(0, 8)}.pdf`,
          content: payload.pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    logger.info(`Prescription email successfully sent to ${payload.to}`);
  } catch (error) {
    logger.error("Failed to deliver prescription email:", error);
    // A failed email must not delete an already-created prescription or break the API.
  }
};

export default sendInvoiceEmail;