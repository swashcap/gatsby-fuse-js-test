const compression = require("compression");
const connectSlow = require("connect-slow");
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const path = require("node:path");
const responseTime = require("response-time");
const serveStatic = require("serve-static");

module.exports.createServer = () => {
  const app = express();

  app.use(
    cors({
      origin: [
        "http://localhost:8000",
        "http://localhost:9000",
        "http://localhost:9001",
      ],
    }),
  );
  app.use(compression());
  app.use(morgan("dev"));
  app.use(responseTime());
  app.use(connectSlow({ delay: 2000 }));
  app.use(serveStatic(path.resolve(__dirname, "../public"), { index: false }));

  return app;
};
