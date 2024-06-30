import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import mime from "mime";
import s3Client from "~/server/cloud/s3client";
import HttpResponse from "~/server/exceptions/api-response";
import createId from "~/utils/create-id";

export default defineEventHandler(async (e) => {
  try {
    const body = await readMultipartFormData(e);

    if (!body?.[0]) {
      return HttpResponse.badRequest(e, "File not found");
    }

    const file = body[0];
    if (!file || !file?.type?.includes("image")) {
      return HttpResponse.badRequest(e, "File must be an image");
    }

    const extention = mime.getExtension(file.type);
    const fileName = `${createId(15)}${Date.now()}.${extention}`;

    const s3params: PutObjectCommandInput = {
      Bucket: process.env.AWS_S3_BUCKET as string,
      Key: `galleries/${fileName}`,
      Body: file.data.buffer as Buffer,
      ContentType: file.type,
    };

    await s3Client.send(new PutObjectCommand(s3params));

    return HttpResponse.success(
      e,
      "File uploaded",
      {
        id: fileName,
        url: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/galleries/${fileName}`,
      },
      201,
    );
  } catch (error: any) {
    return HttpResponse.serverError(
      e,
      error?.message || "Internal Server Error",
    );
  }
});
