#!/usr/bin/env node
const { createServer } = require(".");

const PORT = process.env.PORT ?? 9001;

createServer().listen(PORT);
