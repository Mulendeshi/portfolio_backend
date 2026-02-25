// // import { Context } from "https://deno.land/x/hono@v4.2.7/mod.ts";

import { logError, logExec } from "../../../_shared/services/loggingService.ts";
import { ResponseHandler } from "../../../_shared/lib/responseHandler.ts";
import { DeleteProjectUsecase } from "../usecases/deleteProject.ts";
import { CreateProjectUsecase } from "../usecases/createProject.ts";
import { ViewProjectsUsecase } from "../usecases/viewProjects.ts";
import { EditProjectUsecase } from "../usecases/editProject.ts";
import { Helper } from "../../../_shared/lib/helper.ts";


export class ProjectsController {
  constructor(private repository: any) {}

  async handleRequest(payload: any) {
    logExec("ProjectsController payload", payload);

    new Helper().verifyPayloadFields(payload, {
      definition: "string",
      data: "object",
    });
    try {
      switch (payload.definition) {
        case "viewprojects": {
          logExec("viewing projects definition", payload.data);
          const result = await new ViewProjectsUsecase(this.repository)
            .execute();

          return new ResponseHandler(
            "0",
            "Success",
            "All Projects retrieved",
            200,
            result,
          ).toResponse("viewprojects definition finished");
        }

        case "createproject": {
          logExec("creating projects definition", payload.data);
          const result = await new CreateProjectUsecase(
            this.repository,
          ).execute(payload.data);

          return new ResponseHandler(
            "0",
            "Success",
            "Project created",
            200,
            result,
          ).toResponse("createproject definition finished");
        }

        case "editproject": {
          logExec("editing projects definition", payload.data);
          const result = await new EditProjectUsecase(this.repository).execute(
            payload.data,
          );

          return new ResponseHandler(
            "0",
            "Success",
            "Project updated",
            200,
            result,
          ).toResponse("editproject definition finshed");
        }

        case "deleteproject": {
          logExec("deleting projects definition", payload.data);
          const result = await new DeleteProjectUsecase(this.repository).execute(
            payload.data,
          );

          return new ResponseHandler(
            "0",
            "Success",
            "Project deleted successfuly",
            200,
            result,
          ).toResponse("delete project definition finshed");
        }

        default:
          throw new ResponseHandler(
            "14",
            "Failure",
            "Invalid Request",
            400,
            `definition: ${payload.definition} not defined`,
          );
      }
    } catch (e: any) {
      logError("ProjectsController.handleRequest failed", e, payload);

      if (e instanceof ResponseHandler) {
        return e.toResponse("ProjectsController execution");
      }

      return new ResponseHandler(
        e.code ?? "06",
        e.response ?? "Failure",
        e.description ?? "Unexpected error occurred in cont",
        e.status ?? 500,
        (e as Error).message,
        payload,
      ).toResponse("ProjectsController");
    }
  }
}
