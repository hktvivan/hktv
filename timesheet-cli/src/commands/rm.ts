import { getTimesheet, saveDraft, getWeekBounds, type TimesheetRow } from "../lib/timesheet-api";

export async function rmCommand(opts: {
  remark: string;
  allDays?: boolean;
  yes?: boolean;
  date?: string;
}): Promise<void> {
  const bounds = getWeekBounds(opts.date);
  const rows = (await getTimesheet(bounds)).map((r) => ({ ...r, date: { ...r.date } }));

  const matches = rows.filter((r) => (r.remark ?? "") === opts.remark);
  if (matches.length === 0) {
    console.log(`No rows found with remark "${opts.remark}".`);
    return;
  }

  if (!opts.yes) {
    console.log(`Found ${matches.length} row(s) with remark "${opts.remark}".`);
  }

  const remaining = rows.filter((r) => (r.remark ?? "") !== opts.remark);
  await saveDraft(remaining, bounds);
  console.log(`Removed ${matches.length} row(s).`);
}
