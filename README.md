# Frontend Mentor - Weather App Solution

This is a solution to the [Weather App challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/weather-app-K1FhddVm49).  
Frontend Mentor challenges help you improve your coding skills by building realistic projects.  

## Table of contents

- [Overview](#overview)  
  - [The challenge](#the-challenge)  
  - [Screenshot](#screenshot)  
  - [Links](#links)  
- [My process](#my-process)  
  - [Built with](#built-with)  
  - [What I learned](#what-i-learned)  
- [Author](#author)  

## Overview

### The challenge

Users should be able to:  

- Search for weather information by entering a location in the search bar  
- View current weather conditions (temperature, weather icon, location details)  
- See additional weather metrics:  
  - "Feels like" temperature  
  - Humidity percentage  
  - Wind speed  
  - Precipitation amounts  
- Browse a 7-day forecast with daily high/low temperatures and weather icons  
- View an hourly forecast showing temperature changes throughout the day  
- Switch between days of the week using the hourly forecast selector  
- Toggle between Imperial and Metric measurement units  
- Switch between:  
  - Celsius ↔ Fahrenheit  
  - km/h ↔ mph (wind speed)  
  - millimeters (precipitation)  
- View an optimal responsive layout depending on device size  
- See hover and focus states for all interactive elements  

### Screenshot

![](/preview.jpg)  

### Links

- **Solution URL**: [GitHub Repo](https://github.com/S4V10N)  
- **Live Site URL**: [Weather App](https://weather-app-orpin-chi-75.vercel.app/)  

## My process

### Built with

- Semantic **HTML5** markup  
- **CSS custom properties**  
- **Flexbox**  
- **CSS Grid**  
- **SCSS**  
- **JavaScript**  
- Mobile-first workflow  

### What I learned

The Frontend Mentor Challenge taught me a lot. I discovered new ways to approach **JavaScript**, became more flexible with design choices, and improved my problem-solving process in code.  

Most importantly, it pushed me outside of my comfort zone — and I can genuinely say I grew as a developer through the experience. 🚀  

### Code snippets I’m proud of

**Loading animation (HTML):**
```html
<div class="loading load-state" id="load-state-animation">
  <div class="balls">
    <div class="ball-1"></div>
    <div class="ball-2"></div>
    <div class="ball-3"></div>
  </div>
  <p>Loading...</p>
</div>
```

**weather app dashboard (CSS):**
```CSS
.app__dashboard {
  width: 124rem;
  display: grid;
  grid-template-columns: 80rem 1fr;
  grid-template-rows: auto;
  align-items: start;
  column-gap: 2.5rem;
  grid-template-areas: 
    "one two"
    "three two"
    "four two";
}
```

**weekday dropdown (JS):**
``` JS
weekDaysArray.forEach((dayElement, index) => {
  dayElement.addEventListener("click", () => {
    let selected = weekDaysArray[index];
    daysBtn.innerHTML = selected.textContent;
  });
});
```
## Author

- Frontend Mentor - [@S4V10N](https://www.frontendmentor.io/profile/S4V10N)  
- Twitter - [@S4V10N](https://x.com/dev_savion?s=21)  