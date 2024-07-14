import { eq, sql } from "drizzle-orm";
import db from "~/server/database";
import {
  roomFacilities,
  roomNearestAccess,
  rooms,
} from "~/server/database/schema";
import HttpResponse from "~/server/exceptions/api-response";
import delayAsync from "~/utils/delay-async";

export default defineEventHandler(async (e) => {
  try {
    const { id } = getRouterParams(e);

    if (!id) {
      return HttpResponse.badRequest(e, "Invalid room id");
    }

    const getRooms = await db.query.rooms.findFirst({
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

    if (!getRooms) {
      return HttpResponse.error(e, "Room not found", {}, 404);
    }

    const getFacilities = await db.query.roomFacilities.findMany({
      with: {
        facility: true,
      },
      where: eq(roomFacilities.roomId, id),
    });
    const getNearestAccess = await db.query.roomNearestAccess.findMany({
      with: {
        nearestAccess: true,
      },
      where: eq(roomNearestAccess.roomId, id),
    });

    const results = {
      ...getRooms,
      facilities: getFacilities.map((facility) => facility.facility),
      nearestAccess: getNearestAccess.map(
        (nearestAccess) => nearestAccess.nearestAccess,
      ),
    };

    return HttpResponse.success(
      e,
      "Room details fetched successfully",
      results,
    );
  } catch (error) {
    console.log(error);
    return HttpResponse.serverError(e, "Internal Server Error");
  }
});
