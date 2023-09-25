const randomPageNum = Math.floor(Math.random() * 10)
const breweryAPI = `https://api.openbrewerydb.org/v1/breweries?${randomPageNum}&per_page=10`
const galleryDiv = document.getElementById('')

// Function to fetch the brewery data from api
function fetchResource(url) {
    return fetch(url)
    .then((r) => r.json())
    .then(breweryData => {
        breweryData.forEach(renderBreweryGallery)
        
    })
}

