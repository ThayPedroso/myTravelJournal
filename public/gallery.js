getData()
async function getData() {
    const response = await fetch('/gallery')
    console.log(response)
    const data = await response.photo
    console.log(data)

    for (item of data) {
        const root = document.createElement('div')
        const mood = document.createElement('p')
        const geo = document.createElement('p')
        const date = document.createElement('p')
        const image = document.createElement('img')

        mood.textContent = `mood: ${item.mood}`
        geo.textContent = `lat: ${item.latitude}°, lon: ${item.longitude}°`
        const dateString = new Date(item.timestamp).toLocaleString()
        date.textContent = dateString
        image.src = item.image64
        image.alt = 'Photos with silly faces'

        root.append(mood, geo, date, image)
        document.body.append(root)
    }

    console.log(data);
}