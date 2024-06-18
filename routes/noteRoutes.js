const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

router.get('/notes', async (req, res) => {
    const notes = await Note.find();
    res.json(notes);
});

router.post('/notes', async (req, res) => {
    const newNote = new Note({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date
    });
    await newNote.save();
    res.json(newNote);
});

router.put('/notes/:id', async (req, res) => {
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedNote);
});

router.delete('/notes/:id', async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
});

module.exports = router;
