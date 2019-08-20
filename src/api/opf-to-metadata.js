const cheerio = require("cheerio");

const options = {
  withDomLvl1: true,
  normalizeWhitespace: false,
  xmlMode: true,
  decodeEntities: true
};

export function parseOPF(text, opfPath) {
  const $ = cheerio.load(text, options);
  let book = {
    type: "Publication",
    links: [],
    resources: [],
    readingOrder: [],
    json: {}
  };
  book.inLanguage = $("dc\\:language").text();
  book.name = $("dc\\:title").text();

  const packageElement = $("package");
  const idforid = packageElement.attr("unique-identifier");
  book.identifier = $(`#${idforid}`).text();
  book.json.epubVersion = packageElement.attr("version");
  const ncxId = $("spine").attr("toc");
  const coverId = $('[name="cover"]').attr("content");
  // This needs to add a reference to the OPF file itself for later use.
  // Use rel=describedBy
  book.resources = $("manifest > item")
    .map((index, item) => {
      const node = $(item);
      const properties = node.attr("properties");
      const rel = [];
      if (properties && properties.indexOf("nav") !== -1) {
        rel.push("contents");
      }
      const id = node.attr("id");
      if (id === ncxId) {
        rel.push("ncx");
      }
      if (properties && properties.indexOf("cover-image") !== -1) {
        rel.push("cover");
      } else if (id === coverId) {
        rel.push("cover");
      }

      return {
        url: getPath(node.attr("href"), opfPath),
        rel,
        id,
        encodingFormat: node.attr("media-type")
      };
    })
    .toArray();
  book.readingOrder = $('itemref:not([linear="no"])')
    .map((index, ref) => {
      const node = $(ref);
      return book.resources.find(item => {
        return item.id === node.attr("idref");
      });
    })
    .toArray();
  book.resources = book.resources.map(item => {
    delete item.id;
    return item;
  });
  book.creator = $("dc\\:creator")
    .map((index, author) => {
      return $(author).text();
    })
    .toArray();

  book.publisher = $("dc\\:publisher")
    .map((index, publisher) => {
      return $(publisher).text();
    })
    .toArray();
  const knownRoles = ["trl", "ill", "edt", "clr", "aut"];
  const creators = $("dc\\:creator")
    .map((index, contributor) => {
      const node = $(contributor);
      return {
        name: node.text(),
        id: node.attr("id"),
        role: node.attr("opf:role")
      };
    })
    .toArray();
  const contributors = $("dc\\:contributor")
    .map((index, contributor) => {
      const node = $(contributor);
      return {
        name: node.text(),
        id: node.attr("id"),
        role: node.attr("opf:role")
      };
    })
    .toArray();
  if (book.json.epubVersion !== "2.0") {
    $('meta[property="role"]').each((index, role) => {
      const node = $(role);
      const id = node.attr("refines");
      const refined =
        creators.find(item => item.id === id.replace("#", "")) ||
        contributors.find(item => item.id === id.replace("#", ""));
      refined.role = node.text();
    });
  }
  book.author = creators
    .filter(creator => creator.role === "aut")
    .map(creator => creator.name);
  book.creator = creators
    .filter(creator => !knownRoles.includes(creator.role))
    .map(creator => creator.name);

  book.translator = contributors
    .filter(contributor => contributor.role === "trl")
    .map(contributor => contributor.name);
  book.illustrator = contributors
    .filter(contributor => contributor.role === "ill")
    .map(contributor => contributor.name);
  book.editor = contributors
    .filter(contributor => contributor.role === "edt")
    .map(contributor => contributor.name);
  book.colorist = contributors
    .filter(contributor => contributor.role === "clr")
    .map(contributor => contributor.name);
  book.contributor = contributors
    .filter(contributor => !knownRoles.includes(contributor.role))
    .map(creator => creator.name);
  return book;
}

function getPath(path, opfPath) {
  const opf = new URL(opfPath, "http://example.com/");
  // If host is example.com, then this is a local request.
  if (opf.hostname === "example.com") {
    return new URL(decodeURIComponent(path), opf).pathname;
  } else {
    return new URL(decodeURIComponent(path), opf).href;
  }
}
