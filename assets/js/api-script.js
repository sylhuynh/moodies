// Zomato API - ebaf4ea1c48d3147925a8d04eff4eaf3
// Open Weather API - 61884189ea401251c54c2d436ff4118c
// curl -X GET --header "Accept: application/json" --header "user-key: ebaf4ea1c48d3147925a8d04eff4eaf3" "https://developers.zomato.com/api/v2.1/categories"

var testLat = "32.715736";
var testLon = "-117.161087";

function zomatoResources(){



    var lat = testLat;
    var lon = testLon;

    $.ajax({
        url: "https://developers.zomato.com/api/v2.1/geocode?lat=" + lat + "&lon=" + lon,
        headers: { 
          'user-key': 'ebaf4ea1c48d3147925a8d04eff4eaf3',
          'Accept': 'application/json'
        },
        type: "GET"})
        .then(function(response){

            console.log(response);

        });
};

zomatoResources();

function openWeatherResources(city){

  var apiKey = "61884189ea401251c54c2d436ff4118c"
  var cityName = "San Diego";
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

  $.ajax({url: queryURL, method: "GET"}).then(function(result){

    console.log(result)

  });

};

openWeatherResources();

