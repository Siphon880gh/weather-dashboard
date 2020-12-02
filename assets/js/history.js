/**
 * @overview Persistently save and load history of city searches. Limit to 5 cities.
 */

function loadHistoryCities() {
    var cities = localStorage.getItem("history-cities");
    if (cities) {

        // Render old cities
        citiesArr = JSON.parse(cities);
        renderCities(citiesArr);

        if (citiesArr.length) return true;
    }

    return false;
} // loadHistoryCities

function renderCities(cities) {

    function oldCityHandler() {
        let queryCity = $(this).text();
        saveHistoryCities(queryCity);
        agency(queryCity, (city) => { app.models.getWeather(city) });
    }

    var $ul = $("ul.search-history");
    $ul.empty();

    cities.forEach(city => {
        var $li = $("<li class='list-group-item search-history-city'></li>");
        $li.text(city);

        // Attach event listener that will query old city for weather information
        $li.on("click", oldCityHandler);

        // Append old city to list
        $ul.append($li);
    })
} // renderCities

/** TO REVIEW: The array manipulations below because likely appears in job interviews */
function saveHistoryCities(city) {

    // get from localStorage
    var cities = localStorage.getItem("history-cities");
    cities = cities ? JSON.parse(cities) : [];

    // Reorder city to the top if it had been searched before
    var found = cities.indexOf(city);
    if (found !== -1) {
        cities.splice(found, 1); // TO REVIEW: Remove at found position
    }

    // Move most recently searched city to the top of the history list (the 0th position)
    // TO REVIEW: <Array>.unshift adds an element to the left side, whereas .push adds to the right side.
    cities.unshift(city);

    // Keep history list down to 5 items so the webpage does not get overran
    if (cities.length > 5) {
        cities.splice(5); // TO REVIEW: Splice taking one argument will remove elements at that position and forward 
    }

    // Update local storage
    localStorage.setItem("history-cities", JSON.stringify(cities));

    // Re-render cities
    renderCities(cities);

} // saveHistoryCities