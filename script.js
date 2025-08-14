// Select DOM elements
const cityInput = document.getElementById("citySearch");
const searchButton = document.getElementById("searchButton");
const weatherDisplay = document.getElementById("weatherDisplay");
const forecastSection = document.getElementById("forecastSection");
const forecastContainer = document.getElementById("forecastContainer");
const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");

// API key and endpoint
const apiKey = "155f014635594668b29e522c239447da";
const currentWeatherEndpoint = "https://api.weatherbit.io/v2.0/current";
const forecastEndpoint = "https://api.weatherbit.io/v2.0/forecast/daily";

// Fetch current weather for a city
async function fetchCurrentWeather(city) {
  const url = `${currentWeatherEndpoint}?city=${city}&key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.data[0];
  } catch (error) {
    console.error("Error fetching current weather:", error);
    throw error;
  }
}

// Fetch 5-day forecast for a city
async function fetchForecast(city) {
  const url = `${forecastEndpoint}?city=${city}&days=5&key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
}

// Display current weather
function displayWeather(weather) {
  weatherDisplay.innerHTML = `
    <div class="bg-white/30 p-8 rounded-2xl text-white weather-card shadow-xl">
      <h2 class="text-3xl font-bold mb-2">${weather.city_name}, ${weather.country_code}</h2>
      <p class="text-xl mb-4">${weather.weather.description}</p>
      <p class="text-lg">🌡️ Temperature: ${weather.temp}°C</p>
      <p class="text-lg">💧 Humidity: ${weather.rh}%</p>
      <p class="text-lg">🌬️ Wind: ${weather.wind_spd.toFixed(1)} m/s</p>
      <p class="text-sm mt-4 text-white/80">Last updated: ${weather.ob_time}</p>
    </div>
  `;
  weatherDisplay.classList.remove("hidden");
}

// Display forecast cards
function displayForecast(forecastData) {
  forecastContainer.innerHTML = "";
  forecastData.forEach((day, index) => {
    const card = document.createElement("div");
    card.className = "forecast-card p-4 rounded-2xl text-white interactive shadow-md";
    card.innerHTML = `
      <h4 class="text-lg font-semibold mb-2">${new Date(day.datetime).toDateString()}</h4>
      <p>${day.weather.description}</p>
      <p>🌡️ High: ${day.max_temp}°C</p>
      <p>🌡️ Low: ${day.min_temp}°C</p>
      <p>💧 Humidity: ${day.rh}%</p>
    `;
    forecastContainer.appendChild(card);
  });
  forecastSection.classList.remove("hidden");
}

// Show loading animation
function showLoading() {
  loadingState.classList.remove("hidden");
  loadingState.innerHTML = `<div class="text-white text-xl loading">Loading weather data...</div>`;
}

// Hide loading animation
function hideLoading() {
  loadingState.classList.add("hidden");
  loadingState.innerHTML = "";
}

// Show error message
function showError(message) {
  errorState.classList.remove("hidden");
  errorState.innerHTML = `<div class="text-red-100 text-lg font-medium">${message}</div>`;
}

// Hide error message
function hideError() {
  errorState.classList.add("hidden");
  errorState.innerHTML = "";
}

// Search weather for city
async function searchWeather() {
  const city = cityInput.value.trim();
  if (!city) return;

  showLoading();
  hideError();
  weatherDisplay.classList.add("hidden");
  forecastSection.classList.add("hidden");

  try {
    const [weather, forecast] = await Promise.all([
      fetchCurrentWeather(city),
      fetchForecast(city),
    ]);

    displayWeather(weather);
    displayForecast(forecast);
  } catch (error) {
    showError("Couldn't fetch weather data. Please try again later.");
  } finally {
    hideLoading();
  }
}

// Event listeners
searchButton.addEventListener("click", searchWeather);
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchWeather();
  }
});
