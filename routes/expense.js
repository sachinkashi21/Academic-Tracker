const express = require('express');
const router = express.Router();

const Expense=require("../models/expense.js");
const { isLoggedIn } = require('../middleware.js');


router.get('/',isLoggedIn,async (req, res) => {
    try {
        
        const expenses = await Expense.findOne({ user: "660c1951d4bce118cf3ce6b2" });

        if (expenses) {
           
            res.render('expense/index.ejs', { data: expenses });
        } else {
           
            res.redirect('/expense/new');
        }
    } catch (err) {
        // Handle errors appropriately
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/new',isLoggedIn, (req, res) => {
    
    res.render('expense/newExp.ejs');
});

router.post('/new',isLoggedIn, async (req, res) => {
    
    try {
        
        const { name, description, amount } = req.body;

        const newExpense = new Expense({
            name: name,
            description: description,
            amount: amount,
            user: req.user._id // Associate the expense with the logged-in user
        });

        await newExpense.save();

        
        res.redirect('/expense');
    } catch (err) {
        
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Get All Expenses
router.get('/',isLoggedIn, async (req, res) => {

    let ydata={data:{
        "tuitionFees": {
          "amount": 30000,
          "date": "2024-04-01"
        },
        "textbooks": [
          { "name": "Book 1", "author": "Author 1", "amount": 20 },
          { "name": "Book 2", "author": "Author 2", "amount": 25 }
        ],
        "stationery": [
          { "name": "Pen", "description": "Blue ballpoint pen", "amount": 5 },
          { "name": "Notebook", "description": "Spiral-bound notebook", "amount": 10 }
        ],
        "otherExpenses": [
          { "name": "Transportation", "description": "Bus fare", "amount": 15 },
          { "name": "Food", "description": "Lunch", "amount": 10 }
        ],
        "monthlyBudget": 500
      }}

    res.render("expense/index.ejs",ydata);
    // try {
    //     const expenses = await Expense.find();
    //     res.json(expenses);
    // } catch (err) {
    //     res.status(500).json({ message: err.message });
    // }
});

// Get Single Expense
router.get('/:id',isLoggedIn, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (expense == null) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json(expense);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Expense
router.put('/expenses/:id',isLoggedIn, async (req, res) => {
    try {
        const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(expense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete Expense
router.delete('/expenses/:id',isLoggedIn, async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});



module.exports = router;