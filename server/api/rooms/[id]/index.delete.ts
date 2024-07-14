import { and, eq } from "drizzle-orm";
import db from "~/server/database";
import {
  galleries,
  roomFacilities,
  roomNearestAccess,
  rooms,
} from "~/server/database/schema";
import HttpResponse from "~/server/exceptions/api-response";

export default defineEventHandler(async (e) => {
  try {
    const { id } = getRouterParams(e);

    if (!id) {
      return HttpResponse.badRequest(e, "Room ID is required");
    }

    await db.transaction(async (tx) => {
      // delete room facilities
      await tx.delete(roomFacilities).where(eq(roomFacilities.roomId, id));
      // delete room nearest access
      await tx
        .delete(roomNearestAccess)
        .where(eq(roomNearestAccess.roomId, id));
      // delete room galleries
      await tx.delete(galleries).where(eq(galleries.roomId, id));
      // delete room
      await tx
        .delete(rooms)
        .where(and(eq(rooms.id, id), eq(rooms.ownerId, e.context.user?.id)));
    });

    return HttpResponse.success(e, "Room deleted successfully", {});
  } catch (error) {
    console.log(error);
    return HttpResponse.serverError(e, "Internal Server Error");
  }
});
