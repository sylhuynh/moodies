// Index Globals //
var resultsContainer = $("#results-container");
var emotionDropdown = $("#emotion-dropdown");
var emotionChoice = $("#emotion-dropdown li");
var resultsCardContainer = $("#restaurant-card");
var acceptButton = $("#accept-button");

// Zomato Globals //
var cuisineBasedOnEmotion = "";
var choiceReasonFeelingBlurb = [];
var sadReasonings = [" down on your luck", " not up to par", " like you need a pick-me-up", " down", " out of sorts", " not so hot", " blue", " in the dumps", " a bummer", " out of sorts", " sad", " sad dog"];
var happyReasonings = [" happy", " chipper", " like everything's going your way", " like you're on cloud nine", " over the moon", " happy as a clam", " tickled pink", " on top of the world", " like you're walking on air", " like a dog with two tails", " you're grinning from ear to ear", " like a happy camper"];
var angryReasonings = [" angry", " like you've been driven up the wall", " like you've had it up to here", " like you've taken all you can take", " fed up", " things are getting on your nerves", " tilted", " salty", " your hands clenching", " like you're turning red", " like biting someone's head off", " like you're going to blow a fuse"];

// User Location //
var lat = "";
var long = "";

// Weather Globals //
var currentIcon = "";
var currentTemp = "";
var currentFeels = "";
var currentWeather = "";
var currentWeatherDescription = "";


// Hides buttons
function hideBtns() {
    $("#y-btn").hide();
    $("#x-btn").hide();
    $("#accept-button").hide();
    $("#no-button").hide();
    $("#hidden-div").show();

    var matchText = $("<p>").text("IT'S A MATCH!");

    $("#hidden-div").append(matchText);

};


// Gets the user location //
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
    openWeatherResources(lat, long);



};


// On click Emotion Algorithm
$(emotionChoice).on("click", function moodToFood(selectedEmotion) {

    if (lat === "" && long === "") {


    }

    else {

        choiceReasonFeelingBlurb = [];
        var emotionChosen = $(this).attr("data-name");
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


// Show the cards and buttons //
function showCardandBtns() {
    $("#restaurant-card").show();
    $(".btn-wrapper").show();
};


// Hide the emotion dropdown //
function hideDropDown() {
    $("#dropdown-wrapper").hide();
};


// Zomato Geo Location URL //
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

        var cityType = response.location.entity_type;
        var cityID = response.location.entity_id;
        var resultAmount = 20;


        zomatoSearchResources(cityID, cityType, cuisineBasedOnEmotion, resultAmount, lat, long);

    });

}


// Zomato Search URL //
function zomatoSearchResources(cityID, cityType, cuisineBasedOnEmotion, resultAmount, lat, long) {

    $.ajax({
        url: "https://developers.zomato.com/api/v2.1/search?entity_id=" + cityID + "&entity_type=" + cityType + "&q=" + cuisineBasedOnEmotion + "&count=" + resultAmount + "&lat=" + lat + "&lon=" + long,
        headers: {
            'user-key': 'ebaf4ea1c48d3147925a8d04eff4eaf3',
            'Accept': 'application/json'
        },
        type: "GET"
    }).then(function (searchResponse) {
        console.log(searchResponse);
        $("#card-restaurant-row").show();

        var searchResponse = searchResponse;

        $("#spinner").hide();

        cardCreate(searchResponse);
        showCardandBtns();


        $("#no-button").on("click", function () {

            cardCreate(searchResponse);

        });

        $("#accept-button").on("click", function () {

            modalContent();

        });



    });

};


// Open Weather Location URL //
function openWeatherResources(lat, long) {

    var apiKey = "61884189ea401251c54c2d436ff4118c"
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appid=" + apiKey;

    $.ajax({ url: queryURL, method: "GET" }).then(function (result) {

        currentIcon = result.weather[0].icon;
        currentTemp = ((result.main.temp - 273.15) * 1.8 + 32).toFixed(1);
        currentFeels = ((result.main.feels_like - 273.15) * 1.8 + 32).toFixed(1);
        currentWeather = result.weather[0].main;
        currentWeatherDescription = result.weather[0].description;


        $(".logo-img").attr("src", "https://openweathermap.org/img/wn/" + currentIcon + "@2x.png")
        $(".logo-img").show();

        $(".feels-like").html("Feels like: " + currentFeels + " &deg;F")

    });

};


