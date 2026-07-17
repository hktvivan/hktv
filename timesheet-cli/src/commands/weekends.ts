import { getTimesheet, saveDraft, getWeekBounds, type TimesheetRow } from "../lib/timesheet-api";

const HOLIDAY_PROJECT_ID = 4181;
const HOLIDAY_DETAIL_ID = 2;
const HOLIDAY_HOURS = 8;

export async function weekendsCommand(opts: { week?: string; date?: string }): Promise<void> {
  const bounds = getWeekBounds(opts.week ?? opts.date);
  const rows = (await getTimesheet(bounds)).map((r) => ({ ...r, date: { ...r.date } }));

  // Fill Saturday and Sunday
  const startDate = new Date(bounds.start + "T00:00:00");
  let added = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const day = d.getDay();

    if (day !== 0 && day !== 6) continue;

    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    // Check if already has hours for this date
    const hasHours = rows.some((r) => r.date[dateKey] && r.date[dateKey] > 0);
    if (hasHours) continue;

    let row = rows.find((r) => r.projectLabel === HOLIDAY_PROJECT_ID && r.workDetail === HOLIDAY_DETAIL_ID);
    if (row) {
      row.date[dateKey] = HOLIDAY_HOURS;
    } else {
      row = {
        projectLabel: HOLIDAY_PROJECT_ID,
        workDetail: HOLIDAY_DETAIL_ID,
        remark: "Public Holiday",
        date: { [dateKey]: HOLIDAY_HOURS },
      };
      rows.push(row);
    }
    added++;
  }

  if (added === 0) {
    console.log("Weekend days already filled.");
    return;
  }

  await saveDraft(rows, bounds);
  console.log(`Filled ${added} weekend day(s) with public holiday entries.`);
}
