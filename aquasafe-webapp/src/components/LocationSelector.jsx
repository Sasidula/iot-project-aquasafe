import React from "react"

export const LocationSelector = ({ selectedLocation, setSelectedLocation }) => {
    const locations = [
        "Kelani River",
        "Mahaweli River",
        "Kalu Ganga",
        "Nilwala River"
    ]

    return (
        <div>
            <label className="block text-white text-sm font-medium mb-2">
                Select River Location
            </label>
            <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
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
