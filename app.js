const express=require('express');
const app=express();
const port=3000;
const bodyParser = require('body-parser');
const cookieparser = require("cookieparser");

cookieparser.parse("foo=bar");
app.use(bodyParser.json());
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")))
app.use(express.urlencoded({extended: true}));

const methodOverride=require("method-override");
app.use(methodOverride("_method"));

const studentRouter=require("./routes/student");

const mongoose = require("mongoose");
main().then((res) => {
    console.log("connection established");
}).catch((err) => {
    console.log(err);
}) 
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/gbuild');
}

app.get("/",(req,res)=>{
    res.send("hello");
})

app.use("/student",studentRouter);

app.listen(port,()=>{
    console.log("app listening at",port);
})