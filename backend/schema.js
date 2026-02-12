const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const notesSchema = new mongoose.Schema({
    username: String,
    note: String,
    date: { type: Date, default: Date.now },
    isTrashed: { type: Boolean, default: false }
});

module.exports = {
    Users: mongoose.model("Users", userSchema),
    Notes: mongoose.model("Notes", notesSchema)
};
