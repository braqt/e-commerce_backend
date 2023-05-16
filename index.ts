require("dotenv").config();

const cors = require("cors");

import express from "express";

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors({ origin: true }));

app.listen(PORT, () => console.log("Listening on Port:", PORT));
