//DOM for input form
const form = document.querySelector("#searchInput");

//Variables
const apiKey = '093063c871e4d4f901ab6cb1072ea5e4';
const userSearch = [];
const today = luxon.DateTime.local().toLocaleString({
    weekday: "short",
    month: "short",
    day: "2-digit",
  }); 

//API call for City Weather Search Resuls
const currentWeather = async (citySearch) => {
  const results = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&units=imperial&appid=${apiKey}`
  );
  $("#searchContent").css("display", "block");
  $("#searchDetails").empty();
  const apiResponse = results.data;
  const weatherImage = apiResponse.weather[0].icon;
  const imageURL = `https://openweathermap.org/img/w/${weatherImage}.png`;

  //Attach data to page
  let usercitySearch = $(`
    <h1 id ='cityName'>
    ${apiResponse.name} (${today}) <img src='${imageURL}'/>
    </h1>
    <p> Temp: ${apiResponse.main.temp} °F </p>
    <P> Humidity: ${apiResponse.main.temp} %</p>
    <p> Wind Speed: ${apiResponse.main.temp} MPH</p>
  `);
  $('#searchDetails').append(usercitySearch);
  const latitude = apiResponse.coord.lat;
  const longitude = apiResponse.coord.lon;
  
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
      $('#searchDetails').append(uvIndexEl);
      fivedayapiData(latitude, longitude);
      //Index Colors
      if (uvIndex >= 2) {
        uvIndexEl.addClass("uvIndexGreen")
        $('Low');
      } else if (UVindex > 2 && UVindex <= 5) {
        uvIndexEl.addClass("uvIndexGreen")
        $('Low');
      }
      else if (UVIndex > 5 && UVIndex <= 7) {
        uvIndexEl.addClass("uvIdndexYellow")
        $('Moderate');
      } else if (uvIndex < 7) {
        uvIndexEl.addClass("uvIndexOrange")
        $('High');
      } else if (uvIndex >=7 && uvIndex <= 10) {
        uvIndexEl.addClass("uvIndexRed")
        $('Very High');
      } else if (uvIndex < 10)  {
        uvIndexEl.addClass("ultraviolet")
        $('Very High');
      } 

    });
};

//Five Day Forecast
function fivedayapiData(latitude, longitude) {
    axios
    .get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`
    )
    .then(function (fivedayapiDataRes) {
      console.log(fivedayapiDataRes);
      $('#fivedayapiData').empty();
      for (let i = 1; i <6; i++) {
        let apiWeatherInfo = {
          date: fivedayapiDataRes.data.daily[i].dt,
          temp: fivedayapiDataRes.data.daily[i].temp.day,
          image: fivedayapiDataRes.data.daily[i].weather[0].icon,
          humidity: fivedayapiDataRes.data.daily[i].humidity,
        };
        let forecastCurrentDate = luxon.DateTime.fromSeconds(
          apiWeatherInfo.date
        ).toLocaleString({ weekday: 'short', month: 'short', day: '2-digit' });
        let forecastImage = `<img src= 'https://openweathermap.org/img/w/${apiWeatherInfo.icon}.png' />`;
        
        //5 Day Cards
        WeatherCard = $(`
        <div class="p-3">
        <div class="card text-light bg-transparent">
          <div class="card-body">
            <p>${forecastCurrentDate}</p>
            <p>${forecastImage}</p> 
            <p>Temperature: ${apiWeatherInfo.temp} °F</p>
            <p>Humidity: ${apiWeatherInfo.humidity} %</p>
          </div>
        </div>
      </div>
    `);
    $('#fiveDay').append(WeatherCard);
      }
    });
}

//Add Event Listeners

// 1. Input Form
form.addEventListener('submit', function (event) {
  event.preventDefault();
  console.log(form);

  let citySearch= document.querySelector("#cityName").value.trim()
  currentWeather(citySearch);
  if (!userSearch.includes(citySearch)) {
    userSearch.push(citySearch);
    let usercitySearch = $(`
    <li class="list-group-item bg-transparent text-light text-center pointer history">${citySearch}</li>
    `);
    $('#searchHistory').append(usercitySearch);
  }

  localStorage.setItem('citySearch', JSON.stringify(userSearch));
  form.elements.query.value = '';
});
// 2. List
$(document).on('click', '.list-group-item', function () {
  let citySearchList = $(this).text();
  currentWeather(citySearchList);
})

//Display most recent citySearch on page rephresh
$(document).ready(function () {
  let citySearchHistory = JSON.parse(localStorage.getItem('citySearch'));

  if (citySearchHistory !== null) {
    let lastSearchElment = citySearchHistory.length -1;
    let lastuserSearch = citySearchHistory[lastSearchElment];
    currentWeather(lastuserSearch);
  }
});