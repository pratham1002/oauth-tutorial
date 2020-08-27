const express = require("express");

require("./db/mongoose");

const app = express();
const googleAuthRouter = require('./oauth2/googleAuthRouters')

app.use(express.json());
app.use(googleAuthRouter)

module.exports = app;
