function setup() {
    noCanvas()
    const video = createCapture(VIDEO)
    video.size(320, 240)
    console.log("chamou sketch.js")
    const button = document.getElementById('submit')
    button.addEventListener('click', async event => {
        console.log('botão foi clicado')
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async function (position) {
                const latitude = position.coords.latitude
                const longitude = position.coords.longitude
                const mood = document.getElementById('usermood').value
                video.loadPixels()
                const image64 = video.canvas.toDataURL()
                const data = { mood, latitude, longitude, image64 }
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }
                const response = await fetch('/photo', options)
                const responseData = await response.json()
                console.log(responseData)
            })
        } else {
            alert("I'm sorry, but geolocation services are not supported by your browser.")
        }
    })
}