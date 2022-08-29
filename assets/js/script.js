//#region Weather API + geolocation

async function currentCity() {
    const weatherImage = document.querySelector('.weather-image');
    const weatherLocation = document.querySelector('.weather-location');
    const weatherTemperature = document.querySelector('.weather-temperature');
    const suggestionParagraph = document.querySelector('.suggestion');
    navigator.geolocation.getCurrentPosition(async function (position) {
        let data = await getCityWeather(position.coords.latitude, position.coords.longitude);
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
    });
}

currentCity();

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

//#region ricerca
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

//#endregion

// Prova
/*
let weather = {
    apiKey: "62b2896b7ea5c96b920fdfb088348f9b",
    fetchWeather: function (city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            city +
            "&units=metric&appid=" +
            this.apiKey
        )
            .then((response) => {
                if (!response.ok) {
                    alert("No weather found.");
                    throw new Error("No weather found.");
                }
                return response.json();
            })
            .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        document.querySelector(".weather-location").innerText = name;
        document.querySelector(".icon").src =
            "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".weather-condition").innerText = description;
        document.querySelector(".weather-temperature").innerText = temp + "°C";
        document.querySelector(".humidity").innerText =
            "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText =
            "Wind speed: " + speed + " km/h";
        document.querySelector(".weather").classList.remove("loading");
        document.body.style.backgroundImage =
            "url('https://source.unsplash.com/1600x900/?" + name + "')";
    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
    },
};

document.querySelector(".search-button").addEventListener("click", function () {
    weather.search();
});

document
    .querySelector(".search-bar")
    .addEventListener("keyup", function (event) {
        if (event.key == "Enter") {
            weather.search();
        }
    });

weather.fetchWeather("Denver");
*/