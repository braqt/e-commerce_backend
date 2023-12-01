require("dotenv").config();
import { initializeApp, cert } from "firebase-admin/app";

import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import envVars from "./src/constants/config";

import ProductsRoutes from "./src/routes/products";
import OrderRoutes from "./src/routes/orders";
import UserRoutes from "./src/routes/users";
import AdminRoutes from "./src/routes/admin";

const app = express();

app.use(express.json());
app.use(cors({ origin: true }));

mongoose.set("strictQuery", false);
mongoose.connect(envVars.MONGO_URI, {
  dbName: "ecommerce",
});

initializeApp({
  credential: cert(JSON.parse(envVars.CERT)),
});

app.use("/products", ProductsRoutes);
app.use("/orders", OrderRoutes);
app.use("/users", UserRoutes);
app.use("/admin", AdminRoutes);

app.listen(envVars.PORT, () => console.log("Listening on Port:", envVars.PORT));
