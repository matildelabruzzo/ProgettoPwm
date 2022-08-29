const tokenWeather = "62b2896b7ea5c96b920fdfb088348f9b";

async function getCityCoord(city) {

    let resp = await fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + tokenWeather, { method: "GET" });
    resp = await resp.json();

    return { lat: resp[0].lat, lon: resp[0].lon };
}

async function getCityWeather(lat, lon) {

    let weather = await fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + tokenWeather + "&units=metric&lang=it", { method: "GET" });
    return await weather.json();
}