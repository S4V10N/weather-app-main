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
searchBar.addEventListener("click", () => {
    swap(searchBarDropdown)
    searchBar.value = "";
});
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
async function getLocation(location) {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=en&format=json`);
    const data = await res.json();
    const result = data.results[0];
    return {
        name: result.name || "",
        country: result.country || "",
        lat: result.latitude,
        lon: result.longitude
    }
}

async function getWeather(location) {
  const { lat, lon, name } = await getLocation(location);
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min`
  );
  const data = await res.json();

  console.log("🌦 Raw weather API response:", data);

  const weatherData = {
    name,
    current: data.current,
    daily: data.daily,
  };

  console.log("✅ Parsed weather:", weatherData);
  return weatherData;
}

async function getSuggestions(query) {
  if (!query) {
    suggestedCities.innerHTML = "";
    return;
  }

  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=4&language=en&format=json`
  );
  const data = await res.json();

  suggestedCities.innerHTML = "";

  if (data.results) {
    data.results.forEach((city) => {
      const p = document.createElement("p");
      p.textContent = `${city.name}, ${city.country}`;
      p.addEventListener("click", () => {
        locationInput.value = city.name;
        suggestedCities.innerHTML = "";
        searchBtn.click(); // trigger search
      });
      suggestedCities.appendChild(p);
    });
  }
}

searchBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    suggestedCitiesContainer.style.display = "none";

    const location = searchBar.value.trim();

    if (!location) {
        searchBar.innerHTML = "Please enter a location";
        return;
    }

    preLoader();

    try {
        // ✅ Call your geocoding + weather API
        const weather = await getWeather(location);

        if (!weather || !weather.daily || !weather.daily.temperature_2m_max) {
            noResultErr();
            stopLoader();
            return;
        }

        console.log("✅ Full Weather Data:", weather);

        // ====== Current weather ======
        // These should come from geocoding (weather.location or similar)
        let city = weather.city || location; 
        let country = weather.country || ""; // fallback if missing

        let current = String(Math.round(weather.current.temperature_2m));
        let humid = String(weather.current.relative_humidity_2m) + "%";
        let wind = String(Math.round(weather.current.wind_speed_10m));
        let feels = String(Math.round(weather.current.apparent_temperature));
        let today = new Date().toDateString();

        // Plug into DOM
        cityLocation.innerHTML = `${city}, ${country}`;
        currentTemp.innerHTML = current;
        humidity.innerHTML = humid;
        windSpeed.textContent = wind;
        feelsTemp.innerHTML = feels; // ✅ no ".value"
        date.innerHTML = today;

        // ====== Daily forecast (7 days) ======
        const { temperature_2m_max, temperature_2m_min, time } = weather.daily;

        for (let i = 0; i < 7; i++) {
            let weekday = new Date(time[i]).toLocaleDateString('en-US', { weekday: 'short' });
            day_week[i].innerHTML = weekday;

            let maxTemp = String(Math.round(temperature_2m_max[i]));
            let minTemp = String(Math.round(temperature_2m_min[i]));
            let dayDate = new Date(time[i]).toDateString();

            if (temp_max[i]) temp_max[i].textContent = maxTemp;
            if (temp_min[i]) temp_min[i].textContent = minTemp;

            console.log(`📅 ${dayDate}: Min = ${minTemp}, Max = ${maxTemp}`);
        }

        // ====== Hourly forecast (next 8 hours from now) ======
        // ====== Hourly forecast (next 8 hours from now) ======
if (weather.hourly && weather.hourly.temperature_2m) {
    const { temperature_2m, time: hourlyTime } = weather.hourly;

    // find index of current hour
    let now = new Date();
    let currentHourISO = now.toISOString().slice(0, 13); // e.g., "2025-09-27T22"
    let startIndex = hourlyTime.findIndex(t => t.startsWith(currentHourISO));

    if (startIndex !== -1) {
        for (let i = 0; i < 8; i++) {
            let hourIndex = startIndex + i;
            if (hourIndex >= hourlyTime.length) break;

            let hourLabel = new Date(hourlyTime[hourIndex]).toLocaleTimeString('en-US', { hour: 'numeric' });
            let hourTemp = String(Math.round(temperature_2m[hourIndex])); // ✅ only max for that hour

            console.log(`🕑 ${hourLabel}: ${hourTemp}`);

            // If you have DOM nodes like hourly_time[i], hourly_temp[i]
            if (hourly_time[i]) hourly_time[i].textContent = hourLabel;
            if (hourly_temp[i]) hourly_temp[i].textContent = hourTemp;
            console.log(hourly_time[i], hourly_temp[i]);
        }
    }
}
        

        stopLoader();

    } catch (error) {
        console.error("❌ Error fetching weather:", error);
        noResultErr();
        stopLoader();
    }
});
