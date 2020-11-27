$(document).ready(function () {
    documentIsReady();
})
// Execute code on document ready
function documentIsReady() {
    // Select DOM elements
    const countryCityDOM = document.querySelector('#country-city');
    const iconDOM = document.querySelector('#icon');
    const descriptionDOM = document.querySelector('#description');
    const rainDOM = document.querySelector('#rain-data');
    const sunriseDOM = document.querySelector('#sunrise-data');
    const sunsetDOM = document.querySelector('#sunset-data');
    const tempDOM = document.querySelector('#temp');
    const feelsLikeDOM = document.querySelector('#feels-like-data');
    const humidityDOM = document.querySelector('#humidity-data');
    const pressureDOM = document.querySelector('#pressure-data');
    const timeDOM = document.querySelector('#clock');

    const degreeDOM = document.querySelector('.degree');
    let dat = degreeDOM.dataset.id;
    const langDOM = document.querySelector('.lang');

    const loadingSection = document.querySelector('#loading-section');
    const infoSection = document.querySelector('.info');

    let wait;

    let currentLang;
    currentLang = currentLang || 'en'

    // Request city from IP API
    ipRequest(currentLang);
    function ipRequest(lang) {
        wait = 1;
        isLoading();

        const ipapi = {
            "async": true,
            "crossDomain": true,
            "url": "http://api.ipapi.com/210.55.144.106?access_key=b7c41e90ca850fb062c81fef42989d49&format=1",
            "method": "GET",
        };
        $.ajax(ipapi).done(function (response) {
            // Send response to next function
            getWeatherData(response.latitude, response.longitude, lang);
        });
    };

    // Request weather information from API based on city
    function getWeatherData(lat, lon, lang) {
        const openweathermap = {
            "async": true,
            "crossDomain": true,
            "url": `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=${lang}&id=524901&appid=6c9dc6e0b6d13f0aa604a44878a228d3`,
            "method": "GET",
        };

        return $.ajax(openweathermap).done(function (response) {
            formatData(response);
        });
    };

    // Place information from response into variables
    function formatData(wResponse) {
        let temp = tempConvert(wResponse.main.temp);
        let feelsLike = tempConvert(wResponse.main.feels_like); // Feels like (kelvin)

        let humidity = wResponse.main.humidity; // Humidity (%)
        let pressure = wResponse.main.pressure; // Pressure (hPa)

        let city = wResponse.name; // City name
        let country = wResponse.sys.country; // Country name
        let description = wResponse.weather[0].description; // Description (two words)
        let iconid = wResponse.weather[0].icon; // icon ID
        let icon = `http://openweathermap.org/img/wn/${iconid}@2x.png`; // icon URL

        let sunrise = wResponse.sys.sunrise; // Sunrise (unix timestamp)
        let sunset = wResponse.sys.sunset; // Sunset (unix timestamp)
        let fsunrise = timeConvert(sunrise); // Sunrise (00:00)
        let fsunset = timeConvert(sunset); // Sunset (00:00)

        // If rain is available, get it:
        let rain;
        if (wResponse.rain) {
            rain = wResponse.rain["1h"]; // Rain for the past hour (ml)
        }

        // Convert unix timestamp to UTC
        function timeConvert(unix) {
            var date = new Date(unix * 1000);
            var hours = date.getHours();
            var minutes = date.getMinutes();
            return `${hours}:${minutes}`;
        }

        // Temperature conversions

        function tempConvert(temp) {
            let newTemp;
            if (dat === 'c') {
                newTemp = `${Math.round(temp - 273.15)}&degC`;
            }
            if (dat === 'f') {
                newTemp = `${Math.round((temp - 273.15) * 9 / 5 + 32)}&degF`;
            }
            if (dat === 'k') {
                newTemp = `${temp}K`;
            }
            return newTemp;
        }

        wait = 0
        loadIntoDOM(temp, feelsLike, humidity, pressure, city, country, description, icon, fsunrise, fsunset, rain);
        isLoading();
    }
    // Load data into DOM
    function loadIntoDOM(temp, feelsLike, humidity, pressure, city, country, description, icon, fsunrise, fsunset, rain) {
        countryCityDOM.innerHTML = `${city}, ${country}`
        iconDOM.src = icon;
        descriptionDOM.innerHTML = description;

        if (rain !== undefined) {
            rainDOM.innerHTML = `${rain} ml`
        } else {
            rainDOM.innerHTML = '0 ml'
        }

        // Moment.js clock setup
        let interval = setInterval(function () {
            let momentNow = moment();
            timeDOM.innerHTML = momentNow.format('hh:mm A');
        }, 100);

        sunriseDOM.innerHTML = (moment(fsunrise, 'hh:mm').format('hh:mm A'));;
        sunsetDOM.innerHTML = (moment(fsunset, 'hh:mm').format('hh:mm A'));;

        tempDOM.innerHTML = temp;
        feelsLikeDOM.innerHTML = feelsLike;
        humidityDOM.innerHTML = `${humidity}%`
        pressureDOM.innerHTML = `${pressure}hPa`
    }

    degreeDOM.addEventListener('click', function () {
        if (dat === 'c' && wait === 0) {
            dat = 'f';
            degreeDOM.innerHTML = '&degF'
            ipRequest();
        } else if (dat === 'f' && wait === 0) {
            dat = 'k';
            degreeDOM.innerHTML = 'K'
            ipRequest();
        } else if (dat === 'k' && wait === 0) {
            dat = 'c';
            degreeDOM.innerHTML = '&degC'
            ipRequest();
        }
        else {
            alert('Please wait for system to update');
        }
    });

    // Add language options
    let languages = [{ name: 'Afrikaans', code: 'af' }, { name: 'Albanian', code: 'al' }, { name: 'Arabic', code: 'ar' }, { name: 'Azerbaijani', code: 'az' }, { name: 'Bulgarian', code: 'bg' }, { name: 'Catalan', code: 'ca' }, { name: 'Czech', code: 'cz' }, { name: 'Danish', code: 'da' }, { name: 'German', code: 'de' }, { name: 'Greek', code: 'el' }, { name: 'English', code: 'en' }, { name: 'Basque', code: 'eu' }, { name: 'Persian', code: 'fa' }, { name: 'Finnish', code: 'fi' }, { name: 'French', code: 'fr' }, { name: 'Galician', code: 'gl' }, { name: 'Hebrew', code: 'he' }, { name: 'Hindi', code: 'hi' }, { name: 'Croatian', code: 'hr' }, { name: 'Hungarian', code: 'hu' }, { name: 'Indonesian', code: 'id' }, { name: 'Italian', code: 'it' }, { name: 'Japanese', code: 'ja' }, { name: 'Korean', code: 'kr' }, { name: 'Latvian', code: 'la' }, { name: 'Lithuanian', code: 'lt' }, { name: 'Macedonian', code: 'mk' }, { name: 'Norwegian', code: 'no' }, { name: 'Dutch', code: 'nl' }, { name: 'Polish', code: 'pl' }, { name: 'Portuguese', code: 'pt' }, { name: 'Português Brasil', code: 'pt_br' }, { name: 'Romanian', code: 'ro' }, { name: 'Russian', code: 'ru' }, { name: 'Swedish', code: 'sv' }, { name: 'Slovak', code: 'sk' }, { name: 'Slovenian', code: 'sl' }, { name: 'Spanish', code: 'es' }, { name: 'Serbian', code: 'sr' }, { name: 'Thai', code: 'th' }, { name: 'Turkish', code: 'tr' }, { name: 'Ukrainian', code: 'uk' }, { name: 'Vietnamese', code: 'vi' }, { name: 'Chinese Simp.', code: 'zh_cn' }, { name: 'Chinese Trad.', code: 'zh_tw' }, { name: 'Zulu', code: 'zu' }, { name: 'Afrikaans', code: 'af' }, { name: 'Afrikaans', code: 'af' },];
    function setLanguages() {
        for (let i = 0; i < languages.length; i++) {
            let option = document.createElement('option');
            let value = document.createAttribute('value');
            value.value = languages[i].code;
            option.setAttributeNode(value);
            option.innerHTML = languages[i].name;
            if (languages[i].code === 'en') {
                option.setAttribute('selected', '');
            }
            langDOM.appendChild(option);
        }
    }
    setLanguages();

    // When option changed, reload the settings
    langDOM.addEventListener('change', () => {
        ipRequest(langDOM.value)
    });

    // Hide and show sections depending on whether the chain is running
    function isLoading() {
        if (wait === 1) {
            infoSection.style.display = 'none';
            loadingSection.style.display = 'flex';
        } else {
            infoSection.style.display = 'flex';
            loadingSection.style.display = 'none';
        }
    }
}