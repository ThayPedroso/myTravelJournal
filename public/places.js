// Making a map and tiles
let mymap = L.map('checkinMap').setView([0, 0], 2)
const attribution = '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const tiles = L.tileLayer(tileUrl, { attribution })
tiles.addTo(mymap)

getData()
async function getData() {
    const response = await fetch('/api')
    const data = await response.json()
    console.log(data)

    // Making a icon with a custom icon
    const newIcon = L.icon({
        iconUrl: 'assets/person_pin_circle-24px.svg',
        iconSize: [50, 32],
        iconAnchor: [25, 16],
    });

    for (item of data) {
        const marker = L.marker([item.latitude, item.longitude], {icon: newIcon}).addTo(mymap)

        let txt = `The weather here at ${item.latitude}°, ${item.longitude}° was ${item.summary} with a temperature of 
            ${item.temperature}°C.`

        if (item.value < 0) {
            txt += ` No air quality reading.`
        }
        else {
            txt += ` The concentration of particulate matter (${item.parameter})
            is ${item.value} ${item.unit} last read on ${item.lastUpdated}`
        }

        marker.bindPopup(txt)
    }

    //console.log(data)
}