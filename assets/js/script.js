//#region Weather API + geolocation
currentCity();

function weatherData(data) {
    const weatherImage = document.querySelector('.weather-image');
    const weatherLocation = document.querySelector('.weather-location');
    const weatherTemperature = document.querySelector('.weather-temperature');
    const suggestionParagraph = document.querySelector('.suggestion');

    const locationName = data.name;
    const temperature = Math.floor(data.main.temp); // arrotondo per difetto
    const imageCode = data.weather[0].icon;
    const description = data.weather[0].description;

    const suggestion = getSuggestion(imageCode);

    weatherLocation.innerText = locationName;
    weatherTemperature.innerText = temperature + '°';
    weatherImage.alt = description;
    weatherImage.src = `images/${imageCode}.jpg`;
    suggestionParagraph.innerText = suggestion;
}

async function currentCity() {
    navigator.geolocation.getCurrentPosition(async function (position) {
        let data = await getCityWeather(position.coords.latitude, position.coords.longitude);
        weatherData(await data);
    });
}

function getSuggestion(imageCode) {
    const suggestions = {
        '01d': 'Ricordati la crema solare!',
        '01n': 'Buonanotte!',
        '02d': 'Oggi il sole va e viene...',
        '02n': 'Attenti ai lupi mannari...',
        '03d': 'Luce perfetta per fare foto!',
        '03n': 'Dormi sereno :)',
        '04d': 'Che cielo grigio :(',
        '04n': 'Non si vede nemmeno la luna!',
        '09d': 'Prendi l\'ombrello',
        '09n': 'Copriti bene!',
        '10d': 'Prendi l\'ombrello',
        '10n': 'Copriti bene!',
        '11d': 'Attento ai fulmini!',
        '11n': 'I lampi accendono la notte!',
        '13d': 'Esci a fare un pupazzo di neve!',
        '13n': 'Notte perfetta per stare sotto il piumone!',
        '50d': 'Accendi i fendinebbia!',
        '50n': 'Guida con prudenza!',
    }

    return suggestions[imageCode];
}

//#endregion

//#region Swiper
var swiper = new Swiper(".mySwiper", {
    slidesPerView: 4,
    spaceBetween: 30,
    freeMode: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});
//#endregion

//#region ricerca città
document.getElementById("search-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    let options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '529ab92a76msh4a5699d05e5fcbdp18aec3jsn0182800d0d4d',
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
    };

    let testo = document.getElementById("search-bar").value;
    setTimeout(async function () {
        if (testo == document.getElementById("search-bar").value) {
            let result = await fetch('https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=' + document.getElementById("search-bar").value, options);
            result = await result.json();
            result.data.forEach(async function (el) {
                if (el.city.toLowerCase() == testo.toLowerCase()) {
                    let coord = await getCityCoord(testo.toLowerCase());
                    let data = await getCityWeather(coord.lat, coord.lon);
                    weatherData(await data);
                }
            });
        }
    }, 1000);
});


/*
document.getElementById("search-bar").addEventListener("keyup", async function (e) {
    e.preventDefault();
    let options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '529ab92a76msh4a5699d05e5fcbdp18aec3jsn0182800d0d4d',
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
    };

    let testo = document.getElementById("search-bar").value;
    setTimeout(async function () {
        if (testo == document.getElementById("search-bar").value) {
            let result = await fetch('https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=' + document.getElementById("search-bar").value, options);
            result = await result.json();
            document.getElementById("ricerca-incrementale").innerText = result.data[0].city;
        }
    }, 1000);
});
*/

//#endregion