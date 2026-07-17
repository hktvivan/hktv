import { cac } from "cac";
import { loginCommand } from "./commands/login";
import { showCommand } from "./commands/show";
import { addCommand } from "./commands/add";
import { rmCommand } from "./commands/rm";
import { projectsCommand } from "./commands/projects";
import { detailsCommand } from "./commands/details";
import { favoritesCommand } from "./commands/favorites";
import { submitCommand } from "./commands/submit";
import { weekendsCommand } from "./commands/weekends";
import { statusCommand } from "./commands/status";

const cli = cac("timesheet");

cli
  .command("login", "Authenticate with the timesheet API")
  .action(async () => {
    try {
      await loginCommand();
    } catch (e: any) {
      console.error(e.message);
      process.exit(1);
    }
  });

cli
  .command("show", "Show one Sun-Sat timesheet week")
  .option("--week <week>", "ISO week (e.g. 2024-W01)")
  .option("--date <date>", "Date within the week (YYYY-MM-DD)")
  .option("--json", "Output as JSON")
  .action(async (opts) => {
    try {
      await showCommand(opts);
    } catch (e: any) {
      console.error(e.message);
      process.exit(1);
    }
  });

cli
  .command("add", "Add or update a timesheet row")
  .option("--project <project>", "Project label or ID")
  .option("--detail <detail>", "Detail work done (default: Coding & implementation)")
  .option("--remark <remark>", "Work remark")
  .option("--hours <hours>", "Hours to log")
  .option("--date <date>", "Date (YYYY-MM-DD, default: today)")
  .action(async (opts) => {
    try {
      await addCommand({ ...opts, hours: Number(opts.hours) });
    } catch (e: any) {
      console.error(e.message);
      process.exit(1);
    }
  });

cli
  .command("rm", "Remove or zero a timesheet row")
  .option("--remark <remark>", "Work remark to remove")
  .option("--all-days", "Remove from all days")
  .option("--yes", "Skip confirmation")
  .option("--date <date>", "Date (YYYY-MM-DD)")
  .action(async (opts) => {
    try {
      await rmCommand(opts);
    } catch (e: any) {
      console.error(e.message);
      process.exit(1);
    }
  });

cli
  .command("projects", "List/search available projects")
  .option("--search <query>", "Search projects by name")
  .option("--page <page>", "Page number", { default: 1 })
  .action(async (opts) => {
    try {
      await projectsCommand({ ...opts, page: Number(opts.page) });
    } catch (e: any) {
      console.error(e.message);
      process.exit(1);
    }
  });

cli
  .command("details", "List allowed Detail Work Done values")
  .option("--project <project>", "Project label or ID")
  .action(async (opts) => {
    try {
      await detailsCommand(opts);
    } catch (e: any) {
      console.error(e.message);
      process.exit(1);
    }
  });

cli
  .command("favorites", "List favorite project/detail combos")
  .action(async () => {
    try {
      await favoritesCommand();
    } catch (e: any) {
      console.error(e.message);
      process.exit(1);
    }
  });

cli
  .command("submit", "Submit a week's timesheet (locks it)")
  .option("--week <week>", "ISO week (e.g. 2024-W01)")
  .option("--date <date>", "Date within the week (YYYY-MM-DD)")
  .action(async (opts) => {
    try {
      await submitCommand(opts);
    } catch (e: any) {
      console.error(e.message);
      process.exit(1);
    }
  });

cli
  .command("weekends", "Auto-fill weekend days with public holiday entries")
  .option("--week <week>", "ISO week (e.g. 2024-W01)")
  .option("--date <date>", "Date within the week (YYYY-MM-DD)")
  .action(async (opts) => {
    try {
      await weekendsCommand(opts);
    } catch (e: any) {
      console.error(e.message);
      process.exit(1);
    }
  });

cli
  .command("status", "Show current login/token status")
  .action(async () => {
    try {
      await statusCommand();
    } catch (e: any) {
      console.error(e.message);
      process.exit(1);
    }
  });

cli.help();
cli.version("1.0.0");

const parsed = cli.parse();
if (parsed.args.length === 0 && !parsed.options.help && !parsed.options.version) {
  cli.outputHelp();
}
