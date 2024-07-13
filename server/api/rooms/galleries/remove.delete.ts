import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { and, eq } from "drizzle-orm";
import s3Client from "~/server/cloud/s3client";
import db from "~/server/database";
import { galleries } from "~/server/database/schema";
import HttpResponse from "~/server/exceptions/api-response";

export default defineEventHandler(async (e) => {
  try {
    const { roomId, id, imgId } = await readBody(e);

    if (!imgId) {
      return HttpResponse.badRequest(e, "ID not found");
    }

    if (roomId && id) {
      await db
        .delete(galleries)
        .where(and(eq(galleries.id, id), eq(galleries.roomId, roomId)));
    }

    await s3Client.send(
      new DeleteObjectCommand({
        Key: `galleries/${imgId}`,
        Bucket: process.env.AWS_S3_BUCKET as string,
      }),
    );

    return HttpResponse.success(e, "Gallery deleted", {});
  } catch (error: any) {
    return HttpResponse.serverError(
      e,
      error?.message || "Internal Server Error",
    );
  }
});
