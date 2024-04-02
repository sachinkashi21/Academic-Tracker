const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  });

  const Expense = mongoose.model('Expense', expenseSchema);

  module.exports=Expense;