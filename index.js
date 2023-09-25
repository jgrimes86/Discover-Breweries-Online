const theMetAPI = 'https://collectionapi.metmuseum.org/public/collection/v1/objects'
const parseJSON  = (resp) => resp.json()


function fetchResource(url) {
    return fetch(url)
    .then(parseJSON)
}

