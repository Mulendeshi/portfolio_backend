import { logExec, logError } from "../../../_shared/services/loggingService.ts";
import { ResponseHandler } from "../../../_shared/lib/responseHandler.ts";
import { Helper } from "../../../_shared/lib/helper.ts";


export class SignUpUsecase {
  constructor(private readonly repository: any) {}

  async execute(payload: Record<string, unknown>) {
    logExec("SignUpUsecase.execute payload", payload);

    new Helper().verifyPayloadFields(payload, {
      email: "string",
      password: "string",
    });

    try {
      const result = await this.repository.signUp(
        payload.email as string,
        payload.password as string,
      );

      logExec("User signed up successfully", result);

      return result;
    } catch (error) {
      logError("SignUpUsecase failed", error, payload);

      if (error instanceof ResponseHandler) {
        throw error;
      }

      throw new ResponseHandler(
        "21",
        "Failure",
        "Sign up failed",
        400,
        (error as Error).message,
        error as Error,
      );
    }
  }
}