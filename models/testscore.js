const mongoose = require('mongoose');

const testScoreSchema = new mongoose.Schema({
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    studentId: {
      type: String,
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
