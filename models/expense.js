const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    },
    items: [{
        name: { type: String, required: true },
        description: String,
        amount: { type: Number, required: true }
    }],

    tuitionFees: {
      amount: Number,
      date: { type: Date, default: Date.now },
      receipt: Number,
  },
  textbooks: [{
      name: String,
      author: String,
      amount: Number
  }],
  stationery: [{
      name: String,
      description: String,
      amount: Number
  }],
  otherExpenses: [{
      name: String,
      description: String,
      amount: Number
  }],
  monthlyBudget: Number,
  yearlyBudget: Number,
  
});

  const Expense = mongoose.model('Expense', expenseSchema);

  module.exports=Expense;