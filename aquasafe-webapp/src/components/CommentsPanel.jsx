import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db, ref, onValue, push } from "../utils/firebase";

export const CommentsPanel = ({ location }) => {
    const [activeLocation, setActiveLocation] = useState(location);
    const [activeTab, setActiveTab] = useState("view");
    const [comments, setComments] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        comment: "",
        location: location
    });

    useEffect(() => {
        setFormData(prev => ({ ...prev, location }));
        setActiveLocation(location);
    }, [location]);

    useEffect(() => {
        const commentsRef = ref(db, "comments");
        onValue(commentsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loaded = Object.entries(data).map(([id, comment]) => ({
                    id,
                    ...comment
                }));
                loaded.sort((a, b) => b.timestamp - a.timestamp);
                const filtered = loaded.filter(c => c.location === activeLocation);
                setComments(filtered);
            } else {
                setComments([]);
            }
        });
    }, [activeLocation]);

    const handleInputChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = () => {
        const { name, email, comment, location } = formData;

        if (!name || !email || !comment || !location) {
            alert("Please fill in all fields.");
            return;
        }

        const commentsRef = ref(db, "comments");
        push(commentsRef, {
            name,
            email,
            comment,
            location,
            timestamp: Date.now()
        }).then(() => {
            // FIX: reset but keep the location intact
            setFormData({ name: "", email: "", comment: "", location });
        });
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <motion.div
            className="bg-blue-800/50 rounded-lg p-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex mb-4 border-b border-blue-700">
                <button
                    className={`pb-2 px-4 font-medium ${activeTab === "view"
                        ? "text-white border-b-2 border-blue-400"
                        : "text-blue-300 hover:text-blue-200"
                    }`}
                    onClick={() => setActiveTab("view")}
                >
                    View Comments
                </button>
                <button
                    className={`pb-2 px-4 font-medium ${activeTab === "add"
                        ? "text-white border-b-2 border-blue-400"
                        : "text-blue-300 hover:text-blue-200"
                    }`}
                    onClick={() => setActiveTab("add")}
                >
                    Add Comment
                </button>
            </div>

            {activeTab === "view" ? (
                <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <motion.div
                                key={comment.id}
                                variants={item}
                                className="bg-blue-700/30 rounded-lg p-4 border border-blue-600/30"
                            >
                                <div className="text-white font-bold">{comment.name}</div>
                                <div className="text-white font-semibold">{comment.email}</div>
                                <div className="text-blue-200 md:text-lg">{comment.comment}</div>
                                <div className="text-sm text-blue-300 mt-1 italic">
                                    Location: {comment.location} |{" "}
                                    {new Date(comment.timestamp).toLocaleString()}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            variants={item}
                            className="text-blue-300 text-center p-4 bg-blue-700/30 rounded-lg border border-blue-600/30"
                        >
                            No comments yet.
                        </motion.div>
                    )}
                </motion.div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                >
                    <motion.div variants={item} className="space-y-2">
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Your name"
                            className="w-full p-2 rounded bg-blue-700/40 text-white border border-blue-600/30"
                        />
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Your email"
                            className="w-full p-2 rounded bg-blue-700/40 text-white border border-blue-600/30"
                        />
                        <textarea
                            name="comment"
                            value={formData.comment}
                            onChange={handleInputChange}
                            placeholder="Your comment"
                            rows={3}
                            className="w-full p-2 rounded bg-blue-700/40 text-white border border-blue-600/30"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 w-1/6 h-10 text-white rounded-lg"
                            >
                                Submit
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
};
