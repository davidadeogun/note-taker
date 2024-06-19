const mongoose = require('mongoose');
const Category = require('./models/Category');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        const categories = [
            { name: 'Urgent' },
            { name: 'Urgent and Important' },
            { name: 'Important' },
            { name: 'Not Important' }
        ];

        await Category.insertMany(categories);
        console.log('Categories inserted');
        mongoose.disconnect();
    })
    .catch(err => {
        console.error('Error inserting categories', err);
    });
