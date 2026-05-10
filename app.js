const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {

  if (req.url === "/" && req.method === "GET") {

    res.writeHead(200, { "Content-Type": "text/html" });

    res.write(`
      <html>
        <head>
          <title>Node Form</title>
        </head>
        <body>
          <h1>User Form</h1>

          <form action="/submit" method="POST">
            <input type="text" name="username" placeholder="Enter Name" />
            <button type="submit">Submit</button>
          </form>

        </body>
      </html>
    `);

    return res.end();
  }

  if (req.url === "/submit" && req.method === "POST") {

    const body = [];

    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("end", () => {

      const parsedBody = Buffer.concat(body).toString();

      const message = parsedBody.split("=")[1];

      fs.writeFileSync("message.txt", message);

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