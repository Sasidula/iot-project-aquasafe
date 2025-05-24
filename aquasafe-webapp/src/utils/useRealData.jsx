import { useState, useEffect } from "react";
import { db, ref, onValue } from "./firebase";

export function useRealData(MenuLocation) {

    const [realLocation, setRealLocation] = useState("6.951457,79.918599");
    const [menuLocation, setMenuLocation] = useState(MenuLocation);
    const [sensorViewData, setSensorViewData] = useState({});
    const [weatherData, setWeatherData] = useState({});
    const [safetyData, setSafetyData] = useState({});
    const [alerts, setAlerts] = useState([]);
    const [weatherForecast, setWeatherForecast] = useState([]);
    const [historicalData, setHistoricalData] = useState({
        flowRate: [],
        waterLevel: [],
        waterTemperature: [],
        turbidity: []
    });

    const weatherAPIKey = '05d0f3de4b3b4e9c853142033251705';
    //we will not use logic change the location for now
    const location = '6.951457,79.918599';
    const days = 5;

    switch (MenuLocation) {
        case "Kelani River":
            setMenuLocation("6.951457,79.918599");
            break;
        case "Mahaweli River":
            setMenuLocation("6.951457,79.918599");
            break;
        case "Kalu Ganga":
            setMenuLocation("6.951457,79.918599");
            break;
        case "Nilwala River":
            setMenuLocation("6.951457,79.918599");
            break;
        default:
            setMenuLocation("6.951457,79.918599");
            break;
    }

    // ✅ Get browser location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const loc = `${pos.coords.latitude},${pos.coords.longitude}`;
                    setRealLocation(loc);
                },
                (err) => {
                    console.warn("Geolocation error:", err.message);
                    // fallback to default
                    setRealLocation("6.951457,79.918599");
                }
            );
        } else {
            console.warn("Geolocation not supported. Using fallback.");
            setLocation("6.951457,79.918599");
        }
    }, []);


    useEffect(() => {
        const sensorRef = ref(db, "sensors");
        const unsubscribe = onValue(sensorRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {

                setSensorViewData(data);

                const now = new Date();
                const label = formatTimeLabel(now);

                const waterLevel = 100 - data.distance_cm; // example conversion
                const flowRate = data.flow_rate_lpm;
                const waterTemp = data.water_temperature_c;
                const turbidity = data.turbidity_voltage;

                setHistoricalData(prev => ({
                    flowRate: [...prev.flowRate.slice(-23), { time: label, value: flowRate }],
                    waterLevel: [...prev.waterLevel.slice(-23), { time: label, value: waterLevel }],
                    waterTemperature: [...prev.waterTemperature.slice(-23), { time: label, value: waterTemp }],
                    turbidity: [...prev.turbidity.slice(-23), { time: label, value: turbidity }]
                }));

            }
        });

        return () => unsubscribe();
    }, []);


    //time formating logic
    const formatTimeLabel = (date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const suffix = hours >= 12 ? "PM" : "AM";
        const hour = hours % 12 || 12;
        return `${hour}:${minutes.toString().padStart(2, "0")} ${suffix}`;
    };


    useEffect(() => {
        fetch(`https://api.weatherapi.com/v1/forecast.json?key=${weatherAPIKey}&q=${location}&days=${days}&alerts=yes`)
            .then(response => response.json())
            .then(data => {
                setWeatherData(data);
                console.log('Weather Forecast:', data);

                // Extract alerts if available
                const weatherAlerts = data?.alerts?.alert || [];

                // Map them into your custom format
                const formattedAlerts = weatherAlerts.map((alert, index) => ({
                    id: index + 1,
                    type: mapAlertSeverityToType(alert.severity),
                    title: alert.headline || "Weather Alert",
                    message: alert.desc || "No description available.",
                    timestamp: alert.effective || new Date().toISOString()
                }));

                setAlerts(formattedAlerts);

                // === Extract Forecast ===
                const formattedForecast = data?.forecast?.forecastday?.map((dayData, index) => ({
                    day: index === 0 ? "Today" : new Date(dayData.date).toLocaleDateString(undefined, { weekday: 'long' }),
                    condition: mapConditionToIcon(dayData.day.condition.text),
                    highTemp: Math.round(dayData.day.maxtemp_c),
                    lowTemp: Math.round(dayData.day.mintemp_c),
                    precipitation: Math.round(dayData.day.daily_chance_of_rain),
                    windSpeed: Math.round(dayData.day.maxwind_kph * 0.621371), // Convert to mph
                    uvIndex: dayData.day.uv
                }));

                setWeatherForecast(formattedForecast);

            })
            .catch(error => console.error('Weather API error:', error));
    }, []);


    //danger measuring logic
    function mapAlertSeverityToType(severity) {
        switch ((severity || "").toLowerCase()) {
            case "minor":
                return "info";
            case "moderate":
                return "warning";
            case "severe":
            case "extreme":
                return "danger";
            default:
                return "info";
        }
    }

    //"y"ing logic for weather
    function mapConditionToIcon(conditionText) {
        const text = conditionText.toLowerCase();
        if (text.includes("sunny")) return "sunny";
        if (text.includes("cloud")) return "cloudy";
        if (text.includes("rain")) return "rainy";
        if (text.includes("storm")) return "stormy";
        if (text.includes("snow")) return "snowy";
        return "partly-cloudy";
    }


    //get ai output
    useEffect(() => {
        if (
            sensorViewData?.distance_cm &&
            weatherData?.current?.temp_c
        ) {
            const inputData = {
                depth: sensorViewData.distance_cm,
                current: sensorViewData.flow_rate_lpm,
                temp: sensorViewData.water_temperature_c,
                air_temp: weatherData.current.temp_c,
                turbidity: sensorViewData.turbidity_raw,
                rainfall: sensorViewData.rain_value,
                wind_speed: weatherData.current.wind_kph,
                gust_speed: weatherData.current.gust_kph,
                humidity: weatherData.current.humidity,
                cloud: weatherData.current.cloud,
                feels_like: weatherData.current.feelslike_c,
                dew_point: weatherData.current.dewpoint_c,
                uv_index: weatherData.current.uv,
                is_night: weatherData.current.is_day === 0 ? 1 : 0,
                condition: mapConditionToCode(weatherData.current.condition.text)
            };

            console.log("ai model send data",inputData);

            fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputData)
            })
                .then(response => response.json())
                .then(result => {
                    setSafetyData(result);
                    console.log('Safety Prediction:', result);
                })
                .catch(error => console.error('Prediction API error:', error));
        }
        else {
            console.log("Missing data for ai model", sensorViewData, weatherData);
        }
    }, [sensorViewData, weatherData]);


    //maping weather condition to api response
    function mapConditionToCode(conditionText) {
        const conditionMap = {
            "Sunny": 1000,
            "Clear": 1000,
            "Partly cloudy": 1003,
            "Cloudy": 1006,
            "Overcast": 1009,
            "Mist": 1030,
            "Patchy rain possible": 1063,
            "Patchy snow possible": 1066,
            "Patchy sleet possible": 1069,
            "Patchy freezing drizzle possible": 1072,
            "Thundery outbreaks possible": 1087,
            "Blowing snow": 1114,
            "Blizzard": 1117,
            "Fog": 1135,
            "Freezing fog": 1147,
            "Patchy light drizzle": 1150,
            "Light drizzle": 1153,
            "Freezing drizzle": 1168,
            "Heavy freezing drizzle": 1171,
            "Patchy light rain": 1180,
            "Light rain": 1183,
            "Moderate rain at times": 1186,
            "Moderate rain": 1189,
            "Heavy rain at times": 1192,
            "Heavy rain": 1195,
            "Light freezing rain": 1198,
            "Moderate or heavy freezing rain": 1201,
            "Light sleet": 1204,
            "Moderate or heavy sleet": 1207,
            "Patchy light snow": 1210,
            "Light snow": 1213,
            "Patchy moderate snow": 1216,
            "Moderate snow": 1219,
            "Patchy heavy snow": 1222,
            "Heavy snow": 1225,
            "Ice pellets": 1237,
            "Light rain shower": 1240,
            "Moderate or heavy rain shower": 1243,
            "Torrential rain shower": 1246,
            "Light sleet showers": 1249,
            "Moderate or heavy sleet showers": 1252,
            "Light snow showers": 1255,
            "Moderate or heavy snow showers": 1258,
            "Light showers of ice pellets": 1261,
            "Moderate or heavy showers of ice pellets": 1264,
            "Patchy light rain with thunder": 1273,
            "Moderate or heavy rain with thunder": 1276,
            "Patchy light snow with thunder": 1279,
            "Moderate or heavy snow with thunder": 1282
        };
        return conditionMap[conditionText] || null;
    }


    //status measuring logic
    function getFlowRateStatus(flowRateLpm) {
        if (flowRateLpm < 10) return "low";
        if (flowRateLpm <= 20) return "normal";
        if (flowRateLpm <= 30) return "high";
        return "danger";
    }
    function getTemperatureStatus(tempC) {
        if (tempC < 15) return "cold";
        if (tempC <= 25) return "normal";
        return "warm";
    }
    function getWaterLevelStatus(distanceCm) {
        if (distanceCm < 50) return "low";
        if (distanceCm <= 150) return "normal";
        if (distanceCm <= 200) return "high";
        return "danger";
    }
    function getTurbidityStatus(ntu) {
        if (ntu < 10) return "low";
        if (ntu <= 50) return "normal";
        if (ntu <= 100) return "high";
        return "danger";
    }
    function getWeatherStatus(wss) {
        if (wss < 10) return "low";
        if (wss <= 50) return "normal";
        if (wss <= 100) return "high";
        return "danger";
    }


    //rain millimeters per min
    let rainfall_mm;
    rainfall_mm = (sensorViewData.rain_value / 1024) * 50


    const sensorData = {
        flowRate: sensorViewData.flow_rate_lpm || 0,
        flowRateStatus: getFlowRateStatus(sensorViewData.flow_rate_lpm) || "unknown",
        waterTemperature: sensorViewData.water_temperature_c || 0,
        temperatureStatus: getTemperatureStatus(sensorViewData.water_temperature_c)|| "unknown",
        waterLevel: sensorViewData.distance_cm || 0,
        waterLevelStatus: getWaterLevelStatus(sensorViewData.distance_cm) || "unknown",
        turbidity: sensorViewData.turbidity_raw,
        turbidityStatus: getTurbidityStatus(sensorViewData.turbidity_raw)|| "unknown",
        rain: sensorViewData.rain_level || "unknown",
        rainValue: rainfall_mm || "unknown",
        rainStatus: getWeatherStatus(sensorViewData.rain_value)|| "unknown", // acidic, normal, alkaline

        lastUpdated: new Date().toISOString()
    };


    //ai safty output
    const safetyStatus = {
        level: safetyData?.safety_level || "Unknown",
        message: safetyData?.status_message || "Unknown"
    };


    // Safety tips
    const safetyTips = [
        {
            id: 1,
            title: "Check Conditions Before Activities",
            tip:
                "Always check river conditions before swimming, boating, or fishing. Conditions can change rapidly."
        },
        {
            id: 2,
            title: "Watch for Debris",
            tip:
                "After rainfall, watch for floating debris that can pose hazards to watercraft and swimmers."
        },
        {
            id: 3,
            title: "Respect Warning Signs",
            tip:
                "Warning signs are posted for your safety. Always respect closures and advisories."
        },
        {
            id: 4,
            title: "Wear Life Jackets",
            tip:
                "Always wear a properly fitted life jacket when boating, kayaking, or engaging in water activities."
        }
    ]

    //test sets
    console.log("sensorData:", sensorData);
    console.log("safetyStatus:", safetyStatus);
    console.log("weatherForecast:", weatherForecast);
    console.log("historicalData:", historicalData);
    console.log("alerts:", alerts);

    return {
        sensorData,
        safetyStatus,
        weatherForecast,
        historicalData,
        alerts,
        safetyTips
    };
}



