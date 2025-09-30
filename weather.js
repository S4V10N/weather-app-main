const units = document.querySelector("#units");
const searchBar = document.querySelector("#searchBar");
const searchBtn = document.querySelector("#searchBtn");
const daysBtn = document.querySelector(".selected");
const unitsDropdown = document.querySelector(".units__filter");
const searchBarDropdown = document.querySelector(".suggestions");
const daysBtnDropdown = document.querySelector(".week-days");
const nodeList = document.querySelectorAll(".filter");
const weekDays = document.querySelectorAll(".weekDays");
const weekDaysArray = Array.from(weekDays);
const metricUnit = document.querySelectorAll(".metric");
const imperialUnit = document.querySelectorAll(".imperial");
const unitsSwap = document.querySelector(".bold-text");
const metricUnitArray = Array.from(metricUnit);
const imperialUnitArray = Array.from(imperialUnit);
const loading = document.querySelectorAll(".load-state");
const loadState = Array.from(loading);
const loadingT = document.querySelectorAll(".load-text");
const loadingText = Array.from(loadingT);
const loadingAnimation = document.querySelector("#load-state-animation");
const noResultText = document.querySelector(".noResult");
const noResult = document.querySelector(".app__dashboard");
const tempMax = document.querySelectorAll(".temp-max");
const tempMin = document.querySelectorAll(".temp-min");
const temp_min = Array.from(tempMin);
const temp_max = Array.from(tempMax);
const cityLocation = document.querySelector("#location");
const date = document.querySelector("#date");
const currentTemp = document.querySelector(".temp-current");
const humidity = document.querySelector(".humidity");
const feelsTemp = document.querySelector(".temp_");
const precipitate = document.querySelector("#precipitate");
const windSpeed = document.querySelector(".wind-speed");
const suggestedCities = document.querySelectorAll(".suggestions p");
const suggestedCitiesContainer = document.querySelector(".suggestions");
const suggestions = Array.from(suggestedCities);
const dayWeek = document.querySelectorAll(".dayWeek");
const day_week = Array.from(dayWeek);
const hourlyTime = document.querySelectorAll(".hours-weather");
const hourly_time = Array.from(hourlyTime);
const hourlyTemp = document.querySelectorAll(".hour-temp");
const hourly_temp = Array.from(hourlyTemp);
const hourlyIcon = document.querySelectorAll(".weather-icon");
const hourly_icon = Array.from(hourlyIcon);
const weatherIcon = document.querySelector(".city-icon");
const dayIcon = document.querySelectorAll(".day-weather-icon");
const day_icon = Array.from(dayIcon);


function swap(one) {
    if(one.style.display === "none" || one.style.display === "") {
        one.style.display = "block";
    } else {
        one.style.display = "none"
    }
}

// drop-down buttons
units.addEventListener("click", () => swap(unitsDropdown));
daysBtn.addEventListener("click", () => swap(daysBtnDropdown));
unitsSwap.addEventListener("click", () => {
    for (let i = 0; i < metricUnitArray.length; i++) {
        if (metricUnitArray[i].style.display === "block" || metricUnitArray[i].style.display === "" || metricUnitArray[i].style.display === "inline-block") {
            metricUnitArray[i].style.display = "none";
        } else {
            metricUnitArray[i].style.display = "inline-block";
        }
    };
    for (let i = 0; i < imperialUnitArray.length; i++) {
        if (imperialUnitArray[i].style.display === "none" || imperialUnitArray[i].style.display === ""){
            imperialUnitArray[i].style.display = "inline-block";
        } else {
            imperialUnitArray[i].style.display = "none";
        }
    }
})

