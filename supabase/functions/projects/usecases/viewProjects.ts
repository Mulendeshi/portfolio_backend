import { logExec, logError } from "../../../_shared/services/loggingService.ts";
import { ResponseHandler } from "../../../_shared/lib/responseHandler.ts";

export class ViewProjectsUsecase {
  constructor(private readonly repository: any) {}

  async execute() {
    logExec("Executing the viewprojects api");

    try {
      const projects = await this.repository.getAllRecords("projects");

      logExec("ViewProjects.execute() success", {
        count: projects?.length ?? 0,
      });

      logExec("Projects returned", projects)

      return projects;
    } catch (error: any) {
      logError("viewing projects failed", error as Error, {
        table: "projects",
      });

      if (error instanceof ResponseHandler) {
        throw error;
      }

      throw new ResponseHandler(
        "18",
        "Failure",
        "Failed to view projects",
        500,
        (error as Error).message,
        error,
      );
    }
  }
}

