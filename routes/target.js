const express = require('express');
const router = express.Router();
const Target = require('../models/target');
const { isLoggedIn } = require('../middleware');


router.get('/',isLoggedIn, async (req, res) => {
    try {
        
        
        // let req.user.id="660c1951d4bce118cf3ce6b2";

        const targets = await Target.find({ user: req.user.id });
        targets.sort((a, b) => a.dueDate - b.dueDate);
        const currentTargets = targets.filter(target => {
            const now = new Date();
            return target.dueDate >= now;
        });

        res.render('target/index.ejs', { targets: currentTargets });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/new',isLoggedIn, (req, res) => {
   

    res.render('target/newTarget.ejs');
});



router.post('/new', isLoggedIn,async (req, res) => {
  

    try {
       
        const { title, description, dueDate } = req.body;

        // let req.user.id="660c1951d4bce118cf3ce6b2";

        const newTarget = new Target({
            title: title,
            description: description,
            dueDate: dueDate,
            user: req.user.id
        });

        
        await newTarget.save();

        
        res.redirect('/target');
    } catch (err) {
        
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/:id/done',isLoggedIn, async (req, res) => {
    const targetId = req.params.id;

    try {
        // Find the target by ID
        const target = await Target.findById(targetId);

        if (!target) {
            // If target not found, redirect back to the page
            return res.redirect('/targets');
        }

        // Update the status of the target to "done"
        target.status = target.status === 'pending' ? 'done' : 'pending';
        
        // Save the updated target
        await target.save();

        // Redirect back to the page
        res.redirect('/target');
    } catch (err) {
        console.error('Error marking target as Done:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to delete a target
router.post('/:id/delete',isLoggedIn, async (req, res) => {
    const targetId = req.params.id;

    try {
        // Find the target by ID and delete it
        await Target.findByIdAndDelete(targetId);
        
        // Redirect back to the page
        res.redirect('/target');
    } catch (err) {
        console.error('Error deleting target:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to update a target
router.get('/:id/edit',isLoggedIn, async (req, res) => {
    const targetId = req.params.id;

    try {
        // Find the target by ID
        const target = await Target.findById(targetId);

        if (!target) {
            // If target not found, redirect back to the page
            return res.redirect('/target');
        }

        // Render the edit form with the target data
        res.render('target/editTarget.ejs', { target });
    } catch (err) {
        console.error('Error fetching target for editing:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle form submission for updating a target
router.post('/:id/edit',isLoggedIn, async (req, res) => {
    const targetId = req.params.id;
    const { title, description, dueDate } = req.body;

    try {
        // Find the target by ID and update its details
        await Target.findByIdAndUpdate(targetId, { title, description, dueDate });

        // Redirect back to the page
        res.redirect('/target');
    } catch (err) {
        console.error('Error updating target:', err);
        res.status(500).send('Internal Server Error');
    }
});




module.exports = router;
