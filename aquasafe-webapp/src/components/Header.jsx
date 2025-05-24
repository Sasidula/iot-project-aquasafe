import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {LocationSelector} from "./LocationSelector.jsx";
import {useRealData} from "../utils/useRealData.jsx";

export const Header = ({ menuOpen, setMenuOpen }) => {
    const [locationMenuOpen, setLocationMenuOpen] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState("Kelani River")
    const currentTime = new Date().toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    })
    const {
        sensorData,
        safetyStatus,
        weatherForecast,
        historicalData,
        alerts,
        safetyTips
    } = useRealData(selectedLocation);

    return (
        <>
            <motion.header
                className="sticky top-0 z-10 bg-blue-900 shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto px-4 py-4 md:px-6 flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M3 8C5 6 7 10 9 8C11 6 13 10 15 8C17 6 19 10 21 8"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M3 12C5 10 7 14 9 12C11 10 13 14 15 12C17 10 19 14 21 12"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M3 16C5 14 7 18 9 16C11 14 13 18 15 16C17 14 19 18 21 16"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-white">AquaSafe.ai</h1>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <div className="text-blue-200 text-sm">Last updated: {currentTime}</div>

                        {/* New Location Dropdown Toggle Button */}
                        <button
                            onClick={() => setLocationMenuOpen(!locationMenuOpen)}
                            className="text-white hover:text-blue-200"
                        >
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
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    {/* Mobile hamburger menu toggle */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {!menuOpen && (
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
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        )}
                    </button>
                </div>
            </motion.header>

            <AnimatePresence>
                {locationMenuOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.3 }}
                        className="fixed top-0 right-0 w-1/4 min-w-[250px] h-full bg-blue-900 z-50 shadow-lg p-6 text-white"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Select Location</h2>
                            <button
                                onClick={() => setLocationMenuOpen(false)}
                                className="text-white"
                            >
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
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <LocationSelector
                            selectedLocation={selectedLocation}
                            setSelectedLocation={setSelectedLocation}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}