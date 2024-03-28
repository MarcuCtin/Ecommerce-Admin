import multiparty from 'multiparty';
import fs from 'fs';
import mime from 'mime-types';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
const bucketName = 'mknext-ecommerce';
export default async function handler(req, res) {
  const form = new multiparty.Form();
  const { field, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      resolve({ fields, files });
      console.log(fields, files);
    });
  });

  const client = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.S3AccessKeyId,
      secretAccessKey: process.env.S3SecretAccessKey,
    },
  });
  let links = [];
  for (let file of files.file) {
    const ext = file.originalFilename.split('.').pop();
    const filename = Date.now() + '.' + ext;
    console.log(ext, filename, 'filename');
    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: filename,
        Body: fs.readFileSync(file.path),
        ACL: 'public-read',
        ContentType: mime.lookup(file.path),
      })
    );
    const link = `https://${bucketName}.s3.amazonaws.com/${filename}`;
    links.push(link);
  }

  res.json(links);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
