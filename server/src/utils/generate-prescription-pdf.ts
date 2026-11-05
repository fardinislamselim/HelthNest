/**
 * @copyright 2026
 * @author HealthNest Team
 * @license Apache-2.0
 */

import PDFDocument from "pdfkit";
import { IPrescriptionPdfData } from "@/modules/v1/prescription/prescription.interface";

/**
 * Generate a professional medical prescription PDF using PDFKit
 */
export const generatePrescriptionPdf = async (
  data: IPrescriptionPdfData,
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
      info: {
        Title: `Prescription-${data.prescription.id}`,
        Author: `Dr. ${data.doctor.name}`,
        Subject: "Medical Prescription - HealthNest",
      },
    });

    const buffers: Buffer[] = [];
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", (err) => reject(err));

    const primaryColor = "#0d9488"; // Teal-600
    const secondaryColor = "#0f172a"; // Slate-900
    const grayColor = "#64748b"; // Slate-500
    const lightBg = "#f8fafc"; // Slate-50
    const borderColor = "#cbd5e1"; // Slate-300

    // ==========================================
    // 1. HEADER SECTION
    // ==========================================
    doc
      .fillColor(primaryColor)
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("HealthNest", 40, 40);

    doc
      .fillColor(grayColor)
      .fontSize(9)
      .font("Helvetica")
      .text("Digital Healthcare Consultation & Prescription System", 40, 68);

    doc
      .fillColor(secondaryColor)
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("MEDICAL PRESCRIPTION", 360, 40, { align: "right" });

    const formattedDate = new Date(data.prescription.createdAt).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );

    doc
      .fillColor(grayColor)
      .fontSize(9)
      .font("Helvetica")
      .text(`Date: ${formattedDate}`, 360, 58, { align: "right" })
      .text(`Rx ID: ${data.prescription.id}`, 360, 70, { align: "right" });

    // Header divider line
    doc
      .moveTo(40, 90)
      .lineTo(555, 90)
      .strokeColor(primaryColor)
      .lineWidth(2)
      .stroke();

    // ==========================================
    // 2. DOCTOR & PATIENT DETAILS
    // ==========================================
    const detailsTop = 102;

    // Doctor Details Box
    doc
      .rect(40, detailsTop, 250, 95)
      .fillColor(lightBg)
      .fillAndStroke(borderColor);

    doc
      .fillColor(primaryColor)
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("DOCTOR INFORMATION", 50, detailsTop + 8);

    doc
      .fillColor(secondaryColor)
      .fontSize(11)
      .font("Helvetica-Bold")
      .text(`Dr. ${data.doctor.name}`, 50, detailsTop + 24);

    doc
      .fillColor(grayColor)
      .fontSize(9)
      .font("Helvetica")
      .text(`Specialization: ${data.doctor.specialization}`, 50, detailsTop + 40)
      .text(`Qualifications: ${data.doctor.qualifications || "MBBS"}`, 50, detailsTop + 54)
      .text(
        `Experience: ${data.doctor.experienceYears ? data.doctor.experienceYears + " Years" : "Registered Practitioner"}`,
        50,
        detailsTop + 68,
      )
      .text(`Contact: ${data.doctor.contactNumber || data.doctor.email || "N/A"}`, 50, detailsTop + 82);

    // Patient Details Box
    doc
      .rect(305, detailsTop, 250, 95)
      .fillColor(lightBg)
      .fillAndStroke(borderColor);

    doc
      .fillColor(primaryColor)
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("PATIENT INFORMATION", 315, detailsTop + 8);

    doc
      .fillColor(secondaryColor)
      .fontSize(11)
      .font("Helvetica-Bold")
      .text(data.patient.name, 315, detailsTop + 24);

    doc
      .fillColor(grayColor)
      .fontSize(9)
      .font("Helvetica")
      .text(`Email: ${data.patient.email}`, 315, detailsTop + 40)
      .text(`Contact: ${data.patient.contactNumber || "N/A"}`, 315, detailsTop + 54)
      .text(
        `Address: ${data.patient.address || "N/A"}`,
        315,
        detailsTop + 68,
      )
      .text(`Appointment Ref: ${data.appointment.id}`, 315, detailsTop + 82);

    // ==========================================
    // 3. CLINICAL FINDINGS
    // ==========================================
    let currentY = detailsTop + 110;

    doc
      .fillColor(primaryColor)
      .fontSize(11)
      .font("Helvetica-Bold")
      .text("Clinical Findings & Diagnosis", 40, currentY);

    currentY += 16;

    doc
      .rect(40, currentY, 515, 45)
      .fillColor(lightBg)
      .fillAndStroke(borderColor);

    doc
      .fillColor(secondaryColor)
      .fontSize(9)
      .font("Helvetica")
      .text(data.prescription.keyFindings, 50, currentY + 8, {
        width: 495,
        lineGap: 3,
      });

    currentY += 55;

    // ==========================================
    // 4. PRESCRIBED MEDICINES (Rx TABLE)
    // ==========================================
    doc
      .fillColor(primaryColor)
      .fontSize(11)
      .font("Helvetica-Bold")
      .text("Prescribed Medications (Rx)", 40, currentY);

    currentY += 16;

    // Table Header
    const tableLeft = 40;
    const tableWidth = 515;
    const colWidths = {
      name: 145,
      dosage: 75,
      frequency: 75,
      duration: 80,
      instructions: 140,
    };

    doc
      .rect(tableLeft, currentY, tableWidth, 22)
      .fillColor(primaryColor)
      .fill();

    doc
      .fillColor("#ffffff")
      .fontSize(9)
      .font("Helvetica-Bold")
      .text("Medicine", tableLeft + 8, currentY + 6)
      .text("Dosage", tableLeft + colWidths.name + 6, currentY + 6)
      .text(
        "Frequency",
        tableLeft + colWidths.name + colWidths.dosage + 6,
        currentY + 6,
      )
      .text(
        "Duration",
        tableLeft + colWidths.name + colWidths.dosage + colWidths.frequency + 6,
        currentY + 6,
      )
      .text(
        "Instructions",
        tableLeft +
          colWidths.name +
          colWidths.dosage +
          colWidths.frequency +
          colWidths.duration +
          6,
        currentY + 6,
      );

    currentY += 22;

    // Table Rows
    data.prescription.medicines.forEach((med, index) => {
      const rowBg = index % 2 === 0 ? "#ffffff" : lightBg;
      const rowHeight = 22;

      doc
        .rect(tableLeft, currentY, tableWidth, rowHeight)
        .fillColor(rowBg)
        .fillAndStroke(borderColor);

      doc
        .fillColor(secondaryColor)
        .fontSize(9)
        .font("Helvetica-Bold")
        .text(med.name, tableLeft + 8, currentY + 6, {
          width: colWidths.name - 12,
          ellipsis: true,
        });

      doc
        .fillColor(secondaryColor)
        .fontSize(9)
        .font("Helvetica")
        .text(med.dosage, tableLeft + colWidths.name + 6, currentY + 6)
        .text(
          med.frequency,
          tableLeft + colWidths.name + colWidths.dosage + 6,
          currentY + 6,
        )
        .text(
          med.duration,
          tableLeft + colWidths.name + colWidths.dosage + colWidths.frequency + 6,
          currentY + 6,
        )
        .text(
          med.instructions || "As directed",
          tableLeft +
            colWidths.name +
            colWidths.dosage +
            colWidths.frequency +
            colWidths.duration +
            6,
          currentY + 6,
          { width: colWidths.instructions - 12, ellipsis: true },
        );

      currentY += rowHeight;
    });

    currentY += 15;

    // ==========================================
    // 5. ADDITIONAL INSTRUCTIONS
    // ==========================================
    if (data.prescription.additionalInstructions) {
      doc
        .fillColor(primaryColor)
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("Advice & Additional Instructions", 40, currentY);

      currentY += 16;

      doc
        .rect(40, currentY, 515, 45)
        .fillColor(lightBg)
        .fillAndStroke(borderColor);

      doc
        .fillColor(secondaryColor)
        .fontSize(9)
        .font("Helvetica")
        .text(data.prescription.additionalInstructions, 50, currentY + 8, {
          width: 495,
          lineGap: 3,
        });

      currentY += 55;
    }

    // ==========================================
    // 6. FOOTER & SIGNATURE
    // ==========================================
    const footerY = 720;

    // Doctor signature stamp block
    doc
      .moveTo(380, footerY)
      .lineTo(540, footerY)
      .strokeColor(borderColor)
      .lineWidth(1)
      .stroke();

    doc
      .fillColor(secondaryColor)
      .fontSize(10)
      .font("Helvetica-Bold")
      .text(`Dr. ${data.doctor.name}`, 380, footerY + 5, {
        align: "center",
        width: 160,
      });

    doc
      .fillColor(grayColor)
      .fontSize(8)
      .font("Helvetica")
      .text("Authorized Medical Practitioner", 380, footerY + 18, {
        align: "center",
        width: 160,
      });

    // Bottom Branding & Disclaimer
    doc
      .moveTo(40, 770)
      .lineTo(555, 770)
      .strokeColor(borderColor)
      .lineWidth(0.5)
      .stroke();

    doc
      .fillColor(grayColor)
      .fontSize(8)
      .font("Helvetica")
      .text(
        "HealthNest Healthcare Management System • Computer-generated legal medical prescription",
        40,
        778,
      );

    doc
      .fillColor(grayColor)
      .fontSize(8)
      .font("Helvetica")
      .text(`Generated: ${formattedDate}`, 360, 778, { align: "right" });

    doc.end();
  });
};

