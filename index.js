// const randomPageNum = Math.floor(Math.random() * 10)
// const breweryAPI = `https://api.openbrewerydb.org/v1/breweries?page=${randomPageNum}&per_page=10`

const breweryAPI = 'https://api.openbrewerydb.org/v1/breweries/random?size=10'
const galleryDiv = document.getElementById('brewery-preview');
const breweryDetailCard = document.getElementById('brewery-detail');
const stateSelectionForm = document.getElementById('state-form');
const mapTile = document.getElementById('map');
const likedBreweries = document.getElementById('saved-breweries')


//all-purpose fetch function
function fetcher(url) {
    return fetch(url)
    .then(response => response.json())
}

//get state brewery data from databaseand
function stateBreweries(state) {
    fetcher(`https://api.openbrewerydb.org/v1/breweries?by_state=${state}&by_type=micro&per_page=200`)
    .then(randomizer)
    
}
stateBreweries('New_Jersey')

// create an array of 10 breweries randomly select a brewery from database response
function randomizer(stateBreweries) {
    let numberOfBreweries = stateBreweries.length;
    let breweryArray = [];
    for (let i=10; i>0; i--) {
        oneBrewery = stateBreweries.splice([Math.floor(Math.random() * numberOfBreweries)], 1)
        breweryArray.push(...oneBrewery)
    }
    console.log(breweryArray)
    renderBreweryGallery(breweryArray)
}

//populate brewery menu from the array made by randomizer
function renderBreweryGallery(breweryArray) {
    galleryDiv.innerHTML = '';
    breweryArray.map(brewery => {
        const div = document.createElement('div');
        div.dataset.brewId = brewery.id;
        div.addEventListener('click', breweryGalleryClick);
        div.classList = 'gallery-card';
        div.addEventListener('mouseenter', hoverOn);
        div.addEventListener('mouseleave', hoverOff);

        const website = brewery.website_url;
        const img = document.createElement('img');
        img.src = 'images/icons8-hops-green.png';
        
        const span = document.createElement('span');
        span.innerText = brewery.name;
        span.classList = "brewery-name";
        div.append(img, span);
        galleryDiv.append(div);
    })
}


function breweryGalleryClick(event) {
    let brewId = event.target.parentElement.dataset.brewId
    fetcher('https://api.openbrewerydb.org/v1/breweries/'+brewId)
    .then(breweryDetail)
}
    
function breweryDetail(brewery) {
    breweryDetailCard.innerHTML = '';
    
    let name = document.createElement('h3');
    name.dataset.brewId = brewery.id
    name.innerText = brewery.name;
    
    let address = document.createElement('div');
    if (brewery.address_2 == null && brewery.address_3 == null) {
        address.innerText = `${brewery.address_1}, ${brewery.city}, ${brewery.state_province} ${brewery.postal_code}`
    } else if (brewery.address_3 == null) {
        address.innerText = `${brewery.address_1}, ${brewery.address_2}, ${brewery.city}, ${brewery.state_province} ${brewery.postal_code}`
    } else {address.innerText = `${brewery.address_1} + ${brewery.address_2} + ${brewery.address_3}, ${brewery.city}, ${brewery.state_province} ${brewery.postal_code}`}
    
    let website = document.createElement('div');
    website.innerText = brewery.website_url;

    let saveButton = document.createElement('button');
    saveButton.innerText = 'Save Brewery';
    saveButton.addEventListener('click', saveToDatabase);

    breweryDetailCard.append(name, address, website, saveButton);

    let lat = brewery.latitude;
    let lng = brewery.longitude;
    layerGroup.clearLayers();
    if (lat != null && lng != null) {
        L.marker([lat, lng]).addTo(layerGroup)
        map.setView([lat, lng])
    } else {
        map.src = 'brewKettle.jpeg'
    }
}

//get liked breweries from local database
function fetchLikedBreweries() {
    fetcher('http://localhost:3000/breweries')
    .then(listLikedBreweries)
}
fetchLikedBreweries();

//display liked breweries list on page load
function listLikedBreweries(breweries) {
    breweries.forEach(item => {
        let savedBrewery = document.createElement('li');
        savedBrewery.innerText = item.name;
        savedBrewery.dataset.brewId = item.breweryId;
        savedBrewery.addEventListener('click', showSavedBrewery)
        likedBreweries.append(savedBrewery);
    })
}

function showSavedBrewery(event) {
    let breweryId = event.target.dataset.brewId;
    fetcher('https://api.openbrewerydb.org/v1/breweries/'+breweryId)
    .then(breweryDetail)
}

//save liked brewery to database if not already on database
function saveToDatabase(event) {
    let brewID = event.target.parentElement.firstChild.dataset.brewId
    let breweryName = event.target.parentElement.firstChild.innerText

    fetcher('http://localhost:3000/breweries')
    .then(savedBreweryChecker)
    
    function savedBreweryChecker(breweries) {
        let alreadySaved = breweries.find(item => {
            if(item.name == breweryName) {return true}
        })
        if (alreadySaved == undefined) {
            databaseUpdate()
        } else if (alreadySaved.name == breweryName) {
            console.log('brewery already saved to database')
        }
    }
    
    function databaseUpdate() {
        fetch('http://localhost:3000/breweries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            breweryId: brewID,
            name: breweryName,
        })
        })
        .then(response => response.json())
        .then(listUpdate)
    }
            
    function listUpdate(newdata){
        let savedBrewery = document.createElement('li');
        savedBrewery.innerText = newdata.name;
        savedBrewery.dataset.brewId = brewID;
        savedBrewery.addEventListener('click', showSavedBrewery)
        likedBreweries.append(savedBrewery);
    }
}

// Function to search breweries by state form submission and render gallery with results
    stateSelectionForm.addEventListener('submit', e => {
    e.preventDefault()
    const state = e.target.state.value

    stateBreweries(state)
    e.target.reset()
})


// embedded map:
let map = L.map('map').setView([39.952, -75.163], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let layerGroup = L.layerGroup().addTo(map);


// event functions for mouseenter and mouseleave
function hoverOn(event) {
    event.target.classList = 'hovering';
    let icon = event.target.firstChild;
    icon.src = './images/icons8-hops-black80.png';
}

function hoverOff(event) {
    event.target.classList.remove('hovering');
    let icon = event.target.firstChild;
    icon.src = './images/icons8-hops-green.png';
}