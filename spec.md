# 🍲 Food Recipe App – Recipe Finder

**Version:** 1.2
**Last Updated:** 25 Aug 2025 (Major Update: MongoDB Integration)
**Author:** Steve
**Status:** In Development
**Stakeholders:** Self / Beta Testers

---
## The most important rule
* Don't make the changes which are already made 
* Incase if there is an error make the changes

## 1. Purpose & Scope

### Purpose

To build a full-stack web application that allows users to search for food recipes, view ingredients and step-by-step instructions, and optionally save favorite recipes locally. The app integrates **TheMealDB API** for recipe data.

### Scope

This app includes:

* Recipe search by name using TheMealDB API
* Display recipe details: ingredients, quantity, instructions, and images
* Optional “Save Favorite” feature (local or database storage for future expansion)
* Responsive, mobile-friendly interface

---

## 2. Problem Statement & Goals

### Problem

Many home cooks struggle to find structured recipes quickly and with reliable ingredient lists. This app centralizes recipes and makes them searchable with clear instructions.

### Goals

* Enable users to search and view recipes easily
* Display accurate ingredients with quantities
* Offer a simple, responsive UI for mobile and desktop users
* Minimize repeated API calls to TheMealDB for efficiency

---

## 3. User Stories & Use Cases

### User Stories

* *As a user*, I want to search for a recipe by name so I can see how to cook it.
* *As a user*, I want to view the ingredients and quantities so I can prepare my shopping list.
* *As a user*, I want to see step-by-step instructions for each recipe.

### Use Cases

* Search recipe by name
* Display recipe details from TheMealDB API
* Prevent repeated API calls for the same recipe (caching)
* Optional: Save favorite recipes for quick access

---

## 4. Functional Requirements

* Search recipes by name (frontend input → backend call)
* Fetch recipe details from TheMealDB API
* Display recipe title, ingredients, quantities, instructions, and image
* Cache previously searched recipes to reduce repeated API calls
* Optional save feature: store favorite recipes locally or in MongoDB
* Error handling for invalid searches or API failures

---

## 5. Technical & Non‑Functional Requirements

### Tech Stack

| Layer      | Tech Choice                        |
| ---------- | ---------------------------------- |
| Frontend   | HTML, Tailwind CSS, JavaScript     |
| Backend    | Node.js + Express                  |
| Database   | MongoDB                           |
| API        | TheMealDB API                      |
| Auth       | None (future enhancement possible) |
| Versioning | GitHub                             |

### Non-Functional

* Performance: Recipe results displayed <2s
* Caching: Reduce redundant API requests
* Security: Validate user input to prevent injection attacks
* Accessibility: Basic semantic HTML and ARIA attributes

---

## 6. Design

* **Minimal UI**: Clean interface, recipe cards with images
* **Tailwind CSS**: Utility-first styling for rapid and responsive design
* **Responsive Layout**: Works on mobile and desktop
* **Loading Indicators**: Shows progress while fetching recipes
* **No Clutter**: Focus on recipe content only
* **Color & Typography**: Use Tailwind color palette and font utilities for readability

---

## 7. Data Models

**Recipe Object (from TheMealDB API):**

```json
{
  "idMeal": "52772",
  "strMeal": "Teriyaki Chicken Casserole",
  "strInstructions": "Step-by-step cooking instructions...",
  "strMealThumb": "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
  "ingredients": [
    { "item": "soy sauce", "quantity": "3/4 cup" },
    { "item": "water", "quantity": "1/2 cup" }
  ]
}
```

**Optional MongoDB Favorites Schema:**

```js
{
  name: String,
  ingredients: [String],
  instructions: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
}
```

---

## 8. User Flows

**Search & View Flow:**

1. User enters recipe name → clicks Search
2. Frontend sends GET request to `/api/recipes/:name`
3. Backend calls TheMealDB API → fetches recipe JSON
4. Backend returns recipe data → frontend renders recipe details

**Optional Favorite Flow:**

1. User clicks “Save” → recipe stored in MongoDB or local storage
2. User views favorite recipes from saved list

---

## 9. Integrations & Dependencies

* **TheMealDB API**: Recipe data (name, ingredients, instructions, image)
* **Axios**: For backend API calls
* **Express**: Backend server routing
* **MongoDB**: Optional storage for favorites
* **Tailwind CSS**: Styling and responsive design

---

## 10. Success Metrics & Testing

### Metrics

* Average search time <2s
* 100% of API responses successfully rendered
* Prevent repeated API calls for the same recipe (cache hit rate >70%)

### Test Plan

* Unit tests for backend route `/api/recipes/:name`
* Test frontend rendering of recipe data
* Test caching logic for repeated searches
* Manual UX testing on mobile and desktop

---

## 11. Changelog & Milestones

### August 25, 2025

#### Major Milestones Achieved:
1. ✅ MongoDB Integration
   - Set up MongoDB connection with error handling and retries
   - Created Recipe schema for database storage
   - Implemented proper database connection error handling

2. ✅ Save Recipe Functionality
   - Added save recipe button and functionality
   - Implemented proper data transformation from TheMealDB format to our schema
   - Added visual feedback for save operations
   - Implemented duplicate recipe checking

3. ✅ Saved Recipes View
   - Created saved-recipes.html page
   - Implemented grid layout for saved recipes
   - Added delete functionality for saved recipes
   - Added navigation between main and saved recipes pages

4. ✅ Error Handling & Reliability
   - Added graceful server shutdown
   - Implemented port conflict resolution
   - Added proper error notifications
   - Improved MongoDB connection reliability

#### Technical Improvements:
1. Server Stability
   - Added automatic port switching if default port (3000) is busy
   - Implemented graceful shutdown handlers
   - Added MongoDB connection retries

2. Data Management
   - Updated Recipe schema with proper validation
   - Improved data transformation for saved recipes
   - Added proper error handling for database operations

3. User Interface
   - Added loading states for save operations
   - Implemented success/error notifications
   - Added visual feedback for user actions
   - Improved navigation between pages

#### Next Steps:
1. 🔄 Add recipe search caching
2. 🔄 Implement pagination for saved recipes
3. 🔄 Add recipe categories
4. 🔄 Improve error recovery mechanisms

---

## 13. Glossary

* **TheMealDB** – Open API for recipe data
* **Tailwind CSS** – Utility-first CSS framework for styling and responsive design
* **Cache** – Temporary storage to prevent repeated API calls
* **API** – Application Programming Interface

---

