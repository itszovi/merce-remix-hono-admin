import { PassThrough } from "stream";
import type { UploadHandler } from "@remix-run/node";
import { writeAsyncIterableToWritable } from "@remix-run/node";
import { S3Client, PutObjectRequest, GetObjectCommand } from "@aws-sdk/client-s3";
import env from "config/env";
import { Upload } from "@aws-sdk/lib-storage";


const uploadStream = ({ Key, Bucket }: PutObjectRequest) => {
  const s3 = new S3Client({
    credentials: {
      accessKeyId: env.STORAGE_ACCESS_KEY,
      secretAccessKey: env.STORAGE_SECRET,
    },
    region: env.STORAGE_REGION,
  });
  const pass = new PassThrough();

  const key = `${Date.now()}-${Key}`;

  return {
    writeStream: pass,
    promise: new Upload({
      client: s3,
      params: {
        Body: pass,
        Bucket,
        Key: 'images/' + key,
      },
    }).done(),
    key
  };
};

export async function uploadStreamToS3(data: any, filename: string) {
  const stream = uploadStream({
    Key: filename,
    Bucket: env.STORAGE_BUCKET
  });
  await writeAsyncIterableToWritable(data, stream.writeStream);

  await stream.promise;

  return `https://${env.STORAGE_BUCKET}.s3.${env.STORAGE_REGION}.amazonaws.com/images/${stream.key}`;
}

export const s3UploadHandler: UploadHandler = async ({
  name,
  filename,
  data,
}) => {
  console.log(name)
  if (name !== "img") {
    return undefined;
  }

  try {
    const uploadedFileLocation = await uploadStreamToS3(data, filename!);
    return uploadedFileLocation;
  } catch (error) {
    console.error('Upload error:', error);
    return undefined;
  }
};