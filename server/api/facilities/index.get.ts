import db from "~/server/database";
import HttpResponse from "~/server/exceptions/api-response";

export default defineEventHandler(async (e) => {
  try {
    const facilities = await db.query.facilities.findMany();

    return HttpResponse.success(e, "Successful Get Facilities", facilities);
  } catch (error: any) {
    return HttpResponse.serverError(
      e,
      error?.message || "Internal Server Error",
    );
  }
});
