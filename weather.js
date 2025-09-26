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
const suggestedCities = document.querySelectorAll(".suggestions p");
const suggestions = Array.from(suggestedCities);
const loading = document.querySelectorAll(".load-state");
const loadState = Array.from(loading);
const loadingT = document.querySelectorAll(".load-text");
const loadingText = Array.from(loadingT);
const loadingAnimation = document.querySelector("#load-state-animation");
const noResultText = document.querySelector(".noResult");
const noResult = document.querySelector(".app__dashboard");




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
searchBar.addEventListener("click", () => swap(searchBarDropdown));
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
    for(let i = 0; i <= loadState.length; i++) {
        loadingText[i].innerHTML = "&mdash;";
        loadingAnimation.style.zIndex = "4";
        daysBtn.innerHTML = "&mdash;";
        loadState[i].classList.add("loadingState");
    };
}

function noResultErr() {
    noResult.classList.add("app-Error");
    noResultText.style.display = "flex";
}

// API call
async function getWeather() {
  preLoader();

  try {
    const location = searchBar.value.trim();

    if (!location) {
      noResult();
      return;
    }

    // Step 1: Geocoding
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      noResult();
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // Step 2: Forecast
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&timezone=auto`;
    const response = await fetch(forecastUrl);
    const data = await response.json();

    if (!data || !data.daily) {
      noResult();
      return;
    }

    // Step 3: Build results text
    let resultText = `📍 Location: ${name}, ${country}\n`;
    resultText += `🌡️ Current Temp: ${data.current.temperature_2m}°C\n`;
    resultText += `💧 Humidity: ${data.current.relative_humidity_2m}%\n`;
    resultText += `🌧️ Precipitation: ${data.current.precipitation}mm\n`;
    resultText += `💨 Wind Speed: ${data.current.wind_speed_10m} km/h\n\n`;

    resultText += "📅 Daily Forecast:\n";
    data.daily.time.forEach((day, i) => {
      resultText += `${day}: Max ${data.daily.temperature_2m_max[i]}°C / Min ${data.daily.temperature_2m_min[i]}°C\n`;
    });

    // Step 4: Show alert
    alert(resultText);

  } catch (error) {
    console.error("❌ Error fetching weather:", error);
    noResultErr();
  }
}

searchBtn.addEventListener("click", () => {
    event.preventDefault();
    searchBarDropdown.style.display = "none";
    if (searchBar.value === ""|| searchBar.value.length === 0) {
        searchBar.value = "Please enter a valid city";
    } else {
        if (searchBar.value !== "Please enter a valid city"){
            getWeather();
        }
    }
});