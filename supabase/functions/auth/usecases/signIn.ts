import { logExec, logError } from "../../../_shared/services/loggingService.ts";
import { ResponseHandler } from "../../../_shared/lib/responseHandler.ts";
import { Helper } from "../../../_shared/lib/helper.ts";

export class SignInUsecase {
  constructor(private readonly repository: any) {}

  async execute(payload: Record<string, unknown>) {
    logExec("SignInUsecase execute payload", payload);

    new Helper().verifyPayloadFields(payload, {
      email: "string",
      password: "string",
    });

    try {
      const result = await this.repository.signIn(
        payload.email as string,
        payload.password as string,
      );

      logExec("User signed in successfully", result);

      return result;
    } catch (error) {
      logError("SignInUsecase failed", error, payload);

      if (error instanceof ResponseHandler) {
        throw error;
      }

      throw new ResponseHandler(
        "20",
        "Failure",
        "Sign in failed",
        401,
        (error as Error).message,
        error as Error,
      );
    }
  }
}