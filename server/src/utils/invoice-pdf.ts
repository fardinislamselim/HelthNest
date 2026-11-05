import PDFDocument from "pdfkit";

interface IInvoiceData {
  id: string;
  amount: string;
  currency: string;
  patientName: string;
  patientEmail: string;
  doctorName: string;
  scheduleDate: string;
  slotStart: string;
  slotEnd: string;
  serialNumber: number;
  paidAt: Date;
}

const createInvoicePdf = (
  invoiceNumber: string,
  appointment: IInvoiceData
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageWidth = doc.page.width;
    const left = 50;
    const right = pageWidth - 50;

    // Header
    doc
      .fillColor("#168568")
      .fontSize(25)
      .font("Helvetica-Bold")
      .text("HealthNest", left, 50);

    doc
      .fillColor("#64748b")
      .fontSize(9)
      .font("Helvetica")
      .text("Healthcare & Consultation Platform", left, 80);

    doc
      .fillColor("#168568")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("PAID", right - 70, 55, {
        width: 70,
        align: "right",
      });

    doc
      .moveTo(left, 110)
      .lineTo(right, 110)
      .strokeColor("#e2e8f0")
      .stroke();

    // Invoice heading
    doc
      .fillColor("#0f172a")
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("PAYMENT INVOICE", left, 135);

    doc
      .fillColor("#64748b")
      .fontSize(10)
      .font("Helvetica")
      .text(`Invoice No: ${invoiceNumber}`, left, 170);

    doc.text(
      `Issued: ${appointment.paidAt.toLocaleDateString("en-US")}`,
      left,
      185
    );

    // Amount section
    doc
      .roundedRect(left, 220, right - left, 90, 8)
      .fill("#f0fdf4");

    doc
      .fillColor("#64748b")
      .fontSize(10)
      .text("TOTAL AMOUNT PAID", left + 20, 240);

    doc
      .fillColor("#168568")
      .fontSize(26)
      .font("Helvetica-Bold")
      .text(
        `${appointment.currency.toUpperCase()} ${appointment.amount}`,
        left + 20,
        260
      );

    // Information helper
    const drawSection = (
      title: string,
      rows: [string, string][],
      y: number
    ) => {
      doc
        .fillColor("#168568")
        .fontSize(13)
        .font("Helvetica-Bold")
        .text(title, left, y);

      let currentY = y + 25;

      rows.forEach(([label, value]) => {
        doc
          .fillColor("#64748b")
          .fontSize(10)
          .font("Helvetica")
          .text(label, left, currentY);

        doc
          .fillColor("#0f172a")
          .font("Helvetica-Bold")
          .text(value, left + 130, currentY);

        currentY += 22;
      });

      return currentY + 15;
    };

    let y = 340;

    y = drawSection(
      "Patient Information",
      [
        ["Patient Name", appointment.patientName],
        ["Email Address", appointment.patientEmail],
      ],
      y
    );

    y = drawSection(
      "Doctor Information",
      [
        ["Doctor Name", appointment.doctorName],
        ["Appointment ID", appointment.id],
      ],
      y
    );

    y = drawSection(
      "Appointment Details",
      [
        ["Appointment Date", appointment.scheduleDate],
        ["Time Slot", `${appointment.slotStart} - ${appointment.slotEnd}`],
        ["Serial Number", `#${appointment.serialNumber}`],
      ],
      y
    );

    // Footer
    doc
      .moveTo(left, y + 5)
      .lineTo(right, y + 5)
      .strokeColor("#e2e8f0")
      .stroke();

    doc
      .fillColor("#168568")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Thank you for choosing HealthNest!", left, y + 25, {
        width: right - left,
        align: "center",
      });

    doc
      .fillColor("#64748b")
      .fontSize(9)
      .font("Helvetica")
      .text(
        "This is a computer-generated payment receipt.",
        left,
        y + 45,
        { width: right - left, align: "center" }
      );

    doc.end();
  });
};

export default createInvoicePdf;