const express = require("express");
const app = express();
const port = 3030;

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

app.use(express.json());

app.listen(port, function () {
  console.log("listening on " + port);
});

app.post("/films", (req, res) => {
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

/**
 * enpoint for random movie
 */

app.get("/films/randoms", (req, res) => {
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

app.get("/categories", (req, res) => {
  collection
    .distinct("category")
    .then((results) => {
      res.json(results);
    })
    .catch((error) => console.error(error));
});
