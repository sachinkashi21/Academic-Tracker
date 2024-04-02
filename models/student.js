const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

let studentSchema = new Schema({
    name: String,
    googleId: String,
    photo: {
        type: String,
        default: "assets/avatar.jpg",
        set: (v) => (v === "" ? "avatar.jpg" : v),
    },
    semester: {
        type: Number,
        
    },
    branch: {
        type: String,
        enum:["CSE","ISE","MECH","CIVIL","AIML","EEE","ECE"]
    }

});

studentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Student", studentSchema);
