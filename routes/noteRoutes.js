// Importing the express module to create a new express application
const express = require('express');

// Creating a new router object
const router = express.Router();

// Importing the Note and Category models
const Note = require('../models/Note');
const Category = require('../models/Category');

// Route to get all notes
router.get('/notes', async (req, res) => {
    try {
        // Fetch all notes from the database, populate the 'category' field with the 'name' field from the Category model, and exclude 'createdAt' and 'updatedAt' fields
        const notes = await Note.find().populate('category', 'name').select('-createdAt -updatedAt');
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
        // Find or create the category
        let categoryDoc = await Category.findOne({ name: category });
        if (!categoryDoc) {
            categoryDoc = new Category({ name: category });
            await categoryDoc.save();
        }

        // Create a new note and save it to the database
        const newNote = new Note({
            title,
            description,
            date,
            category: categoryDoc._id
        });
        await newNote.save();
        // Send the created note as a response, excluding 'createdAt', 'updatedAt', and '__v' fields
        res.status(201).json(newNote.toObject({ versionKey: false, transform: (doc, ret) => { delete ret.createdAt; delete ret.updatedAt; } }));
    } catch (error) {
        // Send an error response if something goes wrong
        res.status(500).json({ message: 'Failed to create note', error: error.message });
    }
});

// Route to update a note
router.put('/notes/:id', async (req, res) => {
    const { title, description, date, category } = req.body;

    // Check if all required fields are provided
    if (!title || !description || !date || !category) {
        return res.status(400).json({ message: 'Title, description, date, and category are required' });
    }

    try {
        // Find or create the category
        let categoryDoc = await Category.findOne({ name: category });
        if (!categoryDoc) {
            categoryDoc = new Category({ name: category });
            await categoryDoc.save();
        }

        // Update the note and fetch the updated note from the database
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, {
            title,
            description,
            date,
            category: categoryDoc._id
        }, { new: true }).select('-createdAt -updatedAt');

        // Check if the note exists
        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        // Send the updated note as a response, excluding 'createdAt', 'updatedAt', and '__v' fields
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
        const note = await Note.findByIdAndDelete(req.params.id);
        // Check if the note exists
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Check if the category is still used by any other notes
        const categoryUsage = await Note.findOne({ category: note.category });
        if (!categoryUsage) {
            // Delete the category from the database if it's not used by any other notes
            await Category.findByIdAndDelete(note.category);
        }

        // Send a success response
        res.json({ message: 'Note and associated category deleted' });
    } catch (error) {
        // Send an error response if something goes wrong
        res.status(500).json({ message: 'Failed to delete note', error: error.message });
    }
});

// Export the router
module.exports = router;