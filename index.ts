import { serve, file } from "bun";
interface Data {
    translatedText: string;
  }

const server = Bun.serve({
    port:3000,
    fetch(req , server) {
        // upgrade the request to a WebSocket
        if (server.upgrade(req)) {
            return; // do not return a Response
        }
    const url = new URL(req.url);
    if (url.pathname === "/") return new Response(Bun.file("./index.html"));
    if (url.pathname === "/script.js") return new Response(Bun.file("./script.js"));
    return new Response(`404!`);
    },
    websocket: {
        async message(ws, message) {
            const jsonString = Buffer.from(message).toString('utf8')
            const parsedData = JSON.parse(jsonString)
            const resourceData = JSON.stringify(parsedData.data)
            const res = await fetch("https://translate.argosopentech.com/translate", {
                method: "POST",
                body: JSON.stringify({
                  q: resourceData,
                  source: "de",
                  target: "en"
                }),
                headers: { "Content-Type": "application/json" }
              });
                 const en_json = await res.json() as Data;
                 const en_text = JSON.stringify(en_json["translatedText"])   
                 ws.send(en_text.slice(3,-3)); // echo back the message
        }, // a message is received
        open(ws) {}, // a socket is opened
        close(ws, code, message) {}, // a socket is closed
        drain(ws) {}, // the socket is ready to receive more data
    }, // handlers
  });

  
  
  console.log(`Listening on http://localhost:${server.port}...`);
  