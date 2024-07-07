import db from "~/server/database";
import HttpResponse from "~/server/exceptions/api-response";

export default defineEventHandler(async (e) => {
  try {
    const nearestAccess = await db.query.nearestAccess.findMany();

    return HttpResponse.success(
      e,
      "Successful Get Nearest Access",
      nearestAccess,
    );
  } catch (error: any) {
    return HttpResponse.serverError(
      e,
      error?.message || "Internal Server Error",
    );
  }
});
