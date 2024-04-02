if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

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

const engine=require("ejs-mate");
app.engine("ejs",engine);

const studentRouter=require("./routes/student");
const courseRouter=require("./routes/course");

const mongoose = require("mongoose");
main().then((res) => {
    console.log("connection established");
}).catch((err) => {
    console.log(err);
}) 
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/gbuild');
}


const passport=require("passport");
const LocalStrategy=require("passport-local");

//User model require
const Student=require("./models/student.js");

//require sessions and flash middleware
const session=require("express-session");
const MongoStore = require('connect-mongo');
// const flash=require("connect-flash");

//session store
// let store=MongoStore.create({
//     mongoUrl: dbUrl,
//     crypto:{
//         secret: process.env.SECRET,
//     },
//     touchAfter: 60*60*3,
// });

// store.on("error",()=>{
//     console.log("ERROR IN MONGO SESSION STORE",err);
// })

// session
let sessionOptions={
    // store,      
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized:true,
    cookie: {
        expires: Date.now()+ 1000*60*60*24*3,
        maxAge: 1000*60*60*24*3,
        httpOnly: true,
    }
}
app.use(session(sessionOptions));
// app.use(flash());


//define after session MW
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Student.authenticate()));

passport.serializeUser(Student.serializeUser());
passport.deserializeUser(Student.deserializeUser());




app.get("/",(req,res)=>{
    res.send("hello");
})

app.use("/student",studentRouter);
app.use("/course",courseRouter);

app.listen(port,()=>{
    console.log("app listening at",port);
})