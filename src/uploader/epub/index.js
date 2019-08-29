import { uploadMedia } from "../upload-media.js";
import { initEpub } from "./initEpub.js";
import { create } from "../../api/create.js";

/* istanbul ignore next */
async function zipModule() {
  if (window.JSZip) return window.JSZip;
  return import(window.ZIPJSPATH || "/js/vendor/jszip/dist/jszip.js").then(
    module => {
      window.JSZip = module.default;
      return module.default;
    }
  );
}

export async function epub(file) {
  await zipModule();
  const zip = await window.JSZip.loadAsync(file, {
    base64: false
  });
  const bookContext = { file, zip };
  const init = await initEpub(bookContext);
  const created = await addEpubToLibrary(init);
  const uploaded = await uploadMedia(created);
  return uploaded;
}

async function addEpubToLibrary(contextPromise) {
  const context = await contextPromise;
  const created = await create(context.book);
  context.book.id = created.id;
  return context;
}
