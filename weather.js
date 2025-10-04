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
const loadingT = document.querySelectorAll(".hiddenL");
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
function closeDropdown (one, two) {
    document.addEventListener("click", (e) => {
    if (!one.contains(e.target) && !two.contains(e.target)) {
        two.style.display = "none";
    }
})
};

// drop-down buttons
units.addEventListener("click", () => swap(unitsDropdown),
closeDropdown(units, unitsDropdown));
daysBtn.addEventListener("click", () => swap(daysBtnDropdown), closeDropdown(daysBtn, daysBtnDropdown));

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

searchBar.addEventListener("click", () => closeDropdown(searchBar, suggestedCitiesContainer));


function preLoader() {
    for(let i = 0; i < loadState.length; i++) {
        loadingAnimation.style.zIndex = "4";
        daysBtn.innerHTML = "&mdash;";
        loadState[i].classList.add("loadingState");
        feelsTemp.innerHTML = "&mdash;";
        windSpeed.innerHTML = "&mdash;";
        precipitate.innerHTML = "&mdash;";
        humidity.innerHTML = "&mdash;";
        loadingText[0].style.display = "none";
        loadingText[1].style.display = "none";
        loadingText[2].style.display = "none";
    };
};
function stopLoader() {
    loadingAnimation.style.zIndex = "-1";
    for (let i = 0; i < loadState.length; i++) {
        daysBtn.innerHTML = weekDaysArray[0].textContent;
        loadState[i].classList.remove("loadingState");
        loadingText[0].style.display = "Block";
        loadingText[1].style.display = "Block";
        loadingText[2].style.display = "Block";
    }
};
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
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code,precipitation&hourly=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,precipitation&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum&timezone=auto`
    );
    const weatherData = await weatherRes.json();

    weatherData.city = name;
    weatherData.country = country;

    return weatherData;
};

function getWeatherIcon(code) {
    if ([0].includes(code)) return "./assets/images/icon-sunny.webp";
    if ([1, 2, 3].includes(code)) return "./assets/images/icon-overcast.webp";
    if ([45, 48].includes(code)) return "./assets/images/icon-fog.webp";
    if ([51, 53, 55, 56, 57].includes(code)) return "./assets/images/icon-drizzle.webp";
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "./assets/images/icon-rain.webp";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "./assets/images/icon-rain.webp";

    if ([95, 96, 99].includes(code)) return "./assets/images/icon-storm.webp";
    return "./assets/images/icon-partly-cloudy.webp";
}

function displayWeather(weather, location) {
    let city = weather.city || location;
    let country = weather.country || "";

    console.log(`📍 Location: ${city}, ${country}`);

    function getDailyCodeFromHourly(dayIndex) {
        if (!weather.hourly) return weather.daily.weather_code?.[dayIndex] ?? 0;
        const { time: hourlyTime = [], weather_code: hourlyCodes = [] } = weather.hourly;

        let targetDate = new Date(weather.daily.time[dayIndex]).toISOString().slice(0, 10);
        let codes = hourlyTime
            .map((t, idx) => (t.startsWith(targetDate) ? hourlyCodes[idx] : null))
            .filter(c => c !== null);

        if (!codes.length) return weather.daily.weather_code?.[dayIndex] ?? 0;

        let middayIndex = hourlyTime.findIndex(t => t.startsWith(`${targetDate}T12:00`));
        if (middayIndex !== -1) return hourlyCodes[middayIndex];

        let freq = {};
        codes.forEach(c => (freq[c] = (freq[c] || 0) + 1));
        return parseInt(Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0]);
    }

    function updateCurrentFields(dayIndex) {
        let dayDate = new Date(weather.daily.time[dayIndex]);
        date.innerHTML = dayDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        });
        cityLocation.innerHTML = `${city}, ${country}`;

        if (dayIndex === 0) {
            let temp = Math.round(weather.current.temperature_2m);
            let humid = `${weather.current.relative_humidity_2m}%`;
            let wind = Math.round(weather.current.wind_speed_10m);
            let feels = Math.round(temp - 2);

            currentTemp.innerHTML = temp;
            humidity.innerHTML = humid;
            windSpeed.textContent = wind;
            feelsTemp.innerHTML = feels;

            if (weather.current?.precipitation !== undefined && precipitate) {
                precipitate.textContent = Math.round(weather.current.precipitation);
            }
            if (weather.current?.weather_code !== undefined) {
                weatherIcon.src = getWeatherIcon(weather.current.weather_code);
            }
        } else {
            let avgHumid = getDailyAvgFromHourly(dayIndex, "humidity");
            let avgWind = getDailyAvgFromHourly(dayIndex, "wind");

            const {
                temperature_2m_max = [],
                temperature_2m_min = [],
                precipitation_sum = []
            } = weather.daily;

            let avgTemp = Math.round((temperature_2m_max[dayIndex] + temperature_2m_min[dayIndex]) / 2);

            currentTemp.innerHTML = avgTemp;
            feelsTemp.innerHTML = avgTemp - 2;
            humidity.innerHTML = `${avgHumid}%`;
            windSpeed.textContent = avgWind;

            let code = getDailyCodeFromHourly(dayIndex);
            weatherIcon.src = getWeatherIcon(code);

            if (precipitate) {
                precipitate.textContent = Math.round(precipitation_sum?.[dayIndex] ?? 0);
            }
        }
    }

    function getDailyAvgFromHourly(dayIndex, type) {
        if (!weather.hourly) return 0;
        const { time: hourlyTime = [], relative_humidity_2m = [], wind_speed_10m = [] } = weather.hourly;

        let targetDate = new Date(weather.daily.time[dayIndex]).toISOString().slice(0, 10);
        let values = hourlyTime
            .map((t, idx) => {
                if (!t.startsWith(targetDate)) return null;
                if (type === "humidity") return relative_humidity_2m[idx];
                if (type === "wind") return wind_speed_10m[idx];
                return null;
            })
            .filter(v => v !== null && !isNaN(v));

        if (!values.length) return 0;
        return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    }

    if (weather.daily) {
        const { temperature_2m_max = [], temperature_2m_min = [], time = [] } = weather.daily;
        for (let i = 0; i < 7; i++) {
            if (!time[i]) continue;
            let weekday = new Date(time[i]).toLocaleDateString("en-US", { weekday: "short" });
            if (day_week?.[i]) day_week[i].textContent = weekday;
            if (temp_max?.[i]) temp_max[i].textContent = Math.round(temperature_2m_max[i]);
            if (temp_min?.[i]) temp_min[i].textContent = Math.round(temperature_2m_min[i]);
            if (day_icon?.[i]) {
                let code = getDailyCodeFromHourly(i);
                day_icon[i].src = getWeatherIcon(code);
                day_icon[i].alt = `Weather icon for ${weekday}`;
            }
        }
    }

    function renderHourlyForecast(dayIndex) {
        if (!weather.hourly) return;
        const { temperature_2m = [], time: hourlyTime = [], weather_code = [] } = weather.hourly;

        let now = new Date();
        let targetDate = new Date(weather.daily.time[dayIndex]).toISOString().slice(0, 10);

        let startIndex = hourlyTime.findIndex(t => {
            let localTime = new Date(t);
            return (
                t.startsWith(targetDate) &&
                localTime.getHours() === now.getHours()
            );
        });

        if (startIndex === -1) {
            startIndex = hourlyTime.findIndex(t => t.startsWith(targetDate));
        }
        if (startIndex === -1) startIndex = 0; 

        let nextHours = hourlyTime.slice(startIndex, startIndex + 8);

        for (let i = 0; i < 8; i++) {
            if (!nextHours[i]) break;
            let idx = startIndex + i;
            let localTime = new Date(hourlyTime[idx]);
            let hourLabel = localTime.toLocaleTimeString("en-US", { hour: "numeric" });

            if (hourly_time?.[i]) hourly_time[i].textContent = hourLabel;
            if (hourly_temp?.[i]) hourly_temp[i].textContent = Math.round(temperature_2m[idx]);
            if (hourly_icon?.[i]) hourly_icon[i].src = getWeatherIcon(weather_code?.[idx] ?? 0);
        }
    }

    updateCurrentFields(0);
    renderHourlyForecast(0);

    weekDaysArray.forEach((dayElement, index) => {
        dayElement.textContent = new Date(weather.daily.time[index]).toLocaleDateString("en-US", { weekday: "long" });
        dayElement.addEventListener("click", () => {
            daysBtn.innerHTML = dayElement.textContent;
            updateCurrentFields(index);
            renderHourlyForecast(index);
        });
    });
};

unitsSwap.addEventListener("click", () => {
    function toFahrenheit(celsius) {
        celsius = parseFloat(celsius);
        if (isNaN(celsius)) return 0;
        return Math.round((celsius * 9) / 5 + 32);
    }

    function toCelsius(fahrenheit) {
        fahrenheit = parseFloat(fahrenheit);
        if (isNaN(fahrenheit)) return 0;
        return Math.round((fahrenheit - 32) * 5 / 9);
    }

    function toMph(kmh) {
        kmh = parseFloat(kmh);
        if (isNaN(kmh)) return 0;
        return Math.round(kmh / 1.609);
    }

    function toKmh(mph) {
        mph = parseFloat(mph);
        if (isNaN(mph)) return 0;
        return Math.round(mph * 1.60934);
    }

    function toIn(mm) {
        mm = parseFloat(mm);
        if (isNaN(mm)) return 0;
        return (mm * 0.0393701).toFixed(2);
    }

    function toMm(inches) {
        inches = parseFloat(inches);
        if (isNaN(inches)) return 0;
        return Math.round(inches * 25.4);
    }

    function toImperial() {
        currentTemp.innerHTML = toFahrenheit(currentTemp.innerHTML);
        windSpeed.innerHTML = toMph(windSpeed.innerHTML);
        feelsTemp.innerHTML = toFahrenheit(feelsTemp.innerHTML);

        if (precipitate && precipitate.innerHTML.trim() !== "") {
            precipitate.innerHTML = toIn(precipitate.innerHTML);
        }

        for (let i = 0; i < temp_max.length; i++) {
            temp_max[i].innerHTML = toFahrenheit(temp_max[i].innerHTML);
        }
        for (let i = 0; i < temp_min.length; i++) {
            temp_min[i].innerHTML = toFahrenheit(temp_min[i].innerHTML);
        }
        for (let i = 0; i < hourly_temp.length; i++) {
            hourly_temp[i].innerHTML = toFahrenheit(hourly_temp[i].innerHTML);
        }
    }

    function toMetric() {
        currentTemp.innerHTML = toCelsius(currentTemp.innerHTML);
        windSpeed.innerHTML = toKmh(windSpeed.innerHTML);
        feelsTemp.innerHTML = toCelsius(feelsTemp.innerHTML);

        if (precipitate && precipitate.innerHTML.trim() !== "") {
            precipitate.innerHTML = toMm(precipitate.innerHTML);
        }

        for (let i = 0; i < temp_max.length; i++) {
            temp_max[i].innerHTML = toCelsius(temp_max[i].innerHTML);
        }
        for (let i = 0; i < temp_min.length; i++) {
            temp_min[i].innerHTML = toCelsius(temp_min[i].innerHTML);
        }
        for (let i = 0; i < hourly_temp.length; i++) {
            hourly_temp[i].innerHTML = toCelsius(hourly_temp[i].innerHTML);
        }
    }

    for (let i = 0; i < metricUnitArray.length; i++) {
        if (
            metricUnitArray[i].style.display === "block" ||
            metricUnitArray[i].style.display === "" ||
            metricUnitArray[i].style.display === "inline-block"
        ) {
            metricUnitArray[i].style.display = "none";
        } else {
            if (i === 0) {
                toMetric();
            }
            metricUnitArray[i].style.display = "inline-block";
        }
    }

    for (let i = 0; i < imperialUnitArray.length; i++) {
        if (
            imperialUnitArray[i].style.display === "none" ||
            imperialUnitArray[i].style.display === ""
        ) {
            if (i === 0) {
                toImperial();
            }
            imperialUnitArray[i].style.display = "inline-block";
        } else {
            imperialUnitArray[i].style.display = "none";
        }
    }
});

function noNetwork () {
    const appError = document.querySelector(".app-error");
    const appErrorDisplay = document.querySelector(".appError");
    appError.style.display = "none";
    appErrorDisplay.style.display = "flex";
};

searchBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    noResult.classList.remove("app-Error");
    noResultText.style.display = "none";
    suggestedCitiesContainer.style.display = "none";

    const location = searchBar.value.trim();
    if (!location) return;

    if (!navigator.onLine) {
        noNetwork();  
        return;       
    } else {
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
    }
});
