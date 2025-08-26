document.addEventListener('DOMContentLoaded', () => {
    console.log('Loading saved recipes...'); // Debug log
    loadSavedRecipes();
});

async function loadSavedRecipes() {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const recipesGrid = document.getElementById('savedRecipes');
    const noRecipesEl = document.getElementById('noRecipes');

    console.log('DOM elements:', { loadingEl, errorEl, recipesGrid, noRecipesEl }); // Debug log

    try {
        // Show loading
        loadingEl.classList.remove('hidden');
        errorEl.classList.add('hidden');
        noRecipesEl.classList.add('hidden');

        // Fetch saved recipes
        const response = await fetch('/api/recipes');
        if (!response.ok) throw new Error('Failed to fetch saved recipes');
        
        const recipes = await response.json();

        // Handle no recipes
        if (recipes.length === 0) {
            noRecipesEl.classList.remove('hidden');
            return;
        }

        // Display recipes
        recipesGrid.innerHTML = recipes.map(recipe => `
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <img src="${recipe.image}" alt="${recipe.name}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">${recipe.name}</h3>
                    <div class="mb-4">
                        <h4 class="font-medium text-gray-700 mb-1">Ingredients:</h4>
                        <ul class="list-disc list-inside text-gray-600 text-sm">
                            ${recipe.ingredients.map(ing => `
                                <li>${ing.quantity} ${ing.item}</li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="flex justify-between items-center">
                        <button 
                            onclick="viewRecipe('${recipe._id}')"
                            class="text-emerald-500 hover:text-emerald-600 text-sm"
                        >
                            View Details
                        </button>
                        <button 
                            onclick="deleteRecipe('${recipe._id}')"
                            class="text-red-500 hover:text-red-600 text-sm"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading saved recipes:', error);
        errorEl.textContent = 'Failed to load saved recipes. Please try again.';
        errorEl.classList.remove('hidden');
    } finally {
        loadingEl.classList.add('hidden');
    }
}

async function deleteRecipe(id) {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    const errorEl = document.getElementById('error');
    
    try {
        const response = await fetch(`/api/recipes/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete recipe');

        // Reload the recipes list
        loadSavedRecipes();
    } catch (error) {
        console.error('Error deleting recipe:', error);
        errorEl.textContent = 'Failed to delete recipe. Please try again.';
        errorEl.classList.remove('hidden');
    }
}

function viewRecipe(id) {
    // Redirect to recipe detail page
    window.location.href = `/recipe/${id}`;
}
