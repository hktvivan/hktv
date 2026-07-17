import { getFavorites } from "../lib/timesheet-api";

export async function favoritesCommand(): Promise<void> {
  const resp = await getFavorites();
  const data = (resp as Record<string, unknown>).data ?? resp;
  const items = Array.isArray(data) ? data : [];

  if (items.length === 0) {
    console.log("No favorites found.");
    return;
  }

  for (const item of items as any[]) {
    const project = item.projectName ?? item.projectLabel ?? "?";
    const detail = item.detailName ?? item.workDetail ?? "?";
    const remark = item.remark ?? "";
    console.log(`${project}  ${detail}  ${remark}`);
  }
}
