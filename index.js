const express = require('express')
const app = express()
const axios = require('axios')
const { response } = require('express')
const port = process.ENV_PORT || 4000

const options = {
    method: 'POST',
    url: 'https://api.petfinder.com/v2/oauth2/token',
    headers: {'content-type': 'application/json'},
    data: {
        grant_type: 'client_credentials',
        client_id: 'fnK2eAeCFxLdrat5tPgeqpOmw5hSR86WPsYHmYX7qBPGmrlYMB',
        client_secret: 'JzyDFtjV3PZd3fgMLOCTxccTmJODxZ1VLJiTlpvh',
    }
};
let token
//parses the token out from the request
const getToken = response => {
    token = response.data.access_token
    return token
}

//filter the animals for ones that have pictures
const filterResponseForAnimalsWithPhotos = (response) => {
    return response.data.animals.filter(animal => animal.photos !== [] || animal.primary_photo_cropped !== null)
}


const showCatJson = (cats) => app.get('/', (_, res) => res.json(cats))
axios.request(options).then(getToken).then(token => {
    axios.get('https://api.petfinder.com/v2/animals?type=cat&limit=100', {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }).then(response => filterResponseForAnimalsWithPhotos(response))
    .then(cats => showCatJson(cats))
}).catch(error =>  console.error(error))






app.listen(port)
