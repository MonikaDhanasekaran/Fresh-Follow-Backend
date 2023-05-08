const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const dotenv = require("dotenv");
dotenv.config();
const db = require("./db/connect");
db();

// import auth routes

const auth = require("./models/authModel");
const register = require("./routes/registerRoutes");
const product = require("./routes/productRoutes");
const contact = require("./routes/contactRoutes");

app.get("/", (req,res) => {
    res.send("Welcome to My Fresh Follow App!!!");
});

app.use("/freshFollow", register);
app.use("/", auth.authenticateUser);
app.use("/freshFollow/product", product);
app.use("/freshFollow/contact", contact);

const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{
    console.log(`App is running on the PORT ${process.env.PORT}`);
});