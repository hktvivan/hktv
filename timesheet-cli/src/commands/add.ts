import { getCatalog, getTimesheet, saveDraft, getWeekBounds, type TimesheetRow, type WeekBounds } from "../lib/timesheet-api";

export async function addCommand(opts: {
  project: string;
  detail?: string;
  remark: string;
  hours: number;
  date?: string;
}): Promise<void> {
  const bounds: WeekBounds = getWeekBounds(opts.date);
  const catalog = await getCatalog();

  // Resolve project by name or ID
  const project = catalog.projects.find(
    (p) => p.name.toLowerCase().includes(opts.project.toLowerCase()) || String(p.id) === opts.project,
  );
  if (!project) throw new Error(`No project matching "${opts.project}".`);

  // Resolve detail (default to "Coding & implementation")
  const detailLabel = opts.detail ?? "Coding & implementation";
  const detail = catalog.details.find(
    (d) => d.name.toLowerCase().includes(detailLabel.toLowerCase()) || String(d.id) === detailLabel,
  );
  if (!detail) throw new Error(`No detail matching "${detailLabel}".`);

  // Get existing week data
  const rows = (await getTimesheet(bounds)).map((r) => ({ ...r, date: { ...r.date } }));

  // Find the target date (default to today)
  const targetDate = opts.date ? new Date(opts.date + "T00:00:00") : new Date();
  const dateKey = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, "0")}-${String(targetDate.getDate()).padStart(2, "0")}`;

  // Find or create row (match by project + detail + remark)
  let row = rows.find(
    (r) => r.projectLabel === project.id && r.workDetail === detail.id && (r.remark ?? "") === opts.remark,
  );
  if (row) {
    row.date[dateKey] = opts.hours;
  } else {
    row = { projectLabel: project.id, workDetail: detail.id, remark: opts.remark, date: { [dateKey]: opts.hours } };
    rows.push(row);
  }

  await saveDraft(rows, bounds);
  console.log(`Added ${opts.hours}h for ${project.name} on ${dateKey}.`);
}
