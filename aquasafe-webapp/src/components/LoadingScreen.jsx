import React from "react"
import { motion } from "framer-motion"
export const LoadingScreen = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-screen bg-gradient-to-b from-blue-900 to-blue-800">
            <motion.div
                initial={{
                    opacity: 0,
                    y: 20
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                transition={{
                    duration: 0.8
                }}
                className="flex flex-col items-center"
            >
                <Logo />
                <h1 className="mt-6 text-4xl font-bold text-white">AquaSafe.ai</h1>
                <p className="mt-2 text-blue-200">
                    Checking real-time river conditions...
                </p>
                <WaveAnimation />
                <motion.div
                    className="w-64 h-1 bg-blue-700 mt-8 rounded-full overflow-hidden"
                    initial={{
                        opacity: 0
                    }}
                    animate={{
                        opacity: 1
                    }}
                    transition={{
                        delay: 0.5
                    }}
                >
                    <motion.div
                        className="h-full bg-blue-300"
                        initial={{
                            width: 0
                        }}
                        animate={{
                            width: "100%"
                        }}
                        transition={{
                            duration: 3,
                            ease: "easeInOut"
                        }}
                    />
                </motion.div>
            </motion.div>
        </div>
    )
}
const Logo = () => (
    <motion.div
        className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center"
        animate={{
            scale: [1, 1.05, 1]
        }}
        transition={{
            repeat: Infinity,
            duration: 2
        }}
    >
        <svg
            width="60"
            height="60"
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
    </motion.div>
)


const WaveAnimation = () => {
    return (
        <div className="relative w-64 h-16 mt-8">
            {[1, 2, 3].map(i => (
                <motion.div
                    key={i}
                    className="absolute bottom-0 left-0 w-full h-4 opacity-70"
                    style={{
                        background: `rgba(147, 197, 253, ${0.3 / i})`,
                        borderRadius: "50% 50% 0 0 "
                    }}
                    animate={{
                        height: ["40%", "70%", "40%"],
                        y: [0, -10, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    )
}
