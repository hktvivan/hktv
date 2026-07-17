import type { Project, Detail, TimesheetRow } from "./timesheet-api";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function fmtDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len - 1) + "…" : str;
}

function resolveName(items: (Project | Detail)[], id: number): string {
  const item = items.find((i) => i.id === id);
  return item ? item.name : String(id);
}

export function renderTimesheetTable(
  rows: TimesheetRow[],
  projects: Project[],
  details: Detail[],
  start: string,
  end: string,
): string {
  if (rows.length === 0) {
    return `No timesheet rows for ${start} to ${end}.`;
  }

  const lines: string[] = [];
  const header = ["Project", "Detail", "Remark", ...DAYS, "Total"].join("\t");
  lines.push(header);
  lines.push("-".repeat(header.length));

  let grandTotal = 0;

  // Build date list for the week
  const startDate = new Date(start + "T00:00:00");
  const dateKeys: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    dateKeys.push(fmtDate(d));
  }

  for (const row of rows) {
    const project = truncate(resolveName(projects, row.projectLabel), 30);
    const detail = truncate(resolveName(details, row.workDetail), 25);
    const remark = truncate(String(row.remark ?? ""), 20);

    const dateData = row.date ?? {};
    const weekHours: string[] = [];
    let rowTotal = 0;

    for (const dateKey of dateKeys) {
      const hours = Number(dateData[dateKey] ?? 0);
      rowTotal += hours;
      weekHours.push(hours > 0 ? String(hours) : "");
    }

    grandTotal += rowTotal;
    lines.push([project, detail, remark, ...weekHours, String(rowTotal)].join("\t"));
  }

  lines.push("-".repeat(header.length));
  lines.push(["", "", "", ...Array(7).fill(""), String(grandTotal)].join("\t"));

  return lines.join("\n");
}
