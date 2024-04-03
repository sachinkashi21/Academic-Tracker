const express = require('express');
const router = express.Router();

const Course=require("../models/course.js");
const TestScore=require("../models/testscore.js");

router.get("/",(req,res)=>{
    res.render("test/index.ejs");
})

router.get('/sem', async (req, res) => {
    try {
        const semester = req.query.s; 
        console.log(semester);
        const courses = await Course.find({ semester: semester });
        res.render('test/course.ejs', { courses: courses }); // Render courses page with the retrieved courses
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error'); // Send error response if something goes wrong
    }
});

router.get('/scores/:courseId',async (req, res) => {
    try {
        const courseId = req.params.courseId; 
        const studentId = "660c1951d4bce118cf3ce6b2"; //currUser
        
       
        const testScores = await TestScore.find({ courseId: courseId, studentId: studentId });
        
        res.render("test/scores.ejs",{testScores});
       
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


module.exports = router;