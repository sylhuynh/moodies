var resultsContainer = $("#results-container");
var emotionDropdown = $("#emotion-dropdown");
$('.dropdown-trigger').dropdown();

$(emotionDropdown).on("click", function(event){
    console.log(this);
    zomatoResources();
})
// connect Zomato API
function zomatoResources(){
    $.ajax({
        url: "https://developers.zomato.com/api/v2.1/categories",
        headers: { 
          'user-key': 'ebaf4ea1c48d3147925a8d04eff4eaf3',
          'Accept': 'application/json' 
        },
        type: "GET"}).then(function(response){
            console.log(response);           
            var cardContainer = $("<div>").attr("id","card-container").text(response.categories[0].categories.name);
            resultsContainer.append(cardContainer);
        });
};