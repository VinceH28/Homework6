//DOM for input form
const form = document.querySelector("#searchInput");

//Variables
const apiKey = '093063c871e4d4f901ab6cb1072ea5e4';
const searchHistroy = [];
const currentDay = luxon.DateTime.local().toLocaleString({
    weekday: "short",
    month: "short",
    day: "2-digit",
  }); 

//API call for City Search
const todaysWeather = async (citySearch) => {

  $("#queryContent").css("display", "block");
  $("#queryDetails").empty();
  const weatherData = res.data;
  const weatherImage = weatherData.weather[0].icon;
  const imageURL = `https://openweathermap.org/img/w/${weatherImage}.png`;

  //Attach data to page
  let citysearchElement = $(`
    <h1 id ='cityName'>
    ${weatherData.name} (${today}) <img src='${imageURL}'/>
    </h1>
    <p> Temp: ${weatherData.main.temp} °F </p>
    <P> Humidity: ${weatherData.main.temp} %</p>
    <p>Wind Speed: ${weatherData.main.temp} MPH</p>
  `);
  $('#searchDetails').append(citysearchElement);
  const latitude = weatherData.coord.lat;
  const longitude = weatherData.coord.lon;
  
  //UV Index
  axios
    .get(`https://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
    )
    .then(function (uvIndexRes) {
      let uvIndex = uvIndexRes.data.value;
      let uvIndexEl = $(`
      <p> UV Index:
      <span id="uvindex">${uvIndex}</span>
      </p>
      `);
      $('#quearyDetails').append(uvIndexEl);
      fivedayForecast(latitude, longitude);
      //Index Colors
      if (uvIndex < 2) {
        uvindex.classList.add("uviGreen")
        $('Low');
      } else if (uvIndex < 5) {
        uvindex.classList.add("uviYellow")
        $('Moderate');
      } else if (uvIndex < 7) {
        uvindex.classList.add("uviOrange")
        $('High');
      } else if (uvIndex < 10) {
        uvindex.classList.add("uviRed")
        $('Very High');
      } else {
        uvindex.classList.add("ultraviolet");
      }
    });

  //Five Day Forecast
  function fivedayForecast(latitude, longitude) {
    axios
    .get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`
    )
    .then(function (finvedayForecastRes) {
      $('#fiveDay').empty();
      for (let i = 1; i <6; i++) {
        let forecastWeatherInfo = {
          date: finvedayForecastRes.data.daily[i].dt,
          temp: finvedayForecastRes.data.temp.day,
          image: finvedayForecastRes.data.weather[0].image,
          humidity: finvedayForecastRes.data.daily[i].humidity,
        };
        let forecastCurrentDate = luxon.DateTime.fromSeconds(
          forecastWeatherInfo.date
        ).toLocaleString({ weekday: 'short', month: 'short', day: '2-digit' });
        let forecastImage = `<img src= 'https://openweathermap.org/img/w/${forecastWeatherInfo.icon}.png' />`;
        
        //5 Day Cards
        forecastWeatherCard = $(`
        <div class="p-3">
        <div class="card text-light bg-transparent">
          <div class="card-body">
            <p>${forecastCurrentDate}</p>
            <p>${forecastImage}</p> 
            <p>Temperature: ${forecastWeatherInfo.temp} °F</p>
            <p>Humidity: ${forecastWeatherInfo.humidity} %</p>
          </div>
        </div>
      </div>
    `);
    $('#fiveDay').append(forecastWeatherCard);
      }
    });
  }
}