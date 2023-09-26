// const randomPageNum = Math.floor(Math.random() * 10)
// const breweryAPI = `https://api.openbrewerydb.org/v1/breweries?page=${randomPageNum}&per_page=10`

const breweryAPI = 'https://api.openbrewerydb.org/v1/breweries/random?size=10'
const galleryDiv = document.getElementById('brewery-preview');
const breweryDetail = document.getElementById('brewery-detail');
const stateSelectionForm = document.getElementById('state-form')

//all-purpose fetch function
function fetcher(url) {
    return fetch(url)
    .then(response => response.json())
}

//get state brewery data from databaseand
function stateBreweries(state) {
    fetcher(`https://api.openbrewerydb.org/v1/breweries?by_state=${state}&per_page=200`)
    .then(randomizer)
    
}
stateBreweries('New_Jersey')

// create an array of 10 breweries randomly select a brewery from database response
function randomizer(stateBreweries) {
    let numberOfBreweries = stateBreweries.length;
    let breweryArray = [];
    for (let i=10; i>0; i--) {
        breweryArray.push(stateBreweries[Math.floor(Math.random() * numberOfBreweries)])
    }
    renderBreweryGallery(breweryArray)
}

//populate brewery menu from the array made by randomizer
function renderBreweryGallery(breweryArray) {
    galleryDiv.innerHTML = '';
    breweryArray.map(brewery => {
        const div = document.createElement('div');
        div.dataset.brewId = brewery.id;
        div.addEventListener('click', breweryDetails);

        const website = brewery.website_url;
        const img = document.createElement('img');
        img.src = 'images/icons8-hops-80.png';
        
        const span = document.createElement('span');
        span.innerText = brewery.name;
        span.classList = "brewery-name";
        div.append(img, span);
        galleryDiv.append(div);
    })
}


// function logoSelector(website) {
//     let urlSection = website.replace(`http://www.`, '')
//     let icon = `https://icons.duckduckgo.com/ip3/${urlSection}.ico`
//     return icon
// }




function breweryDetails(event) {
    let brewId = event.target.parentElement.dataset.brewId
    fetch('https://api.openbrewerydb.org/v1/breweries/'+brewId)
    .then(resp => resp.json())
    .then(brewery => {
        breweryDetail.innerHTML = '';
        
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

        let saveButton = document.createElement('button')
        saveButton.innerText = 'Save Brewery';
        saveButton.addEventListener('click', saveToDatabase)

        breweryDetail.append(name, address, website, saveButton)

    })

}

function saveToDatabase() {
    console.log('this will save the brewery to the list')
}

// Function to search breweries by state form submission and render gallery with results
// function stateSelected() {
    stateSelectionForm.addEventListener('submit', e => {
    e.preventDefault()
    const state = e.target.state.value

    stateBreweries(state)
    e.target.reset()
})
