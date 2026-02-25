import { logError, logExec } from "../../../_shared/services/loggingService.ts";
import { ResponseHandler } from "../../../_shared/lib/responseHandler.ts";
import { Helper } from "../../../_shared/lib/helper.ts";

export class DeleteProjectUsecase {
  constructor(private repository: any) {}

  async execute(data: any) {
    logExec("Executing delete project use case");

    new Helper().verifyPayloadFields(data, {
      id: "string",
    });

    try {
      
      const query = {
        table: "projects",
        id: data.id,
      };

      const result = await this.repository.deleteRecord(query);

      if (!result || result.length === 0) {
        throw new ResponseHandler(
          "404",
          "Failure",
          "Project not found",
          404,
          "No project exists with the provided ID",
        );
      }

      logExec("Project deleted successfully", {
        projectId: (data as { id: string }).id,
      });

      return {
        code: "200",
        status: "Success",
        message: "Project deleted successfully",
        data: result,
      };

    } catch (error: any) {
      logError("Deleting project failed", error, {
        table: "projects",
        projectId: (data as { id: string }).id,
      });

      if (error instanceof ResponseHandler) {
        throw error;
      }

      throw new ResponseHandler(
        "18",
        "Failure",
        "Failed to delete project",
        500,
        error?.message ?? "Unexpected delete error",
        error,
      );
    }
  }
}