const express = require('express')
const fetch = require('node-fetch')
require('dotenv').config()

const app = express()

port = 3333

app.use(express.static('public'))
app.use(express.json({ limit: '1mb' }))

app.listen(port, () => console.log(`Listening at ${port}`))

app.get('/weather/:latlon', async (request, response) => {
    // Read latitude and longitude from request
    const latlon = request.params.latlon.split(',')
    const lat = latlon[0]
    const lon = latlon[1]
    // Read darkSky API_key as environment variable  
    const api_key = process.env.API_KEY
    // fetch weather from darkSkyAPI
    const darkSkyApi_url = `https://api.darksky.net/forecast/${api_key}/${lat},${lon}/?units=si`
    const darkSkyfetch_response = await fetch(darkSkyApi_url)
    const darkSky_data = await darkSkyfetch_response.json()
    // fetch air quality from openaqAPI
    const aqApi_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`
    const aqfetch_response = await fetch(aqApi_url)
    const aq_data = await aqfetch_response.json()

    // Object with weather and airQuality information
    const data = {
        weather: darkSky_data,
        air_quality: aq_data
    }
    console.log(data)
    response.json(data)

})