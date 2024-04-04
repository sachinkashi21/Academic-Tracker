if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express=require('express');
const app=express();
const port=3000;
const bodyParser = require('body-parser');
const cookieparser = require("cookieparser");

const Agenda=require('agenda');

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
const testRouter=require("./routes/testscore");
const expenseRouter=require("./routes/expense");
const targetRouter=require("./routes/target");
const attendanceRouter=require("./routes/attendance");

let Target=require("./models/target.js");

const mongoose = require("mongoose");
main().then((res) => {
    console.log("connection established");
    // startAgenda();
}).catch((err) => {
    console.log(err);
}) 
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/gbuild');
}
// async function startAgenda() {
//     // Create new instance of Agenda.js
//     const agenda = new Agenda({ mongo: mongoose.connection });
//     console.log("tello");
//     // Define job to check for targets with due date less than 12 hours away
//     agenda.define('check for approaching targets', async (job) => {
//         // Calculate the date 12 hours from now
//         console.log("no")
//         const twelveHoursFromNow = new Date(Date.now() + 12 * 60 * 60 * 1000);

//         // Find targets with due date less than 12 hours away
//         const approachingTargets = await Target.find({ dueDate: { $lt: twelveHoursFromNow } });

//         console.log("bello");    

//         // Iterate over approaching targets and perform actions
//         approachingTargets.forEach(target => {
//             // Example action: Send notification
//             sendNotification(target);
//         });

//         console.log('Checking for approaching targets...');
//     });

//     // Schedule job to run every hour
//     agenda.every('1 second', 'check for approaching targets');
//     console.log("hello");

//     // Start Agenda.js
//     await agenda.start();
//     console.log('Agenda.js started successfully');
// }

// function sendNotification(target) {
//     // Replace this with your notification logic (e.g., using browser notifications, emails, etc.)
//     console.log(`Sending notification for approaching target: ${target.title}`);
// }

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


app.use((req, res, next) => {
    res.locals.currUser = {_id:"660c1951d4bce118cf3ce6b2",semester: 3,username:  'xyx',photo: 'assets/avatar.jpg', }; 
    next();
});


app.get("/",(req,res)=>{
    res.send("hello");
})

app.use("/student",studentRouter);
app.use("/course",courseRouter);
app.use("/test",testRouter);
app.use("/expense",expenseRouter);
app.use("/target",targetRouter);
app.use("/attendance",attendanceRouter);

app.listen(port,()=>{
    console.log("app listening at",port);
})