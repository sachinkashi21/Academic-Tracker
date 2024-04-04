const express = require('express');
const router = express.Router();

const passport=require("passport");
const LocalStrategy=require("passport-local");

const Student=require("../models/student.js");
const { isLoggedIn } = require('../middleware.js');


router.get("/login",(req,res)=>{
    res.render("student/login.ejs");
})

router.post("/login", passport.authenticate("local",{
    failureRedirect:"/student/login",
    
}),(req,res)=>{
    res.redirect("/student");
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
           
            res.redirect("/student/postsignup");
        })
    } catch(e){
        
        res.redirect("student/signup");
    }
    
})

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        
        res.redirect("/student/login");
    });
});

router.get("/postsignup",isLoggedIn,(req,res)=>{
    res.render("student/postLogin.ejs");
})

router.post("/postsignup",isLoggedIn,async(req,res)=>{
    console.log(req.body);
    let {Semester,branch}=req.body;

    let ans=await Student.findByIdAndUpdate(req.user.id,{semester: Semester,branch: branch});
    console.log(ans,req.user);
    res.redirect("/");
})

router.get("/",(req,res)=>{
    res.render("home.ejs");
})

module.exports = router;