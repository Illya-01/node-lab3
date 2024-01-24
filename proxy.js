import http from 'node:http'
import net from 'node:net'

const CRLF = '\r\n'
const PORT = process.env.PORT || 3000

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
   const { remoteAddress, remotePort } = req.socket
   const { headers, url, method } = req
   const { pathname, hostname } = new URL(url)
   const options = { hostname, path: pathname, method, headers }

   const request = http.request(options, result => void result.pipe(res))

   console.log(
      `HTTP connection from ${remoteAddress}:${remotePort} to ${hostname} established 🤝`
   )

   request.on('error', err => {
      console.error(`Error in outgoing request 🔴: ${err.message}`)
      res.writeHead(500)
      res.end('Internal server error')
   })

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
   const { remoteAddress, remotePort } = socket
   const { hostname, port } = new URL(`http://${req.url}`)
   const targetPort = parseInt(port, 10)

   console.log(
      `HTTPS connection from ${remoteAddress}:${remotePort} to ${hostname}:${targetPort} established 🤝`
   )

   const proxy = net.connect(targetPort, hostname, () => {
      if (head) {
         proxy.write(head)
      }
      socket.pipe(proxy).pipe(socket)
   })

   proxy.on('error', err => {
      console.error(`Error in TCP connection 🔴: ${err.message}`)
      socket.end()
   })
})

server.listen(PORT, () => {
   console.log(`Proxy server starting up 🚀 on port ${PORT}${CRLF}`)
})
