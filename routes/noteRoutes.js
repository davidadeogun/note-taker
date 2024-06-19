const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

router.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find().select('-createdAt -updatedAt').populate('category');
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve notes', error: error.message });
    }
});

router.post('/notes', async (req, res) => {
    const { title, description, date, category } = req.body;

    if (!title || !description || !date || !category) {
        return res.status(400).json({ message: 'Title, description, date, and category are required' });
    }

    try {
        const newNote = new Note({
            title,
            description,
            date,
            category
        });
        await newNote.save();
        res.status(201).json(newNote.toObject({ versionKey: false, transform: (doc, ret) => { delete ret.createdAt; delete ret.updatedAt; } }));
    } catch (error) {
        res.status(500).json({ message: 'Failed to create note', error: error.message });
    }
});

router.put('/notes/:id', async (req, res) => {
    const { title, description, date, category } = req.body;

    if (!title || !description || !date || !category) {
        return res.status(400).json({ message: 'Title, description, date, and category are required' });
    }

    try {
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-createdAt -updatedAt');
        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(updatedNote.toObject({ versionKey: false, transform: (doc, ret) => { delete ret.createdAt; delete ret.updatedAt; } }));
    } catch (error) {
        res.status(500).json({ message: 'Failed to update note', error: error.message });
    }
});

router.delete('/notes/:id', async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id).select('-createdAt -updatedAt');
        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({ message: 'Note deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete note', error: error.message });
    }
});

module.exports = router;
