let area = "Lubumbashi";
// const date1 = "2024-09-24";
// const date2 = "";
const apiKey = "Q85WR6S84C26GP6ZKJGMBRT69";
const apiUrl =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const temperature = document.querySelector(".w-temp");
const timeNow = document.querySelector(".w-hour");
const dateToDay = document.querySelector(".w-date");
const wIcon = document.querySelector("#w-icon");
const wCondition = document.querySelector(".w-condition");
const wCity = document.querySelector(".w-city");
const wCityDetails = document.querySelector(".w-city-details");

const asideIconeCdt = document.querySelector(".aside-icon-condition");
const weatherAsideDate = document.querySelector(".aside-weather-date");
const asideDay = document.querySelector(".aside-weather-day");

const appAsideBottom = document.querySelector(".app-aside-bottom");
const errorMsg = document.querySelector(".error-msg");
const searchBtn = document.querySelector("#searchbar");
const cityInput = document.querySelector("#city-input");

Date.prototype.addDays = function (days) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};
//Date 1
const fDate = new Date();
const date1 = `${fDate.getFullYear()}-0${
  fDate.getMonth() + 1
}-${fDate.getDate()}`;

// console.log(`date1: ${date1}`);

// Add 6 Days to create Date 2
const date = new Date(date1);

const dateAdd = date.addDays(6);
const date2 = `${dateAdd.getFullYear()}-0${
  dateAdd.getMonth() + 1
}-${dateAdd.getDate()}`;

// console.log(`date2: ${date2}`);

//get day
const weekDay = weekDays[date.getDay()];

//Loader
const loader = document.querySelector(".loader");

// Update Weather function
const updateWeather = async () => {
  try {
    loader.style.display = "block";

    await getWeather(area);
  } catch (error) {
    console.error("Erreur lors de la mise à jour des données météo:", error);
  } finally {
    loader.style.display = "none";
  }
};

// Event manager for city search
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    errorMsg.textContent = "";
    area = city; // Update area variable
    updateWeather(); // Calls up the update function
  } else {
    errorMsg.textContent = "Please enter a city name!";
    errorMsg.style.color = "red";
  }
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click(); // Simulate a click on the search button
  }
});

async function getWeather(area) {
  try {
    const response = await fetch(
      `${apiUrl}${area}/${date1}/${date2}?key=${apiKey}`,
      {
        mode: "cors",
      }
    );

    const weatherData = await response.json();

    // console.log(weatherData);

    if (temperature) {
      temperature.textContent = `${Math.round(
        (5 / 9) * (weatherData.days[0].temp - 32)
      )}°`;
    }

    if (timeNow) {
      timeNow.textContent = `${fDate.getHours()}:${fDate.getMinutes()}:${fDate.getSeconds()}`;
    }

    if (dateToDay) {
      dateToDay.textContent = `${weekDay}, ${weatherData.days[0].datetime}`;
    }

    if (wIcon && weatherData.days[0].icon) {
      wIcon.src = `../assets/weather-icon/${weatherData.days[0].icon}.svg`;
    }

    if (wCondition) {
      wCondition.textContent = `${weatherData.days[0].conditions}`;
    }
    if (wCity) {
      wCity.textContent = `${weatherData.address}`;
    }
    if (wCityDetails) {
      wCityDetails.textContent = `${weatherData.resolvedAddress}`;
    }

    // Empty forecast container before adding new forecasts
    appAsideBottom.innerHTML = "";

    // Gestion des jours dans la variable dayValues
    const dayValues = Object.values(weatherData.days);
    dayValues.forEach((day, i) => {
      const dayContainer = document.createElement("div");
      dayContainer.classList = "app-weater-day-container";

      const wAsideHour = document.createElement("div");
      wAsideHour.classList = "w-hour-content";

      const wAsideIcon = document.createElement("div");
      wAsideIcon.classList = "w-icon-content";

      const wAsideTemp = document.createElement("div");
      wAsideTemp.classList = "w-temp-content";

      const pDay = document.createElement("p");
      pDay.classList = "aside-weather-day";
      // pDay.style.color = "blue";

      const pDate = document.createElement("span");
      pDate.classList = "aside-weather-date";
      // pDate.style.color = "blue";

      const pIcon = document.createElement("img");
      pIcon.classList = "w-icon-condition";

      const pTemp = document.createElement("p");
      pTemp.classList = "aside-temp";
      // pTemp.style.color = "blue";

      wAsideHour.appendChild(pDay);
      wAsideHour.appendChild(pDate);
      wAsideIcon.appendChild(pIcon);
      wAsideTemp.appendChild(pTemp);

      dayContainer.appendChild(wAsideHour);
      dayContainer.appendChild(wAsideIcon);
      dayContainer.appendChild(wAsideTemp);

      appAsideBottom.appendChild(dayContainer);

      // const day = dayValues[i];

      const asideDate = new Date(`${day.datetime}`);

      pDay.textContent = `${weekDays[asideDate.getDay()]}`;
      pDate.textContent = `${
        months[asideDate.getMonth()]
      }, ${asideDate.getDate()}`;

      pIcon.src = `../assets/weather-icon/${day.icon}.svg`;

      pTemp.textContent = `${Math.round((5 / 9) * (day.temp - 32))} °C`;
    });
  } catch (error) {
    console.log(`Message d'erreur: ${error}`);
  }
}

// Calls the initial update
updateWeather();

// Updates data every 10 minutes (600000 ms)
setInterval(updateWeather, 600000);
