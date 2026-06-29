import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type AssessmentExportData = {
  alter: string;
  geschlecht: string;
  schwangerschaft: string;
  stillzeit: string;
  worsening: string | undefined;
  groesse: string;
  gewicht: string;
  temperatur: string;
  dauer: string;
  medikation: string;
  allergien: string;
  vorerkrankungen: string;
  alkoholkonsum: string;
  zigaretten: string;
  symptome: string;
  textSymptome: string;
  datum: string;
  dringlichkeit: string;
  handlungsempfehlung: string;
  vermutungen: { text: string; wahrscheinlichkeit: string }[];
};

export function formatAssessmentTxt(d: AssessmentExportData): string {
  const rows: string[] = [];

  rows.push("Daten\n");

  rows.push("Patientendaten");
  rows.push(`Alter: ${d.alter}`);
  rows.push(`Geschlecht: ${d.geschlecht}`);
  rows.push(`Größe: ${d.groesse}`);
  rows.push(`Gewicht: ${d.gewicht}`);
  rows.push(`Temperatur: ${d.temperatur}`);
  rows.push(`Dauer der Symptome: ${d.dauer}`);
  rows.push(`Symptome werden schlimmer: ${d.worsening || "Keine Angabe"}`);
  if (d.geschlecht !== "männlich") {
    rows.push(`Schwangerschaft: ${d.schwangerschaft}`);
    rows.push(`Stillzeit: ${d.stillzeit}`);
  }
  if (d.medikation.length < 0) {
    rows.push(`Medikation: ${d.medikation}`);
  }
  else {
    rows.push("Medikation: Keine Angabe");
  }
  rows.push(`Allergien: ${d.allergien || "Keine Angabe"}`);
  rows.push(`Vorerkrankungen: ${d.vorerkrankungen.length > 0 ? d.vorerkrankungen : "Keine Angabe"}`);
  rows.push(`Alkoholkonsum (Getränke/Woche): ${d.alkoholkonsum || "Keine Angabe"}`);
  rows.push(`Zigaretten pro Tag: ${d.zigaretten || "Keine Angabe"}`);

  rows.push("\nSymptome");
  if (d.symptome) rows.push(`Symptome: ${d.symptome}`);
  if (d.textSymptome) rows.push(`Selbst beschriebene Beschwerden: ${d.textSymptome}`);

  rows.push("\nKI Auswertung");
  rows.push(`Dringlichkeitsstufe: ${d.dringlichkeit}`);
  rows.push(`Handlungsempfehlung: ${d.handlungsempfehlung}`);

  rows.push("\nVermutungen:");
  d.vermutungen.forEach((v, i) => {
    rows.push(`Vermutung ${i + 1}: ${v.text} (${v.wahrscheinlichkeit})`);
    rows.push(`Wahrscheinlichkeit: ${v.wahrscheinlichkeit}`);
  });

  rows.push(`\nDaten erfasst am: ${d.datum}`);

  return rows.join("\n");
}

export function downloadTxt(d: AssessmentExportData) {
  const text = formatAssessmentTxt(d);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "assessment.txt";
  a.click();
  URL.revokeObjectURL(url);
}

export function formatAssessmentPdfTable(d: AssessmentExportData): string[][] {
  const tableBody: string[][] = [];

  tableBody.push(["Alter", d.alter]);
  tableBody.push(["Geschlecht", d.geschlecht]);
  tableBody.push(["Größe", d.groesse]);
  tableBody.push(["Gewicht", d.gewicht]);
  if (d.medikation.length < 0) {
    tableBody.push(["Medikation", d.medikation]);
  }
  else {
    tableBody.push(["Medikation", "Keine Angabe"]);
  }
  tableBody.push(["Allergien", d.allergien || "Keine Angabe"]);
  tableBody.push(["Vorerkrankungen", d.vorerkrankungen.length > 0 ? d.vorerkrankungen : "Keine Angabe"]);
  tableBody.push(["Alkoholkonsum (Getränke/Woche)", d.alkoholkonsum || "Keine Angabe"]);
  tableBody.push(["Zigaretten pro Tag", d.zigaretten || "Keine Angabe"]);
  tableBody.push(["Temperatur", d.temperatur]);
  tableBody.push(["Dauer der Symptome", d.dauer]);
  tableBody.push(["Symptome werden schlimmer", d.worsening || "Keine Angabe"]);
  if (d.geschlecht !== "männlich") {
    tableBody.push(["Schwangerschaft", d.schwangerschaft]);
    tableBody.push(["Stillzeit", d.stillzeit]);
  }
  if (d.symptome) tableBody.push(["Symptome", d.symptome]);
  if (d.textSymptome) tableBody.push(["selbst geschriebene Beschwerden", d.textSymptome]);
  tableBody.push(["Dringlichkeitsstufe (KI)", d.dringlichkeit]);
  tableBody.push(["Handlungsempfehlung (KI)", d.handlungsempfehlung]);
  d.vermutungen.forEach((v, i) => {
    tableBody.push([`Vermutung ${i + 1} (KI)`, v.text]);
    tableBody.push(["Wahrscheinlichkeit", v.wahrscheinlichkeit]);
  });
  tableBody.push(["Daten erfasst am", d.datum]);

  return tableBody;
}

export function downloadPdf(d: AssessmentExportData) {
  const tableBody = formatAssessmentPdfTable(d);

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`\n    Daten\n    `, 10, 10);
  autoTable(doc, {
    startY: 25,
    theme: "plain",
    body: tableBody,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });
  doc.save("assessment.pdf");
}
