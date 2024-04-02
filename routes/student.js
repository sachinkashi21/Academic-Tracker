const express = require('express');
const router = express.Router();

const passport=require("passport");
const LocalStrategy=require("passport-local");

const Student=require("../models/student.js");


router.get("/login",(req,res)=>{
    res.render("student/login.ejs");
})

router.post("/login", passport.authenticate("local",{
    failureRedirect:"/student/login",
    
}),(req,res)=>{
    res.redirect("/home");
})

router.get("/signup",(req,res)=>{
    res.render("student/signup.ejs");
})
router.post("/signup",async(req,res)=>{
    try{
        let {username, password}=req.body;
        let newUser= new Student({
            username,
        });
        let registeredUser=await Student.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
           
            res.redirect("/");
        })
    } catch(e){
        // req.flash("error",e.message);
        res.redirect("student/signup");
    }
    
})

router.get("/",(req,res)=>{
    res.render("home.ejs");
})

module.exports = router;