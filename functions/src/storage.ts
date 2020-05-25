import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import * as fs from "fs-extra";
import { tmpdir } from "os";
import { join } from "path";
import * as sharp from "sharp";
import { Storage } from "@google-cloud/storage";

const gcs = new Storage();

export const resizeAvatar = functions.storage
  .object()
  .onFinalize(async (object) => {
    const bucket = gcs.bucket(object.bucket);

    const filePath = object.name;
    const fileName = filePath?.join("/").pop();
    const tempFilePath = join(tmpdir(), fileName);

    const avatarFileName = "avatar_" + fileName;
    const tempAvatarPath = join(tmpdir(), avatarFileName);

    if (fileName.includes("avatar_")) {
      console.log("Exiting function - file was most likely already resized");
      return false;
    }

    await bucket.file(filePath).download({ destination: tempFilePath });

    await sharp(tempFilePath).resize(100, 100).toFile(tempAvatarPath);

    return bucket.upload(tempAvatarPath, {
      destination: join(dirname(filePath), avatarFileName)
    });
  });
