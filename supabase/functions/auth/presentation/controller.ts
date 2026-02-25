import { logError, logExec } from "../../../_shared/services/loggingService.ts";
import { ResponseHandler } from "../../../_shared/lib/responseHandler.ts";
import { SignOutUsecase } from "../usecases/signOut.ts";
import { Helper } from "../../../_shared/lib/helper.ts";
import { SignInUsecase } from "../usecases/signIn.ts";
import { SignUpUsecase } from "../usecases/signUp.ts";


export class AuthenticationController {
  constructor(private repository: any) {}

  async handleRequest(payload: any) {
    logExec("ProjectsController payload", payload);

    new Helper().verifyPayloadFields(payload, {
      definition: "string",
      data: "object",
    });
    try {
      switch (payload.definition) {
        case "signup": {
          logExec("signup definition started", payload.data);
          const result = await new SignUpUsecase(this.repository)
            .execute(payload.data);

          return new ResponseHandler(
            "0",
            "Success",
            "Signed up successfully",
            200,
            result,
          ).toResponse("signup definition finished");
        }

        case "login": {
          logExec("login definition started", payload.data);
          const result = await new SignInUsecase(
            this.repository,
          ).execute(payload.data);

          return new ResponseHandler(
            "0",
            "Success",
            "Logged in successfully",
            200,
            result,
          ).toResponse("login definition finished");
        }

        case "logout": {
          logExec("logout definition started", payload);
          const result = await new SignOutUsecase(this.repository).execute();

          return new ResponseHandler(
            "0",
            "Success",
            "logged out successfully",
            200,
            result,
          ).toResponse("logout definition finshed");
        }

        default:
          throw new ResponseHandler(
            "14",
            "Failure",
            "Invalid definiton",
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
