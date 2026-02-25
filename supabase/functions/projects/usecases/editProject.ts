import { logError, logExec } from "../../../_shared/services/loggingService.ts";
import { ResponseHandler } from "../../../_shared/lib/responseHandler.ts";
import { Project, ProjectType } from "../data/projects.ts";
import { Helper } from "../../../_shared/lib/helper.ts";

type EditProjectPayload = {
  id: string;
} & ProjectType;

/**
 * EditProject Use Case
 */
export class EditProjectUsecase {
  constructor(private readonly repository: any) {}

  async execute(data: EditProjectPayload): Promise<ProjectType> {
    logExec("Executing EditProject use case", data);

    new Helper().verifyPayloadFields(data, {
      id: "string",
      name: "string",
      description: "string",
      image_url: "string",
      github_url: "string",
      live_url: "string",
    });

    try {
      const { id, ...projectData } = data;

      logExec("my id", { id });
      const checkRecordQuery = {
        table: "projects",
        id: id,
      };
      const result = await this.repository.getRecordById(checkRecordQuery);

      if(!result){
        throw new ResponseHandler(
          "15",
          "Failure",
          "Project not found",
          400,
          `No project found with provided id ${id}`,
        );
      }
      
      const project = new Project(projectData);

      if (!project.isValid()) {
        throw new ResponseHandler(
          "14",
          "Failure",
          "Invalid Project",
          400,
          project.getErrors().join(", "),
        );
      }

      const updateProjectQuery = {
        table: "projects",
        id: id,
        updates: project.toJson(),
      };

      logExec("thrff querrrrry", updateProjectQuery);

      const updatedProject = await this.repository.updateRecord(
        updateProjectQuery,
      );

      if (!updatedProject) {
        throw new ResponseHandler(
          "15",
          "Failure",
          "Project not found",
          404,
          `No project found with id ${id}`,
        );
      }

      logExec("Project updated successfully", updatedProject);

      return updatedProject;
    } catch (error: any) {
      logError("Editing project failed", error as Error, {
        table: "projects",
        payload: data,
      });

      if (error instanceof ResponseHandler) {
        throw error;
      }

      throw new ResponseHandler(
        "18",
        "Failure",
        "Failed to edit project",
        500,
        (error as Error).message,
        error as Error,
      );
    }
  }
}
