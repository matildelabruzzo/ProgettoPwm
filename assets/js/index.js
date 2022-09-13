//#region Weather API + geolocation

currentCity();
citPreferite();

async function citPreferite() {
    if (document.getElementsByClassName("preferito").length > 0) {

        for (let i = 0; i < document.getElementsByClassName("preferito").length; i++) {
            let { lat, lon } = await getCityCoord(document.getElementById("cit" + i).innerText);
            let weather = await getCityWeather(lat, lon);
            getImg(document.getElementById("cit" + i).innerText, "imgSlider" + i, Math.floor(Math.random() * 15));
            document.getElementById("cit" + i + "Temp").innerText = "temperatura: " + weather.main.temp + "°";
            document.getElementById("cit" + i + "TempPerc").innerText = "temperatura percepita: " + weather.main.feels_like + "°";
            document.getElementById("cit" + i + "Humid").innerText = "umidità: " + weather.main.humidity + "%";
            document.getElementById("cit" + i + "Weather").innerText = "tempo: " + weather.weather[0].description;

        }
    }
}


function weatherData(data) {
    const weatherImage = document.querySelector('.weather-image');
    const weatherLocation = document.querySelector('.weather-location');
    const weatherTemperature = document.querySelector('.weather-temperature');
    const suggestionParagraph = document.querySelector('.suggestion');

    const locationName = data.name;
    const temperature = Math.floor(data.main.temp); // arrotondo per difetto
    const imageCode = data.weather[0].icon;

    const suggestion = getSuggestion(imageCode);

    weatherLocation.innerText = locationName;
    weatherTemperature.innerText = temperature + '°';
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

var swiper = new Swiper(".swiperQuotes", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2,
        slideShadows: false,
    },
    loop: true,
});
//#endregion

//#region ricerca città
document.getElementById("search-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '529ab92a76msh4a5699d05e5fcbdp18aec3jsn0182800d0d4d',
            'X-RapidAPI-Host': 'spott.p.rapidapi.com'
        }
    };

    let testo = document.getElementById("search-bar").value;


    let result = await fetch('https://spott.p.rapidapi.com/places/autocomplete?language=%20it&limit=10&skip=0&type=CITY&q=' + document.getElementById("search-bar").value, options);
    result = await result.json();

    result.forEach(async function (el) {
        if (el.localizedName.toLowerCase() == testo.toLowerCase()) {
            let coord = await getCityCoord(testo.toLowerCase());
            let data = await getCityWeather(coord.lat, coord.lon);
            weatherData(await data);
        }
    });

});


document.getElementById("search-bar").addEventListener("keyup", async function (e) {
    e.preventDefault();
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '529ab92a76msh4a5699d05e5fcbdp18aec3jsn0182800d0d4d',
            'X-RapidAPI-Host': 'spott.p.rapidapi.com'
        }
    };

    let dataList;

    let result = await fetch('https://spott.p.rapidapi.com/places/autocomplete?language=%20it&limit=10&skip=0&type=CITY&q=' + document.getElementById("search-bar").value, options);
    result = await result.json();




    while (document.getElementById("datalistOptions").hasChildNodes()) {
        document.getElementById("datalistOptions").removeChild(document.getElementById("datalistOptions").firstChild);
    }


    result.forEach((el) => {
        dataList = document.createElement("option");
        dataList.setAttribute("value", el.localizedName.toLowerCase());
        document.getElementById("datalistOptions").appendChild(dataList);
    });

});


//#endregion