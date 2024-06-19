// Importing the mongoose module, which provides a straightforward, schema-based solution to model your application data with MongoDB
const mongoose = require('mongoose');

// Defining the schema for the Note model
const noteSchema = new mongoose.Schema({
    // The 'title' field is required and will be trimmed to remove any leading or trailing whitespace
    title: {
        type: String,
        required: true,
        trim: true
    },
    // The 'description' field is required and will be trimmed to remove any leading or trailing whitespace
    description: {
        type: String,
        required: true,
        trim: true
    },
    // The 'date' field defaults to the current date and time
    date: {
        type: Date,
        default: Date.now
    },
    // The 'category' field is a reference to a Category model object and is required
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
});

// Exporting the Note model, which can be used in other parts of our application
module.exports = mongoose.model('Note', noteSchema);