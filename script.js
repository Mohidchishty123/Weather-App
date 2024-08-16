document.addEventListener('DOMContentLoaded', function() {
    const defaultCity = 'Lahore';
    fetchWeather(defaultCity);

    document.getElementById('weatherForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const location = document.getElementById('location').value;
        fetchWeather(location);
    });
});

function fetchWeather(location) {
    const weatherInfoDiv = document.getElementById('weatherContainer');
    const loadingDiv = document.getElementById('loading');

    // Show the loading component
    loadingDiv.classList.remove('hidden');

    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=KGK3U8EUGUP5LXBAT2NRZJ5LB`, { mode: 'cors' })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            const conditions = data.currentConditions.conditions;
            const fahrenheitTemp = data.currentConditions.temp;
            const celsiusTemp = fahrenheitToCelsius(fahrenheitTemp);
            const feelsLikeCelsius = fahrenheitToCelsius(data.currentConditions.feelslike);
            
            const windSpeed = data.currentConditions.windspeed;
            const chanceOfRain = data.days[0].precipprob || 0;

            document.getElementById('conditions').textContent = conditions;
            document.getElementById('locationDisplay').textContent = location;
            document.getElementById('temperature').textContent = `${celsiusTemp} °C`;
            document.getElementById('feelsLike').textContent = `${feelsLikeCelsius} °C`;
           
            document.getElementById('chanceOfRain').textContent = `${chanceOfRain} %`;
            document.getElementById('windSpeed').textContent = `${windSpeed} km/h`;

            // Populate daily forecast
            const dailyForecastDiv = document.getElementById('dailyForecast');
            dailyForecastDiv.innerHTML = ''; // Clear existing forecast

            data.days.slice(1, 8).forEach(function(day) {
                const dayDiv = document.createElement('div');
                dayDiv.innerHTML = `
                    <p><strong>${formatDay(day.datetime)}</strong></p>
                    <p class="max-temp">${fahrenheitToCelsius(day.tempmax)} °C</p>
                    <p class="min-temp">${fahrenheitToCelsius(day.tempmin)} °C</p>
                `;
                dailyForecastDiv.appendChild(dayDiv);
            });

            // Hide the loading component
            loadingDiv.classList.add('hidden');
        })
        .catch(function(error) {
            weatherInfoDiv.innerHTML = `<p>Error fetching the weather data. Please try again.</p>`;
            console.error('Error fetching the weather data:', error);
            // Hide the loading component
            loadingDiv.classList.add('hidden');
        });
}

function fahrenheitToCelsius(fahrenheit) {
    return ((fahrenheit - 32) * 5 / 9).toFixed(0);
}

function formatDay(datetime) {
    const date = new Date(datetime);
    return date.toLocaleDateString(undefined, { weekday: 'long' });
}