// Creates cards dynamically
function cardCreate(searchResponse) {

    resultsCardContainer.empty();

    var restaurantsArray = searchResponse.restaurants
    var randomRestaurantChoice = Math.floor(Math.random() * restaurantsArray.length);
    console.log(randomRestaurantChoice)

    // Grabs featured image from featured image object library
    var firstCuisine = [];
    var cuisineLines = restaurantsArray[randomRestaurantChoice].restaurant.cuisines;
    if (cuisineLines.indexOf(",") !== -1) {
        var firstCuisineLineWord = cuisineLines.substr(0, cuisineLines.indexOf(","));
        firstCuisine.push(firstCuisineLineWord);
    }
    else {
        firstCuisine.push(cuisineLines);
    }
    var cuisineTypeString = JSON.stringify(firstCuisine).toLowerCase();
    var cuisineType = JSON.parse(cuisineTypeString);
    var imageSource = featuredImage[cuisineType];
    var cardImage = $("<img>").attr("src", imageSource).attr("class", "activator");

    // Checkmark button
    var checkmark = $("<i>").attr("class","material-icon").html("✓");
    var checkmarkLink = $("<a>").attr("class", "btn-floating halfway-fab waves-effect waves-light red activator").append(checkmark);
    var cardTitle = $("<span>").text(restaurantsArray[randomRestaurantChoice].restaurant.name).attr("class", "card-title");
    
    // Card front title & photo
    var cardImageDiv = $("<div>").attr("class", "card-image").append(cardImage, cardTitle,checkmarkLink);

    // Card front info
    var cardInfo = $("<p>").text(restaurantsArray[randomRestaurantChoice].restaurant.cuisines + " " + searchResponse.restaurants[randomRestaurantChoice].restaurant.location.locality);
    var reccomendationReason = $("<p>").text("Moodies recommends " + cuisineType + " when you are feeling " + choiceReasonFeelingBlurb[0] + "!");
    var cardContentFront = $("<div>").attr("class", "card-content").append(cardInfo, reccomendationReason);
    var websiteInfo = $("<a>").text("Learn more").attr("href", restaurantsArray[randomRestaurantChoice].restaurant.url).attr("target", "_blank");
    var learnMore = $("<div>").attr("class", "card-action").append(websiteInfo);
    var cardFront = $("<div>").attr("class", "card large");

    // Card reveal info
    var collapseIcon = $("<i>").attr("class", "material-icons right").html("X");
    var cardRevealTitle = $("<span>").text(restaurantsArray[randomRestaurantChoice].restaurant.name).attr("class", "card-title grey-text text-darken-4").append(collapseIcon);
    var restaurantInfo = $("<p>").html("Give them a call: " + "<br>" + restaurantsArray[randomRestaurantChoice].restaurant.phone_numbers + "<br><br>" + "Address: " + "<br>" + restaurantsArray[randomRestaurantChoice].restaurant.location.address);
    var cardContentBack = $("<div>").attr("class", "card-content").append(restaurantInfo);
    var cardReveal = $("<div>").attr("class", "card-reveal");

    cardReveal.append(cardRevealTitle, cardContentBack);
    cardFront.append(cardImageDiv, cardContentFront, learnMore, cardReveal);


    $("#restaurant-card").append(cardFront);

};


// Accept Modal
function modalContent() {

    var matchText = $("<p>")

    matchText.text("IT'S A MATCH!");

    $("#hidden-div").append(matchText);

    $("#myModal").show();

};

var span = document.getElementsByClassName("close")[0];

$(span).on("click", function () {
    $("#hidden-div").empty();
    $("#myModal").hide();

})

$("#myModal").on("click", function () {
    $("#hidden-div").empty();
    $("#myModal").hide();

});

