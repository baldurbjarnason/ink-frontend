import { createPDF } from "./create-pdf.js";

/* istanbul ignore next */
export function pdfModule() {
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  return new Promise(resolve => {
    return loadJS("/js/pdfjs-dist/build/pdf.min.js", () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "/js/pdfjs-dist/build/pdf.worker.js";
      window.CMAP_URL = "/js/pdfjs-dist/cmaps/";
      window.CMAP_PACKED = true;
      return resolve(true);
    });
  });
}

export async function pdf(file) {
  await pdfModule();
  return createPDF(file);
}

/* istanbul ignore next */
function loadJS(src, cb, ordered) {
  var tmp;
  var ref = document.getElementsByTagName("script")[0];
  var script = document.createElement("script");

  if (typeof cb === "boolean") {
    tmp = ordered;
    ordered = cb;
    cb = tmp;
  }

  script.src = src;
  script.async = !ordered;
  ref.parentNode.insertBefore(script, ref);

  if (cb && typeof cb === "function") {
    script.onload = cb;
  }
  return script;
}
