import { getServerSession } from "#auth";
import sanitizeHtml from "sanitize-html";
import db from "~/server/database";
import { galleries, rooms } from "~/server/database/schema";
import HttpResponse from "~/server/exceptions/api-response";
import { InsertRoom } from "~/types";

export default defineEventHandler(async (e) => {
  try {
    const body = await readBody(e);
    const session = await getServerSession(e);

    if (!session) return HttpResponse.unauthorized(e);

    const description = sanitizeHtml(body.description);
    const newRoom: InsertRoom = {
      ownerId: session.user?.id as string,
      title: body.title as string,
      description: description,
      price: body.price,
      pricePeriod: body.price_period,
      address: body.address as string,
      allowBookPeriod: body.period?.join(","),
      locationBbox: body.bbox?.join(","),
      locationPoint: `${body.point?.lat},${body.point?.lng}`,
      roomsTotal: body.total_rooms,
      roomsAvailable: body.slots,
      type: body.type,
    };

    await db.transaction(async (tx) => {
      const [room] = await tx
        .insert(rooms)
        .values(newRoom)
        .returning({ id: rooms.id });

      for (let i = 0; i < body.galleries.length; i++) {
        await tx.insert(galleries).values({
          roomId: room.id,
          image: body.galleries[i],
        });
      }
    });

    return HttpResponse.success(e, "Room has been created", {});
  } catch (error) {
    console.log(error);
    return HttpResponse.serverError(e, "Internal server error");
  }
});

// description: body.description as string,
// price: body.price,
// pricePeriod: body.pricePeriod?.join(","),
// location: body.location,
// images: body.images,
// ownerId: session.user?.id,
// locationPoint: `${body.locationPoint[0]},${body.locationPoint[1]}`,
// locationBbox: body.bbox?.join(","),
// type: body.type,
// roomsTotal: body.total_rooms,
// roomsAvailable: body.slots,
// allowBookPeriod: body.period?.join(","),
// address: body.address as string,
