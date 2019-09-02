export function normalise (pub) {
  let resources = pub.resources || []
  if (resources.data) {
    resources = resources.data
  }
  let readingOrder = pub.readingOrder || []
  if (readingOrder.data) {
    readingOrder = readingOrder.data
  }
  function fixURLs (item) {
    item.url = new URL(item.url, pub.id).href
    return item
  }
  pub.readingOrder = readingOrder.map(fixURLs)
  pub.resources = resources.map(fixURLs)
  return pub
}
