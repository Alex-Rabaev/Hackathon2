const apiKey = "2d4f966e24d14bd6bab835eb5a72b62c"
const apiGamesURL = new URL("https://api.rawg.io/api/games");
const paramsDefault = {
    key:`${apiKey}`,
    page:1,
    page_size:15,
}
let amountPages = 0;

let previousPage = "";
let nextPage = "";

function getBaseURL (path) {
    return `https://api.rawg.io/api/${path}?key=${apiKey}`;
}

async function getSearchObj(path) {
    try { 
        const response = await (await fetch(getBaseURL(path))).json();
        let objMap = {}
        // console.log(response);
        for (let i of response.results) {
            objMap[i.name] = i.id;
        }
        // console.log(objMap);
        return objMap
    } catch(error) {
        console.log("ERROR", error);
    }
}


const platformsBTN = document.querySelector("#platforms-btn");
let isClickedPlatforms = false;
platformsBTN.addEventListener("click", buildDropdownSearchMenu(isClickedPlatforms, "platform"));

const genresBTN = document.querySelector("#genres-btn");
let isClickedGenres = false;
genresBTN.addEventListener("click", buildDropdownSearchMenu(isClickedGenres, "genre"));

// Creating dropdownmenu for search settings
async function buildDropdownSearchMenu (isClicked, searchSetting) {
    if (isClicked) {
        return
    }
    isClicked = true;
    const selectedDropdownMenu = document.getElementById(`${searchSetting}s-list`);
    for (let item of Object.keys(await getSearchObj(`${searchSetting}s`))) {
        const label = document.createElement("label");
        label.classList.add("dropdown-item");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = searchSetting;
        checkbox.value = item;
        checkbox.classList.add(`${searchSetting}-item`);

        // checkbox.checked = false;

        const labelText = document.createTextNode(item);

        label.appendChild(checkbox);
        label.appendChild(labelText);

        selectedDropdownMenu.appendChild(label);
    }

}




const gameForm = document.querySelector("#gameForm");
gameForm.addEventListener("submit", makeRequest);

async function nameToId(checks, path) {
    // Take resoure (platforms/genres) from API 
    const objMap = await getSearchObj(path)
    // For every selected checkbox
    // find resource (platforms/genres) ID from map
    return checks.filter(x => x.checked).map(x => objMap[x.value])
}

async function makeRequest(event) {
    try { 
        event.preventDefault();
        clearCardsDiv();
        paramsDefault.page = 1;
        let params = {...paramsDefault};

        // Dates search
        const dateFrom = document.querySelector("#dateFrom").value;
        const dateTo = document.querySelector("#dateTo").value;
        if (dateFrom && dateTo) {
            params.dates = `${dateFrom},${dateTo}`
        }

        // Platforms search
        const checksPlatforms = [...document.querySelectorAll(".platform-item")]
        const platformsSelected = await nameToId(checksPlatforms, 'platforms');
        if (platformsSelected.length) {
            params.platforms = platformsSelected.join(",");
        }

        // Genres search
        const checksGenres = [...document.querySelectorAll(".genre-item")]
        const genresSelected = await nameToId(checksGenres, 'genres');
        if (genresSelected.length) {
            params.genres = genresSelected.join(",");
        }

        // Search query search (searchInput)
        const searchQuery = document.querySelector("#searchInput").value;
        if (searchQuery) {
            params.search = `${searchQuery}`.toLowerCase();
        }

        const orderBy = document.getElementById("orderBy").value;
        const sortOrder = document.getElementById("sortOrder").value;
        if (orderBy) {
            params.ordering = `${sortOrder}${orderBy}`;
        }

        // console.log(params);
        apiGamesURL.search = new URLSearchParams(params).toString();
        const response = await fetch(apiGamesURL);


        const gamesResults = await response.json();
        // console.log(gamesResults);
        appendGameCard(gamesResults);
        amountPages = Math.ceil(gamesResults.count/params.page_size);
        createPagination(paramsDefault.page, amountPages);
        // console.log(amountPages);
        nextPage = gamesResults.next;
        previousPage = gamesResults.previous;
        // console.log(nextPage);
        // console.log(previousPage);
        // console.log(amountPages);
        return nextPage, previousPage, amountPages;
    } catch(error) {
        console.log("ERROR", error);
    }
}
// for dropdown menu (selecting platforms and genres)

document.addEventListener("DOMContentLoaded", getDropdownMenu("platforms-btn", "platforms-list"));

document.addEventListener("DOMContentLoaded", getDropdownMenu("genres-btn", "genres-list"));

function getDropdownMenu(buttonID, menuID) {
    let dropdownToggle = document.getElementById(buttonID);
    let dropdownMenu = document.getElementById(menuID);

    dropdownToggle.addEventListener("click", function() {
        dropdownMenu.classList.toggle("show");
    });

    document.addEventListener("click", function(event) {
        if (!dropdownToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove("show");
        }
    });
}

