import * as fs from 'fs';
import { parseOPF } from '../../api/opf-to-metadata.js'

export async function get (req, res, next) {
  const file = req.query.opf;
  console.log(file);
  const url = new URL(file, 'http://example.com/')
  let text
  try {
    const path =  url.pathname
    console.log(url, `static${path}`)
    text = await fs.promises.readFile(`static${path}`)
  } catch (err) {
    res.sendStatus(404)
  }
  try {
    const metadata = parseOPF(text, url.hostname === 'example.com' ? url.pathname : file)
    await fs.promises.writeFile('book2.json', JSON.stringify(metadata, null, 2))
    return res.json(metadata)
  } catch (err) {
    next(err)
  }
}