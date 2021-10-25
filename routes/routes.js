const express = require("express");
const router = express.Router();

const MongoClient = require("mongodb").MongoClient;

let db;
let collection;

const dotenv = require("dotenv");
dotenv.config();

// user test expiration
MongoClient.connect(
  process.env.DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) return console.error(err);
    console.log("Connected to Database netflix");
    db = client.db("netflix");
    collection = db.collection("films");
  }
);

router.get("/films/:id", (req, res) => {
  const { id } = req.params;

  if (!Number.isInteger(Number(id)) || Number(id) < 0) {
    res
      .status(400)
      .send({ error: "params : id greater than or equal to zero" });
  }

  collection
    .findOne({ id: Number(id) })
    .then((results) => {
      if (results) {
        res.json(results);
      }
      res.json({});
    })
    .catch((error) => res.status(500).send(error));
});

router.post("/films", (req, res) => {
  const { filterByCategory = "", limit = 10, pageNumber } = req.body;
  if (!Number.isInteger(pageNumber) || pageNumber < 0) {
    res
      .status(400)
      .send({ error: "body : pageNumber greater than or equal to zero" });
  }

  let filer = filterByCategory !== "" ? { category: filterByCategory } : {};

  let sort = { _id: 1 };

  collection
    .find(filer)
    .sort(sort)
    .skip(pageNumber > 0 ? (pageNumber - 1) * limit : 0)
    .limit(limit)
    .toArray()
    .then((results) => {
      res.json(results);
    })
    .catch((error) => res.status(500).send(error));
});

router.get("/films/randoms", (req, res) => {
  collection
    .aggregate([
      {
        $match: {
          rating: { $gte: 1 },
        },
      },
      { $sample: { size: 1 } },
    ])
    .toArray()
    .then((results) => {
      res.json(results[0]);
    })
    .catch((error) => res.status(500).send(error));
});

router.get("/categories", (req, res) => {
  collection
    .distinct("category")
    .then((results) => {
      res.json(results);
    })
    .catch((error) => res.status(500).send(error));
});

router.get("/", (req, res) => {
  res.json("hello netflix");
});

module.exports = router;