searchBar.addEventListener("input", async () => {
    const query = searchBar.value.trim();

    if (!query) {
        suggestions.forEach((p) => (p.textContent = ""));
        return;
    }

    const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=4`
    );
    const data = await res.json();
    suggestions.forEach((p) => (p.textContent = ""));

    if (data.results) {
        data.results.slice(0, 4).forEach((place, i) => {
            suggestedCitiesContainer.style.display = "block";
            suggestions[i].innerHTML = `${place.name}, ${place.country}`;
            suggestions[i].onclick = () => {
                searchBar.value = `${place.name}, ${place.country}`;
                suggestedCitiesContainer.style.display = "none";
            };
        });
    }
});

weekDaysArray.forEach((dayElement, index) => {
    dayElement.addEventListener("click", () => {
        let selected = weekDaysArray[index];
            daysBtn.innerHTML = selected.textContent;
    });
});

// states
function preLoader() {
    for(let i = 0; i < loadState.length; i++) {
        loadingText[i].innerHTML = "&mdash;";
        loadingAnimation.style.zIndex = "4";
        daysBtn.innerHTML = "&mdash;";
        loadState[i].classList.add("loadingState");
    };
};

function stopLoader() {
    loadingAnimation.style.zIndex = "-1";
    for (let i = 0; i < loadState.length; i++) {
        loadState[i].classList.remove("loadingState");
    }
}

function noResultErr() {
    noResult.classList.add("app-Error");
    noResultText.style.display = "flex";
};

// API call
async function getWeather(location) {
    const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
        throw new Error("No location found");
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
    );
    const weatherData = await weatherRes.json();

    weatherData.city = name;
    weatherData.country = country;

    return weatherData;
}

function getWeatherIcon(code) {
    if ([0].includes(code)) return ".//assets/images/icon-sunny.webp";
    if ([1, 2, 3].includes(code)) return "./assets/images/icon-overcast.webp";
    if ([45, 48].includes(code)) return ".//assets/images/icon-fog.webp";
    if ([51, 53, 55, 56, 57].includes(code)) return ".//assets/images/icon-drizzle.webp";
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return ".//assets/images/icon-rain.webp";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return ".//assets/images/icon-snow.webp";
    if ([95, 96, 99].includes(code)) return ".//assets/images/icon-storm.webp";
    return ".//assets/images/icon-partly-cloudy.webp";
}

function displayWeather(weather, location) {
    let city = weather.city || location;
    let country = weather.country || "";

    console.log(`📍 Location: ${city}, ${country}`);

    let temp = Math.round(weather.current.temperature_2m);
    let humid = `${weather.current.relative_humidity_2m}%`;
    let wind = Math.round(weather.current.wind_speed_10m);
    let feels = Math.round(weather.current.apparent_temperature);
    let today = new Date().toLocaleDateString("en-US",{
        weekday: "long", 
        month: "long", 
        day: "numeric",
        year: "numeric"
    }
    );

    cityLocation.innerHTML = `${city}, ${country}`;
    currentTemp.innerHTML = temp;
    humidity.innerHTML = humid;
    windSpeed.innerHTML = wind;
    feelsTemp.innerHTML = feels;
    date.innerHTML = today;

    weatherIcon.src = getWeatherIcon(weather.current.weather_code);

    // Daily
    const { temperature_2m_max, temperature_2m_min, time,} = weather.daily;
    for (let i = 0; i < 7; i++) {
        let weekday = new Date(time[i]).toLocaleDateString("en-US", {
            weekday: "short",
        });
        day_week[i].innerHTML = weekday;

        let max = Math.round(temperature_2m_max[i]);
        let min = Math.round(temperature_2m_min[i]);

        if (temp_max[i]) temp_max[i].textContent = max;
        if (temp_min[i]) temp_min[i].textContent = min;
    }

    const { temperature_2m, time: hourlyTime, weather_code } = weather.hourly;
    let now = new Date();
    let currentHourISO = now.toISOString().slice(0, 13);
    let startIndex = hourlyTime.findIndex((t) => t.startsWith(currentHourISO));

    if (startIndex !== -1) {
        for (let i = 0; i < 8; i++) {
            let idx = startIndex + i;
            if (idx >= hourlyTime.length) break;

            let hourLabel = new Date(hourlyTime[idx]).toLocaleTimeString("en-US", {
                hour: "numeric",
            });
            let weekday = new Date().toLocaleDateString("en-US",{
            weekday: "long"
            }
            );
            daysBtn.innerHTML = weekday;
            let hourTemp = Math.round(temperature_2m[idx]);

            if (hourly_time[i]) hourly_time[i].textContent = hourLabel;
            if (hourly_temp[i]) hourly_temp[i].textContent = hourTemp;
            if (hourly_icon[i]) hourly_icon[i].src = getWeatherIcon(weather_code[idx]);
        }
    }
}



searchBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    noResult.classList.remove("app-Error");
    noResultText.style.display = "none";
    suggestedCitiesContainer.style.display = "none";

    const location = searchBar.value.trim();
    if (!location) return;

    preLoader();

    try {
        const weather = await getWeather(location);
        displayWeather(weather, location);
        stopLoader();
    } catch (error) {
        console.error("Error:", error);
        noResultErr();
        stopLoader();
    }
});


unitsSwap.addEventListener("click", () => {
    useMetric = !useMetric;
    unitToggle.textContent = useMetric ? "Switch to °F" : "Switch to °C";

    if (lastWeather) {
        displayWeather(lastWeather, lastWeather.city);
    }
});
function toFahrenheit(celsius) {
    return Math.round((celsius * 9) / 5 + 32);
}
function toMph(kmh) {
    return Math.round(kmh / 1.609);
}