import { TimeEntry, formatHours, formatDateForReport, formatTimeForDisplay } from "./timeUtils";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDF = (entries: TimeEntry[], totalOvertime: number): void => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text("Informe de Horas Trabajadas - Allan Montero Badilla", 14, 22);
  
  doc.setFontSize(12);
  doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 32);

  // Create table data
  const tableColumn = ["Fecha", "Entrada", "Salida", "Horas Trabajadas", "Horas Extra"];
  const tableRows = entries.map((entry) => [
    formatDateForReport(entry.date),
    formatTimeForDisplay(entry.clockIn),
    formatTimeForDisplay(entry.clockOut),
    formatHours(entry.hoursWorked),
    entry.overtimeHours > 0 ? formatHours(entry.overtimeHours) : "—"
  ]);

  // Usar autoTable como función independiente
  autoTable(doc, {
    startY: 40,
    head: [tableColumn],
    body: tableRows,
    theme: "striped",
    headStyles: { 
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: { 
      cellPadding: 5,
      fontSize: 10,
      lineColor: [220, 220, 220],
      lineWidth: 0.1
    },
    footStyles: { 
      fillColor: [240, 240, 240], 
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    },
    foot: [['Total Horas Extra', '', '', '', formatHours(totalOvertime)]],
  });

  // Save the PDF
  doc.save("informe-horas-trabajadas.pdf");
};