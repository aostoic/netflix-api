const express = require("express");
const router = express.Router();

const MongoClient = require("mongodb").MongoClient;

let db;
let collection;
MongoClient.connect(
  "mongodb+srv://aostoic:darkluk1A1@cluster0.wcwko.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) return console.error(err);
    console.log("Connected to Database netflix");
    db = client.db("netflix");
    collection = db.collection("films");
  }
);

router.post("/films", (req, res) => {
  const { filterByCategory = "", limit = 10, pageNumber = 0 } = req.body;

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
    .catch((error) => console.error(error));
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
    .catch((error) => console.error(error));
});

router.get("/categories", (req, res) => {
  collection
    .distinct("category")
    .then((results) => {
      res.json(results);
    })
    .catch((error) => console.error(error));
});

module.exports = router;
