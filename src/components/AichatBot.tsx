"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageSquare, Bot, WifiOff } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const AichatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("connecting");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // System prompt for OpenAI
  const systemPrompt = `You are Abhay Krishnan, a friendly and professional front-end developer. 
  Answer questions about your skills, experience, and projects based on portfolio content.
  Keep responses concise (1-2 sentences) and professional but friendly.`;
  // Check initial connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Simple ping to check if API is reachable
        await fetch("https://api.openai.com/v1/models", {
          method: "HEAD",
        });
        setConnectionStatus("connected");
      } catch (err) {
        setConnectionStatus("disconnected");
      }
    };

    checkConnection();
  }, []);

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        const greeting =
          connectionStatus === "connected"
            ? "Hi there! I'm Abhay, a front-end developer. How can I help you today?"
            : "Hi! I'm Abhay. (Note: I'm currently offline but can answer basic questions)";

        setMessages([
          {
            id: Date.now().toString(),
            text: greeting,
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
        setIsTyping(false);
      }, 1000);
    }
  }, [isOpen, messages.length, connectionStatus]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  console.log(import.meta.env.VITE_OPENAI_KEY, "I am api key"); // Should log your key
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      if (connectionStatus === "connected") {
        const response = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [
                { role: "system", content: systemPrompt },
                ...messages.map((msg) => ({
                  role: msg.sender === "user" ? "user" : "assistant",
                  content: msg.text,
                })),
                { role: "user", content: input },
              ],
              temperature: 0.7,
              max_tokens: 150,
            }),
          }
        );

        if (!response.ok) throw new Error("API request failed");

        const data = await response.json();
        addBotResponse(data.choices[0].message.content);
      } else {
        // Offline mode - use local responses
        setTimeout(() => {
          addBotResponse(getLocalResponse(input));
        }, 800);
      }
    } catch (err) {
      addBotResponse(
        "Sorry, I'm having trouble connecting to my knowledge base. Here's what I can tell you locally:"
      );
      addBotResponse(getLocalResponse(input));
      setConnectionStatus("disconnected");
    } finally {
      setIsTyping(false);
    }
  };

  const addBotResponse = (text: string) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  // Local response fallback
  const getLocalResponse = (userInput: string) => {
    const input = userInput.toLowerCase();

    if (input.includes("hello") || input.includes("hi")) {
      return "Hello there! How can I help you today?";
    } else if (input.includes("how are you")) {
      return "I'm doing great, thanks for asking! How about you?";
    } else if (input.includes("project") || input.includes("work")) {
      return "I've worked on several exciting projects. You can check them out in the Projects section of my portfolio!";
    } else if (input.includes("contact") || input.includes("hire")) {
      return "You can contact me through the Contact form on this website, or directly via email at abhay@example.com.";
    } else if (input.includes("skill") || input.includes("technology")) {
      return "I'm proficient in React, TypeScript, Next.js, and various other frontend technologies. Check out my Skills section for more details!";
    } else if (input.includes("experience")) {
      return "I have experience working with various companies and on freelance projects. The Experience section has all the details.";
    } else if (input.includes("thank")) {
      return "You're welcome! Feel free to ask if you have any other questions.";
    } else if (
      input.includes("good") &&
      (input.includes("day") ||
        input.includes("morning") ||
        input.includes("afternoon") ||
        input.includes("evening"))
    ) {
      return "I'm glad to hear that! Is there anything specific you'd like to know about my work or skills?";
    } else if (input.includes("bad") && input.includes("day")) {
      return "I'm sorry to hear that. I hope chatting with me can make it a bit better. How can I help you today?";
    } else {
      return "I'm currently offline but can discuss my portfolio content. If you have any questions about my portfolio, skills, or experience, feel free to ask.";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => setIsOpen((prev) => !prev);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const reconnect = async () => {
    setConnectionStatus("connecting");
    try {
      await fetch("https://api.openai.com/v1/models", { method: "HEAD" });
      setConnectionStatus("connected");
      addBotResponse("Connection restored! How can I help you?");
    } catch (err) {
      setConnectionStatus("disconnected");
      addBotResponse("Still offline. I'll keep trying to reconnect...");
    }
  };

  return (
    <>
      {/* Chat toggle button */}
      <motion.button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-15 h-15 rounded-full bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-xl flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <>
            <MessageSquare size={24} />
            {connectionStatus === "disconnected" && (
              <motion.span
                className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full border-2 border-card"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
            )}
          </>
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-22 right-6 w-80 sm:w-96 h-[32rem] bg-card rounded-xl shadow-2xl overflow-hidden z-50 border border-border/50 flex flex-col"
          >
            {/* Chat header with connection status */}
            <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Bot size={22} />
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 flex justify-start"
                    >
                      <div className="bg-card text-card-foreground rounded-lg rounded-tl-none p-3 shadow-sm">
                        <div className="flex space-x-1">
                          <motion.span
                            className="w-2 h-2 bg-muted-foreground rounded-full"
                            animate={{ y: [0, -4, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.6,
                              delay: 0,
                            }}
                          />
                          <motion.span
                            className="w-2 h-2 bg-muted-foreground rounded-full"
                            animate={{ y: [0, -4, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.6,
                              delay: 0.2,
                            }}
                          />
                          <motion.span
                            className="w-2 h-2 bg-muted-foreground rounded-full"
                            animate={{ y: [0, -4, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.6,
                              delay: 0.4,
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">Chat with Abhay</h3>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        connectionStatus === "connected"
                          ? "bg-green-400"
                          : connectionStatus === "disconnected"
                          ? "bg-yellow-400"
                          : "bg-blue-400 animate-pulse"
                      }`}
                    />
                    <p className="text-xs opacity-80">
                      {connectionStatus === "connected"
                        ? "Online"
                        : connectionStatus === "disconnected"
                        ? "Offline"
                        : "Connecting..."}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="text-primary-foreground/80 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Connection warning banner */}
            {connectionStatus === "disconnected" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-500/20 border-b border-yellow-500/30 p-2 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-300">
                  <WifiOff size={14} />
                  <span>Working offline - limited responses</span>
                </div>
                <button
                  onClick={reconnect}
                  className="text-yellow-700 dark:text-yellow-200 hover:underline"
                >
                  Reconnect
                </button>
              </motion.div>
            )}

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-card to-muted/20">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-4 flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 ${
                        message.sender === "user"
                          ? "bg-primary/10 border border-primary/20 text-primary-foreground rounded-br-none"
                          : "bg-card text-card-foreground shadow-sm rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`text-xs mt-1 opacity-70 flex ${
                          message.sender === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                        {message.sender === "bot" &&
                          connectionStatus === "disconnected" && (
                            <span className="ml-2 text-yellow-500">
                              • Offline
                            </span>
                          )}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 flex justify-start"
                  >
                    <div className="bg-card text-card-foreground rounded-2xl rounded-bl-none p-3 shadow-sm">
                      <div className="flex space-x-1.5">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ y: [0, -3, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 1.2,
                              delay: i * 0.3,
                            }}
                            className="w-1.5 h-1.5 bg-primary rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Chat input */}
            <div className="p-3 border-t border-border/50 bg-card/50">
              <div className="flex items-center space-x-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={
                    connectionStatus === "connected"
                      ? "Ask me anything..."
                      : "Ask about my skills or projects..."
                  }
                  rows={1}
                  className="flex-1 bg-background border border-input rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none max-h-32"
                  style={{ minHeight: "44px" }}
                />
                <motion.button
                  onClick={handleSendMessage}
                  className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-xl p-2.5 h-[44px] w-[44px] flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!input.trim() || isTyping}
                >
                  <Send size={18} />
                </motion.button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {connectionStatus === "disconnected" && (
                  <span className="text-yellow-600 dark:text-yellow-300">
                    Offline mode - reconnecting...
                  </span>
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AichatBot;
