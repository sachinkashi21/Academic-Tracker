const express = require('express');
const router = express.Router();

const Course=require("../models/course.js");

router.get("/", async (req, res) => {
    try {
        const courses = await Course.find({});
        res.render('course/index.ejs', { courses: courses }); // Rendering index.ejs and passing the courses data
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
})

router.get('/new', (req, res) => {
    res.render('course/create.ejs'); 
});

// Route to handle form submission
router.post('/new', async (req, res) => {
    try {
        const { name, code, credits, semester, cie, see, duration } = req.body;
        
        
        const newCourse = new Course({
            name,
            code,
            credits,
            semester,
            cie,
            see,
            duration
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

router.delete('/:id', async (req, res) => {
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

router.get('/:id/edit', async (req, res) => {
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

router.post('/:id/update', async (req, res) => {
    try {
        const courseId = req.params.id;
        const { cie, see, semester, credits, duration } = req.body;

        // Find the course by ID and update its fields
        const updatedCourse = await Course.findByIdAndUpdate(courseId, {
            cie,
            see,
            semester,
            credits,
            duration
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
