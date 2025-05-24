import React from "react"
import { motion } from "framer-motion"
export const Header = ({ menuOpen, setMenuOpen }) => {
    const currentTime = new Date().toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    })
    return (
        <motion.header
            className="sticky top-0 z-10 bg-blue-900 shadow-lg"
            initial={{
                opacity: 0,
                y: -20
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            transition={{
                duration: 0.5
            }}
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
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M3 12C5 10 7 14 9 12C11 10 13 14 15 12C17 10 19 14 21 12"
                                stroke="white"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M3 16C5 14 7 18 9 16C11 14 13 18 15 16C17 14 19 18 21 16"
                                stroke="white"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-white">AquaSafe.ai</h1>
                </div>
                <div className="hidden md:block text-blue-200 text-sm">
                    Last updated: {currentTime}

                </div>
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
    )
}