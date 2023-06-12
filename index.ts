require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

import ProductsRoutes from "./src/routes/products";

const { PORT, MONGO_URI } = process.env;
const app = express();

app.use(express.json());
app.use(cors({ origin: true }));

mongoose.set("strictQuery", false);
mongoose.connect(MONGO_URI, {
  dbName: "ecommerce",
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/products", ProductsRoutes);

app.listen(PORT, () => console.log("Listening on Port:", PORT));
