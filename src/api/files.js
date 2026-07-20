import { get, BASE_URL } from "./client.js";

export function getFile(fileId) {
  return get(`files/${fileId}`);
}

export function getFiles(fileIds) {
  return get(`files?fileIds=${fileIds.join(",")}`);
}

export function fileUrl(filePath) {
  return `${BASE_URL}${filePath}`;
}
