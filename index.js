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
const getToken = response => {
    token = response.data.access_token
    return token
}
const filterResponseForAnimalsWithPhotos = (response) => {
    return response.data.animals.filter(animal => animal.photos !== [] || animal.primary_photo_cropped !== null)
}

axios.request(options).then(getToken).then(token => {
    axios.get('https://api.petfinder.com/v2/animals?type=cat&limit=100', {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }).then(response => console.log(filterResponseForAnimalsWithPhotos(response)))
    }).catch(error =>  console.error(error))





app.get('/', (req, res) => {
    res.json({message: 'hello'})
}) 

app.listen(port)