const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance');
const Course=require('../models/course.js');
const { isLoggedIn } = require('../middleware.js');

// Route to view details about attendance
router.get('/',isLoggedIn, async (req, res) => {

    // const { studentId } = req.user;  
    let studentId=req.user;
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
router.get("/new",isLoggedIn,async(req,res)=>{
    try {
        // Retrieve all courses from the database
        const courses = await Course.find({ semester: req.user.semester }).sort(); // Assuming you have a 'semester' field in the Course model
        
        // Pass courses data to the EJS template
        res.render('attendance/newForm.ejs', { courses });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

router.post('/new',isLoggedIn, async (req, res) => {
    // const { studentId } = req.user;
    let studentId = req.user;

    const { courseId, daysInWeek, startOfCourseDate, endOfCourseDate, extraClasses } = req.body;
    try {
        // Split daysInWeek string into an array and trim whitespace
        const daysInWeekArray = daysInWeek.split(",").map(day => day.trim());

        // Create an empty 2D array for myAttendance with default value "non"
        const numberOfWeeks = Math.ceil((new Date(endOfCourseDate) - new Date(startOfCourseDate)) / (1000 * 60 * 60 * 24 * 7));
        const daysInWeekCount = daysInWeekArray.length;
        const myAttendance = Array.from({ length: numberOfWeeks }, () => Array.from({ length: daysInWeekCount }, () => 'non'));

        // Create a new attendance record
        const attendance = new Attendance({
            courseId,
            studentId,
            daysInWeek: daysInWeekArray,
            startOfCourseDate,
            endOfCourseDate,
            extraClasses,
            myAttendance
        });

        // Save the attendance record to the database
        await attendance.save();
        res.redirect("/attendance");
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



// Route to get info of particular course attendance
router.get('/:courseId',isLoggedIn, async (req, res) => {
    const { studentId } = req.user;
    // let studentId="660c1951d4bce118cf3ce6b2";
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

router.get('/edit/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;

    try {
        // Find the attendance record by ID
        const attendance = await Attendance.findById(id);

        if (!attendance) {
            return res.status(404).send('Attendance record not found');
        }

        res.render('attendance/editForm', { attendance });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


router.put('/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { daysInWeek, startOfCourseDate, endOfCourseDate, extraClasses } = req.body;
    
    try {
        // Find the attendance record by ID
        const attendance = await Attendance.findById(id);

        if (!attendance) {
            return res.status(404).send('Attendance record not found');
        }

        // Update the specified fields
        if (daysInWeek) {
            attendance.daysInWeek = daysInWeek.split(",").map(day => day.trim());
        }
        if (startOfCourseDate) {
            attendance.startOfCourseDate = startOfCourseDate;
        }
        if (endOfCourseDate) {
            attendance.endOfCourseDate = endOfCourseDate;
        }
        if (extraClasses) {
            attendance.extraClasses = extraClasses;
        }

        const startDate = new Date(startOfCourseDate);
        const endDate = new Date(endOfCourseDate);
        const numberOfDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
        const numberOfWeeks = Math.ceil(numberOfDays / 7);
        const newMyAttendance = Array.from({ length: numberOfWeeks }, () => attendance.daysInWeek.map(() => 'non'));
        attendance.myAttendance = newMyAttendance;

        // Save the updated attendance record
        await attendance.save();

        // res.status(200).send('Attendance record updated successfully');
        res.redirect("/attendance");
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/delete/:id', isLoggedIn,async (req, res) => {
    const { id } = req.params;

    try {
        // Find the attendance record by ID and delete it
        const deletedAttendance = await Attendance.findByIdAndDelete(id);

        if (!deletedAttendance) {
            return res.status(404).send('Attendance record not found');
        }

        // res.status(200).send('Attendance record deleted successfully');
        res.redirect("/attendance");
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/weekly/:attendanceId',isLoggedIn, async (req, res) => {
    const { attendanceId } = req.params;

    try {
        // Retrieve attendance record by ID
        const attendance = await Attendance.findById(attendanceId);

        if (!attendance) {
            return res.status(404).send('Attendance record not found');
        }

        // Calculate the number of weeks between start and end dates
        const startDate = new Date(attendance.startOfCourseDate);
        const endDate = new Date(attendance.endOfCourseDate);
        const daysInWeek = attendance.daysInWeek;
        const numberOfDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
        const numberOfWeeks = Math.ceil(numberOfDays / 7);

        // Assuming myAttendance is already populated with attendance data
        const myAttendance = attendance.myAttendance;

        // Render the EJS template with attendance data
        res.render('attendance/myAtt.ejs', {
            attendanceId,
            startOfCourseDate: startDate,
            endOfCourseDate: endDate,
            courseId: attendance.courseId,
            myAttendance,
            daysInWeek,
            numberOfWeeks
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


router.post('/:attendanceId/mark',isLoggedIn, async (req, res) => {
    const { attendanceId } = req.params;
    const { weekIndex, dayIndex, status } = req.body;

    try {
        // Find the attendance record by ID
        const attendance = await Attendance.findById(attendanceId);

        if (!attendance) {
            return res.status(404).send('Attendance record not found');
        }

        // Update the attendance status
        attendance.myAttendance[weekIndex][dayIndex] = status;

        // Save the updated attendance record
        await attendance.save();

        res.redirect(`/attendance/weekly/${attendanceId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
