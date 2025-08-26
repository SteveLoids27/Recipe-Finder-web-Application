const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true // Prevent duplicate recipes
    },
    ingredients: [{
        item: {
            type: String,
            required: true
        },
        quantity: {
            type: String,
            default: ''
        }
    }],
    instructions: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Recipe', recipeSchema);