import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, type Files, type Fields } from "formidable";
import fs from "fs";
import crypto from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/aws-s3";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new IncomingForm();

  const data = await new Promise<{ fields: Fields; files: Files }>(
    (resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    },
  );

  try {
    const file = Array.isArray(data.files.file)
      ? data.files.file[0]
      : data.files.file;
    if (!file || !file.filepath) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const buffer = fs.readFileSync(file.filepath);
    const fileName = crypto.randomBytes(32).toString("hex");

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileName,
      Body: buffer,
      ContentType: file.mimetype || undefined,
    });

    await s3Client.send(command);

    return res.status(200).json({ data: fileName });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
