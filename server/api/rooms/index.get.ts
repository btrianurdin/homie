import { desc, eq } from "drizzle-orm";
import db from "~/server/database";
import { rooms } from "~/server/database/schema";
import HttpResponse from "~/server/exceptions/api-response";

export default defineEventHandler(async (e) => {
  try {
    const data = await db.query.rooms.findMany({
      columns: {
        id: true,
        title: true,
        address: true,
        type: true,
        price: true,
        ownerId: true,
        created_at: true,
      },
      with: {
        galleries: {
          limit: 1,
        },
      },
      where: eq(rooms.ownerId, e.context.user.id!),
      orderBy: [desc(rooms.created_at)],
    });

    return HttpResponse.success(e, "Rooms retrieved successfully", data);
  } catch (error) {
    console.log(error);
    return HttpResponse.serverError(e, "Internal server error");
  }
});
