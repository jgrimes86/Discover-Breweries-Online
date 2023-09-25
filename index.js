// const randomPageNum = Math.floor(Math.random() * 10)
// const breweryAPI = `https://api.openbrewerydb.org/v1/breweries?page=${randomPageNum}&per_page=10`

const breweryAPI = 'https://api.openbrewerydb.org/v1/breweries/random?size=10'
const galleryDiv = document.getElementById('brewery-preview')

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
    const div = document.createElement('div')
    div.dataset.brewId = brewery.id;
    div.addEventListener('click', breweryDetails)

    const website = brewery.website_url
    let newWebsite = website.replace(`http://www.`, '')

    const img = document.createElement('img')
    img.src = `https://icons.duckduckgo.com/ip3/${newWebsite}.ico`
    const span = document.createElement('span');
    span.innerText = brewery.name;
    div.append(img, span)
    galleryDiv.append(div)
}

function breweryDetails() {
    console.log('this button will load brewery details')
}
