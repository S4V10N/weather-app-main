console.log("js is working");
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

console.log(imperialUnitArray)
console.log(metricUnitArray)
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
        daysBtn.textContent = selected.textContent;
    });
});