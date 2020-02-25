const express = require("express");
const axios = require("axios");
const db = require("../db");

let lastFetch = null;

module.exports = express.Router()
  .get("/", fetchVersionsIfNeeded, getRecords);

function fetchVersionsIfNeeded(req, res, next) {
  if (lastFetch === null || dateDiffInDays(lastFetch || new Date(), new Date()) > 2) {
    Promise.all([
      axios.get("https://api.github.com/repos/directus/app/releases"),
      axios.get("https://api.github.com/repos/directus/api/releases")
    ])
      .then(([appRes, apiRes]) => ({ app: appRes.data, api: apiRes.data }))
      .then(({ app, api }) => {
        const extractInfo = (array, repo) => array.map(({ name, published_at, body }) => ({
          version: name,
          date: published_at,
          info: body,
          repo
        }));

        return [...extractInfo(app, "app"), ...extractInfo(api, "api")];
      })
      .then(records => {
        db
          .delete()
          .from("versions")
          .then(() => {
            lastFetch = new Date();
            db("versions").insert(records).then(() => next());
          });
      })
      .catch(error => {
        console.error(error);
        res.status(500).end();
      });
  }

  return next();
}

function dateDiffInDays(a, b) {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / 1000 * 60 * 60 * 24);
}

function getRecords(req, res) {
  db
    .select("*")
    .from("versions")
    .orderBy("date", "desc")
    .then(records => {
      res.send(records);
    })
    .catch(error => {
      console.error(error);
      res.status(500).end();
    });
}