import React, { useState } from "react";
import { getChatbotResponse } from "./geminiApi";
import "./Chatbot.css"; // Styling file

const Chatbot = () => {
    const [query, setQuery] = useState(""); 
    const [messages, setMessages] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleSendMessage = async () => {
        if (!query.trim()) return;

        setLoading(true);
        const userMessage = { sender: "", text: query };
        setMessages([...messages, userMessage]);

        try {
            const botResponse = await getChatbotResponse(query);
            setMessages([...messages, userMessage, { sender: "Bot", text: botResponse }]);
        } catch (error) {
            setMessages([...messages, { sender: "Bot", text: "Sorry, I couldn't process that." }]);
        }

        setQuery("");
        setLoading(false);
    };

    return (
        <div className="chatbot-container">
            {!isOpen ? (
                <button className="chatbot-open-btn" onClick={() => setIsOpen(true)}>💬 Chat with HR</button>
            ) : (
                <div className="chat-window">
                    <div className="chat-header">
                        <h1>💬</h1>
                        <span>Workplace Assistant</span>
                        <button className="chat-close-btn" onClick={() => setIsOpen(false)}>✖</button>
                    </div>

                    <div className="chat-body">
                        {messages.length === 0 && <p className="chat-placeholder">Ask me about attendance, leaves, or policies...</p>}
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.sender === "" ? "user" : "bot"}`}>
                                <strong>{msg.sender} </strong>{msg.text}
                            </div>
                        ))}
                    </div>

                    <div className="chat-footer">
                        <input 
                            type="text" 
                            value={query} 
                            onChange={(e) => setQuery(e.target.value)} 
                            placeholder="Type your question..."
                        />
                        <button onClick={handleSendMessage} disabled={loading}>
                            {loading ? "..." : "Send"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
