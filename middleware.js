// authMiddleware.js

// Middleware function to check if user is logged in
const isLoggedIn = (req, res, next) => {
    // Check if user is authenticated
    if (req.isAuthenticated()) {
        // If user is authenticated, proceed to next middleware or route handler
        return next();
    } else {
        // If user is not authenticated, redirect to login page
        res.redirect('/student/login');
    }
};

module.exports.isLoggedIn=isLoggedIn;
