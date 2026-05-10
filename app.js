const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {

  if (req.url === "/" && req.method === "GET") {

    let messages = [];

    if (fs.existsSync("messages.txt")) {

      const fileData = fs.readFileSync("messages.txt", "utf8");

      messages = fileData
        .split("\n")
        .filter(msg => msg.trim() !== "");
    }

    messages.reverse();

    res.writeHead(200, { "Content-Type": "text/html" });

    res.write(`
      <html>
        <head>
          <title>Message App</title>

          <style>
            body{
              font-family: Arial;
              padding: 30px;
            }

            form{
              margin-top: 20px;
            }

            input{
              padding: 10px;
              width: 250px;
            }

            button{
              padding: 10px 20px;
              cursor: pointer;
            }

            .message{
              background: #f1f1f1;
              padding: 10px;
              margin: 10px 0;
              border-radius: 5px;
            }
          </style>

        </head>

        <body>

          <h1>Messages</h1>

          ${messages.map(msg => `
            <div class="message">${msg}</div>
          `).join("")}

          <form action="/message" method="POST">

            <input 
              type="text" 
              name="message" 
              placeholder="Enter message"
              required
            />

            <button type="submit">
              Send
            </button>

          </form>

        </body>
      </html>
    `);

    return res.end();
  }

  if (req.url === "/message" && req.method === "POST") {

    const body = [];

    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("end", () => {

      const parsedBody = Buffer.concat(body).toString();

      const message = decodeURIComponent(
        parsedBody.split("=")[1]
      );

      fs.appendFileSync("messages.txt", message + "\n");

      res.statusCode = 302;
      res.setHeader("Location", "/");

      return res.end();
    });

    return;
  }

  res.writeHead(404, { "Content-Type": "text/html" });

  res.write("<h1>Page Not Found</h1>");

  res.end();
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});