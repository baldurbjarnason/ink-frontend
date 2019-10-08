import * as book from './book.js'
import * as layout from './layout.js'

export function stores () {
  return {...book, ...layout}
}