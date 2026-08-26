import { serve } from '@hono/node-server'

import { app } from './app.js'

const port = Number.parseInt(process.env.PORT ?? '3000', 10)

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error('PORT must be an integer between 1 and 65535')
}

serve({ fetch: app.fetch, port }, (serverInfo) => {
  console.log(`API listening on http://localhost:${serverInfo.port}`)
})
