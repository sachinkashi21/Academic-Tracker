
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    branch: {
      type: String,
      enum:["CSE","ISE","AIML","MECH","CIVIL","EEE","ECE"]
    },
    code: {
      type: String,
      required: true,
      unique: true
    },
    credits: {
        type: Number,
        required: true,
    },
    semester: {
        type: Number,
    },
    cie: Number,
    see: Number,
    duration:{
        type: Number,
    }
  });

  const Course = mongoose.model('Course', courseSchema);


  module.exports=Course;
