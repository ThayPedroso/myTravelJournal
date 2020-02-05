const path = require('path')
const express = require('express')
const fetch = require('node-fetch')
require('dotenv').config()
const expressLayouts = require('express-ejs-layouts')
const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('travels')
const app = express()

port = 3333

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout extractScripts', true)
app.set('layout extractStyles', true)
app.use(expressLayouts) 
app.use(express.static('public'))
app.use(express.json({ limit: '1mb' }))

app.listen(port, () => console.log(`Listening at ${port}`))

app.get('/', (request, response) => {
    response.render('pages/home')
})

app.get('/checkin', (request, response) => {
    response.render('pages/checkin')
})

app.get('/places', (request, response) => {
    response.render('pages/places')
})

app.get('/photos', (request, response) => {
    response.render('pages/photos')
})


app.get('/checkin', (request, response) => {
    response.render('home.ejs')
})

app.get('/api', (request, response) => {
    db.serialize(function() {
        db.all(`SELECT * FROM checkins`, (err, rows) => {
            if (err) {
                console.log(err)
                response.end()
                return
            }

            console.log(rows)
            response.json(rows)
        })
    })

    //db.close()
})

app.post('/api', (request, response) => {
    const data = request.body
    //console.log(data)
    // reading current date to use in database
    const timestamp = Date.now()
    data.timestamp = timestamp
    // working with sqlite3
    db.serialize(function() {
        db.run(`CREATE TABLE IF NOT EXISTS checkins (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
            latitude NUMERIC NOT NULL, longitude NUMERIC NOT NULL, summary TEXT NOT NULL, 
            icon TEXT NOT NULL, precipIntensity NUMERIC, temperature NUMERIC NOT NULL,
            apparentTemperature NUMERIC NOT NULL, humidity NUMERIC, windSpeed NUMERIC, parameter TEXT,
            value NUMERIC, lastUpdated TEXT, unit TEXT, sourceName TEXT, date NUMERIC NOT NULL)`)

        const checkin = db.prepare(`INSERT INTO checkins (latitude, longitude, summary, icon, precipIntensity, temperature,
            apparentTemperature, humidity, windSpeed, parameter, value, lastUpdated, unit, sourceName,
            date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)

        checkin.run(data.lat, data.lon, data.weather.summary, data.weather.icon, data.weather.precipIntensity,
            data.weather.temperature, data.weather.apparentTemperature, data.weather.humidity, 
            data.weather.windSpeed, data.air_quality.parameter, data.air_quality.value, 
            data.air_quality.lastUpdated, data.air_quality.unit, data.air_quality.sourceName, timestamp)

        checkin.finalize()

        response.json(data)
    })
    //db.close()
})

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
    //console.log(data)
    response.json(data)
})

