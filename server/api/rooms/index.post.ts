import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import db from "~/server/database";
import {
  galleries,
  roomFacilities,
  roomNearestAccess,
  rooms,
} from "~/server/database/schema";
import HttpResponse from "~/server/exceptions/api-response";
import { InsertRoom } from "~/types";

const validations = z.object({
  title: z.string(),
  description: z.string(),
  price: z.string(),
  address: z.string(),
  period: z.array(z.string()),
  point: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  total_rooms: z.string().transform(Number),
  slots: z.string().transform(Number),
  type: z.string(),
  galleries: z.array(z.string()),
  facilities: z.array(z.string()),
  nearestAccess: z.array(z.string()),
});

export default defineEventHandler(async (e) => {
  try {
    const body = await readBody(e);

    const validate = validations.safeParse(body);
    if (!validate.success) {
      return HttpResponse.error(
        e,
        "Invalid request body",
        validate.error.issues,
        400,
      );
    }

    const description = sanitizeHtml(body.description);
    const newRoom: InsertRoom = {
      ownerId: e.context.user?.id as string,
      title: body.title,
      description: description,
      price: body.price,
      address: body.address,
      allowBookPeriod: body.period?.join(","),
      latitude: body.point?.lat,
      longitude: body.point?.lng,
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

      for (let i = 0; i < body.facilities.length; i++) {
        await tx.insert(roomFacilities).values({
          roomId: room.id,
          facilityId: body.facilities[i],
        });
      }

      for (let i = 0; i < body.nearestAccess.length; i++) {
        await tx.insert(roomNearestAccess).values({
          roomId: room.id,
          nearestAccessId: body.nearestAccess[i],
        });
      }
    });

    return HttpResponse.success(e, "Room has been created", {});
  } catch (error) {
    console.log(error);
    return HttpResponse.serverError(e, "Internal server error");
  }
});
