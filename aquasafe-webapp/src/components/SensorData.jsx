// src/SensorData.jsx
import React, { useEffect, useState } from "react";
import { db, ref, onValue } from "../firebase";

const SensorData = () => {
    const [sensorData, setSensorData] = useState({});

    useEffect(() => {
        const sensorRef = ref(db, "sensors");
        const unsubscribe = onValue(sensorRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setSensorData(data);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h1 className="text-2xl font-bold text-center">River Sensor Readings</h1>
            <ul className="space-y-2 text-gray-800">
                <li><strong>Distance (cm):</strong> {sensorData.distance_cm ?? "Loading..."}</li>
                <li><strong>Flow Rate (L/min):</strong> {sensorData.flow_rate_lpm ?? "Loading..."}</li>
                <li><strong>Total Litres:</strong> {sensorData.total_litres ?? "Loading..."}</li>
                <li><strong>Turbidity Raw:</strong> {sensorData.turbidity_raw ?? "Loading..."}</li>
                <li><strong>Turbidity Voltage:</strong> {sensorData.turbidity_voltage?.toFixed(2) ?? "Loading..."} V</li>
                <li><strong>Rain Value:</strong> {sensorData.rain_value ?? "Loading..."}</li>
                <li><strong>Rain Level:</strong> {sensorData.rain_level ?? "Loading..."}</li>
                <li><strong>Water Temperature (°C):</strong> {sensorData.water_temperature_c ?? "Loading..."}</li>
            </ul>
        </div>
    );
};

export default SensorData;
