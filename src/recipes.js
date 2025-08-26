const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const Recipe = require('../models/Recipe');

const MEALDB_API_URL = 'https://www.themealdb.com/api/json/v1/1';

// Get all saved recipes
router.get('/', async (req, res) => {
    try {
        console.log('Fetching all recipes...'); // Debug log
        const recipes = await Recipe.find().sort({ createdAt: -1 });
        console.log('Found recipes:', recipes); // Debug log
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error); // Debug log
        res.status(500).json({ message: 'Error fetching saved recipes', error: error.message });
    }
});

// Save a new recipe
router.post('/', async (req, res) => {
    try {
        const { name, ingredients, instructions, image } = req.body;
        
        // Check if recipe already exists
        const existingRecipe = await Recipe.findOne({ name });
        if (existingRecipe) {
            return res.status(400).json({ message: 'Recipe already saved' });
        }

        // Create new recipe with properly formatted ingredients
        const recipe = new Recipe({
            name,
            ingredients: ingredients.map(ing => ({
                item: ing.item,
                quantity: ing.quantity
            })),
            instructions,
            image
        });

        await recipe.save();
        res.status(201).json({ message: 'Recipe saved successfully', recipe });
    } catch (error) {
        res.status(500).json({ message: 'Error saving recipe', error: error.message });
    }
});

// Delete a saved recipe
router.delete('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting recipe', error: error.message });
    }
});

// Search recipes by name from TheMealDB
router.get('/search/:name', async (req, res) => {
    try {
    const recipeName = req.params.name;
    const response = await fetch(`${MEALDB_API_URL}/search.php?s=${recipeName}`);
    const data = await response.json();
    
    if (!data.meals) {
      return res.status(404).json({ message: 'No recipes found' });
    }
    
    res.json(data.meals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
});

// Get all saved recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ savedAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching saved recipes', error: error.message });
  }
});

// Save a recipe
router.post('/save', async (req, res) => {
  try {
    const { idMeal, strMeal, strMealThumb, strInstructions } = req.body;
    
    // Check if recipe already exists
    const existingRecipe = await Recipe.findOne({ idMeal });
    if (existingRecipe) {
      return res.status(400).json({ message: 'Recipe already saved' });
    }

    // Format ingredients from the request body
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = req.body[`strIngredient${i}`];
      const measure = req.body[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          ingredient: ingredient.trim(),
          measure: measure ? measure.trim() : ''
        });
      }
    }

    const recipe = new Recipe({
      idMeal,
      strMeal,
      strMealThumb,
      strInstructions,
      ingredients
    });
    await recipe.save();
    res.status(201).json({ message: 'Recipe saved successfully!' });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Recipe already saved' });
    } else {
      res.status(500).json({ message: 'Error saving recipe', error: error.message });
    }
  }
});

module.exports = router;
