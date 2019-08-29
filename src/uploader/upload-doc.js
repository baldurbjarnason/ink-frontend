import queue from "async-es/queue";
import { pdf } from "./pdf.js";
import { epub } from "./epub/";
import { writable } from "svelte/store";
const { subscribe, set, update } = writable([]);

const importQueue = queue(upload);
importQueue.drain(() => {
  set([]);
});
importQueue.error((err, task) => {
  console.error(err);
});
async function create(file) {
  // file can either be an actual file or an object describing an Article with a type: 'Article'
  switch (file.type) {
    case "application/pdf":
      return pdf(file);
    case "application/epub+zip":
      return epub(file);
    default:
      break;
  }
}
async function upload(file) {
  const book = await create(file);
  if (book) {
    update(files => {
      const set = new Set(files);
      set.delete(file);
      return [...set];
    });
    return book;
  }
}
function add(file) {
  update(files => {
    const set = new Set(files);
    set.ad(file);
    return [...set];
  });
  importQueue.push(file);
}

export const uploadQueue = {
  subscribe,
  add
};
