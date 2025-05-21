import React from "react"
import { motion } from "framer-motion"
export const SafetyIndicator = ({ status }) => {
    const getStatusColor = level => {
        switch (level) {
            case "Danger":
                return "from-red-500 to-red-600"
            case "Moderate":
                return "from-yellow-400 to-yellow-500"
            case "Safe":
            default:
                return "from-green-500 to-green-600"
        }
    }
    const getStatusBorder = level => {
        switch (level) {
            case "Danger":
                return "border-red-400"
            case "Moderate":
                return "border-yellow-300"
            case "Safe":
            default:
                return "border-green-400"
        }
    }
    const getStatusText = level => {
        switch (level) {
            case "Danger":
                return "Danger"
            case "Moderate":
                return "Caution"
            case "Safe":
            default:
                return "Safe"
        }
    }
    return (
        <motion.div
            className={`bg-blue-800/50 rounded-lg p-4 h-full border ${getStatusBorder(
                status.level
            )}`}
            initial={{
                opacity: 0,
                scale: 0.9
            }}
            animate={{
                opacity: 1,
                scale: 1
            }}
            transition={{
                duration: 0.5
            }}
        >
            <h2 className="text-xl font-semibold mb-4 text-white">
                River Safety Status
            </h2>
            <div className="flex flex-col items-center justify-center h-[calc(100%-2rem)]">
                <motion.div
                    className={`w-40 h-40 rounded-full bg-gradient-to-br ${getStatusColor(
                        status.level
                    )} flex items-center justify-center mb-4 border-4 ${getStatusBorder(
                        status.level
                    )}`}
                    animate={{
                        boxShadow: [
                            `0 0 0 rgba(255, 255, 255, 0.4)`,
                            `0 0 20px rgba(255, 255, 255, 0.6)`,
                            `0 0 0 rgba(255, 255, 255, 0.4)`
                        ]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                >
          <span className="text-2xl font-bold text-white">
            {getStatusText(status.level)}
          </span>
                </motion.div>
                <p className="text-center text-white font-medium">{status.message}</p>
            </div>
        </motion.div>
    )
}
