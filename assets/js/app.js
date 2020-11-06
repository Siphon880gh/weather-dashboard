/**
 * @dependency MomentJS, quickTester
 */

console.log("JS Connected");

let agency = function(published, subscriber) {
    subscriber(published);
}

// TODO: Right panel with current and future temperature should be blank or have a placeholder when no city was searched yet.
// TODO: UV Index background color should change depending on its index

/**
 * 
 * @object utility methods and properties for the entire app
 * 
 * @method getTodaysDate Returns today's date MM/DD/YYYY
 * @method getTodaysDate Returns date MM/DD/YYYY in some days from today
 * @property  tests.a    This will get the response from querying city name, for testing purposes.
 * @property  tests.b    This will get the response from querying longitude and latitude which has more weather information, for testing purposes
 * 
 */
let utility = {
    getTodaysDate() {
        return moment().format("MM/DD/YYYY");
    },
    getOffsetDate(addDays) {
        return moment().add(addDays, "days").format("MM/DD/YY");
    },
    tests: {
        a: {},
        b: {}
    }
}
/**
 * @object app
 * TO REVIEW: Attempted MVC and publisher subscriber pattern (if I understood it correctly). Come back to this after learning MVC and publisher/subscriber
 * 
 * @method getWeather Limitation: Querying their API with City name does not return 5 day forecast and UV index
 * @returns {object} Includes longitude and latitude
 * {"coord":{"lon":-118.24,"lat":34.05},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"base":"stations","main":{"temp":289.51,"feels_like":288.87,"temp_min":289.15,"temp_max":290.15,"pressure":1007,"humidity":82},"visibility":10000,"wind":{"speed":2.38,"deg":124},"clouds":{"all":40},"dt":1604671262,"sys":{"type":1,"id":4361,"country":"US","sunrise":1604672262,"sunset":1604710533},"timezone":-28800,"id":5368361,"name":"Los Angeles","cod":200}
 * 
 * @method getExpandedWeather Only after getting the longitude and latitude from a city search, can you get the 5 day forecast and UV index by querying their API with longitude and latitude
 * @returns {object} Includes 5 day forecast and UV index
 * 
 */
var app = {
    apiKey: "51d896b9c9317052fd630d3fc467c276",
    /* TODO: Complete convertDescriptionToIcon. It's supposed to get from iconDescription into a wi-icon if we choose to go with Weather Icons project style rather than Open Weather Icons style */
    convertDescriptionToIcon: function(iconDescription) {},
    models: {
        init: function() {
        },
        getWeather: function(city) {
            let apiKey = app.apiKey;

            $.get(`//api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`).then(response=>{ 
                // Testing
                if(quickTester.assert(typeof response.coord!=="undefined", "Querying Open Weather with city name failed because it did not return the city coordinates")) debugger;

                let weatherObj = {
                    city,
                    date: utility.getTodaysDate(),
                    iconDescription: response.weather[0].description,
                    icon: "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png",
                    temperature: response.main.temp,
                    humidity: response.main.humidity,
                    speed: response.wind.speed
                }
                let coords = {
                    lat: response.coord.lat,
                    lon: response.coord.lon
                }

                // Testing purposes
                utility.tests.a = response;
                console.log(city + "\n------------------");
                console.log("Query city name response: ", response);

                // Get more into weatherObj (UV index and daily forecast)
                app.models.getExpandedWeather(weatherObj, coords);
                
            });
        },
        getExpandedWeather: function(weatherObj, coords) {
            let apiKey = app.apiKey;
            let {lat, lon} = coords;

            $.get(`//api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`).then(response=>{ 
                // Testing
                if(quickTester.assert(typeof response.daily!=="undefined", "Querying Open Weather with longitude and latitude failed because it did not return the daily forecast")) debugger;

                // Testing purposes
                utility.tests.b = response;
                console.log("Query longitude/latitude response: ", response);

                // More properties for weatherObj available after querying by longitude and latitude
                weatherObj.uvi = response.current.uvi;
                weatherObj.daily = [];

                // Get daily forecast
                response.daily.forEach((day,i)=>{ 
                    // console.log("Should be num: " + i);
                    weatherObj.daily.push(
                        {
                        city: weatherObj.city,
                        date: utility.getOffsetDate(i+1),
                        iconDescription: day.weather[0].description,
                        icon: "http://openweathermap.org/img/wn/" + day.weather[0].icon + ".png",
                        temperature: day.temp.day,
                        humidity: day.humidity,
                        speed: day.wind_speed,
                        uvi: day.uvi
                    }); // push
                }); // forEach daily from response


                console.log("Final weather object for rendering", weatherObj);

        }) // fetch
     }, // getExpandedWeather

    }, // models
    views: {
        init: function() {
            // Can click old cities to view their information
            $(".search-history-city").on("click", function() {
                let oldCity = $(this).text();
                $("#search-city").val( oldCity );
                $("#search-city-button").click();
            })
        },

        // Todo: Complete setWeather. It's supposed to render weather information
        setWeather: function(weatherObj) {
            alert(weatherObj);
        }
    },
    controllers: {
        init: function() {

            $("#search-city-button").on("click", ()=>{
                // Get text
                let queryCity = $("#search-city").val();
                if(!queryCity) {
                    alert("Error: Please enter a city name to search for weather forecast");
                    return false;
                }
                agency(queryCity, (city)=>{app.models.getWeather(city)})
            });
        }
    }
}

app.models.init();
app.views.init();
app.controllers.init();