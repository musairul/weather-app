document.addEventListener("DOMContentLoaded", () => {
  searchWeather("london");
});

const img = document.querySelector(".gifImgs");
const temp = document.querySelector(".temp");
const cond = document.querySelector(".cond");
const errorTitle = document.querySelector(".error");
const loc = document.querySelector(".loc");
const switchButton = document.querySelector(".measure");
const userInput = document.querySelector("#locationInput");
let inputtedLocation = "";
let celcius = true;
let iconString = "";

function toF(degrees) {
  return (parseFloat(degrees) * 9) / 5 + 32;
}

function toC(degrees) {
  return ((parseFloat(degrees) - 32) * 5) / 9;
}

function convertTemps() {
  if (celcius) {
    const f = toF(temp.textContent);
    celcius = false;
    temp.textContent = f.toFixed(1) + " F";
    switchButton.textContent = "F->C";
  } else {
    const c = toC(temp.textContent);
    celcius = true;
    temp.textContent = c.toFixed(1) + " C";
    switchButton.textContent = "C->F";
  }
}

function searchWeather(input) {
  console.log(`weather.com/${input}/key=?sdkjskfj`);
  errorTitle.classList.add("hide");
  fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${input}/today?unitGroup=uk&elements=datetime%2CdatetimeEpoch%2Cname%2Ctemp%2Cfeelslike%2Chumidity%2Cprecip%2Csnow%2Cwindspeed%2Cpressure%2Ccloudcover%2Cvisibility%2Cconditions%2Cdescription%2Cicon&key=LZMMC8ZPDQ3LCECRVW29EGSB2&contentType=json`
  )
    .then((response) => {
      if (response.status === 400) {
        const message = "Location provided is not valid";
        // errorTitle.textContent = message;
        // errorTitle.classList.remove("hide");
        throw new Error(message);
      }
      inputtedLocation = input;
      loc.textContent = input.toUpperCase();
      return response.json();
    })
    .then((response) => {
      console.log(response);
      temp.textContent = response.currentConditions.temp;
      temp.textContent = celcius
        ? temp.textContent + " C"
        : toF(response.currentConditions.temp) + " F";
      cond.textContent = response.currentConditions.conditions;
      iconString = response.currentConditions.icon;
      console.log(iconString);
      getGif(cond.textContent, inputtedLocation);
    })
    .catch((error) => {
      console.log(error);
      errorTitle.textContent = error;
      errorTitle.classList.remove("hide");
    });
}

function getGif(condition) {
  const search = condition + " weather";
  console.log(search);
  fetch(
    `https://api.giphy.com/v1/gifs/translate?api_key=N1RPR7J6evFACulCbSeeV87rb4RAwfuJ&s=${search}`,
    { mode: "cors" }
  )
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      img.src = response.data.images.original.url;
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

function handleFormSubmit(e) {
  e.preventDefault();
  searchWeather(userInput.value);
}
