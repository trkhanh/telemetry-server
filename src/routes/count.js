const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const chalk = require("chalk");
const hash = require("../hash");
const db = require("../db");

module.exports = express.Router()
    .use(bodyParser.json())
    .use(cors())
    .post("/", hashUrl, saveInstance);

function hashUrl(req, res, next) {
    if (
        !req.body.url ||
        !req.body.version ||
        !req.body.type
    ) return res.status(400).end();

    res.locals.info = {
        id: hash(req.body.url),
        created_on: (new Date()).toISOString(),
        type: req.body.type,
        version: req.body.version
    };

    next();
}

function saveInstance(req, res) {
    save(res.locals.info);
    res.status(200).end();
}

function save(info) {
    db
        .select(["id", "version"])
        .from("instances")
        .where("id", info.id)
        .andWhere("type", info.type)
        .limit(1)
        .then(record => {
            if (record.length === 0) {
                db("instances")
                    .insert(info)
                    .then(() => console.log(chalk`{green Added} record of type {bold ${info.type}} on version {blue ${info.version}}`))
                    .catch(error => {
                        console.error(error);
                    });
            } else {
                if (record[0].version !== info.version) {
                    db("instances")
                        .where("id", "=", info.id)
                        .update("version", info.version)
                        .then(() => console.log(chalk`{magenta Updated} record of type {bold ${info.type}} on version {blue ${info.version}}`))
                        .catch(error => {
                            console.error(error);
                        });
                }
            }
        });
}