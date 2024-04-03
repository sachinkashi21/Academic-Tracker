const express = require('express');
const router = express.Router();

const Course=require("../models/course.js");
const TestScore=require("../models/testscore.js");

router.get("/",(req,res)=>{
    res.render("test/index.ejs");
})

router.get('/score', async (req, res) => {
    try {
        const semester = req.query.s; 
        
        const courses = await Course.find({ semester: semester });
        const testScores= await TestScore.find({ studentId: "660c1951d4bce118cf3ce6b2",semester: semester}).populate("course");
        
        res.render('test/course.ejs', { courses: courses, testScores}); // Render courses page with the retrieved courses
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error'); // Send error response if something goes wrong
    }
});

router.get("/scores/add", async (req, res) => {
    try {
        semester=4;
        
        // to be edditted

        const courses = await Course.find({ semester: {$lt:semester} });
        
        res.render('test/addTest.ejs', { courses, studentId: "660c1951d4bce118cf3ce6b2" }); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

router.post('/scores/add', async (req, res) => {
    try {
        
        const newTestScore = new TestScore({
            course: req.body.course,
            studentId: req.body.studentId,
            degree: req.body.degree,
            semester: req.body.semester,
            cie: {
                internal1: {
                    examMonth: req.body.internal1_examMonth,
                    marks: {
                        written: req.body.internal1_written,
                        assignment: req.body.internal1_assignment
                    }
                },
                internal2: {
                    examMonth: req.body.internal2_examMonth,
                    marks: {
                        written: req.body.internal2_written,
                        assignment: req.body.internal2_assignment
                    }
                },
                
            },
            see: {
                examMonth: req.body.see_examMonth,
                marks: req.body.see_marks
            },
            status: req.body.status,
            Grade: req.body.Grade
        });
        
        await newTestScore.save();
        res.redirect(`/test/scores/${req.body.course}`); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/scores/:courseId', async (req, res) => {
    const courseId = req.params.courseId;
    const studentId = "660c1951d4bce118cf3ce6b2"; 
    try {
        
        const testScores = await TestScore.find({ course: courseId, studentId: studentId }).populate('course');

       
        res.render('test/scores.ejs', { testScores });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/scores/:id/edit', async (req, res) => {
    const testScoreId = req.params.id;

    try {
        
        const testScore = await TestScore.findById(testScoreId).populate('course');

        if (!testScore) {
            return res.status(404).send('Test score not found');
        }

        // Render the EJS template with the test score data
        res.render('test/edit.ejs', { testScore });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/scores/:id/edit', async (req, res) => {
    const testScoreId = req.params.id;

    try {
        
        let ans=await TestScore.findByIdAndUpdate(testScoreId, {
            $set: {
                'semester':req.body.semester,
                'cie.internal1.marks.written': req.body.internal1_written,
                'cie.internal1.marks.assignment': req.body.internal1_assignment,
                'cie.internal2.marks.written': req.body.internal2_written,
                'cie.internal2.marks.assignment': req.body.internal2_assignment,
                'see.marks': req.body.see_marks,
                'status': req.body.status,
                'Grade': req.body.Grade
            }
        });

        
        res.redirect(`/test/scores/${ans.course}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;