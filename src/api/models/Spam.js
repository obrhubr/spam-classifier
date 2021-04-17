const mongoose = require("mongoose");

const Spam = mongoose.model("Spam", { 
    text: String,
    label: Number
});

exports.Spam = Spam; 