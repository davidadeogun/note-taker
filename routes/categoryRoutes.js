// Importing necessary modules
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Route to get all categories
router.get('/categories', async (req, res) => {
    try {
        // Fetch all categories from the database
        const categories = await Category.find();
        // Send the fetched categories as a response
        res.json(categories);
    } catch (error) {
        // Send an error response if something goes wrong
        res.status(500).json({ message: 'Failed to retrieve categories', error: error.message });
    }
});

// Route to create a new category
router.post('/categories', async (req, res) => {
    const { name } = req.body;

    // Check if the category name is provided
    if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
    }

    try {
        // Create a new category and save it to the database
        const newCategory = new Category({ name });
        await newCategory.save();
        // Send the created category as a response
        res.status(201).json(newCategory);
    } catch (error) {
        // Send an error response if something goes wrong
        res.status(500).json({ message: 'Failed to create category', error: error.message });
    }
});

// Export the router
module.exports = router;