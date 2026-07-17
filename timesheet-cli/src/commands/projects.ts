import { getCatalog } from "../lib/timesheet-api";

export async function projectsCommand(opts: { search?: string; page?: number }): Promise<void> {
  const catalog = await getCatalog();
  let projects = catalog.projects;

  if (opts.search) {
    const q = opts.search.toLowerCase();
    projects = projects.filter((p) => p.name.toLowerCase().includes(q));
  }

  const pageSize = 20;
  const page = opts.page ?? 1;
  const start = (page - 1) * pageSize;
  const pageItems = projects.slice(start, start + pageSize);

  if (pageItems.length === 0) {
    console.log("No projects found.");
    return;
  }

  for (const p of pageItems) {
    console.log(`${String(p.id).padStart(5)}  ${p.name}`);
  }

  const totalPages = Math.ceil(projects.length / pageSize);
  console.log(`\nPage ${page}/${totalPages} (${projects.length} projects total)`);
}