/*
const weatherForecast = [
    {
        day: "Today",
        condition: "partly-cloudy",
        highTemp: 72,
        lowTemp: 58,
        precipitation: 20,
        windSpeed: 8,
        uvIndex: 6
    },
    {
        day: "Tomorrow",
        condition: "rainy",
        highTemp: 68,
        lowTemp: 56,
        precipitation: 70,
        windSpeed: 12,
        uvIndex: 3
    },
    {
        day: "Wednesday",
        condition: "rainy",
        highTemp: 64,
        lowTemp: 55,
        precipitation: 80,
        windSpeed: 15,
        uvIndex: 2
    },
    {
        day: "Thursday",
        condition: "cloudy",
        highTemp: 66,
        lowTemp: 54,
        precipitation: 30,
        windSpeed: 10,
        uvIndex: 4
    },
    {
        day: "Friday",
        condition: "sunny",
        highTemp: 70,
        lowTemp: 56,
        precipitation: 10,
        windSpeed: 5,
        uvIndex: 7
    }
]


// Historical data for graphs
const historicalData = {
    flowRate: [
        { time: "12 AM", value: 220 },
        { time: "3 AM", value: 215 },
        { time: "6 AM", value: 225 },
        { time: "9 AM", value: 235 },
        { time: "12 PM", value: 240 },
        { time: "3 PM", value: 238 },
        { time: "6 PM", value: 230 }
    ],
    waterLevel: [
        { time: "12 AM", value: 4.0 },
        { time: "3 AM", value: 4.1 },
        { time: "6 AM", value: 4.2 },
        { time: "9 AM", value: 4.3 },
        { time: "12 PM", value: 4.3 },
        { time: "3 PM", value: 4.2 },
        { time: "6 PM", value: 4.2 }
    ],
    waterTemperature: [
        { time: "12 AM", value: 60 },
        { time: "3 AM", value: 59 },
        { time: "6 AM", value: 58 },
        { time: "9 AM", value: 60 },
        { time: "12 PM", value: 62 },
        { time: "3 PM", value: 63 },
        { time: "6 PM", value: 62 }
    ],
    turbidity: [
        { time: "12 AM", value: 15 },
        { time: "3 AM", value: 16 },
        { time: "6 AM", value: 17 },
        { time: "9 AM", value: 18 },
        { time: "12 PM", value: 19 },
        { time: "3 PM", value: 18 },
        { time: "6 PM", value: 18 }
    ]
}


// Alerts and notifications
const alerts = [
    {
        id: 1,
        type: "warning",
        title: "Increased Flow Rates Expected",
        message:
            "Heavy rainfall upstream may cause increased flow rates in the next 24-48 hours. Exercise caution.",
        timestamp: "2023-06-12T08:30:00Z"
    },
    {
        id: 2,
        type: "info",
        title: "Water Quality Testing",
        message:
            "Routine water quality testing scheduled for tomorrow morning. Results will be updated by noon.",
        timestamp: "2023-06-12T10:15:00Z"
    },
    {
        id: 3,
        type: "danger",
        title: "Flash Flood Watch",
        message:
            "Flash flood watch in effect for the river basin until Wednesday evening. Stay alert to changing conditions.",
        timestamp: "2023-06-12T07:45:00Z"
    }
]*/





