# myTravelJournal

This project consists of a journal to keep track of your travels so that you don't lose any details. 

With __*myTravelJournal*__ you can:

- __Make check-ins:__ Save your current geographic coordinates and weather information such as temperature, rain, humidity, wind, and air quality.
- __View check-ins:__ Here you can see in an interactive map all the places you've checked-in.
- __Photos:__ It's a page to take pictures and save them along with geographic coordinates and you current mood.
- __Gallery:__ This is where you can see all your saved photos and where you took them.

## How webpage works

I've used nodeJS and JavaScript to implement this web-based application. Also used EJS - Embedded JavaScript templating language to generate HTML markup with plain JavaScript. Bootstrap was used to make the application responsive and asthetic. Information is exchanged between the backend and the frontend using the Express framework through HTTP requests. The chosen database was sqlite3, which is a compact yet complete database.

## How pages work

### Layout page

This page contains the HTML head, navbar, bootstrap scripts, and a main tag, where all subpages are loaded through EJS. 

### Check-in page

This page read browser current geolocation and use this to fetch weather information from Darksky API (Application Programming Interface) that allows us to look up the weather anywhere in the globe. This API needs an API Key to authenticate the user. This key must be stored in .env file. This page also requests and fetch air quality information from an open API called Open AQ Platform. Both, weather and air quality information are stored in the database. The weather image is responsive according to the weather API response.  

### View check-ins page

This page uses Leaflet, an open-source JavaScript library for interactive maps. With this library all the checkins are retrieved from database and plotted in the map with popups that show details. The applications reads the latitude and longitude to place the pin in the map.

### Photos page

This page use P5.js that is an open source JavaScript library for creative coding, with a focus on making coding accessible and inclusive. This library is not limited to drawing in canvas, it can be used to include HTML5 objects for text, video, webcam, and sound. In this page, I've used the webcam to save pictures together with a text description. Photos are saved in .png format. The path to the image is saved in the database. 

### Gallery page

This page retrieves all images path, location and user mood from the database and display them in the screen. Bootstrap and EJS are used to render page.

### Database

Two tables were created: checkins and photos. 

checkins has data about all checkins and their weather information:

``` sql
CREATE TABLE IF NOT EXISTS checkins (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
            latitude NUMERIC NOT NULL, longitude NUMERIC NOT NULL, summary TEXT NOT NULL, 
            icon TEXT NOT NULL, precipIntensity NUMERIC, temperature NUMERIC NOT NULL,
            apparentTemperature NUMERIC NOT NULL, humidity NUMERIC, windSpeed NUMERIC, parameter TEXT,
            value NUMERIC, lastUpdated TEXT, unit TEXT, sourceName TEXT, date NUMERIC NOT NULL)
```
photos has data about photos path, location and user mood:
``` sql
CREATE TABLE IF NOT EXISTS photos (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
            latitude NUMERIC NOT NULL, longitude NUMERIC NOT NULL, path TEXT NOT NULL, mood TEXT, 
            date NUMERIC NOT NULL)
```
### YouTube 

You can see this project running at: https://www.youtube.com/watch?v=qMOT43YAEUs&t=1s