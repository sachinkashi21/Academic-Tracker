const express = require('express');
const router = express.Router();

const Course=require("../models/course.js");
const { isLoggedIn } = require('../middleware.js');

router.get("/",isLoggedIn, async (req, res) => {
    try {
        const courses = await Course.find({});
        res.render('course/index.ejs', { courses: courses }); // Rendering index.ejs and passing the courses data
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})

router.get('/new',isLoggedIn, (req, res) => {
    res.render('course/create.ejs'); 
});

// Route to handle form submission
router.post('/new',isLoggedIn, async (req, res) => {
    try {
        const { name, code, credits, semester, cie, see, duration,branch } = req.body;
        
        
        const newCourse = new Course({
            name,
            code,
            credits,
            semester,
            cie,
            see,
            duration,
            branch
        });

        // Save the new course to the database
        await newCourse.save();

        // res.send('Course added successfully!');
        res.redirect("/course");
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');

    }
});

router.delete('/:id',isLoggedIn, async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        if (!deletedCourse) {
            return res.status(404).send("Course not found");
        }
        res.send("Course deleted successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/:id/edit',isLoggedIn, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).send("Course not found");
        }
        res.render('course/edit.ejs', { course: course });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/:id/update',isLoggedIn, async (req, res) => {
    try {
        const courseId = req.params.id;
        const { cie, see, semester, credits, duration,branch } = req.body;

        // Find the course by ID and update its fields
        const updatedCourse = await Course.findByIdAndUpdate(courseId, {
            cie,
            see,
            semester,
            credits,
            duration,
            branch
        }, { new: true });

        if (!updatedCourse) {
            return res.status(404).send("Course not found");
        }

        res.redirect('/course'); // Redirect to the courses page after updating
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
