import { ResponseHandler } from "./responseHandler.ts";

export class Helper {

    verifyPayloadFields(
        payload: Record<string, any>,
        fields: Record<string, unknown>,
        trackFile: string | null = null,
    ): boolean {
        const result = {
            isValid: true,
            missingFields: [] as string[],
            invalidFields: [] as string[],
            message: "",
        };

        for (const [field, type] of Object.entries(fields)) {
            if (!Object.prototype.hasOwnProperty.call(payload, field)) {
                result.isValid = false;
                result.missingFields.push(field);
            } else if (
                type === "array"
                    ? !Array.isArray(payload[field])
                    : typeof payload[field] !== type
            ) {
                result.isValid = false;
                result.invalidFields.push(field);
            }
        }

        result.message = `${result.missingFields.join(", ") || "none"} ${
            result.missingFields.length == 1 ? "is" : "are"
        } missing & ${result.invalidFields.join(", ") || "none"} ${
            result.invalidFields.length == 1 ? "is" : "are"
        } invalid in ${trackFile ? trackFile : "request payload"}`;

        if (!result.isValid) {

            console.log("the payload", result.message)
            throw new ResponseHandler(
                "14",
                "Failure",
                "Invalid payload",
                400,
                result.message,
            ).toResponse("There is a lot going on in your payload mate");
        }

        return result.isValid;
    }

    handle404() {
        return { status: 404, toResponse: (msg: string) => ({ message: msg }) };
    }

}
