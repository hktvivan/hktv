import { getCatalog } from "../lib/timesheet-api";

export async function detailsCommand(opts: { project?: string }): Promise<void> {
  const catalog = await getCatalog();

  for (const d of catalog.details) {
    const active = d.isActive === false ? " (inactive)" : "";
    console.log(`${String(d.id).padStart(5)}  ${d.name}${active}`);
  }
}
