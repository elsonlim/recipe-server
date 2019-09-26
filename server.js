const express = require("express");
const cors = require("cors");
const recipeScraper = require("recipe-scraper");
const morgan = require("morgan");

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

app.get("/health", (req, res) => {
  res.status(200).send("up");
});

app.get("/recipe", async (req, res, next) => {
  console.log("url", req.query.url);
  try {
    const recipe = await recipeScraper(req.query.url);
    if (!recipe) {
      return res.sendStatus(404);
    }
    return res.json(recipe);
  } catch (error) {
    return next(error);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.sendStatus(500);
});

app.listen(port, () => console.log("port " + port));
