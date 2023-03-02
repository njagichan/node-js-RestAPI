const express = require("express");
const postRoute = require("./users");
const productRoute = require("./products");
const bodyParser = require("body-parser");


const cors = require("cors");


const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());


//app.use("/users",postRoute);
app.use("/products",productRoute);


app.listen(5000);