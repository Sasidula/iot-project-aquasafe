import React, { useState } from "react"
import { Header } from "./Header"
import { SensorGrid } from "./SensorGrid"
import { SafetyIndicator } from "./SafetyIndicator"
import { WeatherForecast } from "./WeatherForecast"
import { RiverGraphs } from "./RiverGraphs"
import { AlertsPanel } from "./AlertsPanel"
import {LocationSelector} from "./LocationSelector.jsx";
//import { SafetyResources } from "./SafetyResources"
import {useRealData} from "../utils/useRealData.jsx";

export const Dashboard = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState("Kelani River")
    const {
        sensorData,
        safetyStatus,
        weatherForecast,
        historicalData,
        alerts,
        safetyTips
    } = useRealData(selectedLocation);

    return (
        <div className="flex flex-col min-h-screen w-full bg-gradient-to-b from-blue-900 to-blue-800 text-white">
            <Header
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
            />
            {menuOpen ? (
                <MobileMenu
                    setMenuOpen={setMenuOpen}
                    selectedLocation={selectedLocation}
                    setSelectedLocation={setSelectedLocation}
                />
            ) : (
                <main className="flex-1 px-4 py-6 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="md:col-span-2">
                            <SensorGrid data={sensorData} />
                        </div>
                        <div>
                            <SafetyIndicator status={safetyStatus} />
                        </div>
                    </div>
                    <div className="mb-6">
                        <WeatherForecast />
                    </div>
                    <div className="mb-6">
                        <RiverGraphs />
                    </div>
                    <div className="mb-6">
                        <AlertsPanel />
                    </div>
                </main>
            )}
            <footer className="bg-blue-900 py-4 px-6 text-center text-blue-300 text-sm">
                <p>
                    © 2023 AquaSafe.ai | Data refreshes with real world updated every moment |{" "}
                    <a href="#" className="underline">
                        Terms & Disclaimer
                    </a>
                </p>
            </footer>
        </div>
    )
}

const SelectLocation = () => {
    const locations = [
        "Kelani River",
        "Mahaweli River",
        "Kalu Ganga",
        "Nilwala River"
    ];

    return (
        <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">
                Select River Location
            </label>
            <select
                className="w-full p-3 rounded-lg bg-blue-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
                {locations.map((loc, index) => (
                    <option key={index} value={loc}>
                        {loc}
                    </option>
                ))}
            </select>
        </div>
    )

}

const MobileMenu = ({ setMenuOpen, selectedLocation, setSelectedLocation }) => {

    const menuItems = [
    ]

    return (
        <div className="fixed inset-0 bg-blue-900 z-50 p-6">
            <div className="flex justify-end mb-8">
                <button
                    onClick={() => setMenuOpen(false)}
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
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div className="mb-6">
                <LocationSelector
                    selectedLocation={selectedLocation}
                    setSelectedLocation={setSelectedLocation}
                />
            </div>
        </div>
    )
}


/*

    {
        name: "Dashboard",
        icon: "layout-dashboard"
    },
    {
        name: "Historical Data",
        icon: "history"
    },
    {
        name: "River Maps",
        icon: "map"
    },
    {
        name: "Safety Resources",
        icon: "shield"
    },
    {
        name: "Settings",
        icon: "settings"
    },
    {
        name: "About",
        icon: "info"
    }*/