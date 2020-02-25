require("dotenv").config();

const chalk = require("chalk");

const app = require("./app");

const { log } = console
const { port } = process.env;

app.listen(port, () => log(chalk`🌎 {green Server started!} Listening on port {bold ${port}}`));