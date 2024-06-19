// Importing the mongoose module, which provides a straightforward, schema-based solution to model your application data with MongoDB
const mongoose = require('mongoose');

// Defining the schema for the Category model
const categorySchema = new mongoose.Schema({
    // The 'name' field is required and will be trimmed to remove any leading or trailing whitespace
    name: {
        type: String,
        required: true,
        trim: true
    }
});

// Exporting the Category model, which can be used in other parts of our application
module.exports = mongoose.model('Category', categorySchema);