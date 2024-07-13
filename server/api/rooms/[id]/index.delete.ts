import { and, eq } from "drizzle-orm";
import db from "~/server/database";
import { rooms } from "~/server/database/schema";
import HttpResponse from "~/server/exceptions/api-response";

export default defineEventHandler(async (e) => {
  try {
    const { id } = getRouterParams(e);

    if (!id) {
      return HttpResponse.badRequest(e, "Room ID is required");
    }

    await db.transaction(async (tx) => {
      await tx
        .delete(rooms)
        .where(and(eq(rooms.id, id), eq(rooms.ownerId, e.context.user?.id)));
    });
  } catch (error) {
    return HttpResponse.serverError(e, "Internal Server Error");
  }
});
