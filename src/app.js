document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const recipeResults = document.getElementById('recipeResults');
    const recipeImage = document.getElementById('recipeImage');
    const recipeName = document.getElementById('recipeName');
    const ingredientsList = document.getElementById('ingredientsList');
    const instructions = document.getElementById('instructions');
    const saveButton = document.getElementById('saveButton');
    const saveConfirmation = document.getElementById('saveConfirmation');

    // Function to show error message
    const showError = (message) => {
        error.textContent = message;
        error.classList.remove('hidden');
        recipeResults.classList.add('hidden');
    };

    // Function to show notification
    const showNotification = (message, type) => {
        saveConfirmation.textContent = message;
        saveConfirmation.classList.remove('hidden');
        
        if (type === 'success') {
            saveConfirmation.classList.remove('bg-red-100', 'text-red-700');
            saveConfirmation.classList.add('bg-emerald-100', 'text-emerald-700');
        } else {
            saveConfirmation.classList.remove('bg-emerald-100', 'text-emerald-700');
            saveConfirmation.classList.add('bg-red-100', 'text-red-700');
        }

        setTimeout(() => {
            saveConfirmation.classList.add('hidden');
        }, 3000);
    };

    // Search form submission
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        
        if (!searchTerm) {
            showError('Please enter a recipe name');
            return;
        }

        // Reset UI state
        loading.classList.remove('hidden');
        error.classList.add('hidden');
        recipeResults.classList.add('hidden');

        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchTerm)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error('Failed to fetch recipe');
            }

            if (!data.meals || data.meals.length === 0) {
                throw new Error('No recipes found');
            }

            // Display the first recipe found
            displayRecipe(data.meals[0]);
        } catch (err) {
            showError(err.message);
        } finally {
            loading.classList.add('hidden');
        }
    });

    // Function to format recipe data from MealDB API
    function formatRecipeData(mealData) {
        const ingredients = [];
        // MealDB API provides ingredients and measures in separate fields from 1 to 20
        for (let i = 1; i <= 20; i++) {
            const ingredient = mealData[`strIngredient${i}`];
            const measure = mealData[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) {
                ingredients.push({
                    item: ingredient.trim(),
                    quantity: measure ? measure.trim() : ''
                });
            }
        }

        return {
            id: mealData.idMeal,
            name: mealData.strMeal,
            instructions: mealData.strInstructions,
            image: mealData.strMealThumb,
            ingredients
        };
    }

    // Function to display recipe data
    function displayRecipe(mealData) {
        const recipe = formatRecipeData(mealData);
        
        // Set recipe details with loading state for image
        recipeImage.src = recipe.image;
        recipeImage.alt = recipe.name;
        recipeName.textContent = recipe.name;
        
        // Add loading animation while image loads
        recipeImage.classList.add('opacity-0');
        recipeImage.onload = () => {
            recipeImage.classList.remove('opacity-0');
            recipeImage.classList.add('opacity-100', 'transition-opacity', 'duration-500');
        };

        // Enable save button and attach click handler
        saveButton.disabled = false;
        saveButton.classList.remove('opacity-50', 'cursor-not-allowed');
        saveButton.classList.add('hover:bg-emerald-600');
        saveButton.onclick = () => saveRecipe(recipe);

        // Clear and populate ingredients
        ingredientsList.innerHTML = '';
        recipe.ingredients.forEach(({ item, quantity }) => {
            const li = document.createElement('li');
            li.textContent = `${quantity} ${item}`;
            ingredientsList.appendChild(li);
        });

        // Display instructions
        instructions.textContent = recipe.instructions;

        // Show results
        recipeResults.classList.remove('hidden');
    }

    // Function to save recipe
    async function saveRecipe(recipe) {
        try {
            // Disable save button and show saving state
            saveButton.disabled = true;
            saveButton.textContent = 'Saving...';
            saveButton.classList.add('opacity-50', 'cursor-not-allowed');
            saveButton.classList.remove('hover:bg-emerald-600');

            console.log('Saving recipe:', recipe); // Debug log

            const response = await fetch('/api/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: recipe.name,
                    ingredients: recipe.ingredients.map(ing => ({
                        item: ing.item,
                        quantity: ing.quantity
                    })),
                    instructions: recipe.instructions,
                    image: recipe.image
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to save recipe');
            }

            // Show success message
            showNotification('Recipe saved successfully!', 'success');
            saveButton.textContent = 'Saved!';
            saveButton.classList.add('bg-green-500');
            
            // Reset button after 2 seconds
            setTimeout(() => {
                saveButton.textContent = 'Save Recipe';
                saveButton.classList.remove('bg-green-500');
                saveButton.disabled = false;
                saveButton.classList.remove('opacity-50', 'cursor-not-allowed');
                saveButton.classList.add('hover:bg-emerald-600');
            }, 2000);

        } catch (error) {
            console.error('Error saving recipe:', error);
            showNotification(error.message || 'Failed to save recipe', 'error');
            
            // Reset button
            saveButton.textContent = 'Save Recipe';
            saveButton.classList.remove('bg-red-500');
            saveButton.disabled = false;
            saveButton.classList.remove('opacity-50', 'cursor-not-allowed');
            saveButton.classList.add('hover:bg-emerald-600');
        }
    }
});
