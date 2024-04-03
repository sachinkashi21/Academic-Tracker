// Step 3: Create a Database Schema

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the Target model
const targetSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum:["done","pending","missied"]
    }
    
}, {
    timestamps: true 
});


const Target = mongoose.model('Target', targetSchema);
module.exports = Target;
