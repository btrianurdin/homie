import db from "~/server/database";
import HttpResponse from "~/server/exceptions/api-response";

export default defineEventHandler(async (e) => {
  try {
    const rooms = await db.query.rooms.findMany({
      with: {
        galleries: {
          limit: 1,
        },
      },
    });

    return HttpResponse.success(e, "Successfully fetched recommendations.", rooms);
  } catch (error) {
    return HttpResponse.serverError(e, "Internal server error.");
  }
});
