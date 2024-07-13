import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import db from "~/server/database";
import {
  galleries,
  roomFacilities,
  roomNearestAccess,
  rooms,
} from "~/server/database/schema";
import HttpResponse from "~/server/exceptions/api-response";
import { and, eq } from "drizzle-orm";

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
  galleries: z.array(z.object({ id: z.string(), url: z.string() })),
  facilities: z.array(z.string()),
  nearestAccess: z.array(z.string()),
});

export default defineEventHandler(async (e) => {
  try {
    const { id } = getRouterParams(e);
    const body = await readBody(e);

    if (!id) {
      return HttpResponse.badRequest(e, "Room ID is required");
    }

    const validate = validations.safeParse(body);
    if (!validate.success) {
      return HttpResponse.error(
        e,
        "Invalid request body",
        validate.error.issues,
        400,
      );
    }

    await db.transaction(async (tx) => {
      // update room
      const description = sanitizeHtml(body.description);
      await tx
        .update(rooms)
        .set({
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
        })
        .where(
          and(
            eq(rooms.id, id),
            eq(rooms.ownerId, e.context.user?.id as string),
          ),
        );

      // check existing galleries & check is there any new galleries
      const _galleries = await db.query.galleries.findMany({
        where: eq(galleries.roomId, id),
      });
      const newGalleries = body.galleries.filter(
        (item: { id: string }) => !_galleries.some((i) => i.id === item.id),
      );

      // insert new galleries
      for (let i = 0; i < newGalleries.length; i++) {
        await tx.insert(galleries).values({
          roomId: id,
          image: newGalleries[i].url,
        });
      }

      // remove existing room facilities
      await tx.delete(roomFacilities).where(eq(roomFacilities.roomId, id));
      // insert new room facilities
      for (let i = 0; i < body.facilities.length; i++) {
        await tx.insert(roomFacilities).values({
          roomId: id,
          facilityId: body.facilities[i],
        });
      }

      // remove existing room nearest access
      await tx
        .delete(roomNearestAccess)
        .where(eq(roomNearestAccess.roomId, id));
      // insert new room nearest access
      for (let i = 0; i < body.nearestAccess.length; i++) {
        await tx.insert(roomNearestAccess).values({
          roomId: id,
          nearestAccessId: body.nearestAccess[i],
        });
      }
    });

    return HttpResponse.success(e, "Room updated successfully", {});
  } catch (error) {
    return HttpResponse.serverError(e, "Internal Server Error");
  }
});
