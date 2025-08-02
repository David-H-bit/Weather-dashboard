import React, { useState, useEffect, createContext, useRef } from 'react';
import thunder from '/amcharts_weather_icons_1.0.0/animated/thunder.svg';
import rainy3 from '/amcharts_weather_icons_1.0.0/animated/rainy-3.svg';
import rainy6 from '/amcharts_weather_icons_1.0.0/animated/rainy-6.svg';
import snowy6 from '/amcharts_weather_icons_1.0.0/animated/snowy-6.svg';
import cloudy from '/amcharts_weather_icons_1.0.0/animated/cloudy.svg';
import weather from '/amcharts_weather_icons_1.0.0/animated/day.svg';


function MyComponent(){

    const [city, setCity] = useState("");
    const [foundData, setFoundData] = useState(null);
    const [weatherUnit, setWeatherUnit] = useState("celsius");
    const [errorMessage, setErrorMessage] = useState("");

    
    async function fetchWeatherData(city) {
        const API_KEY = 'api key goes here!!! you can generate one at openweathermap.org'; 
        try{
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
            if(!response.ok){
                setFoundData(null);
                setErrorMessage("Could not find city name, try again please");
                throw new Error('Failed to fetch data'); 
            }
            const data = await response.json();
            setFoundData(data);
            console.log(data);
            setErrorMessage("");
        } catch(error){
            console.log(error);
        }
    }

    function handleCityInput(e){
        setCity(e.target.value);
    }

    function getWeatherEmoji(weatherID) {
        switch (true) {
            case (weatherID >= 200 && weatherID < 300):
                return thunder;
            case (weatherID >= 300 && weatherID < 400):
                return rainy3;
            case (weatherID >= 500 && weatherID < 600):
                return rainy6;
            case (weatherID >= 600 && weatherID < 700):
                return snowy6;
            case (weatherID >= 700 && weatherID < 800):
                return cloudy;
            case (weatherID === 800):
                return weather;
            case (weatherID >= 801 && weatherID < 810):
                return cloudy;
            default:
                return null;
        }
    }

    function handleKeyDown(e){
        if(e.key === 'Enter'){
            fetchWeatherData(city);
        }
    }
    
    function changeWeatherUnit(weatherUnit){
        setWeatherUnit(weatherUnit === "celsius" ? "fahrenheit" : "celsius");
    }

    return(<>
    <div className='search-for-city-data'>
            <h4>Enter the name of the city to fetch data</h4>
            <input type="text" value={city} onChange={handleCityInput} onKeyDown={handleKeyDown}/>
            <button onClick={() => fetchWeatherData(city)} className='weatherBtn'>Find data</button>
            <button onClick={() => changeWeatherUnit(weatherUnit)} className='weatherBtn'>{weatherUnit === "celsius" ? "celsius" : "fahrenheit"}</button>
    </div>
    <div className='weather-card'>
        <h1>Weather dashboard</h1>
        {foundData && (
            <div className='weather-info'>
                <h2 style={{fontSize: "2.5rem"}}> {foundData.name},{" "} {new Intl.DisplayNames(["en"], { type: "region" }).of(foundData.sys.country)}</h2>
                <h2 style={{fontSize: "2.5rem"}}>{weatherUnit === "celsius" ? Math.round(foundData.main.temp) + "°C" : (Math.round(foundData.main.temp * 1.8) + 32) + "°F"}</h2>
                <div className='emoji-card'>
                    <img src={getWeatherEmoji(foundData.weather[0].id)} alt='weather-icon' width={"200px"}></img>
                    <h2 style={{fontSize: "2.5rem"}}>{foundData.weather[0].description}</h2>
                    <h2>Cloudiness: {foundData.clouds.all}%</h2>
                </div>
                <div className='extra-information'>
                    <div className='extra-left'>
                        <h2>Feels like {weatherUnit === "celsius" ? Math.round(foundData.main.feels_like) + "°C" : (Math.round(foundData.main.feels_like * 1.8) + 32) + "°F"}</h2>
                        <h2>Wind: {foundData.wind.speed} m/s</h2>
                        <h2>Humidity: {foundData.main.humidity}%</h2>
                    </div>
                    <div className='extra-right'>
                        <h2>Visibility: {foundData.visibility / 1000} km</h2>
                        <h2>Sunrise: {new Date(foundData.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</h2>
                        <h2>Sunset: {new Date(foundData.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</h2>
                    </div>
                </div>
            </div>
        )}
        {errorMessage && <h2 style={{color: "red"}}>{errorMessage}</h2>}
    </div>
    </>
    );
}

export default MyComponent