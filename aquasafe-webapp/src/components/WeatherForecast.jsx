import React, { Children } from 'react'
import { motion } from 'framer-motion'
//import { weatherForecast } from '../utils/mockData'
import {useRealData} from "../utils/useRealData.jsx";

export const WeatherForecast = () => {
    const {
        sensorData,
        safetyStatus,
        weatherForecast,
        historicalData,
        alerts,
        safetyTips
    } = useRealData();
    const container = {
        hidden: {
            opacity: 0,
        },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }
    const item = {
        hidden: {
            opacity: 0,
            y: 20,
        },
        show: {
            opacity: 1,
            y: 0,
        },
    }
    return (
        <motion.div
            className="bg-blue-800/50 rounded-lg p-4"
            variants={container}
            initial="hidden"
            animate="show"
        >
            <h2 className="text-xl font-semibold mb-4 text-white">
                Weather Forecast
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {weatherForecast.map((day, index) => (
                    <motion.div
                        key={index}
                        className="bg-blue-700/50 rounded-lg p-4 border border-blue-600"
                        variants={item}
                    >
                        <div className="text-center">
                            <h3 className="font-medium text-blue-200 mb-2">{day.day}</h3>
                            <div className="flex justify-center mb-2">
                                {getWeatherIcon(day.condition)}
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">
                                {day.highTemp}°
                            </div>
                            <div className="text-sm text-blue-300">{day.lowTemp}°</div>
                            <div className="mt-3 pt-3 border-t border-blue-600/50 grid grid-cols-3 gap-1 text-xs text-center">
                                <div>
                                    <div className="text-blue-200 mb-1">Precip</div>
                                    <div className="text-white">{day.precipitation}%</div>
                                </div>
                                <div>
                                    <div className="text-blue-200 mb-1">Wind</div>
                                    <div className="text-white">{day.windSpeed} mph</div>
                                </div>
                                <div>
                                    <div className="text-blue-200 mb-1">UV</div>
                                    <div className="text-white">{day.uvIndex}</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}
const getWeatherIcon = (condition) => {
    switch (condition) {
        case 'sunny':
            return (
                <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-yellow-300"
                >
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
            )
        case 'partly-cloudy':
            return (
                <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-200"
                >
                    <path d="M8 3v2"></path>
                    <path d="M16 3v2"></path>
                    <path d="M8 15h8"></path>
                    <path d="M8 19h8"></path>
                    <path d="M11 3c6 0 8 4 8 8"></path>
                    <path d="M3 11c0-4 2-8 8-8"></path>
                    <path d="M3 11h8"></path>
                    <path d="M7 15.5c-1.5 0-3 .5-3 2.5"></path>
                    <path d="M17 15.5c1.5 0 3 .5 3 2.5"></path>
                </svg>
            )
        case 'cloudy':
            return (
                <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-300"
                >
                    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                </svg>
            )
        case 'rainy':
            return (
                <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-300"
                >
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                    <path d="M16 14v6"></path>
                    <path d="M8 14v6"></path>
                    <path d="M12 16v6"></path>
                </svg>
            )
        case 'stormy':
            return (
                <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-yellow-300"
                >
                    <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"></path>
                    <polyline points="13 12 9 18 15 18 11 24"></polyline>
                </svg>
            )
        default:
            return (
                <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-200"
                >
                    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                </svg>
            )
    }
}
