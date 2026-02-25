// // import { Context } from "https://deno.land/x/hono@v4.2.7/mod.ts";

import { logError, logExec } from "../../../_shared/services/loggingService.ts";
import { ResponseHandler } from "../../../_shared/lib/responseHandler.ts";
import { CreateResumeUsecase } from "../usecases/createResume.ts";
import { ViewResumeUsecase } from "../usecases/viewResume.ts";
import { EditResumeUsecase } from "../usecases/editResume.ts";
import { Helper } from "../../../_shared/lib/helper.ts";


export class ResumeController {
  constructor(private repository: any) {}

  async handleRequest(payload: any) {
    logExec("ProjectsController payload", payload);

    new Helper().verifyPayloadFields(payload, {
      definition: "string",
      data: "object",
    });
    try {
      switch (payload.definition) {
        case "viewresume": {
          logExec("viewing resume definition", payload.data);
          const result = await new ViewResumeUsecase(this.repository)
            .execute();

          return new ResponseHandler(
            "0",
            "Success",
            "All resume retrieved",
            200,
            result,
          ).toResponse("ViewResumes definition finished");
        }

        case "createresume": {
          logExec("creating resume definition", payload.data);
          const result = await new CreateResumeUsecase(
            this.repository,
          ).execute(payload.data);

          return new ResponseHandler(
            "0",
            "Success",
            "resume created",
            200,
            result,
          ).toResponse("CreateResume definition finished");
        }

        case "editresume": {
          logExec("editing resume definition", payload.data);
          const result = await new EditResumeUsecase(this.repository).execute(
            payload.data,
          );

          return new ResponseHandler(
            "0",
            "Success",
            "resume updated",
            200,
            result,
          ).toResponse("EditResume definition finshed");
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