const searchQuery = document.querySelector("#searchInput");

searchQuery.addEventListener('input', (event) => {
    let searchInput = event.target.value.toLowerCase();
    if (searchInput.length >= 3) {
        makeRequest(event);
    }
    // clear();
    // displayCards();
});


// function for creating and appending game-cards after requests
function appendGameCard(gamesDB) {
    const gameCardsContainer = document.getElementById('gameCardsContainer');
    gamesDB.results.forEach(function(currentGame) {
        // Create a new card element
        const card = document.createElement('div');
        card.className = 'card card-body';

        // Create image element
        const images = document.createElement('div');
        images.setAttribute("id", currentGame.slug);
        const gameID = currentGame.id;
        appendCarousel(currentGame.short_screenshots, images, gameID);
        card.appendChild(images);

        // Create title element
        const title = document.createElement('h2');
        const gameTitle = currentGame.slug;
        title.textContent = currentGame.name;
        card.appendChild(title);

        // Create release date element
        const releaseDate = document.createElement('p');
        releaseDate.textContent = `Release Date: ${currentGame.released}`;
        card.appendChild(releaseDate);

        // Create platforms list element
        const platforms = document.createElement('div');
        platforms.className = "platformsDiv";
        const platformsLabel = document.createElement('h2');
        platformsLabel.textContent = 'Platforms: ';
        platforms.appendChild(platformsLabel);
        const platformItem = document.createElement('p');
        currentGame.platforms.forEach(function(platform) {
            platformItem.textContent += `|${platform.platform.name} |`;
        });
        platforms.appendChild(platformItem);
        card.appendChild(platforms);

        // Create genres list element
        const genres = document.createElement('div');
        genres.className = "genresDiv";
        const genresLabel = document.createElement('h2');
        genresLabel.textContent = 'Genres: ';
        genres.appendChild(genresLabel);
        const genreItem = document.createElement('p');
        currentGame.genres.forEach(function(genre) {
            genreItem.textContent += `${genre.name}  `;
        });
        genres.appendChild(genreItem);
        card.appendChild(genres);

        // Create stores list element
        const stores = document.createElement('div');
        stores.className = "storesDiv";
        const storesLabel = document.createElement('h2');
        storesLabel.textContent = 'Available in: ';
        stores.appendChild(storesLabel);
        const storeItem = document.createElement('p');
        currentGame.stores.forEach(function(store) {
            storeItem.textContent += `${store.store.name}  `;
        });
        stores.appendChild(storeItem);
        card.appendChild(stores);

        // Create buttons element
        const buttons = document.createElement('div');
        buttons.className = 'buttons';
        const button = document.createElement('button');
        button.textContent = "Add to my list";
        buttons.appendChild(button);
        card.appendChild(buttons);

        // Append the card to the gameCardsContainer
        gameCardsContainer.appendChild(card);
        button.addEventListener("click", function() {
            addToDB(gameID, gameTitle);
        });
    })
}

function addToDB(gameID, gameTitle) {
    const userID = document.getElementById("userId").value;
    console.log(gameID, userID, gameTitle);
    const url = 'http://127.0.0.1:8000/api/mylistgames/';
    const url2 = `http://127.0.0.1:8000/api/users/${userID}`

    const data = {
    "title": gameTitle,
    "gameId": gameID
    };

    // Obtain the CSRF token from the cookie
        const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        .split('=')[1];

        fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken // Include the CSRF token in the headers
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Success:', result);
        // Handle the response from the API
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle any errors that occurred during the request
    });

}

