const connectDB = require("./db/connect");
const express = require("express");
const cors = require("cors");
const router = require("./routes/postRoutes");

require("dotenv").config();
const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.json({ message: "welcome to app" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = 8080;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, console.log("Server is listening on", { PORT }));
  } catch (err) {
    console.log(err);
  }
};

start();
