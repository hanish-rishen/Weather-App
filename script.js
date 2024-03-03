const cityInput = document.querySelector(".city-input");
const searchbutton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");
const API_KEY="5641600880e9678df1ced0cb6536e1b0";
const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0){
       return `<div><h3 class="today-text1">${cityName}</h3>
                 <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon" class="weather-icon">
                 <h3 class="today-text2">${weatherItem.weather[0].description}</h3>
                </div>  
               <h4 class="temp"><span>${(weatherItem.main.temp - 273.15).toFixed(2)}°C</span></h4>
               <h4 class="wind"><span>Wind: ${weatherItem.wind.speed} M/S</span></h4>
               <h4 class="humidity"><span>Humidity: ${weatherItem.main.humidity}%</span></h4>
               </div>`;
               
    }else{
        return `<li class="card">
                   <span>
                   <h3 class="date">(${weatherItem.dt_txt.split(" ")[0]})</h3>
                   <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon" class="weather-icon">
                   <h4 class ="temp-card">${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                   </span>
                </li>`;

    }
    
}
const getWeatherDetails = (cityName, lat, lon) =>{
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        const uniqueForecastDays =[];
     const fiveDaysForecast = data.list.filter(forecast => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if(!uniqueForecastDays.includes(forecastDate)){
            return uniqueForecastDays.push(forecastDate);
        }
      });
      
      cityInput.vlaue ="";
      currentWeatherDiv.innerHTML="";
      weatherCardsDiv.innerHTML="";


      fiveDaysForecast.forEach((weatherItem, index) => {
        const html = createWeatherCard(cityName, weatherItem, index);
        if(index === 0){
            currentWeatherDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName, weatherItem, index));
        }else{
            weatherCardsDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName, weatherItem, index));
        }
    });
    }).catch(() => {
        alert("An error occured while fetching the weather forecast!");
    });

}
const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if(!cityName) return;
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
        const{name, lat, lon} = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
       alert("An error occured while fetching the location!");
    });
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position  => {
          const { latitude, longitude } =  position.coords;
          const  REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
          fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
            const{ name } = data[0];
            getWeatherDetails(name, latitude, longitude);
        }).catch(() => {
           alert("An error occured while fetching the city!");
        });
      },
      error => {
          if(error.code === error.PERMISSION_DENIED){
            alert("Geolocation request is denied. Please reset location permission to grant access again.");
          }
      }
    );
}


locationButton.addEventListener("click",getUserCoordinates);
searchbutton.addEventListener("click",getCityCoordinates);
cityInput.addEventListener("keydown", function (event) {
    // Check if the pressed key is Enter
    if (event.key === "Enter") {
        // Call the getCityCoordinates function when Enter key is pressed
        getCityCoordinates();
    }
});