import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LoadingScreen } from "./components/LoadingScreen"
import { Dashboard } from "./components/Dashboard"
import TestSensorData from "./pages/TestSensorData.jsx";

function Home() {
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 3500)
        return () => clearTimeout(timer)
    }, [])
    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-blue-900 to-blue-800">
            {isLoading ? <LoadingScreen /> : <Dashboard />}
        </div>
    )
}

export function App() {
    return (
        <BrowserRouter>
            <div className="flex flex-col min-h-screen w-full bg-white">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/test" element={<TestSensorData/>} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App;
