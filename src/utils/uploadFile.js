import path from "node:path";
import fs from "fs/promises";

import dotenv from "dotenv";
import HTTP_STATUS from "./http-status.js";

dotenv.config({
  path: path.resolve(
    process.cwd(),
    `.env.${process.env.NODE_ENV || "development"}`
  ),
});

// const file_extension = (type) => {
//   const allowed = ["png", "jpg", "jpeg", "gif"];
//   const ext = type.split("/").pop()?.toLowerCase() || "";
//   return allowed.includes(ext) ? ext : "";
// };

const file_extension = (type) => {
  const allowed = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "video/mp4",
    "video/quicktime",
  ];

  return allowed.includes(type) ? type : "";
};

const upload = async (buffer, filename, directory = "") => {
  let result = null;
  const saveDirectory = "public/uploads/" + directory;
  const fullSavePath = path.resolve(saveDirectory);
  await fs.mkdir(fullSavePath, { recursive: true });
  const filePath = path.join(fullSavePath, filename);
  await fs.writeFile(filePath, buffer);

  const DOMAIN = process.env.DOMAIN;
  // const PORT = process.env.PORT;
  // const PROTOCOL = process.env.PROTOCOL || "http";

  // const domain = DOMAIN
  //   ? `${PROTOCOL}://${DOMAIN}${PORT ? `:${PORT}` : ""}`
  //   : "http://localhost:3200";

  const domain = DOMAIN;

  result = `${domain}/${saveDirectory}/${filename}`;
  return result;
};

async function uploadFile(file, directory = "") {
  // Return the URL on success

  const ext = file_extension(file.mimetype);

  if (!ext) {
    const invalid =
      fileData.Type || file.filename.split(".").pop() || "unknown";
    const err = new Error(`File not uploaded: unsupported type "${invalid}"`);
    err.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    throw err;
  }

  const fileData = {
    Original: file.filename,
    Body: file.buffer,
    UniqueName: `${crypto.randomUUID()}.${file.filename.split(".").pop()}`,
    Folder: directory,
    Type: file.mimetype,
  };

  const bannerUrl = await upload(
    fileData.Body,
    fileData.UniqueName,
    fileData.Folder
  ).catch(() => {
    const err = new Error("File not upload");
    err.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    throw err;
  });

  return bannerUrl;
}

export default uploadFile;
