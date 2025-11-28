import { jsPDF } from 'jspdf';
import { WoundEntry } from '@/types/wound';

export async function generateWoundPDF(entry: WoundEntry): Promise<Blob> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(30, 64, 175); // Primary blue
  doc.text('Wound Assessment Report', margin, yPos);
  yPos += 10;

  // Date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, yPos);
  doc.text(`Assessment Date: ${new Date(entry.timestamp).toLocaleString()}`, margin, yPos + 5);
  yPos += 15;

  // Status badge
  doc.setFontSize(14);
  const statusColors: Record<string, [number, number, number]> = {
    Stable: [34, 197, 94],
    Monitor: [59, 130, 246],
    Concerning: [249, 115, 22],
    Urgent: [239, 68, 68],
  };
  const [r, g, b] = statusColors[entry.status] || [100, 100, 100];
  doc.setTextColor(r, g, b);
  doc.text(`Status: ${entry.status.toUpperCase()}`, margin, yPos);
  yPos += 15;

  // Add wound image
  if (entry.imageData) {
    try {
      const imgWidth = 80;
      const imgHeight = 60;
      doc.addImage(entry.imageData, 'JPEG', margin, yPos, imgWidth, imgHeight);
      yPos += imgHeight + 10;
    } catch (e) {
      console.error('Error adding image to PDF:', e);
    }
  }

  // Metrics section
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text('Analysis Metrics:', margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  const metrics = [
    `Redness Score: ${entry.metrics.redness.toFixed(2)}`,
    `Wound Area: ${entry.metrics.areaPct.toFixed(2)}%`,
    `Exudate Ratio: ${(entry.metrics.exudateRatio * 100).toFixed(2)}%`,
    `Brightness: ${entry.metrics.brightness.toFixed(2)}`,
    `Image Clarity: ${entry.metrics.blurVar.toFixed(2)}`,
  ];

  metrics.forEach((metric) => {
    doc.text(`• ${metric}`, margin + 5, yPos);
    yPos += 6;
  });
  yPos += 5;

  // Delta changes if available
  if (entry.deltaFromPrevious) {
    doc.setFontSize(12);
    doc.text('Changes from Previous Assessment:', margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    const delta = entry.deltaFromPrevious;
    const deltaText = [
      `Area Change: ${delta.areaPctDelta > 0 ? '+' : ''}${delta.areaPctDelta.toFixed(2)}%`,
      `Redness Change: ${delta.rednessDelta > 0 ? '+' : ''}${delta.rednessDelta.toFixed(2)}%`,
      `Exudate Change: ${delta.exudateDelta > 0 ? '+' : ''}${delta.exudateDelta.toFixed(2)}%`,
    ];

    deltaText.forEach((text) => {
      doc.text(`• ${text}`, margin + 5, yPos);
      yPos += 6;
    });
    yPos += 5;
  }

  // Clinician Summary
  doc.setFontSize(12);
  doc.text('Clinical Summary:', margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  const summaryLines = doc.splitTextToSize(entry.llmSummary, pageWidth - margin * 2);
  doc.text(summaryLines, margin + 5, yPos);
  yPos += summaryLines.length * 5 + 10;

  // Patient Instructions
  doc.setFontSize(12);
  doc.text('Patient Instructions:', margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  entry.patientInstructions.forEach((instruction, index) => {
    const lines = doc.splitTextToSize(`${index + 1}. ${instruction}`, pageWidth - margin * 2 - 10);
    doc.text(lines, margin + 5, yPos);
    yPos += lines.length * 5 + 3;
  });
  yPos += 5;

  // Patient Context
  if (entry.patientContext) {
    doc.setFontSize(12);
    doc.text('Patient Information:', margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.text(`Age: ${entry.patientContext.age}`, margin + 5, yPos);
    yPos += 6;
    if (entry.patientContext.comorbidities.length > 0) {
      doc.text(`Comorbidities: ${entry.patientContext.comorbidities.join(', ')}`, margin + 5, yPos);
      yPos += 6;
    }
    if (entry.patientContext.notes) {
      const notesLines = doc.splitTextToSize(`Notes: ${entry.patientContext.notes}`, pageWidth - margin * 2);
      doc.text(notesLines, margin + 5, yPos);
      yPos += notesLines.length * 5;
    }
  }

  // Footer disclaimer
  yPos = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  const disclaimer = 'DISCLAIMER: This report is for informational purposes only and does not constitute medical advice. Please consult a healthcare professional for proper diagnosis and treatment.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - margin * 2);
  doc.text(disclaimerLines, margin, yPos);

  return doc.output('blob');
}

export function downloadPDF(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