// function for creating nice game-images gallery to a card (every time game creating)
function appendCarousel(imagesArray, div, id) {
    const carouselDiv = document.createElement('div');
    carouselDiv.id = `carouselScreenshotsGame${id}`;
    carouselDiv.className = 'carousel slide';

    if (imagesArray) {
        const carouselIndicators = document.createElement('div');
        carouselIndicators.className = 'carousel-indicators';
    
        const amountImgs = imagesArray.length;
        // Create carousel indicators buttons
        for (let i = 0; i < amountImgs; i++) {
            const button = document.createElement('button');
            button.type = 'button';
            button.setAttribute('data-bs-target', `#carouselScreenshotsGame${id}`);
            button.setAttribute('data-bs-slide-to', i.toString());
            if (i === 0) {
                button.className = 'active';
                button.setAttribute('aria-current', 'true');
            }
            button.setAttribute('aria-label', 'Slide ' + (i + 1).toString());
            carouselIndicators.appendChild(button);
        }
        carouselDiv.appendChild(carouselIndicators);
    
    

        // Create carousel items
        const carouselItems = document.createElement('div');
        carouselItems.className = 'carousel-inner';

        for (let j = 0; j < amountImgs; j++) {
            const carouselItem = document.createElement('div');
            carouselItem.className = 'carousel-item';
            if (j === 0) {
                carouselItem.className += ' active';
            }

            const img = document.createElement('img');
            img.src = imagesArray[j].image;
            img.className = 'd-block w-100';
            img.alt = 'screenshot-' + (j + 1).toString();

            carouselItem.appendChild(img);
            carouselItems.appendChild(carouselItem);
        }

        carouselDiv.appendChild(carouselItems);
    }
    // Create carousel control buttons
    const prevButton = document.createElement('button');
    prevButton.className = 'carousel-control-prev';
    prevButton.type = 'button';
    prevButton.setAttribute('data-bs-target', `#carouselScreenshotsGame${id}`);
    prevButton.setAttribute('data-bs-slide', 'prev');

    const prevButtonIcon = document.createElement('span');
    prevButtonIcon.className = 'carousel-control-prev-icon';
    prevButtonIcon.setAttribute('aria-hidden', 'true');

    const prevButtonLabel = document.createElement('span');
    prevButtonLabel.className = 'visually-hidden';
    prevButtonLabel.textContent = 'Previous';

    prevButton.appendChild(prevButtonIcon);
    prevButton.appendChild(prevButtonLabel);

    const nextButton = document.createElement('button');
    nextButton.className = 'carousel-control-next';
    nextButton.type = 'button';
    nextButton.setAttribute('data-bs-target', `#carouselScreenshotsGame${id}`);
    nextButton.setAttribute('data-bs-slide', 'next');

    const nextButtonIcon = document.createElement('span');
    nextButtonIcon.className = 'carousel-control-next-icon';
    nextButtonIcon.setAttribute('aria-hidden', 'true');

    const nextButtonLabel = document.createElement('span');
    nextButtonLabel.className = 'visually-hidden';
    nextButtonLabel.textContent = 'Next';

    nextButton.appendChild(nextButtonIcon);
    nextButton.appendChild(nextButtonLabel);

    carouselDiv.appendChild(prevButton);
    carouselDiv.appendChild(nextButton);

    div.appendChild(carouselDiv);
}

function clearCardsDiv () {
    const divForClear1 = document.getElementById('gameCardsContainer');
    const divForClear2 = document.getElementById('pagesButtons');
    divForClear1.textContent = '';
    divForClear2.textContent = '';
}

function createPagination(currentPage, totalPages) {
    const paginationContainer = document.getElementById('pagesButtons');
    paginationContainer.className += ' pagination-container';

    const previousButton = document.createElement('button');
    previousButton.textContent = 'Previous';
    previousButton.id = "previousButton";

    const currentPageNumber = document.createElement('span');
    currentPageNumber.textContent = 'Page ' + currentPage;

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.id = "nextButton";
    // console.log('in createPagination - ',currentPage ,totalPages);
    if (currentPage === 1) {
    previousButton.style.display = 'none';
    } 
    if (currentPage === totalPages) {
    nextButton.style.display = 'none';
    }

    paginationContainer.appendChild(previousButton);
    paginationContainer.appendChild(currentPageNumber);
    paginationContainer.appendChild(nextButton);
    // const previousPageButton = document.querySelector("#previousButton");
    previousButton.addEventListener("click", previousPageRequest);

    // const nextPageButton = document.querySelector("#nextButton");
    nextButton.addEventListener("click", nextPageRequest);
}



async function previousPageRequest(event) {
    try { 
        event.preventDefault();
        clearCardsDiv();
        paramsDefault.page--;
        createPagination(paramsDefault.page, amountPages);
        let currentURL = previousPage;
        
        // console.log('currentURL', currentURL);
        const response = await fetch(currentURL);

        const gamesResults = await response.json();
        // console.log(gamesResults);
        appendGameCard(gamesResults);
        amountPages = Math.ceil(gamesResults.count/paramsDefault.page_size);
        nextPage = gamesResults.next;
        previousPage = gamesResults.previous;
        // console.log('currentURL', currentURL);
        // console.log('current page',paramsDefault.page);
        // console.log('amountResults', amountPages);
        // console.log('nextPage - ',nextPage);
        // console.log('previousPage - ',previousPage);
        return nextPage, previousPage, amountPages;
    } catch(error) {
        console.log("ERROR", error);
    }
}

async function nextPageRequest(event) {
    try { 
        event.preventDefault();
        clearCardsDiv();
        paramsDefault.page++;
        createPagination(paramsDefault.page, amountPages);
        let currentURL = nextPage;
        
        // console.log('currentURL', currentURL);
        const response = await fetch(currentURL);

        const gamesResults = await response.json();
        // console.log(gamesResults);
        appendGameCard(gamesResults);
        amountPages = Math.ceil(gamesResults.count/paramsDefault.page_size);
        nextPage = gamesResults.next;
        previousPage = gamesResults.previous;
        // console.log('currentURL', currentURL);
        // console.log('current page',paramsDefault.page);
        // console.log('amountResults', amountPages);
        // console.log('nextPage - ',nextPage);
        // console.log('previousPage - ',previousPage);
        return nextPage, previousPage, amountPages;
    } catch(error) {
        console.log("ERROR", error);
    }
}