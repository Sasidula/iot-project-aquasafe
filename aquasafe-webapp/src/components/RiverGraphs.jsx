import React, { useState } from "react"
import { motion } from "framer-motion"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts"
//import { historicalData } from "../utils/mockData"
import {useRealData} from "../utils/useRealData.jsx";

export const RiverGraphs = () => {
    const [activeTab, setActiveTab] = useState("flowRate")
    const {
        sensorData,
        safetyStatus,
        weatherForecast,
        historicalData,
        alerts,
        safetyTips
    } = useRealData();
    const tabs = [
        {
            id: "flowRate",
            name: "Flow Rate",
            unit: "cfs",
            color: "#3b82f6"
        },
        {
            id: "waterLevel",
            name: "Water Level",
            unit: "ft",
            color: "#10b981"
        },
        {
            id: "waterTemperature",
            name: "Temperature",
            unit: "°F",
            color: "#f59e0b"
        },
        {
            id: "turbidity",
            name: "Turbidity",
            unit: "NTU",
            color: "#8b5cf6"
        }
    ]
    const getGraphData = () => {
        return historicalData[activeTab]
    }
    const getActiveTabInfo = () => {
        return tabs.find(tab => tab.id === activeTab)
    }
    return (
        <motion.div
            className="bg-blue-800/50 rounded-lg p-4"
            initial={{
                opacity: 0,
                y: 20
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            transition={{
                duration: 0.5
            }}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white mb-2 md:mb-0">
                    24-Hour Trends
                </h2>
                <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap ${
                                activeTab === tab.id
                                    ? "bg-blue-600 text-white"
                                    : "bg-blue-700/50 text-blue-200 hover:bg-blue-700"
                            }`}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>
            </div>
            <div className="bg-blue-700/30 rounded-lg p-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={getGraphData()}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255, 255, 255, 0.1)"
                        />
                        <XAxis
                            dataKey="time"
                            stroke="rgba(255, 255, 255, 0.5)"
                            tick={{
                                fill: "rgba(255, 255, 255, 0.7)"
                            }}
                        />
                        <YAxis
                            stroke="rgba(255, 255, 255, 0.5)"
                            tick={{
                                fill: "rgba(255, 255, 255, 0.7)"
                            }}
                            unit={getActiveTabInfo().unit}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1e3a8a",
                                borderColor: "#3b82f6",
                                color: "white"
                            }}
                            labelStyle={{
                                color: "white"
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={getActiveTabInfo().color}
                            strokeWidth={3}
                            activeDot={{
                                r: 8
                            }}
                            name={getActiveTabInfo().name}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-3 text-sm text-blue-300 text-center">
                Data updates every 15 minutes. Click on a tab to view different
                measurements.
            </div>
        </motion.div>
    )
}
