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
    score: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  });

  
  const TestScore = mongoose.model('TestScore', testScoreSchema);

  module.exports=TestScore;
