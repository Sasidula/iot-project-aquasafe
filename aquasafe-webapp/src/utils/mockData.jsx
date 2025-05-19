// Mock data for the river conditions dashboard
// Current sensor readings
export const sensorData = {
    flowRate: 238, // cubic feet per second
    flowRateStatus: "normal", // low, normal, high, danger
    waterTemperature: 62, // Fahrenheit
    temperatureStatus: "normal", // cold, normal, warm
    waterLevel: 4.2, // feet
    waterLevelStatus: "normal", // low, normal, high, danger
    turbidity: 18, // NTU (Nephelometric Turbidity Units)
    turbidityStatus: "moderate", // clear, moderate, murky
    pH: 7.2,
    pHStatus: "normal", // acidic, normal, alkaline
    dissolvedOxygen: 8.4, // mg/L
    oxygenStatus: "good", // poor, fair, good
    lastUpdated: new Date().toISOString()
}
// Overall safety status
export const safetyStatus = {
    level: "moderate", // safe, moderate, danger
    message: "Use caution - moderate flow rates in effect"
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
