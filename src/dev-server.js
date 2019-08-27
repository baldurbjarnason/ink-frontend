import sirv from "sirv";
import httpStrategies from 'passport-http'
import passport from 'passport'
import * as fs from 'fs'
import * as https from 'https'

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
const options = {
  key: fs.readFileSync('./dev/localhost.key'),
  cert: fs.readFileSync('./dev/localhost.cert'),
  requestCert: false,
  rejectUnauthorized: false
}

export function devServer (app, sapper) {
  passport.use(new httpStrategies.BasicStrategy((username, password, callback) => {
    if (password === 'devpassword') {
      const user = {id: username}
      return callback(null, user)
    } else {
      return (null, false)
    }
  }))
  app
    .use(
      sirv("static", { dev }),
      
      sapper.middleware({
        session: (req, res) => {
          return {
            user: req.user
          }
        }
      })
    )
  
  const server = https.createServer(options, app)
  server.listen(PORT, function (err) {
    if (err) console.log('error', err)
    console.log('Express server listening on port ' + server.address().port)
  })
}