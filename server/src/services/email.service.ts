import ejs from "ejs";
import path from "path";

import config from "@/config";
import { transporter } from "@/lib/nodemailer";

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

export default sendInvoiceEmail;