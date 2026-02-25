import { AuthenticationController } from "./presentation/controller.ts";
import { ResponseHandler } from "../../_shared/lib/responseHandler.ts";
import SupabaseRepository from "../../_shared/data/supabaseRepository.ts";

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      throw new ResponseHandler(
        "404",
        "Failure",
        "Endpoint not found",
        404,
        "Only POST requests are allowed",
      );
    }

    const result = await new AuthenticationController(new SupabaseRepository())
      .handleRequest(await req.json());

    return new Response(
      JSON.stringify(result),
      {
        status: result.status,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    if (error instanceof ResponseHandler) {
      return new Response(
        JSON.stringify(error.toResponse("projects index error")),
        {
          status: error.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const fallbackError = new ResponseHandler(
      error.code ?? 500,
      error.response ?? "Failure",
      (error as Error)?.message ?? "Unknown error",
      500,
      error.description ?? "Unknown error ko index",
      error,
    );

    return new Response(
      JSON.stringify(fallbackError.toResponse("projects index crash")),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});
