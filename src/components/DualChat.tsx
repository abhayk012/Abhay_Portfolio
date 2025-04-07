"use client"

import { useState, useEffect, useRef } from "react"
import { Send, RefreshCw, CheckCircle2, Clock, Smile, Paperclip, Settings, Info } from "lucide-react"

// Define message type
interface Message {
  id: string
  text: string
  sender: "user1" | "user2" | "system"
  timestamp: number
  status: "sending" | "sent" | "delivered" | "read"
  isTyping?: boolean
}

// Define user type
interface UserType {
  id: "user1" | "user2"
  name: string
  avatar: string
  color: string
  isOnline: boolean
  isTyping: boolean
  lastSeen?: number
}

const DualChat = () => {
  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "system-1",
      text: "Chat session started",
      sender: "system",
      timestamp: Date.now(),
      status: "delivered",
    },
  ])

  // User state
  const [users, setUsers] = useState<UserType[]>([
    {
      id: "user1",
      name: "Alex",
      avatar: "A",
      color: "#4f46e5",
      isOnline: true,
      isTyping: false,
    },
    {
      id: "user2",
      name: "Taylor",
      avatar: "T",
      color: "#10b981",
      isOnline: true,
      isTyping: false,
    },
  ])

  // Input state for both users
  const [inputUser1, setInputUser1] = useState("")
  const [inputUser2, setInputUser2] = useState("")

  // Connection state
  const [isConnected, setIsConnected] = useState(true)
  const [isReconnecting, setIsReconnecting] = useState(false)

  // Refs for auto-scrolling
  const chatBoxRef1 = useRef<HTMLDivElement>(null)
  const chatBoxRef2 = useRef<HTMLDivElement>(null)

  // Typing indicator timeouts
  const typingTimeoutRef1 = useRef<NodeJS.Timeout | null>(null)
  const typingTimeoutRef2 = useRef<NodeJS.Timeout | null>(null)

  // Simulate connection issues occasionally
  useEffect(() => {
    const connectionIssueInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        // 10% chance of connection issue
        setIsConnected(false)
        setIsReconnecting(true)

        // Simulate reconnection after a delay
        setTimeout(() => {
          setIsConnected(true)
          setIsReconnecting(false)

          // Add system message about reconnection
          setMessages((prev) => [
            ...prev,
            {
              id: `system-${Date.now()}`,
              text: "Reconnected to server",
              sender: "system",
              timestamp: Date.now(),
              status: "delivered",
            },
          ])
        }, 3000)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(connectionIssueInterval)
  }, [])

  // Auto-scroll chat boxes when new messages arrive
  useEffect(() => {
    if (chatBoxRef1.current) {
      chatBoxRef1.current.scrollTop = chatBoxRef1.current.scrollHeight
    }
    if (chatBoxRef2.current) {
      chatBoxRef2.current.scrollTop = chatBoxRef2.current.scrollHeight
    }
  }, [messages])

  // Handle typing indicators
  const handleTyping = (userId: "user1" | "user2", isTyping: boolean) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, isTyping } : user)))

    // Emit typing event to the other user (simulated)
    if (isTyping) {
      // Clear any existing timeout
      if (userId === "user1" && typingTimeoutRef1.current) {
        clearTimeout(typingTimeoutRef1.current)
      } else if (userId === "user2" && typingTimeoutRef2.current) {
        clearTimeout(typingTimeoutRef2.current)
      }

      // Set timeout to stop typing indicator after 2 seconds of inactivity
      const timeoutRef = setTimeout(() => {
        setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, isTyping: false } : user)))
      }, 2000)

      if (userId === "user1") {
        typingTimeoutRef1.current = timeoutRef
      } else {
        typingTimeoutRef2.current = timeoutRef
      }
    }
  }

  // Handle sending messages
  const sendMessage = (userId: "user1" | "user2", text: string) => {
    if (!text.trim() || !isConnected) return

    // Create new message
    const newMessage: Message = {
      id: `${userId}-${Date.now()}`,
      text: text.trim(),
      sender: userId,
      timestamp: Date.now(),
      status: "sending",
    }

    // Add message to state
    setMessages((prev) => [...prev, newMessage])

    // Clear input
    if (userId === "user1") {
      setInputUser1("")
    } else {
      setInputUser2("")
    }

    // Clear typing indicator
    handleTyping(userId, false)

    // Simulate message being sent over Socket.IO
    setTimeout(
      () => {
        // Update message status to sent
        setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "sent" } : msg)))

        // Simulate message being delivered
        setTimeout(
          () => {
            setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg)))

            // Simulate other user reading the message
            setTimeout(
              () => {
                setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "read" } : msg)))
              },
              1000 + Math.random() * 2000,
            )
          },
          500 + Math.random() * 1000,
        )
      },
      300 + Math.random() * 500,
    )

    // Simulate the other user typing a response after a delay
    const otherUserId = userId === "user1" ? "user2" : "user1"

    setTimeout(
      () => {
        // Show typing indicator
        setUsers((prev) => prev.map((user) => (user.id === otherUserId ? { ...user, isTyping: true } : user)))

        // Generate a response after a delay
        setTimeout(
          () => {
            // Hide typing indicator
            setUsers((prev) => prev.map((user) => (user.id === otherUserId ? { ...user, isTyping: false } : user)))

            // Generate response based on the message
            let responseText = ""
            const lowerText = text.toLowerCase()

            if (lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("hey")) {
              responseText = `Hi there! How are you?`
            } else if (lowerText.includes("how are you")) {
              responseText = `I'm doing great, thanks for asking! How about you?`
            } else if (lowerText.includes("weather")) {
              responseText = `The weather is nice today, isn't it?`
            } else if (lowerText.includes("name")) {
              responseText = `My name is ${otherUserId === "user1" ? "Alex" : "Taylor"}. Nice to meet you!`
            } else if (lowerText.includes("bye") || lowerText.includes("goodbye")) {
              responseText = `Goodbye! Talk to you later!`
            } else if (lowerText.includes("thanks") || lowerText.includes("thank you")) {
              responseText = `You're welcome!`
            } else if (lowerText.includes("?")) {
              responseText = `That's an interesting question. Let me think about it...`
            } else if (lowerText.length < 10) {
              responseText = `I see. Tell me more!`
            } else {
              // Random responses
              const responses = [
                "That's interesting!",
                "I understand what you mean.",
                "I agree with you.",
                "Let's talk more about that.",
                "I have similar thoughts on that topic.",
                "Thanks for sharing that with me.",
                "I appreciate your perspective.",
                "That makes a lot of sense.",
              ]
              responseText = responses[Math.floor(Math.random() * responses.length)]
            }

            // Send the response
            const responseMessage: Message = {
              id: `${otherUserId}-${Date.now()}`,
              text: responseText,
              sender: otherUserId,
              timestamp: Date.now(),
              status: "sending",
            }

            // Add response to messages
            setMessages((prev) => [...prev, responseMessage])

            // Update message status
            setTimeout(() => {
              setMessages((prev) =>
                prev.map((msg) => (msg.id === responseMessage.id ? { ...msg, status: "sent" } : msg)),
              )

              setTimeout(() => {
                setMessages((prev) =>
                  prev.map((msg) => (msg.id === responseMessage.id ? { ...msg, status: "delivered" } : msg)),
                )

                setTimeout(() => {
                  setMessages((prev) =>
                    prev.map((msg) => (msg.id === responseMessage.id ? { ...msg, status: "read" } : msg)),
                  )
                }, 1000)
              }, 500)
            }, 300)
          },
          1500 + Math.random() * 3000,
        ) // Random typing time
      },
      1000 + Math.random() * 2000,
    ) // Random delay before typing
  }

  // Format timestamp
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Get message status icon
  const getStatusIcon = (status: string, isSender: boolean) => {
    if (!isSender) return null

    switch (status) {
      case "sending":
        return <Clock className="w-3 h-3 text-muted-foreground" />
      case "sent":
        return <CheckCircle2 className="w-3 h-3 text-muted-foreground" />
      case "delivered":
        return <CheckCircle2 className="w-3 h-3 text-blue-500" />
      case "read":
        return <CheckCircle2 className="w-3 h-3 text-green-500" />
      default:
        return null
    }
  }

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-4">
      {/* Connection status */}
      {!isConnected && (
        <div className="absolute top-16 left-0 right-0 mx-auto w-fit bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 px-4 py-2 rounded-md text-sm flex items-center justify-center z-30">
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          {isReconnecting ? "Reconnecting to server..." : "Connection lost. Please wait..."}
        </div>
      )}

      {/* User 1 Chat */}
      <div className="w-full md:w-1/2 h-[50%] md:h-full flex flex-col bg-card rounded-lg shadow-md overflow-hidden">
        {/* Chat header */}
        <div className="p-3 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium mr-2"
              style={{ backgroundColor: users[1].color }}
            >
              {users[1].avatar}
            </div>
            <div>
              <h3 className="font-medium text-sm">{users[1].name}</h3>
              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full mr-1 ${users[1].isOnline ? "bg-green-500" : "bg-gray-400"}`}
                ></div>
                <span className="text-xs text-muted-foreground">{users[1].isOnline ? "Online" : "Offline"}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded-full hover:bg-muted transition-colors">
              <Info className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="p-1 rounded-full hover:bg-muted transition-colors">
              <Settings className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Chat messages */}
        <div ref={chatBoxRef1} className="flex-grow overflow-y-auto p-4 space-y-3">
          {messages.map((message) => {
            const isUser1 = message.sender === "user1"
            // const isUser2 = message.sender === "user2"
            const isSystem = message.sender === "system"

            if (isSystem) {
              return (
                <div key={message.id} className="flex justify-center">
                  <div className="bg-muted/50 text-xs text-muted-foreground px-3 py-1 rounded-full">{message.text}</div>
                </div>
              )
            }

            return (
              <div key={message.id} className={`flex ${isUser1 ? "justify-end" : "justify-start"}`}>
                <div className="flex flex-col max-w-[80%]">
                  <div
                    className={`px-3 py-2 rounded-lg ${
                      isUser1 ? "border-2 border-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                  <div
                    className={`flex items-center mt-1 text-xs text-muted-foreground ${isUser1 ? "justify-end" : "justify-start"}`}
                  >
                    <span>{formatTime(message.timestamp)}</span>
                    <div className="ml-1">{getStatusIcon(message.status, isUser1)}</div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Typing indicator for User 2 */}
          {users[1].isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted px-4 py-2 rounded-lg rounded-bl-none">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat input */}
        <div className="p-3 border-t border-border">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              sendMessage("user1", inputUser1)
            }}
            className="flex items-center gap-2"
          >
            <button type="button" className="p-2 rounded-full hover:bg-muted transition-colors">
              <Smile className="w-5 h-5 text-muted-foreground" />
            </button>
            <button type="button" className="p-2 rounded-full hover:bg-muted transition-colors">
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </button>
            <input
              type="text"
              value={inputUser1}
              onChange={(e) => {
                setInputUser1(e.target.value)
                handleTyping("user1", e.target.value.length > 0)
              }}
              placeholder="Type a message..."
              className="flex-grow bg-muted/50 border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={!isConnected}
            />
            <button
              type="submit"
              className={`p-2 rounded-full ${
                inputUser1.trim() && isConnected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              } transition-colors`}
              disabled={!inputUser1.trim() || !isConnected}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          {/* Connection status indicator */}
          {!isConnected && (
            <div className="mt-2 text-xs text-center text-yellow-600 dark:text-yellow-400">
              <RefreshCw className="w-3 h-3 inline-block mr-1 animate-spin" />
              Reconnecting...
            </div>
          )}
        </div>
      </div>

      {/* User 2 Chat */}
      <div className="w-full md:w-1/2 h-[50%] md:h-full flex flex-col bg-card rounded-lg shadow-md overflow-hidden">
        {/* Chat header */}
        <div className="p-3 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium mr-2"
              style={{ backgroundColor: users[0].color }}
            >
              {users[0].avatar}
            </div>
            <div>
              <h3 className="font-medium text-sm">{users[0].name}</h3>
              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full mr-1 ${users[0].isOnline ? "bg-green-500" : "bg-gray-400"}`}
                ></div>
                <span className="text-xs text-muted-foreground">{users[0].isOnline ? "Online" : "Offline"}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded-full hover:bg-muted transition-colors">
              <Info className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="p-1 rounded-full hover:bg-muted transition-colors">
              <Settings className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Chat messages */}
        <div ref={chatBoxRef2} className="flex-grow overflow-y-auto p-4 space-y-3">
          {messages.map((message) => {
            // const isUser1 = message.sender === "user1"
            const isUser2 = message.sender === "user2"
            const isSystem = message.sender === "system"

            if (isSystem) {
              return (
                <div key={message.id} className="flex justify-center">
                  <div className="bg-muted/50 text-xs text-muted-foreground px-3 py-1 rounded-full">{message.text}</div>
                </div>
              )
            }

            return (
              <div key={message.id} className={`flex ${isUser2 ? "justify-end" : "justify-start"}`}>
                <div className="flex flex-col max-w-[80%]">
                  <div
                    className={`px-3 py-2 rounded-lg ${
                      isUser2 ? "border-2 border-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                  <div
                    className={`flex items-center mt-1 text-xs text-muted-foreground ${isUser2 ? "justify-end" : "justify-start"}`}
                  >
                    <span>{formatTime(message.timestamp)}</span>
                    <div className="ml-1">{getStatusIcon(message.status, isUser2)}</div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Typing indicator for User 1 */}
          {users[0].isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted px-4 py-2 rounded-lg rounded-bl-none">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat input */}
        <div className="p-3 border-t border-border">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              sendMessage("user2", inputUser2)
            }}
            className="flex items-center gap-2"
          >
            <button type="button" className="p-2 rounded-full hover:bg-muted transition-colors">
              <Smile className="w-5 h-5 text-muted-foreground" />
            </button>
            <button type="button" className="p-2 rounded-full hover:bg-muted transition-colors">
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </button>
            <input
              type="text"
              value={inputUser2}
              onChange={(e) => {
                setInputUser2(e.target.value)
                handleTyping("user2", e.target.value.length > 0)
              }}
              placeholder="Type a message..."
              className="flex-grow bg-muted/50 border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={!isConnected}
            />
            <button
              type="submit"
              className={`p-2 rounded-full ${
                inputUser2.trim() && isConnected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              } transition-colors`}
              disabled={!inputUser2.trim() || !isConnected}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          {/* Connection status indicator */}
          {!isConnected && (
            <div className="mt-2 text-xs text-center text-yellow-600 dark:text-yellow-400">
              <RefreshCw className="w-3 h-3 inline-block mr-1 animate-spin" />
              Reconnecting...
            </div>
          )}
        </div>
      </div>

      {/* Socket.IO connection info */}
      <div className="absolute bottom-0 left-0 mt-5 right-0 mx-auto w-fit">
        <div className="bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-muted-foreground flex items-center">
          <div className={`w-2 h-2 rounded-full mr-1 ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
          <span>Socket.IO {isConnected ? "Connected" : "Disconnected"}</span>
        </div>
      </div>
    </div>
  )
}

export default DualChat

