const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance');
const Course=require('../models/course.js');

// Route to view details about attendance
router.get('/', async (req, res) => {
    // const { studentId } = req.user;
    let studentId="660c1951d4bce118cf3ce6b2";
    try {
        // Retrieve all attendance records
        const studentAttendance = await Attendance.find({ studentId }).populate("courseId");
        // Pass the attendance records to the EJS page for rendering
        res.render('attendance/show.ejs', { studentAttendance });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to post info about attendance
router.get("/new",async(req,res)=>{
    try {
        // Retrieve all courses from the database
        const courses = await Course.find({ semester: 3 }).sort(); // Assuming you have a 'semester' field in the Course model
        
        // Pass courses data to the EJS template
        res.render('attendance/newForm.ejs', { courses });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

router.post('/new', async (req, res) => {
    // const { studentId } = req.user;
    let studentId="660c1951d4bce118cf3ce6b2";
   
    const { courseId,daysInWeek, startOfCourseDate, endOfCourseDate, extraClasses } = req.body;
    try {
        // Create a new attendance record
        const attendance = new Attendance({
            courseId,
            studentId,
            daysInWeek,
            startOfCourseDate,
            endOfCourseDate,
            extraClasses
        });
        // Save the attendance record to the database
        await attendance.save();
        res.status(201).send('Attendance record created successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// Route to get info of particular course attendance
router.get('/:courseId', async (req, res) => {
    // const { studentId } = req.user;
    let studentId="660c1951d4bce118cf3ce6b2";
    const { courseId } = req.params;
    try {
        // Retrieve attendance records for the specified course ID
        const courseAttendance = await Attendance.find({ studentId, courseId });
        // Pass the course attendance records to the EJS page for rendering
        res.render('courseAttendance', { courseAttendance });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});




module.exports = router;
