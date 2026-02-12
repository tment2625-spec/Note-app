const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
app.use(cors());
app.use(express.json());
const connectDB = require("./connectDB");
connectDB();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { Users, Notes } = require("./schema");


app.get('/users', async(req,res)=>{
    const users = await Users.find();
    res.json(users);
})

app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log("Signup attempt:", { username, email });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new Users({ 
            username, 
            email, 
            password: hashedPassword 
        });
        
        await user.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Error creating user", error: err.message });
    }
})

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("Login attempt:", { username });

        const user = await Users.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        res.status(200).json({ message: "Login successful", user: { username: user.username, email: user.email } });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Error logging in", error: err.message });
    }
})


app.post('/api/add-note', async (req, res) => {
    try {
        const { username, note } = req.body;
        console.log("Add note attempt:", { username, note });

        const newNote = new Notes({ 
            username, 
            note 
        });
        
        await newNote.save();

        res.status(201).json({ message: "Note added successfully" });
    } catch (err) {
        console.error("Add note error:", err);
        res.status(500).json({ message: "Error adding note", error: err.message });
    }
})

app.get('/api/notes', async(req,res)=>{
    try {
        const notes = await Notes.find({ isTrashed: false }).sort({ date: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: "Error fetching notes" });
    }
})

app.get('/api/notes/trash', async(req,res)=>{
    try {
        const notes = await Notes.find({ isTrashed: true }).sort({ date: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: "Error fetching trashed notes" });
    }
})

app.put('/api/notes/restore/:id', async (req, res) => {
    try {
        await Notes.findByIdAndUpdate(req.params.id, { isTrashed: false });
        res.status(200).json({ message: "Note restored successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error restoring note" });
    }
})

app.delete('/api/notes/permanent/:id', async (req, res) => {
    try {
        await Notes.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Note permanently deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting note permanently" });
    }
})

app.delete('/api/notes/:id', async (req, res) => {
    try {
        await Notes.findByIdAndUpdate(req.params.id, { isTrashed: true });
        res.status(200).json({ message: "Note moved to trash" });
    } catch (err) {
        console.error("Delete note error:", err);
        res.status(500).json({ message: "Error moving note to trash" });
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
