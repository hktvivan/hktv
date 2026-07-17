import { getTimesheet, saveTimesheet, getWeekBounds } from "../lib/timesheet-api";

export async function submitCommand(opts: { week?: string; date?: string }): Promise<void> {
  const bounds = getWeekBounds(opts.week ?? opts.date);
  const rows = await getTimesheet(bounds);

  if (rows.length === 0) {
    console.log(`No timesheet rows for ${bounds.start} to ${bounds.end}. Nothing to submit.`);
    return;
  }

  await saveTimesheet(rows, bounds);
  console.log(`Timesheet submitted for ${bounds.start} to ${bounds.end}.`);
}
