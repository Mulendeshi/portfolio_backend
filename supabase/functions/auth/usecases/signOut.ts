import { logExec, logError } from "../../../_shared/services/loggingService.ts";
import { ResponseHandler } from "../../../_shared/lib/responseHandler.ts";

export class SignOutUsecase {
  constructor(private readonly repository: any) {}

  async execute() {
    logExec("SignOutUsecase.execute");

    try {
      const result:boolean = await this.repository.signOut();

      logExec("User signed out successfully");

      return { signedOut: result };
    } catch (error) {
      logError("SignOutUsecase failed", error);

      if (error instanceof ResponseHandler) {
        throw error;
      }

      throw new ResponseHandler(
        "22",
        "Failure",
        "Sign out failed",
        500,
        (error as Error).message,
        error as Error,
      );
    }
  }
}