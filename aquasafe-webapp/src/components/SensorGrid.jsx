import React from "react"
import { motion } from "framer-motion"
export const SensorGrid = ({ data }) => {
    const sensors = [
        {
            name: "Flow Rate",
            value: `${data.flowRate} cfs`,
            status: data.flowRateStatus,
            icon: "trending-up"
        },
        {
            name: "Water Level",
            value: `${data.waterLevel} ft`,
            status: data.waterLevelStatus,
            icon: "arrow-up-down"
        },
        {
            name: "Temperature",
            value: `${data.waterTemperature}°F`,
            status: data.temperatureStatus,
            icon: "thermometer"
        },
        {
            name: "Turbidity",
            value: `${data.turbidity} NTU`,
            status: data.turbidityStatus,
            icon: "flask-conical"
        },
        {
            name: "Rain Status",
            value: `${data.rain}`,
            status: data.pHStatus,
            icon: "droplets"
        }
    ]
    const container = {
        hidden: {
            opacity: 0
        },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }
    const item = {
        hidden: {
            opacity: 0,
            y: 20
        },
        show: {
            opacity: 1,
            y: 0
        }
    }
    const getStatusColor = status => {
        switch (status) {
            case "danger":
                return "bg-red-500"
            case "high":
                return "bg-orange-500"
            case "moderate":
                return "bg-yellow-500"
            case "normal":
            case "good":
                return "bg-green-500"
            case "low":
            case "cold":
                return "bg-blue-500"
            default:
                return "bg-gray-500"
        }
    }
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="bg-blue-800/50 rounded-lg p-4"
        >
            <h2 className="text-xl font-semibold mb-4 text-white">
                Live Sensor Readings
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {sensors.map((sensor, index) => (
                    <motion.div
                        key={index}
                        variants={item}
                        className="bg-blue-700/50 rounded-lg p-4 border border-blue-600"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-blue-300 font-medium">{sensor.name}</span>
                            <span
                                className={`h-3 w-3 rounded-full ${getStatusColor(
                                    sensor.status
                                )}`}
                            ></span>
                        </div>
                        <div className="flex items-center mt-2">
                            {getIcon(sensor.icon)}
                            <span className="text-2xl font-bold ml-2 text-white">
                {sensor.value}
              </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}
const getIcon = iconName => {
    switch (iconName) {
        case "trending-up":
            return (
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-300"
                >
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
            )
        case "arrow-up-down":
            return (
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-300"
                >
                    <line x1="12" y1="3" x2="12" y2="21"></line>
                    <polyline points="18 15 12 21 6 15"></polyline>
                    <polyline points="6 9 12 3 18 9"></polyline>
                </svg>
            )
        case "thermometer":
            return (
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-300"
                >
                    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
                </svg>
            )
        case "droplets":
            return (
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-300"
                >
                    <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"></path>
                    <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"></path>
                </svg>
            )
        case "flask-conical":
            return (
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-300"
                >
                    <path d="M10 2v7.31"></path>
                    <path d="M14 9.3V2"></path>
                    <path d="M8.5 2h7"></path>
                    <path d="M14 9.3a6.5 6.5 0 1 1-4 0"></path>
                    <path d="M5.52 16h12.96"></path>
                </svg>
            )
        case "wind":
            return (
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-300"
                >
                    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
                </svg>
            )
        default:
            return null
    }
}
