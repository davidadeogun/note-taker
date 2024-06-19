// Importing necessary modules
const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Route to get all notes
router.get('/notes', async (req, res) => {
    try {
        // Fetch all notes from the database, excluding createdAt and updatedAt fields, and populate the category field
        const notes = await Note.find().select('-createdAt -updatedAt').populate('category');
        // Send the fetched notes as a response
        res.json(notes);
    } catch (error) {
        // Send an error response if something goes wrong
        res.status(500).json({ message: 'Failed to retrieve notes', error: error.message });
    }
});

// Route to create a new note
router.post('/notes', async (req, res) => {
    const { title, description, date, category } = req.body;

    // Check if all required fields are provided
    if (!title || !description || !date || !category) {
        return res.status(400).json({ message: 'Title, description, date, and category are required' });
    }

    try {
        // Create a new note and save it to the database
        const newNote = new Note({
            title,
            description,
            date,
            category
        });
        await newNote.save();
        // Send the created note as a response, excluding the versionKey, createdAt, and updatedAt fields
        res.status(201).json(newNote.toObject({ versionKey: false, transform: (doc, ret) => { delete ret.createdAt; delete ret.updatedAt; } }));
    } catch (error) {
        // Send an error response if something goes wrong
        res.status(500).json({ message: 'Failed to create note', error: error.message });
    }
});

// Route to update an existing note
router.put('/notes/:id', async (req, res) => {
    const { title, description, date, category } = req.body;

    // Check if all required fields are provided
    if (!title || !description || !date || !category) {
        return res.status(400).json({ message: 'Title, description, date, and category are required' });
    }

    try {
        // Update the note in the database and fetch the updated note
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-createdAt -updatedAt');
        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        // Send the updated note as a response, excluding the versionKey, createdAt, and updatedAt fields
        res.json(updatedNote.toObject({ versionKey: false, transform: (doc, ret) => { delete ret.createdAt; delete ret.updatedAt; } }));
    } catch (error) {
        // Send an error response if something goes wrong
        res.status(500).json({ message: 'Failed to update note', error: error.message });
    }
});

// Route to delete a note
router.delete('/notes/:id', async (req, res) => {
    try {
        // Delete the note from the database
        const deletedNote = await Note.findByIdAndDelete(req.params.id).select('-createdAt -updatedAt');
        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        // Send a success message as a response
        res.json({ message: 'Note deleted' });
    } catch (error) {
        // Send an error response if something goes wrong
        res.status(500).json({ message: 'Failed to delete note', error: error.message });
    }
});

// Export the router
module.exports = router;