function getLocation() {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(setLocation);

    }
    else {
    }
}

function setLocation(location){

    var lat = location.coords.latitude;
    var long = location.coords.longitude;
    
    zomatoGeoResources(lat, long);

};

getLocation();

function zomatoGeoResources(lat, long){

    $.ajax({
        url: "https://developers.zomato.com/api/v2.1/geocode?lat=" + lat + "&lon=" + long,
        headers: { 
          'user-key': 'ebaf4ea1c48d3147925a8d04eff4eaf3',
          'Accept': 'application/json'
        },
        type: "GET"})
        .then(function(response){

            console.log(response);

            var cityName = response.location.city_name;
            var cityType = response.location.entity_type;
            var cityID = response.location.entity_id;
            var cuisineBasedOnEmotion = "fastfood";
            var resultAmount = 20;


            zomatoSearchResources(cityID, cityType, cuisineBasedOnEmotion, resultAmount, lat, long);
            openWeatherResources(cityName);

        });
};

function zomatoSearchResources(cityID, cityType, cuisineBasedOnEmotion, resultAmount, lat, long){

    $.ajax({
        url: "https://developers.zomato.com/api/v2.1/search?entity_id=" + cityID + "&entity_type=" + cityType + "&q=" + cuisineBasedOnEmotion + "&count=" + resultAmount + "&lat=" + lat+ "&lon=" + long,
        headers: { 
          'user-key': 'ebaf4ea1c48d3147925a8d04eff4eaf3',
          'Accept': 'application/json'
        },
        type: "GET"})
        .then(function(response){

          console.log(response);

        });

};

function openWeatherResources(city){

    var apiKey = "61884189ea401251c54c2d436ff4118c"
    var cityName = city;
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

    $.ajax({url: queryURL, method: "GET"}).then(function(result){

    console.log(result)

    });

};




