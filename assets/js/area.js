var swiper = new Swiper(".mySwiper", {
    slidesPerView: 5,
    grid: {
        rows: 2,
    },
    spaceBetween: 30,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});

capitali();

async function capitali() {
    for (let i = 0; i < document.getElementsByClassName("swiper-slide").length; i++) {
        let { lat, lon } = await getCityCoord(document.getElementById("cit" + i).innerText.split(":")[1].trim());
        let weather = await getCityWeather(lat, lon);
        getImg(document.getElementById("cit" + i).innerText, "imgSlider" + i, Math.floor(Math.random() * 15));
        document.getElementById("cit" + i + "Temp").innerText = "temperatura: " + weather.main.temp + "°";
        document.getElementById("cit" + i + "TempPerc").innerText = "temperatura percepita: " + weather.main.feels_like + "°";
        document.getElementById("cit" + i + "Humid").innerText = "umidità: " + weather.main.humidity + "%";
        document.getElementById("cit" + i + "Weather").innerText = "tempo: " + weather.weather[0].description;

    }

}