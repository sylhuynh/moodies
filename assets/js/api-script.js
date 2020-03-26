var resultsContainer = $("#results-container");
var emotionDropdown = $("#emotion-dropdown");
var emotionChoice = $("#emotion-dropdown li");
var cardContainer = $("#restaurant-card");
var cuisineBasedOnEmotion = "";
var choiceReasoning = [];
var sadReasonings = [" down on your luck", " not up to par", " like you need a pick-me-up", " down", " out of sorts", " not so hot", " blue", " in the dumps", " a bummer", " out of sorts", " sad", " sad dog"];
var happyReasonings = [" happy", " chipper", " like everything's going your way", " like you're on cloud nine", " over the moon", " happy as a clam", " tickled pink", " on top of the world", " like you're walking on air", " like a dog with two tails", " you're grinning from ear to ear", " like a happy camper"];
var angryReasonings = [" angry", " like you've been driven up the wall", " like you've had it up to here", " like you've taken all you can take", " fed up", " things are getting on your nerves", " tilted", " salty", " your hands clenching", " like you're turning red", " like biting someone's head off", " like you're going to blow a fuse"];
var lat = "";
var long = "";
var acceptButton = $("#accept-button");


function hideBtns(){
    $("#y-btn").hide();
    $("#x-btn").hide();
    $("#accept-button").hide();
    $("#no-button").hide();
    $("#hidden-div").show();

    var matchText = $("<p>").text("It's a MATCH!");

    $("#hidden-div").append(matchText);

};

function getLocation() {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(setLocation);

    }
    else {
    }
}

function setLocation(location) {

    lat = location.coords.latitude;
    long = location.coords.longitude;
    console.log("lat " + lat);
    console.log("lon " + long);

};


$(emotionChoice).on("click", function (event) {

    if (lat === "" && long === "") {


    }

    else {

        choiceReasoning = [];
        var emotionChosen = $(this).attr("data-name");
        console.log(emotionChosen);
        if (emotionChosen === "sad") {
            var randomSadReasonChoice = sadReasonings[Math.floor(Math.random() * sadReasonings.length)];
            choiceReasoning.push(randomSadReasonChoice);
            findSadReccomendations();
        }

        else if (emotionChosen === "angry") {
            var randomAngryReasonChoice = angryReasonings[Math.floor(Math.random() * angryReasonings.length)];
            choiceReasoning.push(randomAngryReasonChoice);
            findAngryReccomendations();
        }

        else if (emotionChosen === "happy") {
            var randomHappyReasonChoice = happyReasonings[Math.floor(Math.random() * happyReasonings.length)];
            choiceReasoning.push(randomHappyReasonChoice);
            findHappyReccomendations();
        }


        function findSadReccomendations() {
            //grab fast casual, taquerias, wine bars
            cuisineBasedOnEmotion = "fast casual, taquerias, wine bars";
            hideDropDown();
            $("#spinner").show();
            zomatoGeoResources(lat, long);
        };


        function findAngryReccomendations() {
            //grab fast food, pizzerias, food truck
            cuisineBasedOnEmotion = "fast food, pizzerias, food truck";
            hideDropDown();
            $("#spinner").show();
            zomatoGeoResources(lat, long);
        };


        function findHappyReccomendations() {
            //grab cafes, fine dining, bars
            cuisineBasedOnEmotion = "cafés, fine dining, bars";
            hideDropDown();
            $("#spinner").show();
            zomatoGeoResources(lat, long);
        };

    }

});

function showCardandBtns() {
    $("#restaurant-card").show();
    $(".btn-wrapper").show();

};

function hideDropDown() {
    $("#dropdown-wrapper").hide();
};

