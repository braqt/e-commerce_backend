require("dotenv").config();

import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import ProductsRoutes from "./src/routes/products";
import OrderRoutes from "./src/routes/orders";
import UserRoutes from "./src/routes/users";
import { initializeApp, cert } from "firebase-admin/app";

const { PORT, MONGO_URI, CERT } = process.env;
const app = express();

app.use(express.json());
app.use(cors({ origin: true }));

mongoose.set("strictQuery", false);
mongoose.connect(MONGO_URI, {
  dbName: "ecommerce",
});

initializeApp({
  credential: cert(JSON.parse(CERT)),
});

app.use("/products", ProductsRoutes);
app.use("/orders", OrderRoutes);
app.use("/users", UserRoutes);

app.listen(PORT, () => console.log("Listening on Port:", PORT));
