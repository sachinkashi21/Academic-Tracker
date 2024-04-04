const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    daysInWeek: {
        type: [Number], // Array of numbers representing days in a week (e.g., 1 for Monday, 2 for Tuesday, etc.)
        required: true
    },
    startOfCourseDate: {
        type: Date,
        required: true
    },
    endOfCourseDate: {
        type: Date,
        required: true
    },
    extraClasses: {
        type: Number, // Number representing the count of extra classes
        default: 0
    },
    myAttendance: {
        type: [[String]], // 2D array representing attendance status
        validate: {
            validator: function(arr) {
                return Array.isArray(arr) && arr.every(subArr => Array.isArray(subArr) && subArr.every(item => ['present', 'absent', 'non'].includes(item)));
            },
            message: props => `${props.value} is not a valid attendance status.`
        }
    }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