function zomatoGeoResources(lat, long) {

    var searchURL = "https://developers.zomato.com/api/v2.1/geocode?lat=" + lat + "&lon=" + long
    $.ajax({
        url: searchURL,
        headers: {
            'user-key': 'ebaf4ea1c48d3147925a8d04eff4eaf3',
            'Accept': 'application/json'
        },
        type: "GET"
    })
        .then(function (response) {

            console.log(response);

            var cityName = response.location.city_name;
            var cityType = response.location.entity_type;
            var cityID = response.location.entity_id;
            var resultAmount = 20;


            zomatoSearchResources(cityID, cityType, cuisineBasedOnEmotion, resultAmount, lat, long);
            openWeatherResources(cityName);

        });

}


function zomatoSearchResources(cityID, cityType, cuisineBasedOnEmotion, resultAmount, lat, long) {

    $.ajax({
        url: "https://developers.zomato.com/api/v2.1/search?entity_id=" + cityID + "&entity_type=" + cityType + "&q=" + cuisineBasedOnEmotion + "&count=" + resultAmount + "&lat=" + lat + "&lon=" + long,
        headers: {
            'user-key': 'ebaf4ea1c48d3147925a8d04eff4eaf3',
            'Accept': 'application/json'
        },
        type: "GET"
    })
        .then(function (searchResponse) {

            var searchResponse = searchResponse;

            $("#spinner").hide();

            cardCreate(searchResponse);
            showCardandBtns();


            $("#no-button").on("click", function () {

                cardCreate(searchResponse);


            });


            $("#accept-button").on("click", function () {

               $("#restaurant-card").flip("toggle");

                hideBtns();

            });

        });

};

function openWeatherResources(city) {

    var apiKey = "61884189ea401251c54c2d436ff4118c"
    var cityName = city;
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

    $.ajax({ url: queryURL, method: "GET" }).then(function (result) {

        console.log(result)

    });

};



function cardCreate(searchResponse) {

    cardContainer.empty();

    var restaurantsArray = searchResponse.restaurants;
    var randomRestaurantChoice = Math.floor(Math.random() * restaurantsArray.length);

    if (restaurantsArray[randomRestaurantChoice].restaurant.featured_image === "") {

        var cardImage = $("<img>").attr("src", "assets/images/placeholder-200x200.png");

    }
    else {

        var cardImage = $("<img>").attr("src", restaurantsArray[randomRestaurantChoice].restaurant.featured_image);

    }
    var cardTitle = $("<h2>").text(restaurantsArray[randomRestaurantChoice].restaurant.name);
    var cuisineTypeString = JSON.stringify(restaurantsArray[randomRestaurantChoice].restaurant.cuisines).toLowerCase();
    var cuisineType = JSON.parse(cuisineTypeString);
    var cardInfo = $("<p>").text(restaurantsArray[randomRestaurantChoice].restaurant.cuisines + " , " + searchResponse.restaurants[randomRestaurantChoice].restaurant.location.locality);
    var reccomendationReason = $("<p>").text("Moodies recommends " + cuisineType + " when you are feeling " + choiceReasoning[0] + "!");
    var contactInfo = $("<p>").text("Give them a call: " + restaurantsArray[randomRestaurantChoice].restaurant.phone_numbers).attr("class", "card-content");
    var addressInfo = $("<p>").text("Address: " + restaurantsArray[randomRestaurantChoice].restaurant.location.address).attr("class", "card-content");
    var websiteInfo = $("<a>").text("Learn more.").attr("href", restaurantsArray[randomRestaurantChoice].restaurant.url).attr("class", "card-content").attr("target","_blank");
    var cardFront = $("<div>").attr("class", "front card").attr("style","backface-visibility:hidden;");
    var cardBack = $("<div>").attr("class", "back card").attr("style","backface-visibility:hidden;");
    cardFront.append(cardImage, cardTitle, cardInfo, reccomendationReason);
    cardBack.append(contactInfo, addressInfo, websiteInfo);
    cardContainer.append(cardFront, cardBack);

    $("#restaurant-card").flip({
        axis: "y",
        trigger: "manual"
    });  
};
// Run Functions
getLocation();



