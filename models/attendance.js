const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    studentId: {
      type: String,
      required: true
    },
    attended: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date,
      default: Date.now
    }
  });

  const Attendance = mongoose.model('Attendance', attendanceSchema);

  module.exports=Attendance;