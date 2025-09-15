console.log("js is working");
const units = document.querySelector("#units");
const searchBar = document.querySelector("#searchBar");
const searchBtn = document.querySelector("#searchBtn");
const daysBtn = document.querySelector(".selected");
const unitsDropdown = document.querySelector(".units__filter");
const searchBarDropdown = document.querySelector(".suggestions");
const daysBtnDropdown = document.querySelector(".week-days");
const nodeList = document.querySelectorAll(".filter");
// const filter = Array.from(nodeList);

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
nodeList.forEach(filter => {
    filter.addEventListener("click", () => {
        const check = filter.querySelector(".check");
        check.style.display = check.style.display === "none" ? "inline" : "none"
    });
});