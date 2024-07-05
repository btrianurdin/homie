import { eq, sql } from "drizzle-orm";
import db from "~/server/database";
import { rooms } from "~/server/database/schema";
import HttpResponse from "~/server/exceptions/api-response";
import delayAsync from "~/utils/delay-async";

export default defineEventHandler(async (e) => {
  try {
    const { id } = getRouterParams(e);

    if (!id) {
      return HttpResponse.badRequest(e, "Invalid room id");
    }

    const [room] = await db.query.rooms.findMany({
      columns: {
        ownerId: false,
      },
      with: {
        galleries: true,
        owner: {
          columns: {
            name: true,
            created_at: true,
            phone: true,
            picture: true,
          },
        },
      },
      where: eq(rooms.id, id),
    });

    if (!room) {
      return HttpResponse.error(e, "Room not found", {}, 404);
    }

    return HttpResponse.success(e, "Room details fetched successfully", room);
  } catch (error) {
    console.log(error);
    return HttpResponse.serverError(e, "Internal Server Error");
  }
});
