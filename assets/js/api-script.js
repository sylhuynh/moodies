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
    var firstCuisine = restaurantsArray[randomRestaurantChoice].restaurant.cuisines;
    console.log("first cuisine: "+firstCuisine);
    var cuisineTypeString = JSON.stringify(firstCuisine).toLowerCase();
    var cuisineType = JSON.parse(cuisineTypeString);
    console.log("Cuisine Type: " + cuisineType);
    var featuredImageString = JSON.stringify(featuredImage.cuisineType);
    var featuredImageParse = JSON.parse(featuredImageString);
    var cardImage = $("<img>").attr("src", featuredImageParse).attr("class","activator");
    console.log("Card Image: "+cardImage);
    // var cardImage = $("<img>").attr("src", restaurantsArray[randomRestaurantChoice].restaurant.featured_image).attr("class","activator");

    // Card front title & photo
    var cardImageDiv = $("<div>").attr("class", "card-image").append(cardImage);
    
    // Card front info
    var expandIcon = $("<i>").attr("class","material-icons right").html("...");
    var cardTitle = $("<span>").text(restaurantsArray[randomRestaurantChoice].restaurant.name).attr("class", "card-title activator grey-text text-darken-4").append(expandIcon);
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


// Accept Modal
function modalContent(){

    var matchText = $("<p>")

    matchText.text("IT'S A MATCH!");
    
    $("#hidden-div").append(matchText);

    $("#myModal").show();

};

var span = document.getElementsByClassName("close")[0];

$(span).on("click", function() {
    $("#hidden-div").empty();
    $("#myModal").hide();

})

$("#myModal").on("click", function() {
    $("#hidden-div").empty();
    $("#myModal").hide();

});

// Featured image library
var featuredImage = {
    afghan:"assets/images/afghan.jpg",
    african:"assets/images/african.jpg",
    american:"assets/images/american.jpg",
    argentine:"assets/images/argentine.jpg",
    armenian:"assets/images/armenian.jpg",
    asian:"assets/images/asian.jpg",
    bbq:"assets/images/bbq.jpg",
    bagels:"assets/images/bagels.jpg",
    bakery:"assets/images/bakery.jpg",
    bar:"assets/images/bar.jpg",
    food:"assets/images/food.jpg",
    belgian:"assets/images/belgian.jpg",
    beverages:"assets/images/beverages.jpg",
    brazilian:"assets/images/brazilian.jpg",
    breakfast:"assets/images/breakfast.jpg",
    british:"assets/images/british.jpg",
    bubble_tea:"assets/images/bubble_tea.jpeg",
    burger:"assets/images/burger.jpg",
    burmese:"assets/images/burmese.jpg",
    cafe:"assets/images/cafe.jpg",
    cajun:"assets/images/cajun.jpeg",
    california:"assets/images/california.jpeg",
    cambodian:"assets/images/cambodian.jpg",
    canadian:"assets/images/canadian.jpg",
    cantonese:"assets/images/cantonese.jpeg",
    caribbean:"assets/images/caribbean.webp",
    chili:"assets/images/chili.jpg",
    chinese:"assets/images/chinese.jpeg",
    coffee_and_tea:"assets/images/coffee_and_tea.jpeg",
    colombian:"assets/images/colombian.jpg",
    creole:"assets/images/creole.jpeg",
    crepes:"assets/images/crepes.jpeg",
    cuban:"assets/images/cuban.jpeg",
    deli:"assets/images/deli.jpeg",
    desserts:"assets/images/desserts.jpeg",
    dim_sum:"assets/images/dim_sum.jpeg",
    diner:"assets/images/diner.jpeg",
    dominican:"assets/images/dominican.jpeg",
    donuts:"assets/images/donuts.jpeg",
    drinks_only:"assets/images/drinks_only.jpeg",
    eastern_european:"assets/images/eastern_european.jpeg",
    ethiopian:"assets/images/ethiopian.jpg",
    european:"assets/images/european.jpeg",
    filipino:"assets/images/filipino.jpeg",
    french:"assets/images/french.jpg",
    frozen_yogurt:"assets/images/frozen_yogurt.jpeg",
    fusion:"assets/images/fusion.jpg",
    german:"assets/images/german.jpg",
    greek:"assets/images/greek.jpeg",
    grill:"assets/images/grill.jpg",
    hawaiian:"assets/images/hawaiian.jpeg",
    healthy_food:"assets/images/healthy_food.jpeg",
    ice_cream:"assets/images/ice_cream.jpeg",
    indian:"assets/images/indian.jpeg",
    international:"assets/images/international.jpg",
    iranian:"assets/images/iranian.jpeg",
    irish:"assets/images/irish.jpg",
    israeli:"assets/images/israeli.jpg",
    italian:"assets/images/italian.jpeg",
    jamaican:"assets/images/jamaican.webp",
    japanese:"assets/images/japanese.jpg",
    jewish:"assets/images/jewish.jpg",
    juices:"assets/images/juices.jpeg",
    kebab:"assets/images/kebab.jpg",
    korean:"assets/images/korean.jpeg",
    laotian:"assets/images/laotian.jpg",
    latin_american:"assets/images/latin_american.png",
    lebanese:"assets/images/lebanese.jpeg",
    mediterranean:"assets/images/mediterranean.jpg",
    mexican:"assets/images/mexican.jpg",
    middle_eastern:"assets/images/middle_eastern.jpeg",
    mongolian:"assets/images/mongolian.jpg",
    moroccan:"assets/images/moroccan.jpeg",
    nepalese:"assets/images/nepalese.png",
    new_american:"assets/images/new_american.jpg",
    new_mexican:"assets/images/new_mexican.jpg",
    pacific:"assets/images/pacific.jpeg",
    pakistani:"assets/images/pakistani.jpg",
    patisserie:"assets/images/patisserie.jpg",
    peruvian:"assets/images/peruvian.jpeg",
    pizza:"assets/images/pizza.jpeg",
    pub_food:"assets/images/pub_food.jpeg",
    puerto_rican:"assets/images/puerto_rican.jpeg",
    ramen:"assets/images/ramen.jpg",
    russian:"assets/images/russian.jpg",
    salad:"assets/images/salad.jpeg",
    salvadorean:"assets/images/salvadorean.jpg",
    sandwich:"assets/images/sandwich.jpeg",
    scottish:"assets/images/scottish.jpeg",
    seafood:"assets/images/seafood.jpeg",
    soul_food:"assets/images/soul_food.jpg",
    south_african:"assets/images/south_african.jpg",
    southern:"assets/images/southern.jpg",
    southwestern:"assets/images/southwestern.jpeg",
    spanish:"assets/images/spanish.jpeg",
    steak:"assets/images/steak.jpeg",
    sushi:"assets/images/sushi.jpeg",
    taco:"assets/images/taco.jpeg",
    taiwanese:"assets/images/taiwanese.jpg",
    tapas:"assets/images/tapas.jpeg",
    tea:"assets/images/tea.jpeg",
    teriyaki:"assets/images/teriyaki.jpg",
    tex_mex:"assets/images/tex-mex.jpg",
    thai:"assets/images/thai.jpeg",
    turkish:"assets/images/turkish.jpeg",
    vegetarian:"assets/images/vegetarian.jpeg",
    vietnamese:"assets/images/vietnamese.jpg"
};

// Run Functions
getLocation();



