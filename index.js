const breweryAPI = 'https://api.openbrewerydb.org/v1/breweries';
const galleryDiv = document.getElementById('brewery-preview');
const breweryDetailCard = document.getElementById('brewery-detail');
const stateSelectionForm = document.getElementById('state-form');
const likedBreweries = document.getElementById('saved-breweries');
const newResultsButton = document.createElement('button');
const noMapImage = document.getElementById('default-image');
const breweryDetailsSection = document.getElementById('click-instruction')
breweryDetailsSection.style.display = 'none'

// all-purpose fetch function
function fetcher(url) {
    return fetch(url)
    .then(response => response.json())
}

// get state brewery data from databaseand
function stateBreweries(state) {
    fetcher(breweryAPI+`?by_state=${state}&by_type=micro&per_page=200`)
    .then(randomizer)
}
stateBreweries('New_Jersey')

// create an array of 10 breweries randomly select a brewery from database response
function randomizer(stateBreweries) {
    let numberOfBreweries = stateBreweries.length;
    let breweryArray = [];
    if (numberOfBreweries > 20) {
        let i=10;
        while (i>0) {
            oneBrewery = stateBreweries.splice([Math.floor(Math.random() * numberOfBreweries)], 1)
            console.log(oneBrewery)
            breweryArray.push(...oneBrewery)
            if (oneBrewery.length == 0) {
                i
            } else {i--}
        }
    } else {
        for (let i=10; i>0; i--) {
            oneBrewery = stateBreweries.splice([Math.floor(Math.random() * numberOfBreweries)], 1)
            breweryArray.push(...oneBrewery)
        }
    }
    renderBreweryGallery(breweryArray)
}

// populate brewery menu from the array made by randomizer
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

// event when a brewery in the gallery is clicked on
function breweryGalleryClick(event) {
    let brewId = event.target.parentElement.dataset.brewId
    fetcher(breweryAPI+'/'+brewId)
    .then(breweryDetail)
}
    
// populate the selected brewery's details
function breweryDetail(brewery) {
    breweryDetailCard.innerHTML = '';
    
    let name = document.createElement('h3');
    name.dataset.brewId = brewery.id
    name.innerText = brewery.name;
    
    let address = document.createElement('div');
    address.innerText = breweryAddress(brewery.address_1, brewery.address_2, brewery.address_3, brewery.city, brewery.state_province, brewery.postal_code);
    
    let website = document.createElement('div');
    website.innerText = brewery.website_url;
    
    let saveButton = document.createElement('button');
    saveButton.innerText = 'Save Brewery';
    saveButton.addEventListener('click', saveToDatabase);
    
    breweryDetailCard.append(name, address, website, saveButton);
    
    let lat = brewery.latitude;
    let lng = brewery.longitude;
    mapDisplay(lat, lng);
}

// determine brewery address
function breweryAddress(add1, add2, add3, city, state, zip) {
    if (add1 == null && add2 == null && add3 == null) {
        address = `${city}, ${state} ${zip}`
    } else if (add2 == null && add3 == null) {
        address = `${add1}, ${city}, ${state} ${zip}`
    } else if (add3 == null) {
        address = `${add1}, ${add2}, ${city}, ${state} ${zip}`
    } else {address = `${add1} + ${add2} + ${add3}, ${city}, ${state} ${zip}`}
    return address
}

// display or hide map
function mapDisplay(lat, lng) {
    layerGroup.clearLayers();
    if (lat != null && lng != null) {
        L.marker([lat, lng]).addTo(layerGroup)
        map.setView([lat, lng])
        noMapImage.classList.add('hidden');
        noMapImage.classList.remove('shown');
    } else {
        noMapImage.classList.add('shown');
        noMapImage.classList.remove('hidden');
    }
    breweryDetailsSection.style.display = 'inline-block'
}

// get liked breweries from local database
function fetchLikedBreweries() {
    fetcher('http://localhost:3000/breweries')
    .then(listLikedBreweries)
}
fetchLikedBreweries();

// display liked breweries list on page load
function listLikedBreweries(breweries) {
    breweries.forEach(item => {
        let likedBrewery = document.createElement('li');
        likedBrewery.innerText = item.name;
        likedBrewery.dataset.brewId = item.brewery_id;
        likedBrewery.id = item.id;
        likedBrewery.addEventListener('click', showSavedBrewery);

        let deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'x';
        deleteBtn.addEventListener('click', deleteLikedBrewery);
        likedBrewery.append(deleteBtn);

        likedBreweries.append(likedBrewery);
    })
}

// event when a brewery in the Your Saved Breweries list is clicked
function showSavedBrewery(event) {
    let id = event.target.dataset.brewId;
    fetcher(breweryAPI+'?by_ids='+id)
    .then(data => {
        breweryDetail(data[0])
    })
}

// save liked brewery to database if not already on database
function saveToDatabase(event) {
    let brewID = event.target.parentElement.firstChild.dataset.brewId
    let breweryName = event.target.parentElement.firstChild.innerText
    fetcher('http://localhost:3000/breweries')
    .then(data => savedBreweryChecker(data, brewID, breweryName))  
}

// check database to see if brewery is already saved
function savedBreweryChecker(breweries, brewID, breweryName) {
    let alreadySaved = breweries.find(item => {
        if(item.name == breweryName) {return true}
    })
    if (alreadySaved == undefined) {
        databaseUpdate(brewID, breweryName)
    } else if (alreadySaved.name == breweryName) {
        console.log('brewery already saved to database')
    }
}

// update database of saved breweries
function databaseUpdate(brewId, breweryName) {
    fetch('http://localhost:3000/breweries', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        brewery_id: brewId,
        name: breweryName,
    })
    })
    .then(response => response.json())
    .then(newData => listLikedBreweries([newData]))
}

// delete a liked brewery from the database and liked brewery list
function deleteLikedBrewery(event) {
    event.stopPropagation();

    let breweryLine = event.target.parentElement;
    let breweryId = breweryLine.id

    fetch(`http://localhost:3000/breweries/${breweryId}`, {
        method: 'DELETE'
    })

    breweryLine.remove();
}

// search breweries by state form submission and render gallery with results
newResultsButton.innerText = 'Get More Breweries'
stateSelectionForm.appendChild(newResultsButton)
newResultsButton.disabled = true
newResultsButton.style.display = 'none'
stateSelectionForm.addEventListener('submit', e => {
    e.preventDefault()
    const state = e.target.state.value

    stateBreweries(state)
    newResultsButton.style.display = 'inline-flex'
    newResultsButton.disabled = false

    changeNoMapImage(state);
})

// switch image shown over map when brewery data has no lat/long
function changeNoMapImage(searchedState) {
    let sanitizedState = searchedState.toLowerCase();
    fetcher('http://localhost:3000/images')
    .then(images => {
        // console.log(images)
        let selectedState = images.find(item => {
            if (item.state == sanitizedState) {return true}
        })
        // console.log(selectedState);
        let newImage = selectedState.image;
        noMapImage.src = newImage;
        noMapImage.setAttribute('alt', `Image representing ${searchedState}`);
    })
}

// embedded map code from https://leafletjs.com/examples/quick-start/:
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