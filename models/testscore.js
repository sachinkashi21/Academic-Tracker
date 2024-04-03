const mongoose = require('mongoose');
const {Schema}= mongoose;

const testScoreSchema = new mongoose.Schema({
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    degree: {
      type: String,
    },
    cie:{
      internal1:{
        examMonth: {
          type: Number, 
          min: 1,
          max: 12 // Assuming month numbers are between 1 and 12
        },
        marks:{
          written: {
            type: Number,
            min: 0,
            max: 20,
          },
          assignment: {
            type: Number,
            min: 0,
            max: 5,
          },
        }
      },
      internal2:{
        examMonth: {
          type: Number, 
          min: 1,
          max: 12 // Assuming month numbers are between 1 and 12
        },
        marks:{
          written: {
            type: Number,
            min: 0,
            max: 20,
          },
          assignment: {
            type: Number,
            min: 0,
            max: 5,
          },
        }
      },
    },
    see:{
      examMonth: {
        type: Number, 
        min: 1,
        max: 12 // Assuming month numbers are between 1 and 12
      },
      marks: {
        type: Number,
        min: 0, 
        max: 100,
      }
    },
    status:{
      type: String,
      enum:["pass","fail"],
    },
    Grade: {
      type: String,
      enum: ["A", "B", "C", "D", "F"],
    },
   
  });

  
  const TestScore = mongoose.model('TestScore', testScoreSchema);

  module.exports=TestScore;
