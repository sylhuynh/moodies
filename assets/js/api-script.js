var resultsContainer = $("#results-container");
var emotionDropdown = $("#emotion-dropdown");
var emotionChoice = $("#emotion-dropdown li");
var resultsCardContainer = $("#restaurant-card");
var cuisineBasedOnEmotion = "";
var choiceReasonFeelingBlurb = [];
var sadReasonings = [" down on your luck", " not up to par", " like you need a pick-me-up", " down", " out of sorts", " not so hot", " blue", " in the dumps", " a bummer", " out of sorts", " sad", " sad dog"];
var happyReasonings = [" happy", " chipper", " like everything's going your way", " like you're on cloud nine", " over the moon", " happy as a clam", " tickled pink", " on top of the world", " like you're walking on air", " like a dog with two tails", " you're grinning from ear to ear", " like a happy camper"];
var angryReasonings = [" angry", " like you've been driven up the wall", " like you've had it up to here", " like you've taken all you can take", " fed up", " things are getting on your nerves", " tilted", " salty", " your hands clenching", " like you're turning red", " like biting someone's head off", " like you're going to blow a fuse"];
var lat = "";
var long = "";
var acceptButton = $("#accept-button");


function hideBtns() {
    $("#y-btn").hide();
    $("#x-btn").hide();
    $("#accept-button").hide();
    $("#no-button").hide();
    $("#hidden-div").show();

    var matchText = $("<p>").text("IT'S A MATCH!");

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
    openWeatherResources(lat, long);



};


$(emotionChoice).on("click", function moodToFood(selectedEmotion) {

    if (lat === "" && long === "") {


    }

    else {

        choiceReasonFeelingBlurb = [];
        var emotionChosen = $(this).attr("data-name");
        console.log(emotionChosen);
        if (emotionChosen === "sad") {
            var randomSadReasonChoice = sadReasonings[Math.floor(Math.random() * sadReasonings.length)];
            choiceReasonFeelingBlurb.push(randomSadReasonChoice);
            findSadReccomendations();
        }

        else if (emotionChosen === "angry") {
            var randomAngryReasonChoice = angryReasonings[Math.floor(Math.random() * angryReasonings.length)];
            choiceReasonFeelingBlurb.push(randomAngryReasonChoice);
            findAngryReccomendations();
        }

        else if (emotionChosen === "happy") {
            var randomHappyReasonChoice = happyReasonings[Math.floor(Math.random() * happyReasonings.length)];
            choiceReasonFeelingBlurb.push(randomHappyReasonChoice);
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
    
    }).then(function (response) {

        console.log(response);

        var cityType = response.location.entity_type;
        var cityID = response.location.entity_id;
        var resultAmount = 20;


        zomatoSearchResources(cityID, cityType, cuisineBasedOnEmotion, resultAmount, lat, long);

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
    }).then(function (searchResponse) {

        $("#card-restaurant-row").show();

        var searchResponse = searchResponse;

        $("#spinner").hide();

        cardCreate(searchResponse);
        showCardandBtns();


        $("#no-button").on("click", function () {

            cardCreate(searchResponse);


            $("#accept-button").on("click", function () {
                // hideBtns();
                modalContent()
                $("#myModal").show();

            });

        });

    });

};

function openWeatherResources(lat, long) {

    var apiKey = "61884189ea401251c54c2d436ff4118c"
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appid=" + apiKey;

    $.ajax({ url: queryURL, method: "GET" }).then(function (result) {

        var currentIcon = result.weather[0].icon

        $(".logo-img").attr("src", "https://openweathermap.org/img/wn/" + currentIcon + "@2x.png")
        $(".logo-img").show();


    });

};



function cardCreate(searchResponse) {

    resultsCardContainer.empty();

    var restaurantsArray = searchResponse.restaurants
    var randomRestaurantChoice = Math.floor(Math.random() * restaurantsArray.length);

    var cardImage = $("<img>").attr("src", "assets/images/placeholder-200x200.png").attr("class","activator");

    var cardImage = $("<img>").attr("src", restaurantsArray[randomRestaurantChoice].restaurant.featured_image).attr("class","activator");


    // Card front title & photo
    var cardImageDiv = $("<div>").attr("class", "card-image waves-effect waves-block waves-light").append(cardImage);
    
    // Card front info
    var expandIcon = $("<i>").attr("class","material-icons right").html("...");
    var cardTitle = $("<span>").text(restaurantsArray[randomRestaurantChoice].restaurant.name).attr("class", "card-title activator grey-text text-darken-4").append(expandIcon);
    var cuisineTypeString = JSON.stringify(restaurantsArray[randomRestaurantChoice].restaurant.cuisines).toLowerCase();
    var cuisineType = JSON.parse(cuisineTypeString);
    var cardInfo = $("<p>").text(restaurantsArray[randomRestaurantChoice].restaurant.cuisines + " " + searchResponse.restaurants[randomRestaurantChoice].restaurant.location.locality);
    var reccomendationReason = $("<p>").text("Moodies recommends " + cuisineType + " when you are feeling " + choiceReasonFeelingBlurb[0] + "!");
    var cardContentFront = $("<div>").attr("class", "card-content").append(cardTitle, cardInfo, reccomendationReason);
    var websiteInfo = $("<a>").text("Learn more").attr("href", restaurantsArray[randomRestaurantChoice].restaurant.url).attr("target", "_blank");
    var learnMore = $("<div>").attr("class", "card-action").append(websiteInfo);
    var cardFront = $("<div>").attr("class", "card large");
    
    // Card reveal info
    var collapseIcon = $("<i>").attr("class","material-icons right").html("X");
    var cardRevealTitle = $("<span>").text(restaurantsArray[randomRestaurantChoice].restaurant.name).attr("class", "card-title grey-text text-darken-4").append(collapseIcon);
    var restaurantInfo = $("<p>").html("Give them a call: " + "<br>" + restaurantsArray[randomRestaurantChoice].restaurant.phone_numbers + "<br><br>" + "Address: " + "<br>" + restaurantsArray[randomRestaurantChoice].restaurant.location.address);
    var cardContentBack = $("<div>").attr("class", "card-content").append(restaurantInfo);
    var cardReveal = $("<div>").attr("class", "card-reveal");

    cardReveal.append(cardRevealTitle,cardContentBack);
    cardFront.append(cardImageDiv, cardContentFront, learnMore, cardReveal);


   $("#restaurant-card").append(cardFront);

};


function modalContent(){

    var matchText = $("<p>").text("IT'S A MATCH!");
    
    $("#hidden-div").append(matchText);

};

    
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
$(span).on("click", function() {

    $("#myModal").hide();

})

// When the user clicks anywhere outside of the modal, close it
$("#myModal").on("click", function() {

    $("#myModal").hide();

});

// Run Functions
getLocation();



