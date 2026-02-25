import { logError, logExec } from "../../../_shared/services/loggingService.ts";
import { ResponseHandler } from "../../../_shared/lib/responseHandler.ts";
import { Project, ProjectType } from "../data/projects.ts";
import { Helper } from "../../../_shared/lib/helper.ts";

/**
 * CreateProject Use Case
 */
export class CreateProjectUsecase {
  constructor(private repository: any) {}

  async execute(data: ProjectType): Promise<ProjectType> {
    logExec("Executing CreateProject use case", data);

    new Helper().verifyPayloadFields(data, {
      name: "string",
      description: "string",
      image_url: "string",
      github_url: "string",
      live_url: "string",
    });

    try {
      const project = new Project(data);

      if (!project.isValid()) {
        throw new ResponseHandler(
          "14",
          "Failure",
          "Invalid Project",
          400,
          project.getErrors().join(", "),
        );
      }

      logExec("Project tits", project.toJson())

      const insertProjectQuery = { table:"projects", data: project.toJson()}

      const createdProject = await this.repository.insertRecord(
        insertProjectQuery
      );

      logExec("Project created successfully", createdProject);

      return createdProject;
    } catch (error: any) {
      logError("Creating project failed", error as Error, {
        table: "projects",
        payload: data,
      });

      if (error instanceof ResponseHandler) {
        throw error;
      }

      throw new ResponseHandler(
        "18",
        "Failure",
        "Failed to create project",
        500,
        (error as Error).message,
        error as Error,
      );
    }
  }
}
