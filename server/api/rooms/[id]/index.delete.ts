import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { and, eq } from "drizzle-orm";
import s3Client from "~/server/cloud/s3client";
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

      // get galleries of the room
      const _galleries = await tx
        .select()
        .from(galleries)
        .where(eq(galleries.roomId, id));

      console.log(_galleries);

      // delete images from s3
      _galleries.forEach(async (gallery) => {
        const imgId = gallery.image.split("/").pop();
        console.log(imgId);
        await s3Client.send(
          new DeleteObjectCommand({
            Key: `galleries/${imgId}`,
            Bucket: process.env.AWS_S3_BUCKET as string,
          }),
        );
      });

      // delete galleries
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
