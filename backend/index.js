const express = require("express");
const cookiesparser = require("cookie-parser");
const cors = require("cors");
const dbconnect = require("./config/db");

const connectionroute = require("./routes/Coneectionroutes");
const userroute = require("./routes/userroutes");
const authroute = require("./routes/authroutes");
const postroutes = require("./routes/Postroutes");



const app = express();
require('dotenv').config();

app.use(cookiesparser());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

dbconnect();
app.use(express.json());


app.use('/api/connections', connectionroute);
app.use('/api', userroute);
app.use('/api', authroute);
app.use('/api', postroutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running!' });
});


if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;