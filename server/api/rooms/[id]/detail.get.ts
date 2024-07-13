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

    const room = await db.query.rooms.findFirst({
      with: {
        galleries: {
          orderBy: (galleries, { desc }) => [desc(galleries.created_at)],
        },
        roomFacilities: true,
        roomNearestAccess: true,
      },
      where: and(eq(rooms.id, id), eq(rooms.ownerId, e.context.user?.id)),
    });

    return HttpResponse.success(e, "Successfully fetched room details", room);
  } catch (error) {
    return HttpResponse.serverError(e, "Internal Server Error");
  }
});
