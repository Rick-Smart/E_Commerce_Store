const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
// import routes
const userRoutes = require("./routes/user");

// app
const app = express();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected");
  });

mongoose.connection.on("error", (error) => {
  console.log(`DB connection error: ${error.message}`);
});

// routes middleware
app.use("/api", userRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
