import { DeleteObjectCommand, S3 } from "@aws-sdk/client-s3";
import s3Client from "~/server/cloud/s3client";
import HttpResponse from "~/server/exceptions/api-response";

export default defineEventHandler(async (e) => {
  try {
    const { id, imgId } = await readBody(e);

    if (!imgId) {
      return HttpResponse.badRequest(e, "ID not found");
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
