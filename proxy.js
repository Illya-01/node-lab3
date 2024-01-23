import http from 'node:http'
import net from 'node:net'

const CRLF = '\r\n'
const PORT = 8080

/**
 * Receives the body from a stream by chunks
 * and returns it as a concatenated buffer.
 */
const receiveBody = async stream => {
   const chunks = []

   for await (const chunk of stream) {
      chunks.push(chunk)
   }

   return Buffer.concat(chunks)
}

/**
 * Creates an HTTP server that acts as a proxy for incoming requests.
 */
const server = http.createServer(async (req, res) => {
   const { headers, url, method } = req
   const { pathname, hostname } = new URL(url)
   const options = { hostname, path: pathname, method, headers }

   const request = http.request(options, result => void result.pipe(res))
   console.log(`HTTP connection to ${hostname} established 🤝`)

   if (method === 'POST') {
      const body = await receiveBody(req)
      request.write(body)
      console.log(`POST body: ${body.toString()}`)
   }
   request.end()
})

// For HTTPS requests
server.on('connect', (req, socket, head) => {
   socket.write(`HTTP/1.1 200 Connection Established${CRLF}${CRLF}`)
   const { hostname, port } = new URL(`http://${req.url}`)
   const targetPort = parseInt(port, 10)

   const proxy = net.connect(targetPort, hostname, () => {
      if (head) {
         proxy.write(head)
      }
      socket.pipe(proxy).pipe(socket)
   })

   console.log(`HTTPS connection to ${hostname} established 🤝`)
})

server.listen(PORT, () => {
   console.log(`Proxy server listening 👂 on port ${PORT}`)
})
