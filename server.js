const express = require("express");
const indexRoutes = require("./routes/routes");

const app = express();
const port = 80;

app.use(express.json());
app.use("/", indexRoutes);

app.listen(port, function () {
  console.log("listening on " + port);
});
