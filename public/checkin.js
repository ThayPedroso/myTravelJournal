// Ensure geolocation availability
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async function (position) {
        let lat, lon, weather, air_quality
        try {
            // Reading geolocation from browser
            lat = position.coords.latitude
            lon = position.coords.longitude
            // Return geolocation to user view
            document.getElementById('lat').textContent = lat.toFixed(5)
            document.getElementById('lon').textContent = lon.toFixed(5)
            // fetch api
            const api_url = `weather/${lat},${lon}`
            const weatherAndAirQuality_response = await fetch(api_url)
            const weatherAndAirQuality_data = await weatherAndAirQuality_response.json()
            // Temperature information
            weather = weatherAndAirQuality_data.weather.currently
            const img_url = `./assets/weather/${weather.icon}.jpg`
            document.getElementById('weatherImg').src = img_url
            document.getElementById('summary').textContent = weather.summary
            document.getElementById('temperature').textContent = weather.temperature
            document.getElementById('apparentTemperature').textContent = weather.apparentTemperature
            document.getElementById('humidity').textContent = weather.humidity
            document.getElementById('windSpeed').textContent = weather.windSpeed
            document.getElementById('precipIntensity').textContent = weather.precipIntensity
            // Air quality information
            air_quality = weatherAndAirQuality_data.air_quality.results[0].measurements[2]
            document.getElementById('aq_parameter').textContent = air_quality.parameter
            document.getElementById('aq_value').textContent = air_quality.value
            document.getElementById('aq_units').textContent = air_quality.unit
            document.getElementById('aq_date').textContent = air_quality.lastUpdated.toLocaleString()
            document.getElementById('sourceName').textContent = air_quality.sourceName

            //console.log(weatherAndAirQuality_data)
        } catch (error) {
            console.log(error)
            air_quality = { value: -1 }
            document.getElementById('aq_parameter').textContent = 'Not available'
            document.getElementById('aq_value').textContent = 'N/A'
            document.getElementById('aq_date').textContent = 'N/A'
        }
        const data = { lat, lon, weather, air_quality }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        const db_response = await fetch('/api', options)
        const db_json = await db_response.json()
        //console.log(db_json)
    })
} else {
    alert("I'm sorry, but geolocation services are not supported by your browser.")
}