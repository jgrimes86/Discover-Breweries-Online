// const randomPageNum = Math.floor(Math.random() * 10)
// const breweryAPI = `https://api.openbrewerydb.org/v1/breweries?page=${randomPageNum}&per_page=10`

const breweryAPI = 'https://api.openbrewerydb.org/v1/breweries/random?size=10'
const galleryDiv = document.getElementById('brewery-preview')
const breweryDetail = document.getElementById('brewery-detail');
const stateSelector = document.getElementsByClassName('dropdown')

// Function to fetch the brewery data from api
function fetchResource(url) {
    return fetch(url)
    .then((r) => r.json())
    .then(breweryData => {
        breweryData.forEach(renderBreweryGallery)
        
    })
}
fetchResource(breweryAPI)


function renderBreweryGallery(brewery) {
    const div = document.createElement('div');
    div.dataset.brewId = brewery.id;
    div.addEventListener('click', breweryDetails);

    const website = brewery.website_url;
    const img = document.createElement('img');
    img.src = logoSelector(website);
    
    const span = document.createElement('span');
    span.innerText = brewery.name;
    div.append(img, span);
    galleryDiv.append(div);
}


function logoSelector(website) {
    let urlSection = website.replace(`http://www.`, '')
    let icon = `https://icons.duckduckgo.com/ip3/${urlSection}.ico`
    return icon
}




function breweryDetails(event) {
    let brewId = event.target.parentElement.dataset.brewId
    fetch('https://api.openbrewerydb.org/v1/breweries/'+brewId)
    .then(resp => resp.json())
    .then(brewery => {
        breweryDetail.innerHTML = '';
        
        let name = document.createElement('h3');
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
