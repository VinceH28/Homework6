//DOM for input form
const form = document.querySelector("#searchInput");

//Variables
const apikey = '093063c871e4d4f901ab6cb1072ea5e4';
const searchHistroy = [];
const currentDay = luxon.DateTime.local().toLocaleString({
    weekday: "short",
    month: "short",
    day: "2-digit",
  }); 

//API call for City Search
const todaysWeather = async (citySearch) => {
  const results = await axios.get(`https://www.api.openweathermap.org/data/2.5/weather?q=${citySearch}&apikey=${apikey}`);

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
  const latitue = weatherData.coord.lat;
  const longitue = weatherData.coord.lon;
  

}