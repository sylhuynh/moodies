// Zomato API - ebaf4ea1c48d3147925a8d04eff4eaf3
// Open Weather API - 61884189ea401251c54c2d436ff4118c
// curl -X GET --header "Accept: application/json" --header "user-key: ebaf4ea1c48d3147925a8d04eff4eaf3" "https://developers.zomato.com/api/v2.1/categories"

function zomatoResources(){

    $.ajax({
        url: "https://developers.zomato.com/api/v2.1/geocode?lat=32.715736&lon=-117.161087",
        headers: { 
          'user-key': 'ebaf4ea1c48d3147925a8d04eff4eaf3',
          'Accept': 'application/json' 
        },
        type: "GET"}).then(function(response){
            console.log(response);
            
        });
};

zomatoResources();