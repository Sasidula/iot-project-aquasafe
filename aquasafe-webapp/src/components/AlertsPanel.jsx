import React, { useState } from "react";
import { motion } from "framer-motion";
//import { weatherForecast } from "../utils/mockData";
import {useRealData} from "../utils/useRealData.jsx";

export const AlertsPanel = () => {
    const [activeTab, setActiveTab] = useState("alerts")
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
            x: -20
        },
        show: {
            opacity: 1,
            x: 0
        }
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
            <div className="flex mb-4 border-b border-blue-700">
                <button
                    className={`pb-2 px-4 font-medium ${
                        activeTab === "alerts"
                            ? "text-white border-b-2 border-blue-400"
                            : "text-blue-300 hover:text-blue-200"
                    }`}
                    onClick={() => setActiveTab("alerts")}
                >
                    Alerts & Warnings
                </button>
                <button
                    className={`pb-2 px-4 font-medium ${
                        activeTab === "tips"
                            ? "text-white border-b-2 border-blue-400"
                            : "text-blue-300 hover:text-blue-200"
                    }`}
                    onClick={() => setActiveTab("tips")}
                >
                    Safety Tips
                </button>
            </div>
            {activeTab === "alerts" ? (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                >
                    {alerts.map(alert => (
                        <AlertItem key={alert.id} alert={alert} item={item} />
                    ))}
                </motion.div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    {safetyTips.map(tip => (
                        <TipItem key={tip.id} tip={tip} item={item} />
                    ))}
                </motion.div>
            )}
        </motion.div>
    )
}
const AlertItem = ({ alert, item }) => {
    const getAlertIcon = type => {
        switch (type) {
            case "danger":
                return (
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </div>
                )
            case "warning":
                return (
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    </div>
                )
            case "info":
            default:
                return (
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                    </div>
                )
        }
    }
    const getBorderColor = type => {
        switch (type) {
            case "danger":
                return "border-red-500/30"
            case "warning":
                return "border-yellow-500/30"
            case "info":
            default:
                return "border-blue-500/30"
        }
    }
    return (
        <motion.div
            variants={item}
            className={`bg-blue-700/30 rounded-lg p-4 border ${getBorderColor(
                alert.type
            )}`}
        >
            <div className="flex">
                {getAlertIcon(alert.type)}
                <div className="ml-4">
                    <h3 className="font-semibold text-white">{alert.title}</h3>
                    <p className="text-blue-200 mt-1">{alert.message}</p>
                    <p className="text-xs text-blue-300 mt-2">
                        {new Date(alert.timestamp).toLocaleString()}
                    </p>
                </div>
            </div>
        </motion.div>
    )
}
const TipItem = ({ tip, item }) => {
    return (
        <motion.div
            variants={item}
            className="bg-blue-700/30 rounded-lg p-4 border border-blue-600/30"
        >
            <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mr-3">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                        <line x1="6" y1="1" x2="6" y2="4"></line>
                        <line x1="10" y1="1" x2="10" y2="4"></line>
                        <line x1="14" y1="1" x2="14" y2="4"></line>
                    </svg>
                </div>
                <div>
                    <h3 className="font-semibold text-white">{tip.title}</h3>
                    <p className="text-blue-200 mt-1 text-sm">{tip.tip}</p>
                </div>
            </div>
        </motion.div>
    )
}
