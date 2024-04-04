const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Expense = require("../models/expense.js");
const { isLoggedIn } = require('../middleware.js');

// Route to render the form for creating a new expense
router.get('/new', isLoggedIn, (req, res) => {
    res.render('expense/newExpense.ejs');
});

// Route to render the form for editing an existing expense
router.get('/:id/edit', isLoggedIn, async (req, res) => {
    try {
        const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
        if (!isValidObjectId) {
            return res.status(404).json({ message: 'Invalid expense ID' });
        }

        const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.render('expense/editExpense.ejs', { expense: expense });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new expense
router.post('/', isLoggedIn, async (req, res) => {
    try {
        const { items, monthlyBudget, yearlyBudget } = req.body;

        // Validate incoming data
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Items array is required and should not be empty' });
        }

        // Create new expense instance
        const newExpense = new Expense({
            user: req.user._id,
            items: items.map(item => ({
                name: item.name,
                description: item.description,
                amount: item.amount
            })),
            monthlyBudget: monthlyBudget,
            yearlyBudget: yearlyBudget
        });

        // Save the new expense
        await newExpense.save();

        res.redirect("/expense");
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Get all expenses for a user
router.get('/', isLoggedIn, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user._id });
        res.render('expense/allExpenses.ejs', { expenses: expenses });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Update an expense
router.put('/:id', isLoggedIn, async (req, res) => {
    try {
        const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
        if (!isValidObjectId) {
            return res.status(404).json({ message: 'Invalid expense ID' });
        }

        const updatedExpense = await Expense.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
        if (!updatedExpense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json(updatedExpense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an expense
router.delete('/:id', isLoggedIn, async (req, res) => {
    try {
        const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
        if (!isValidObjectId) {
            return res.status(404).json({ message: 'Invalid expense ID' });
        }

        const deletedExpense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!deletedExpense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
