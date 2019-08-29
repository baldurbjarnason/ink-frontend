import queue from "async-es/queue";
import { fetchWrap } from "../api/fetch-wrap.js";

export async function uploadMedia(doc) {
  const { book, media } = await doc;
  const uploadQueue = queue(uploadData(doc), 5);
  for (const item of media) {
    uploadQueue.push(item);
  }
  const mediaPaths = media.map(item => item.documentPath);
  for (const item of book.resources) {
    if (!mediaPaths.includes(item.url)) {
      uploadQueue.push({
        documentPath: item.url,
        mediaType: item.encodingFormat,
        json: {}
      });
    }
  }
  await uploadQueue.drain();
  return book;
}

function uploadData(doc) {
  const { zip, book } = doc;
  return async function uploader(item) {
    if (
      item.mediaType.includes("javascript") ||
      item.mediaType.includes("jscript") ||
      item.mediaType.includes("ecmascript")
    ) {
      return;
    }
    try {
      const data = new window.FormData();
      const filename = decodeURI(item.url)
        .split("/")
        .pop();
      let file;
      if (item.file) {
        file = item.file;
      } else {
        const blob = await zip.file(decodeURI(item.documentPath)).async("blob");
        file = new window.File([blob], filename, { type: item.mediaType });
      }
      data.append("file", file);
      data.append("documentPath", item.documentPath);
      data.append("mediaType", item.mediaType);
      data.append("json", JSON.stringify(item.json));
      return upload(data, `${book.id}file-upload`);
    } catch (err) {
      console.error(err);
      err.httpMethod = "Parser";
      throw err;
    }
  };
}

async function upload(payload, endpoint) {
  const user = window._session.user
  try {
    const response = await fetchWrap(endpoint, {
      credentials: "include",
      method: "POST",
      body: payload,
      headers: new global.Headers({
        Authorization: `Bearer ${user.token}`
      })
    });
    return response.json();
  } catch (err) {
    err.httpMethod = "POST/Upload Media";
    throw err;
  }
}
