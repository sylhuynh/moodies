var resultsContainer = $("#results-container");
var emotionDropdown = $("#emotion-dropdown");
var emotionChoice = $("#emotion-dropdown li");
var cuisineBasedOnEmotion = "";
$('.dropdown-trigger').dropdown();

$(emotionChoice).on("click", function(event){
    var emotionChosen = this.innerHTML;
    console.log(this.innerHTML)
if (emotionChosen ==="Sad"){
    alert("Sad");
    findSadReccomendations();
}
else if(emotionChosen ==="Angry"){
    alert("Angry");
    findAngryReccomendations();
}
else if(emotionChosen ==="Happy"){
    alert("Happy");
    findHappyReccomendations();
}

function findSadReccomendations(){
    //grab fast casual, taquerias, wine bars
    cuisineBasedOnEmotion = "fast casual, taquerias, wine bars";

    zomatoGeoCode();
};

function findAngryReccomendations(){
    //grab fast food, pizzerias, food truck
    cuisineBasedOnEmotion = "fast food, pizzerias, food truck"
    zomatoGeoCode();
};

function findHappyReccomendations(){
    //grab cafes, fine dining, bars
    cuisineBasedOnEmotion = "cafés, fine dining, bars"
    zomatoGeoCode();
};

// connect Zomato API
function zomatoGeoCode(){
    $.ajax({
        url: "https://developers.zomato.com/api/v2.1/geocode?lat=32.732990&lon=-117.091080",
        headers: { 
          'user-key': 'ebaf4ea1c48d3147925a8d04eff4eaf3',
          'Accept': 'application/json' 
        },
        type: "GET"}).then(function(response){
            console.log(response);
            zomatoSearch();
            function zomatoSearch(){
                var searchQueryURL = "https://developers.zomato.com/api/v2.1/search?q=" + cuisineBasedOnEmotion;
            $.ajax({
                url: searchQueryURL,
                headers: { 
                  'user-key': 'ebaf4ea1c48d3147925a8d04eff4eaf3',
                  'Accept': 'application/json' 
                },
                type: "GET"}).then(function(searchResponse){
                    console.log(searchResponse);           
                    var cardContainer = $("<div>").attr("class","card");
                    var cardImage = $("<img>").attr("src",searchResponse.restaurants[2].restaurant.featured_image);
                    var cardImageDiv = $("<div>").attr("class","card-image").append(cardImage);
                    var cardTitle = $("<span>").attr("class", "card-title").text(searchResponse.restaurants[2].restaurant.name);
                    var cardInfo = $("<p>").text(searchResponse.restaurants[2].restaurant.cuisines + " , " + searchResponse.restaurants[2].restaurant.location.locality);
                    var reccomendationReason = $("<p>").text("Moodies recommends " + searchResponse.restaurants[2].restaurant.cuisines + " food when you are feeling " + emotionChosen + "!");
                    var cardContent = $("<div>").attr("class", "card-content").append(cardInfo, reccomendationReason)
                    resultsContainer.append(cardContainer, cardImage, cardTitle, cardImageDiv, cardContent);
                });
            };
        });

};
})