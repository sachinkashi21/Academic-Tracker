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

        const daysInWeekArray = daysInWeek.split(",").map(day => day.trim());

        const attendance = new Attendance({
            courseId,
            studentId,
            daysInWeek: daysInWeekArray,
            startOfCourseDate,
            endOfCourseDate,
            extraClasses
        });
        // Save the attendance record to the database
        await attendance.save();
        // res.status(201).send('Attendance record created successfully');
        res.redirect("/attendance");
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

router.get('/edit/:id', async (req, res) => {
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


router.put('/:id', async (req, res) => {
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

        // Save the updated attendance record
        await attendance.save();

        // res.status(200).send('Attendance record updated successfully');
        res.redirect("/attendance");
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/delete/:id', async (req, res) => {
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

router.get('/weekly/:courseId', async (req, res) => {
    // const { courseId } = req.params;
    // const studentId="660c1951d4bce118cf3ce6b2";
    // try {
    //     // Find attendance records for the student and course
    //     const attendance = await Attendance.find({ studentId, courseId });

    //     if (!attendance || attendance.length === 0) {
    //         return res.render('attendance/myAtt', { weeklyAttendance: [] });
    //     }

    //     // Group attendance records by week number
    //     const weeklyAttendance = attendance.reduce((acc, record) => {
    //         const startDate = new Date(record.startOfCourseDate);
    //         const endDate = new Date(record.endOfCourseDate);

    //         // Calculate the number of days in the course
    //         const daysInCourse = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    //         // Calculate the number of weeks in the course
    //         const weeksInCourse = Math.ceil(daysInCourse / 7);

    //         // Distribute attendance records into respective weeks
    //         for (let i = 0; i < weeksInCourse; i++) {
    //             const weekStartDate = new Date(startDate);
    //             const weekEndDate = new Date(startDate);
    //             weekEndDate.setDate(weekEndDate.getDate() + 6); // Set week end date to 6 days after start date

    //             // Check if attendance record falls within the current week
    //             if (record.startOfCourseDate <= weekEndDate && record.endOfCourseDate >= weekStartDate) {
    //                 const weekNumber = i + 1; // Week number starts from 1
    //                 if (!acc[weekNumber]) {
    //                     acc[weekNumber] = [];
    //                 }

    //                 // Extract attendance details for the current week
    //                 const weekAttendance = {
    //                     weekNumber,
    //                     attendanceDetails: record.weeklyAttendance.filter(day => {
    //                         const dayDate = new Date(day.date);
    //                         return dayDate >= weekStartDate && dayDate <= weekEndDate;
    //                     })
    //                 };

    //                 acc[weekNumber].push(weekAttendance);
    //             }

    //             // Move to the next week
    //             startDate.setDate(startDate.getDate() + 7);
    //         }

    //         return acc;
    //     }, {});

    //     res.render('attendance/myAtt.ejs', { weeklyAttendance });
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).send('Internal Server Error');
    // }
    const weeklyAttendance = [
        {
          weekNumber: 1,
          attendanceDetails: [
            { date: new Date("2024-03-01"), present: true },
            { date: new Date("2024-03-02"), present: false },
            { date: new Date("2024-03-03"), present: true },
            { date: new Date("2024-03-04"), present: true },
            { date: new Date("2024-03-05"), present: false },
            { date: new Date("2024-03-06"), present: true },
            { date: new Date("2024-03-07"), present: true }
          ]
        },
        {
          weekNumber: 2,
          attendanceDetails: [
            { date: new Date("2024-03-08"), present: true },
            { date: new Date("2024-03-09"), present: true },
            { date: new Date("2024-03-10"), present: false },
            { date: new Date("2024-03-11"), present: true },
            { date: new Date("2024-03-12"), present: true },
            { date: new Date("2024-03-13"), present: true },
            { date: new Date("2024-03-14"), present: false }
          ]
        }
      ];
      
    res.render('attendance/myAtt.ejs',{weeklyAttendance});
});


module.exports = router;