/*

import React, { useState, useEffect } from "react";
import { db, ref, onValue } from "./firebase";

function realData() {
    const [sensorViewData, setSensorViewData] = useState({});
    const [weatherData, setWeatherData] = useState({});
    const [safetyData, setSafetyData] = useState({});

    const weatherAPIKey = '05d0f3de4b3b4e9c853142033251705';
    const location = '6.951457,79.918599';
    const days = 5;

    // Fetch sensor data from Firebase
    useEffect(() => {
        const sensorRef = ref(db, 'sensors/current');
        const unsubscribe = onValue(sensorRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setSensorViewData(data);
                console.log('Sensor Data:', data);
            }
        });
        return () => unsubscribe(); // Cleanup
    }, []);

    // Fetch weather data from WeatherAPI
    useEffect(() => {
        fetch(`https://api.weatherapi.com/v1/forecast.json?key=${weatherAPIKey}&q=${location}&days=${days}&alerts=yes`)
            .then(response => response.json())
            .then(data => {
                setWeatherData(data);
                console.log('Weather Forecast:', data);
            })
            .catch(error => console.error('Error fetching weather data:', error));
    }, []);

    // Send prediction request when both sensorViewData and weatherData are ready
    useEffect(() => {
        if (
            sensorViewData?.distance_cm &&
            weatherData?.current?.temp_c
        ) {
            const inputData = {
                depth: sensorViewData.distance_cm,
                current: sensorViewData.flow_rate_lpm,
                temp: sensorViewData.water_temperature_c,
                air_temp: weatherData.current.temp_c,
                turbidity: sensorViewData.turbidity_raw,
                rainfall: sensorViewData.rain_value,
                wind_speed: weatherData.current.wind_kph,
                gust_speed: weatherData.current.gust_kph,
                humidity: weatherData.current.humidity,
                cloud: weatherData.current.cloud,
                feels_like: weatherData.current.feelslike_c,
                dew_point: weatherData.current.dewpoint_c,
                uv_index: weatherData.current.uv,
                is_night: weatherData.current.is_day === 0 ? 1 : 0,
                condition: mapConditionToCode(weatherData.current.condition.text)
            };

            fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputData)
            })
                .then(response => response.json())
                .then(result => {
                    setSafetyData(result);
                    console.log('Safety Prediction:', result);
                })
                .catch(error => console.error('Error fetching safety prediction:', error));
        }
    }, [sensorViewData, weatherData]);

    function mapConditionToCode(conditionText) {
        const conditionMap = {
            "Sunny": 1000,
            "Clear": 1000,
            "Partly cloudy": 1003,
            "Cloudy": 1006,
            "Overcast": 1009,
            "Mist": 1030,
            "Patchy rain possible": 1063,
            "Patchy snow possible": 1066,
            "Patchy sleet possible": 1069,
            "Patchy freezing drizzle possible": 1072,
            "Thundery outbreaks possible": 1087,
            "Blowing snow": 1114,
            "Blizzard": 1117,
            "Fog": 1135,
            "Freezing fog": 1147,
            "Patchy light drizzle": 1150,
            "Light drizzle": 1153,
            "Freezing drizzle": 1168,
            "Heavy freezing drizzle": 1171,
            "Patchy light rain": 1180,
            "Light rain": 1183,
            "Moderate rain at times": 1186,
            "Moderate rain": 1189,
            "Heavy rain at times": 1192,
            "Heavy rain": 1195,
            "Light freezing rain": 1198,
            "Moderate or heavy freezing rain": 1201,
            "Light sleet": 1204,
            "Moderate or heavy sleet": 1207,
            "Patchy light snow": 1210,
            "Light snow": 1213,
            "Patchy moderate snow": 1216,
            "Moderate snow": 1219,
            "Patchy heavy snow": 1222,
            "Heavy snow": 1225,
            "Ice pellets": 1237,
            "Light rain shower": 1240,
            "Moderate or heavy rain shower": 1243,
            "Torrential rain shower": 1246,
            "Light sleet showers": 1249,
            "Moderate or heavy sleet showers": 1252,
            "Light snow showers": 1255,
            "Moderate or heavy snow showers": 1258,
            "Light showers of ice pellets": 1261,
            "Moderate or heavy showers of ice pellets": 1264,
            "Patchy light rain with thunder": 1273,
            "Moderate or heavy rain with thunder": 1276,
            "Patchy light snow with thunder": 1279,
            "Moderate or heavy snow with thunder": 1282
        };
        return conditionMap[conditionText] || null;
    }

    export const sensorData = {
        flowRate: sensorViewData.flow_rate_lpm,
        flowRateStatus: getFlowRateStatus(sensorViewData.flow_rate_lpm),
        waterTemperature: sensorViewData.water_temperature_c,
        temperatureStatus: getTemperatureStatus(sensorViewData.water_temperature_c),
        waterLevel: sensorViewData.distance_cm,
        waterLevelStatus: getWaterLevelStatus(sensorViewData.distance_cm),
        turbidity: sensorViewData.turbidity_raw,
        turbidityStatus: getTurbidityStatus(sensorViewData.turbidity_raw),
        pH: null,
        pHStatus: "unknown", // acidic, normal, alkaline
        dissolvedOxygen: null, // mg/L
        oxygenStatus: "unknown", // poor, fair, good
        lastUpdated: new Date().toISOString()
    }
    function getFlowRateStatus(flowRateLpm) {
        if (flowRateLpm < 10) return "low";
        if (flowRateLpm <= 20) return "normal";
        if (flowRateLpm <= 30) return "high";
        return "danger";
    }

    function getTemperatureStatus(tempC) {
        if (tempC < 15) return "cold";
        if (tempC <= 25) return "normal";
        return "warm";
    }

    function getWaterLevelStatus(distanceCm) {
        if (distanceCm < 50) return "low";
        if (distanceCm <= 150) return "normal";
        if (distanceCm <= 200) return "high";
        return "danger";
    }

    function getTurbidityStatus(ntu) {
        if (ntu < 10) return "clear";
        if (ntu <= 50) return "moderate";
        if (ntu <= 100) return "murky";
        return "very murky";
    }


// Overall safety status
    export const safetyStatus = {
        level: safetyData.safety_level, // safe, moderate, danger
        message: safetyData.status_message
    }

// Weather forecast
    export const weatherForecast = [
        {
            day: "Today",
            condition: "partly-cloudy",
            highTemp: 72,
            lowTemp: 58,
            precipitation: 20,
            windSpeed: 8,
            uvIndex: 6
        },
        {
            day: "Tomorrow",
            condition: "rainy",
            highTemp: 68,
            lowTemp: 56,
            precipitation: 70,
            windSpeed: 12,
            uvIndex: 3
        },
        {
            day: "Wednesday",
            condition: "rainy",
            highTemp: 64,
            lowTemp: 55,
            precipitation: 80,
            windSpeed: 15,
            uvIndex: 2
        },
        {
            day: "Thursday",
            condition: "cloudy",
            highTemp: 66,
            lowTemp: 54,
            precipitation: 30,
            windSpeed: 10,
            uvIndex: 4
        },
        {
            day: "Friday",
            condition: "sunny",
            highTemp: 70,
            lowTemp: 56,
            precipitation: 10,
            windSpeed: 5,
            uvIndex: 7
        }
    ]


// Historical data for graphs
    export const historicalData = {
        flowRate: [
            { time: "12 AM", value: 220 },
            { time: "3 AM", value: 215 },
            { time: "6 AM", value: 225 },
            { time: "9 AM", value: 235 },
            { time: "12 PM", value: 240 },
            { time: "3 PM", value: 238 },
            { time: "6 PM", value: 230 }
        ],
        waterLevel: [
            { time: "12 AM", value: 4.0 },
            { time: "3 AM", value: 4.1 },
            { time: "6 AM", value: 4.2 },
            { time: "9 AM", value: 4.3 },
            { time: "12 PM", value: 4.3 },
            { time: "3 PM", value: 4.2 },
            { time: "6 PM", value: 4.2 }
        ],
        waterTemperature: [
            { time: "12 AM", value: 60 },
            { time: "3 AM", value: 59 },
            { time: "6 AM", value: 58 },
            { time: "9 AM", value: 60 },
            { time: "12 PM", value: 62 },
            { time: "3 PM", value: 63 },
            { time: "6 PM", value: 62 }
        ],
        turbidity: [
            { time: "12 AM", value: 15 },
            { time: "3 AM", value: 16 },
            { time: "6 AM", value: 17 },
            { time: "9 AM", value: 18 },
            { time: "12 PM", value: 19 },
            { time: "3 PM", value: 18 },
            { time: "6 PM", value: 18 }
        ]
    }


// Alerts and notifications
    export const alerts = [
        {
            id: 1,
            type: "warning",
            title: "Increased Flow Rates Expected",
            message:
                "Heavy rainfall upstream may cause increased flow rates in the next 24-48 hours. Exercise caution.",
            timestamp: "2023-06-12T08:30:00Z"
        },
        {
            id: 2,
            type: "info",
            title: "Water Quality Testing",
            message:
                "Routine water quality testing scheduled for tomorrow morning. Results will be updated by noon.",
            timestamp: "2023-06-12T10:15:00Z"
        },
        {
            id: 3,
            type: "danger",
            title: "Flash Flood Watch",
            message:
                "Flash flood watch in effect for the river basin until Wednesday evening. Stay alert to changing conditions.",
            timestamp: "2023-06-12T07:45:00Z"
        }
    ]


// Safety tips
    export const safetyTips = [
        {
            id: 1,
            title: "Check Conditions Before Activities",
            tip:
                "Always check river conditions before swimming, boating, or fishing. Conditions can change rapidly."
        },
        {
            id: 2,
            title: "Watch for Debris",
            tip:
                "After rainfall, watch for floating debris that can pose hazards to watercraft and swimmers."
        },
        {
            id: 3,
            title: "Respect Warning Signs",
            tip:
                "Warning signs are posted for your safety. Always respect closures and advisories."
        },
        {
            id: 4,
            title: "Wear Life Jackets",
            tip:
                "Always wear a properly fitted life jacket when boating, kayaking, or engaging in water activities."
        }
    ]




    return (
        <div>
            <h1>River Conditions Dashboard</h1>
            <p>Flow Rate: {sensorViewData.flow_rate_lpm}</p>
            <p>Temperature: {sensorViewData.water_temperature_c} °C</p>
            <p>Weather: {weatherData?.current?.condition?.text}</p>
            <p>Safety Level: {safetyData.safety_level}</p>
            <p>Message: {safetyData.status_message}</p>
        </div>
    );
}

export default realData;









import {useState} from "react";

const [sensorViewData, setSensorViewData] = useState({});
const [weatherData, setWeatherData] = useState({});
const [safetyData, setSafetyData] = useState({});


//sensor data from firebase
import { db, ref, onValue } from './firebase';

const sensorRef = ref(db, 'sensors/current');

onValue(sensorRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        setSensorViewData(data);
        console.log('Sensor Data:', data);
    }
});


//weather data from weatherApi
const weatherAPIKey = '05d0f3de4b3b4e9c853142033251705';
const location = '6.951457,79.918599'; // Latitude and Longitude
const days = 5;

fetch(`https://api.weatherapi.com/v1/forecast.json?key=${weatherAPIKey}&q=${location}&days=${days}&alerts=yes`)
    .then(response => response.json())
    .then(data => {
        setWeatherData(data)
        console.log('Weather Forecast:', data);
    })
    .catch(error => console.error('Error fetching weather data:', error));


//safety prediction from ml model
const inputData = {
    depth: sensorViewData.distance_cm,
    current: sensorViewData.flow_rate_lpm,
    temp: sensorViewData.water_temperature_c,
    air_temp: weatherData.current.temp_c,
    turbidity: sensorViewData.turbidity_raw,
    rainfall: sensorViewData.rain_value,
    wind_speed: weatherData.current.wind_kph,
    gust_speed: weatherData.current.gust_kph,
    humidity: weatherData.current.humidity,
    cloud: weatherData.current.cloud,
    feels_like: weatherData.current.feelslike_c,
    dew_point: weatherData.current.dewpoint_c,
    uv_index: weatherData.current.uv,
    is_night: weatherData.current.is_day === 0 ? 1 : 0,
    condition: mapConditionToCode(weatherData.current.condition.text)
};

function mapConditionToCode(conditionText) {
    const conditionMap = {
        "Sunny": 1000,
        "Clear": 1000,
        "Partly cloudy": 1003,
        "Cloudy": 1006,
        "Overcast": 1009,
        "Mist": 1030,
        "Patchy rain possible": 1063,
        "Patchy snow possible": 1066,
        "Patchy sleet possible": 1069,
        "Patchy freezing drizzle possible": 1072,
        "Thundery outbreaks possible": 1087,
        "Blowing snow": 1114,
        "Blizzard": 1117,
        "Fog": 1135,
        "Freezing fog": 1147,
        "Patchy light drizzle": 1150,
        "Light drizzle": 1153,
        "Freezing drizzle": 1168,
        "Heavy freezing drizzle": 1171,
        "Patchy light rain": 1180,
        "Light rain": 1183,
        "Moderate rain at times": 1186,
        "Moderate rain": 1189,
        "Heavy rain at times": 1192,
        "Heavy rain": 1195,
        "Light freezing rain": 1198,
        "Moderate or heavy freezing rain": 1201,
        "Light sleet": 1204,
        "Moderate or heavy sleet": 1207,
        "Patchy light snow": 1210,
        "Light snow": 1213,
        "Patchy moderate snow": 1216,
        "Moderate snow": 1219,
        "Patchy heavy snow": 1222,
        "Heavy snow": 1225,
        "Ice pellets": 1237,
        "Light rain shower": 1240,
        "Moderate or heavy rain shower": 1243,
        "Torrential rain shower": 1246,
        "Light sleet showers": 1249,
        "Moderate or heavy sleet showers": 1252,
        "Light snow showers": 1255,
        "Moderate or heavy snow showers": 1258,
        "Light showers of ice pellets": 1261,
        "Moderate or heavy showers of ice pellets": 1264,
        "Patchy light rain with thunder": 1273,
        "Moderate or heavy rain with thunder": 1276,
        "Patchy light snow with thunder": 1279,
        "Moderate or heavy snow with thunder": 1282
    };

    return conditionMap[conditionText] || null;
}


fetch('http://127.0.0.1:5000/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inputData)
})
    .then(response => response.json())
    .then(result => {
        setSafetyData(result);
        console.log('Safety Prediction:', result);
    })
    .catch(error => console.error('Error fetching safety prediction:', error));


//the river conditions dashboard



// Weather forecast
const conditionMap = {
    "Sunny": "sunny",
    "Partly cloudy": "partly-cloudy",
    "Cloudy": "cloudy",
    "Overcast": "cloudy",
    "Mist": "cloudy",
    "Patchy rain possible": "rainy",
    "Light rain": "rainy",
    "Moderate rain": "rainy",
    "Heavy rain": "rainy",
    "Thunderstorm": "rainy",
    // Add more mappings as needed
};

function getDayLabel(index, dateStr) {
    if (index === 0) return "Today";
    if (index === 1) return "Tomorrow";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function processWeatherData(data) {
    const forecastDays = data.forecast.forecastday;
    const weatherForecast = forecastDays.map((dayData, index) => {
        const dayLabel = getDayLabel(index, dayData.date);
        const conditionText = dayData.day.condition.text;
        const condition = conditionMap[conditionText] || "sunny"; // Default to 'sunny' if not mapped
        const highTemp = Math.round(dayData.day.maxtemp_c);
        const lowTemp = Math.round(dayData.day.mintemp_c);
        const precipitation = Math.round(dayData.day.daily_chance_of_rain);
        const windSpeed = Math.round(dayData.day.maxwind_kph / 1.609); // Convert kph to mph
        const uvIndex = dayData.day.uv;

        return {
            day: dayLabel,
            condition,
            highTemp,
            lowTemp,
            precipitation,
            windSpeed,
            uvIndex
        };
    });

    return weatherForecast;
}
*/