// Featured image library
var featuredImage = {
    afghan: "assets/images/food-images/afghan.jpg",
    african: "assets/images/food-images/african.jpg",
    american: "assets/images/food-images/american.jpg",
    argentine: "assets/images/food-images/argentine.jpg",
    armenian: "assets/images/food-images/armenian.jpg",
    asian: "assets/images/food-images/asian.jpg",
    bbq: "assets/images/food-images/bbq.jpg",
    bagels: "assets/images/food-images/bagels.jpg",
    bakery: "assets/images/food-images/bakery.jpg",
    "bar food": "assets/images/food-images/bar.jpg",
    belgian: "assets/images/food-images/belgian.jpg",
    beverages: "assets/images/food-images/beverages.jpg",
    brazilian: "assets/images/food-images/brazilian.jpg",
    breakfast: "assets/images/food-images/breakfast.jpg",
    british: "assets/images/food-images/british.jpg",
    "bubble tea": "assets/images/food-images/bubble_tea.jpeg",
    burger: "assets/images/food-images/burger.jpg",
    burmese: "assets/images/food-images/burmese.jpg",
    cafe: "assets/images/food-images/cafe.jpg",
    cajun: "assets/images/food-images/cajun.jpeg",
    california: "assets/images/food-images/california.jpeg",
    cambodian: "assets/images/food-images/cambodian.jpg",
    canadian: "assets/images/food-images/canadian.jpg",
    cantonese: "assets/images/food-images/cantonese.jpeg",
    caribbean: "assets/images/food-images/caribbean.webp",
    chili: "assets/images/food-images/chili.jpg",
    chinese: "assets/images/food-images/chinese.jpeg",
    "coffee and tea": "assets/images/food-images/coffee_and_tea.jpeg",
    colombian: "assets/images/food-images/colombian.jpg",
    creole: "assets/images/food-images/creole.jpeg",
    crepes: "assets/images/food-images/crepes.jpeg",
    cuban: "assets/images/food-images/cuban.jpeg",
    deli: "assets/images/food-images/deli.jpeg",
    desserts: "assets/images/food-images/desserts.jpeg",
    "dim sum": "assets/images/food-images/dim_sum.jpeg",
    diner: "assets/images/food-images/diner.jpeg",
    dominican: "assets/images/food-images/dominican.jpeg",
    donuts: "assets/images/food-images/donuts.jpeg",
    "drinks only": "assets/images/food-images/drinks_only.jpeg",
    "eastern european": "assets/images/food-images/eastern_european.jpeg",
    ethiopian: "assets/images/food-images/ethiopian.jpg",
    european: "assets/images/food-images/european.jpeg",
    "fast food": "assets/images/food-images/fast_food.jpg",
    filipino: "assets/images/food-images/filipino.jpeg",
    french: "assets/images/food-images/french.jpg",
    "frozen yogurt": "assets/images/food-images/frozen_yogurt.jpeg",
    fusion: "assets/images/food-images/fusion.jpg",
    german: "assets/images/food-images/german.jpg",
    greek: "assets/images/food-images/greek.jpeg",
    grill: "assets/images/food-images/grill.jpg",
    hawaiian: "assets/images/food-images/hawaiian.jpeg",
    "healthy food": "assets/images/food-images/healthy_food.jpeg",
    "ice cream": "assets/images/food-images/ice_cream.jpeg",
    indian: "assets/images/food-images/indian.jpeg",
    international: "assets/images/food-images/international.jpg",
    iranian: "assets/images/food-images/iranian.jpeg",
    irish: "assets/images/food-images/irish.jpg",
    israeli: "assets/images/food-images/israeli.jpg",
    italian: "assets/images/food-images/italian.jpeg",
    jamaican: "assets/images/food-images/jamaican.webp",
    japanese: "assets/images/food-images/japanese.jpg",
    jewish: "assets/images/food-images/jewish.jpg",
    juices: "assets/images/food-images/juices.jpeg",
    kebab: "assets/images/food-images/kebab.jpg",
    korean: "assets/images/food-images/korean.jpeg",
    laotian: "assets/images/food-images/laotian.jpg",
    "latin american": "assets/images/food-images/latin_american.png",
    lebanese: "assets/images/food-images/lebanese.jpeg",
    mediterranean: "assets/images/food-images/mediterranean.jpg",
    mexican: "assets/images/food-images/mexican.jpg",
    "middle eastern": "assets/images/food-images/middle_eastern.jpeg",
    mongolian: "assets/images/food-images/mongolian.jpg",
    moroccan: "assets/images/food-images/moroccan.jpeg",
    nepalese: "assets/images/food-images/nepalese.png",
    "new american": "assets/images/food-images/new_american.jpg",
    "new mexican": "assets/images/food-images/new_mexican.jpg",
    pacific: "assets/images/food-images/pacific.jpeg",
    pakistani: "assets/images/food-images/pakistani.jpg",
    patisserie: "assets/images/food-images/patisserie.jpg",
    peruvian: "assets/images/food-images/peruvian.jpeg",
    pizza: "assets/images/food-images/pizza.jpeg",
    "pub food": "assets/images/food-images/pub_food.jpeg",
    "puerto rican": "assets/images/food-images/puerto_rican.jpeg",
    ramen: "assets/images/food-images/ramen.jpg",
    russian: "assets/images/food-images/russian.jpg",
    salad: "assets/images/food-images/salad.jpeg",
    salvadorean: "assets/images/food-images/salvadorean.jpg",
    sandwich: "assets/images/food-images/sandwich.jpeg",
    scottish: "assets/images/food-images/scottish.jpeg",
    seafood: "assets/images/food-images/seafood.jpeg",
    "soul food": "assets/images/food-images/soul_food.jpg",
    "south african": "assets/images/food-images/south_african.jpg",
    southern: "assets/images/food-images/southern.jpg",
    southwestern: "assets/images/food-images/southwestern.jpeg",
    spanish: "assets/images/food-images/spanish.jpeg",
    steak: "assets/images/food-images/steak.jpeg",
    sushi: "assets/images/food-images/sushi.jpeg",
    taco: "assets/images/food-images/taco.jpeg",
    taiwanese: "assets/images/food-images/taiwanese.jpg",
    tapas: "assets/images/food-images/tapas.jpeg",
    tea: "assets/images/food-images/tea.jpeg",
    teriyaki: "assets/images/food-images/teriyaki.jpg",
    "tex-mex": "assets/images/food-images/tex-mex.jpg",
    thai: "assets/images/food-images/thai.jpeg",
    turkish: "assets/images/food-images/turkish.jpeg",
    vegetarian: "assets/images/food-images/vegetarian.jpeg",
    vietnamese: "assets/images/food-images/vietnamese.jpg",
    "": "assets/images/food-images/food.jpg"
};

// Run Functions
getLocation();



