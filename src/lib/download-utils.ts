import { AnalysisResult } from "@/types";

function triggerDownload(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/[^a-z0-9]/gi, "-");
  } catch {
    return "report";
  }
}

function dateStr(iso: string) {
  return iso.slice(0, 10);
}

/** Full JSON dump */
export function downloadJSON(result: AnalysisResult) {
  const name = `sitescope-${hostname(result.url)}-${dateStr(result.analyzedAt)}.json`;
  triggerDownload(JSON.stringify(result, null, 2), name, "application/json");
}

/** CSV of all issues — easy to open in Excel / Sheets */
export function downloadCSV(result: AnalysisResult) {
  const rows: string[][] = [
    ["#", "Category", "Severity", "Title", "Description", "Fix", "Impact"],
  ];

  result.issues.forEach((issue, i) => {
    rows.push([
      String(i + 1),
      issue.category,
      issue.severity,
      issue.title,
      issue.description.replace(/"/g, '""'),
      issue.fix.replace(/"/g, '""'),
      issue.impact.replace(/"/g, '""'),
    ]);
  });

  const csv = rows
    .map((r) => r.map((cell) => `"${cell}"`).join(","))
    .join("\n");
  const name = `sitescope-${hostname(result.url)}-${dateStr(result.analyzedAt)}.csv`;
  triggerDownload(csv, name, "text/csv");
}
