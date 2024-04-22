let favouriteMeals = JSON.parse(localStorage.getItem('favouriteMeals')) || [];

//This function is used to app to favouriteMeals  array and save it in the local storage 
function addToFavourites(meal) {
    // Check if the meal's id already exists in the array
    const existingMeal = favouriteMeals.find(m => m.id === meal);
    if (!existingMeal) {

        favouriteMeals.push({ id: meal, mealName: meal })
    }
    console.log(meal);
    localStorage.setItem("favouriteMeals", JSON.stringify(favouriteMeals));
    updateFavourities();
}

//This function will update  the UI with the current favourite Meals from the local Storage
function updateFavourities() {
    const favouritesList = document.getElementById('favouriteMealsList');
    favouritesList.innerHTML = '';
    let favMeals = JSON.parse(localStorage.getItem("favouriteMeals"));
    if (favMeals) {
        favMeals.forEach((meal, i) => {
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'd-flex-jcs-aic', 'favourities-list');
            li.innerHTML = `
            <span >${meal.mealName}</span>
            <button class="btn btn-outline-warning btn-sm" onclick="removeFromFavourities('${i}')">Remove From  Favourites</button>
        `;

            favouritesList.appendChild(li);
        });
    }
}
//This fn ction will remove a specific meal from the favourite list by its index
function removeFromFavourities(index) {
    // console.log(i);

    favouriteMeals.splice(index, 1)
    // console.log(favouriteMeals);
    localStorage.setItem("favouriteMeals", JSON.stringify(favouriteMeals));
    updateFavourities()
}
async function getMealDetailsById(id) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    return data.meals[0];
}

function displayMealPage(meal) {
    // Open a new window with meal details
    const mealDetailsWindow = window.open('', '_blank');
    mealDetailsWindow.document.write(`
        <html>
            <head>
                <title>${meal.strMeal}</title>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
                <link rel="stylesheet" href="styles.css">
            </head>
            <body>
                <div class="container">
                    <h1 class="mt-5 mb-4 text-center">${meal.strMeal}</h1>
                    <img src="${meal.strMealThumb}" class="img-fluid mb-4 meal-image" alt="${meal.strMeal}">
                    <h2>Category</h2>
                    <h4 >
                       ${meal.strCategory}
                    </h4>
                    <h2>Instructions</h2>
                    <p>${meal.strInstructions}</p>
                </div>
            </body>
        </html>
    `);
}

// This searchMeals fn fetch meals from the API based on entered input
async function searchMeals(query) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await response.json();
    return data.meals;
}

//This renderSearchedMeals Results fn to display search results
function renderSearchedMeals(meals) {

    const searchResultsList = document.getElementById('searchResults');
    searchResultsList.innerHTML = '';

    meals && meals.forEach(meal => {
        // console.log(meal);
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex-jcs-aic', 'searched-results-list');
        li.innerHTML = `
            <a class='w-75' onclick="viewMealDetails('${meal.idMeal}')">${meal.strMeal}</a>
            <button class="btn btn-outline-warning btn-sm" onclick="addToFavourites('${meal.strMeal}')">Add to Favourites</button>
        `;
        searchResultsList.appendChild(li);
    });
}

// Event listener for search input
const mealSearch = document.getElementById('meal-search');
mealSearch.addEventListener('input', async (e) => {
    const query = e.target.value.trim();

    if (query.length > 0) {
        const meals = await searchMeals(query);
        renderSearchedMeals(meals);
        // console.log(query, 'working ');
    } else {
        const searchResultsList = document.getElementById('searchResults');
        searchResultsList.innerHTML = '';
    }
});

//this fn  viewMealDetails is called when a searched result is clicked, it will show more details of that  particular meal in modal window
async function viewMealDetails(mealId) {
    const meal = await getMealDetailsById(mealId);
    displayMealPage(meal);
}


updateFavourities()