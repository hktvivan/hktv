import { request } from "./api-client";

export interface Project {
  id: number;
  name: string;
}

export interface Detail {
  id: number;
  name: string;
  isActive?: boolean;
}

export interface TimesheetRow {
  projectLabel: number;
  workDetail: number;
  remark: string;
  date: Record<string, number>;
}

export interface WeekBounds {
  start: string;
  end: string;
}

export interface Catalog {
  projects: Project[];
  details: Detail[];
}

export function getWeekBounds(dateOrWeek?: string): WeekBounds {
  const now = new Date();
  let target: Date;

  if (dateOrWeek) {
    const weekMatch = dateOrWeek.match(/^(\d{4})-W(\d{2})$/);
    if (weekMatch) {
      const year = parseInt(weekMatch[1]);
      const week = parseInt(weekMatch[2]);
      const jan4 = new Date(year, 0, 4);
      const dayOfWeek = jan4.getDay() || 7;
      const weekStart = new Date(jan4);
      weekStart.setDate(jan4.getDate() - dayOfWeek + 1 + (week - 1) * 7);
      target = weekStart;
    } else {
      target = new Date(dateOrWeek + "T00:00:00");
    }
  } else {
    target = now;
  }

  const day = target.getDay();
  const sunday = new Date(target);
  sunday.setDate(target.getDate() - day);

  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);

  const fmt = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };
  return { start: fmt(sunday), end: fmt(saturday) };
}

export async function getCatalog(): Promise<Catalog> {
  const data = (await request("GET", "/time-sheet/project-and-detail")) as Record<string, unknown>;
  const projects = (data.projects ?? []) as Project[];
  const details = (data.details ?? []) as Detail[];
  return { projects, details };
}

export async function getTimesheet(bounds: WeekBounds): Promise<TimesheetRow[]> {
  const resp = (await request("POST", "/time-sheet/get-timesheet", {
    startDate: bounds.start,
    endDate: bounds.end,
  })) as Record<string, unknown>;
  // Response is { data: [...rows], edit: true, stateId: 32 }
  return ((resp.data ?? resp.rows ?? resp.weeklyData ?? []) as TimesheetRow[]);
}

export async function saveTimesheet(rows: TimesheetRow[], bounds: WeekBounds): Promise<unknown> {
  return request("POST", "/time-sheet/save-timesheet", buildWeekPayload(rows, bounds));
}

export async function saveDraft(rows: TimesheetRow[], bounds: WeekBounds): Promise<unknown> {
  return request("POST", "/time-sheet/save-timesheet-draft", buildWeekPayload(rows, bounds));
}

export async function getFavorites(): Promise<unknown> {
  return request("GET", "/time-sheet/favorite-work-list");
}

function fmtDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function buildWeekPayload(rows: TimesheetRow[], bounds: WeekBounds): unknown {
  const startDate = new Date(bounds.start + "T00:00:00");
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    dates.push(fmtDate(d));
  }

  return dates.map((createDate) => ({
    createDate,
    data: rows
      .filter((r) => r.projectLabel != null && r.workDetail != null)
      .map((r) => ({
        projectId: Number(r.projectLabel),
        detailWorkDoneId: Number(r.workDetail),
        workRemark: r.remark ?? "",
        workTime: r.date?.[createDate] ?? 0,
      })),
  }));
}
