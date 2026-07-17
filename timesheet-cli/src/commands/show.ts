import { getTimesheet, getCatalog, getWeekBounds, type WeekBounds } from "../lib/timesheet-api";
import { renderTimesheetTable } from "../lib/table";

export async function showCommand(opts: { week?: string; date?: string; json?: boolean }): Promise<void> {
  const bounds: WeekBounds = getWeekBounds(opts.week ?? opts.date);
  const [rows, catalog] = await Promise.all([getTimesheet(bounds), getCatalog()]);

  if (opts.json) {
    console.log(JSON.stringify(rows, null, 2));
    return;
  }

  const table = renderTimesheetTable(rows, catalog.projects, catalog.details, bounds.start, bounds.end);
  console.log(table);
}
