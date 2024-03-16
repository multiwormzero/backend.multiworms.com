import { S3Client, ListObjectsCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs';
import sharp from "sharp";
import path from 'path';


const s3Client = new S3Client({ region: 'us-east-2' });
const bucketName = 'com.multiworms.nftstore';
const namespace = 'images/0x4551c11b22fdd733a0328c62d6ef4e4c6496dada/QmaKk7DLEbavE9gXFvfds2dwLcdrRu3sbD6sJLp8G1Xfm8/';


async function getexistingImages() {
    // Declare truncated as a flag that the while loop is based on.
    let truncated = true;
    // Declare a variable to which the key of the last element is assigned to in the response.
    let pageMarker;
    // while loop that runs until 'response.truncated' is false.
    let counter = 0;
    const keyArray = [];
    const bucketParams = { Bucket: bucketName, Prefix: namespace };

    while (truncated) {
      try {
        const response = await s3Client.send(new ListObjectsCommand(bucketParams));
        // return response; //For unit tests
        if (Array.isArray(response.Contents) && response.Contents.length > 0) {
            response.Contents.forEach((item) => {
            keyArray[counter] = item.Key;
            counter++;
            });
        }
        // Log the key of every item in the response to standard output.
        truncated = response.IsTruncated;
        // If truncated is true, assign the key of the last element in the response to the pageMarker variable.
        if (truncated) {
          pageMarker = response.Contents.slice(-1)[0].Key;
          // Assign the pageMarker value to bucketParams so that the next iteration starts from the new pageMarker.
          bucketParams.Marker = pageMarker;
        }
        // At end of the list, response.truncated is false, and the function exits the while loop.
      } catch (err) {
        console.log("Error", err);
        truncated = false;
      }
    }
    return keyArray;
  }

const s3Objects = await getexistingImages();

console.log(s3Objects[0]);

for (let i = 0; i < s3Objects.length; i++) {
  const params = { Bucket: bucketName, Key: s3Objects[i] };
  const data = await s3Client.send(new GetObjectCommand(params));
  const image = await data.Body.transformToByteArray();
  const thumb = await sharp(image).resize({fit: sharp.fit.contain, width: 100}).png().toBuffer();

  const s3ThumbParams = {
    Bucket: bucketName,
    Key: namespace+'thumbnails/'+path.basename(s3Objects[i], path.extname(s3Objects[i]))+'.png',
    Body: thumb,
    ContentType: 'image/png'
  };

  try {
    const thumbUpload = await s3Client.send(new PutObjectCommand(s3ThumbParams));
    if (i % 100 == 0) {
      console.log(`${i}: Successful Put`)
    }
  } catch (err) {
    console.log("Error", err);
  }
}