const express = require("express");
const app = express();
const dotenv = require("dotenv");
const errorMiddleware = require("./middleware/error");
const path = require("path");
const cookieParser = require("cookie-parser");
app.use(express.json());

app.use(cookieParser());

const payment = require("./routes/paymentRoutes");

app.use("/api/v1", payment);

dotenv.config({ path: path.join(__dirname, "config/config.env") });

app.use(errorMiddleware);

module.exports = app;
