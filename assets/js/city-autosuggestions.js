/**
 * @dependencies: Google Places API
 * 
 */

function initMap() {
    // Init City autocomplete
    const input = document.querySelector("#search-city");
    let options = {
        types: ['(cities)'],
        componentRestrictions: { country: "us" }
    };
    autocomplete = new google.maps.places.Autocomplete(input, options);

    // Override autosuggestions with commas by parsing only the left most word (the city name) and dropping the state, country, etc
    google.maps.event.addListener(autocomplete, "place_changed", () => {
        try {
            let withCommas = autocomplete.getPlace().formatted_address;
            let withoutCommas = withCommas.replace(/,(.*)/, "");
            input.value = withoutCommas;
            // autocomplete = new google.maps.places.Autocomplete(input, option);
            setTimeout(() => {
                $("#search-city-button").trigger("click")
            }, 100);
        } catch (err) {

        }
    });
}