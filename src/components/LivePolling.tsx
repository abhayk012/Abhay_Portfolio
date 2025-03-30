"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BarChart3,
  PieChart,
  Vote,
  Users,
  Plus,
  X,
  Check,
  RefreshCw,
  MessageSquare,
  Clock,
  ChevronDown,
  ChevronUp,
  Crown,
} from "lucide-react"

interface Poll {
  id: string
  question: string
  options: PollOption[]
  createdBy: string
  createdAt: number
  isActive: boolean
  totalVotes: number
  hasVoted: boolean
}

interface PollOption {
  id: string
  text: string
  votes: number
  color: string
}

interface Comment {
  id: string
  pollId: string
  user: string
  text: string
  timestamp: number
}

const COLORS = [
  "#FF6384", // Pink
  "#36A2EB", // Blue
  "#FFCE56", // Yellow
  "#4BC0C0", // Teal
  "#9966FF", // Purple
  "#FF9F40", // Orange
  "#C9CBCF", // Grey
  "#7BC043", // Green
  "#F37735", // Coral
  "#7D3C98", // Dark Purple
]

const LivePolling = () => {
  const [polls, setPolls] = useState<Poll[]>([])
  const [activePoll, setActivePoll] = useState<Poll | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPollQuestion, setNewPollQuestion] = useState("")
  const [newPollOptions, setNewPollOptions] = useState<string[]>(["", ""])
  const [username, setUsername] = useState("")
  const [isSettingUsername, setIsSettingUsername] = useState(true)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [chartType, setChartType] = useState<"bar" | "pie">("bar")
  const [showComments, setShowComments] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [isPolling, setIsPolling] = useState(false)
  const commentsEndRef = useRef<HTMLDivElement>(null)
  const pollContainerRef = useRef<HTMLDivElement>(null)

  // Simulate Socket.IO connection
  useEffect(() => {
    // Generate some sample polls
    const samplePolls: Poll[] = [
      {
        id: "poll-1",
        question: "What's your favorite programming language?",
        options: [
          { id: "opt-1", text: "JavaScript", votes: 12, color: COLORS[0] },
          { id: "opt-2", text: "Python", votes: 8, color: COLORS[1] },
          { id: "opt-3", text: "TypeScript", votes: 15, color: COLORS[2] },
          { id: "opt-4", text: "Java", votes: 5, color: COLORS[3] },
        ],
        createdBy: "Admin",
        createdAt: Date.now() - 3600000, // 1 hour ago
        isActive: true,
        totalVotes: 40,
        hasVoted: false,
      },
      {
        id: "poll-2",
        question: "Which frontend framework do you prefer?",
        options: [
          { id: "opt-5", text: "React", votes: 18, color: COLORS[4] },
          { id: "opt-6", text: "Vue", votes: 7, color: COLORS[5] },
          { id: "opt-7", text: "Angular", votes: 5, color: COLORS[6] },
          { id: "opt-8", text: "Svelte", votes: 9, color: COLORS[7] },
        ],
        createdBy: "Admin",
        createdAt: Date.now() - 7200000, // 2 hours ago
        isActive: true,
        totalVotes: 39,
        hasVoted: false,
      },
    ]

    // Sample comments
    const sampleComments: Comment[] = [
      {
        id: "comment-1",
        pollId: "poll-1",
        user: "Sarah",
        text: "TypeScript is basically JavaScript with superpowers!",
        timestamp: Date.now() - 1800000, // 30 minutes ago
      },
      {
        id: "comment-2",
        pollId: "poll-1",
        user: "Mike",
        text: "Python is so easy to learn and use!",
        timestamp: Date.now() - 1200000, // 20 minutes ago
      },
      {
        id: "comment-3",
        pollId: "poll-2",
        user: "Alex",
        text: "React has the best ecosystem by far",
        timestamp: Date.now() - 600000, // 10 minutes ago
      },
    ]

    // Sample online users
    const sampleUsers = ["Sarah", "Mike", "Alex", "Taylor", "Jordan"]

    setPolls(samplePolls)
    setActivePoll(samplePolls[0])
    setComments(sampleComments)
    setOnlineUsers(sampleUsers)

    // Simulate receiving votes
    const voteInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance of a vote coming in
        const randomUser = sampleUsers[Math.floor(Math.random() * sampleUsers.length)]
        const randomPollIndex = Math.floor(Math.random() * samplePolls.length)
        const randomOptionIndex = Math.floor(Math.random() * samplePolls[randomPollIndex].options.length)

        setPolls((prevPolls) => {
          const updatedPolls = [...prevPolls]
          const poll = { ...updatedPolls[randomPollIndex] }
          const options = [...poll.options]
          options[randomOptionIndex] = {
            ...options[randomOptionIndex],
            votes: options[randomOptionIndex].votes + 1,
          }
          poll.options = options
          poll.totalVotes += 1
          updatedPolls[randomPollIndex] = poll

          // Update active poll if needed
          if (activePoll && activePoll.id === poll.id) {
            setActivePoll(poll)
          }

          return updatedPolls
        })

        // Add a notification comment sometimes
        if (Math.random() > 0.7) {
          const newVoteComment: Comment = {
            id: `comment-${Date.now()}`,
            pollId: samplePolls[randomPollIndex].id,
            user: "System",
            text: `${randomUser} just voted!`,
            timestamp: Date.now(),
          }

          setComments((prev) => [...prev, newVoteComment])
        }
      }
    }, 3000)

    // Simulate users joining/leaving
    const userInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        // 20% chance of user activity
        if (Math.random() > 0.5 && onlineUsers.length < 10) {
          // User joins
          const newUser = `User${Math.floor(Math.random() * 1000)}`
          setOnlineUsers((prev) => [...prev, newUser])

          // Add system comment
          const joinComment: Comment = {
            id: `comment-${Date.now()}`,
            pollId: "all",
            user: "System",
            text: `${newUser} joined the poll`,
            timestamp: Date.now(),
          }

          setComments((prev) => [...prev, joinComment])
        } else if (onlineUsers.length > 3) {
          // User leaves
          const randomIndex = Math.floor(Math.random() * onlineUsers.length)
          const leavingUser = onlineUsers[randomIndex]

          setOnlineUsers((prev) => {
            const updated = [...prev]
            updated.splice(randomIndex, 1)
            return updated
          })

          // Add system comment
          const leaveComment: Comment = {
            id: `comment-${Date.now()}`,
            pollId: "all",
            user: "System",
            text: `${leavingUser} left the poll`,
            timestamp: Date.now(),
          }

          setComments((prev) => [...prev, leaveComment])
        }
      }
    }, 10000)

    // Simulate connection issues occasionally
    const connectionInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        // 10% chance of connection issue
        setIsConnected(false)
        setConnectionError("Connection lost. Reconnecting...")

        // Reconnect after a delay
        setTimeout(() => {
          setIsConnected(true)
          setConnectionError(null)
        }, 3000)
      }
    }, 30000)

    return () => {
      clearInterval(voteInterval)
      clearInterval(userInterval)
      clearInterval(connectionInterval)
    }
  }, [])

  // Scroll to bottom of comments when new ones arrive
  useEffect(() => {
    if (showComments) {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [comments, showComments])

  // Handle username submission
  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      setIsSettingUsername(false)

      // Add system comment
      const joinComment: Comment = {
        id: `comment-${Date.now()}`,
        pollId: "all",
        user: "System",
        text: `${username} joined the poll`,
        timestamp: Date.now(),
      }

      setComments((prev) => [...prev, joinComment])
      setOnlineUsers((prev) => [...prev, username])
    }
  }

  // Handle creating a new poll
  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    if (!newPollQuestion.trim() || newPollOptions.some((opt) => !opt.trim())) {
      return
    }

    // Create new poll
    const newPoll: Poll = {
      id: `poll-${Date.now()}`,
      question: newPollQuestion,
      options: newPollOptions.map((opt, index) => ({
        id: `opt-${Date.now()}-${index}`,
        text: opt,
        votes: 0,
        color: COLORS[index % COLORS.length],
      })),
      createdBy: username,
      createdAt: Date.now(),
      isActive: true,
      totalVotes: 0,
      hasVoted: false,
    }

    // Add to polls
    setPolls((prev) => [newPoll, ...prev])
    setActivePoll(newPoll)

    // Add system comment
    const newPollComment: Comment = {
      id: `comment-${Date.now()}`,
      pollId: "all",
      user: "System",
      text: `${username} created a new poll: "${newPollQuestion}"`,
      timestamp: Date.now(),
    }

    setComments((prev) => [...prev, newPollComment])

    // Reset form
    setNewPollQuestion("")
    setNewPollOptions(["", ""])
    setShowCreateForm(false)
  }

  // Handle adding a new option field
  const handleAddOption = () => {
    if (newPollOptions.length < 10) {
      setNewPollOptions((prev) => [...prev, ""])
    }
  }

  // Handle removing an option field
  const handleRemoveOption = (index: number) => {
    if (newPollOptions.length > 2) {
      setNewPollOptions((prev) => prev.filter((_, i) => i !== index))
    }
  }

  // Handle option change
  const handleOptionChange = (index: number, value: string) => {
    setNewPollOptions((prev) => {
      const updated = [...prev]
      updated[index] = value
      return updated
    })
  }

  // Handle voting
  const handleVote = (pollId: string, optionId: string) => {
    setIsPolling(true)

    // Simulate network delay
    setTimeout(() => {
      setPolls((prev) => {
        return prev.map((poll) => {
          if (poll.id === pollId) {
            const updatedOptions = poll.options.map((opt) => {
              if (opt.id === optionId) {
                return { ...opt, votes: opt.votes + 1 }
              }
              return opt
            })

            return {
              ...poll,
              options: updatedOptions,
              totalVotes: poll.totalVotes + 1,
              hasVoted: true,
            }
          }
          return poll
        })
      })

      // Update active poll if needed
      if (activePoll && activePoll.id === pollId) {
        setActivePoll((prev) => {
          if (!prev) return null

          const updatedOptions = prev.options.map((opt) => {
            if (opt.id === optionId) {
              return { ...opt, votes: opt.votes + 1 }
            }
            return opt
          })

          return {
            ...prev,
            options: updatedOptions,
            totalVotes: prev.totalVotes + 1,
            hasVoted: true,
          }
        })
      }

      // Add vote comment
      const voteComment: Comment = {
        id: `comment-${Date.now()}`,
        pollId: pollId,
        user: "System",
        text: `${username} voted on "${activePoll?.question}"`,
        timestamp: Date.now(),
      }

      setComments((prev) => [...prev, voteComment])
      setIsPolling(false)
    }, 500)
  }

  // Handle sending a comment
  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim() || !activePoll) return

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      pollId: activePoll.id,
      user: username,
      text: newComment,
      timestamp: Date.now(),
    }

    setComments((prev) => [...prev, comment])
    setNewComment("")
  }

  // Format time
  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp

    if (diff < 60000) {
      return "just now"
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}m ago`
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}h ago`
    } else {
      return new Date(timestamp).toLocaleDateString()
    }
  }

  // Calculate percentage
  const calculatePercentage = (votes: number, total: number) => {
    if (total === 0) return 0
    return Math.round((votes / total) * 100)
  }

  // Render bar chart
  const renderBarChart = (poll: Poll) => {
    const maxVotes = Math.max(...poll.options.map((opt) => opt.votes), 1)

    return (
      <div className="mt-4 space-y-3">
        {poll.options.map((option) => (
          <div key={option.id} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{option.text}</span>
              <span className="font-medium">
                {calculatePercentage(option.votes, poll.totalVotes)}% ({option.votes})
              </span>
            </div>
            <div className="h-8 bg-muted rounded-md overflow-hidden relative">
              <motion.div
                className="h-full absolute left-0 top-0"
                style={{ backgroundColor: option.color }}
                initial={{ width: 0 }}
                animate={{ width: `${(option.votes / maxVotes) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              {!poll.hasVoted && (
                <button
                  onClick={() => handleVote(poll.id, option.id)}
                  disabled={isPolling}
                  className="absolute inset-0 w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black/20 text-white font-medium"
                >
                  Vote
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Render pie chart
  const renderPieChart = (poll: Poll) => {
    const total = poll.totalVotes || 1 // Avoid division by zero
    const segments = poll.options.map((option) => ({
      ...option,
      percentage: (option.votes / total) * 100,
    }))

    // Calculate stroke-dasharray and stroke-dashoffset for each segment
    let cumulativePercentage = 0
    const segmentsWithOffsets = segments.map((segment) => {
      const dashArray = segment.percentage * 2.51327 // 2π × 40 (radius) ÷ 100
      const dashOffset = cumulativePercentage * 2.51327
      cumulativePercentage += segment.percentage
      return {
        ...segment,
        dashArray,
        dashOffset,
      }
    })

    return (
      <div className="mt-4 flex flex-col items-center">
        <div className="relative w-64 h-64">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="20" />
            {segmentsWithOffsets.map((segment, index) => (
              <motion.circle
                key={segment.id}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={segment.color}
                strokeWidth="20"
                strokeDasharray={`${segment.dashArray} ${251.327 - segment.dashArray}`}
                strokeDashoffset={-segment.dashOffset}
                transform="rotate(-90 50 50)"
                initial={{ strokeDasharray: "0 251.327" }}
                animate={{
                  strokeDasharray: `${segment.dashArray} ${251.327 - segment.dashArray}`,
                }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            ))}
            {!poll.hasVoted && (
              <circle
                cx="50"
                cy="50"
                r="30"
                fill="white"
                stroke="none"
                className="cursor-pointer hover:fill-gray-100 transition-colors duration-200"
                onClick={() => setShowVoteButtons(!showVoteButtons)}
              />
            )}
            {poll.hasVoted && (
              <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="currentColor">
                {poll.totalVotes} votes
              </text>
            )}
          </svg>

          {/* Vote buttons overlay */}
          {showVoteButtons && !poll.hasVoted && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-card rounded-lg shadow-lg p-2 w-48">
                {poll.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      handleVote(poll.id, option.id)
                      setShowVoteButtons(false)
                    }}
                    disabled={isPolling}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors duration-200 flex items-center gap-2"
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: option.color }}></div>
                    <span>{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {poll.options.map((option) => (
            <div key={option.id} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: option.color }}></div>
              <span className="text-sm">
                {option.text} ({calculatePercentage(option.votes, poll.totalVotes)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const [showVoteButtons, setShowVoteButtons] = useState(false)

  // If setting username, show username form
  if (isSettingUsername) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <div className="bg-card rounded-lg shadow-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold mb-4 text-center">Join Live Polling</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Enter your name to participate in polls and discussions
          </p>

          <form onSubmit={handleUsernameSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter your name"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground rounded-md py-2 hover:bg-primary/90 transition-colors"
            >
              Join
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              <Users className="inline w-4 h-4 mr-1" />
              {onlineUsers.length} people online
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-4 p-4">
      {/* Polls list and creation */}
      <div className="w-full md:w-1/3 h-[40%] md:h-full flex flex-col bg-card rounded-lg shadow-md overflow-hidden">
        <div className="bg-primary text-primary-foreground p-2 text-sm font-medium flex items-center justify-between">
          <div className="flex items-center">
            <Vote className="w-4 h-4 mr-1" />
            <span>Polls</span>
          </div>

          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="p-1 rounded-full hover:bg-primary-foreground/10 transition-colors"
          >
            {showCreateForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        {/* Create poll form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleCreatePoll} className="p-3 border-b border-border">
                <h3 className="font-medium mb-2">Create New Poll</h3>

                <div className="mb-3">
                  <label htmlFor="question" className="block text-xs font-medium mb-1">
                    Question
                  </label>
                  <input
                    type="text"
                    id="question"
                    value={newPollQuestion}
                    onChange={(e) => setNewPollQuestion(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Enter your question"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-xs font-medium mb-1">Options</label>
                  {newPollOptions.map((option, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-grow px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                      {newPollOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(index)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  {newPollOptions.length < 10 && (
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="text-xs flex items-center gap-1 text-primary hover:underline"
                    >
                      <Plus className="w-3 h-3" /> Add Option
                    </button>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-3 py-1 text-sm border border-border rounded-md hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Create Poll
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Polls list */}
        <div className="flex-grow overflow-y-auto">
          {polls.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <p>No polls available</p>
              <button onClick={() => setShowCreateForm(true)} className="mt-2 text-primary hover:underline">
                Create the first poll
              </button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {polls.map((poll) => (
                <button
                  key={poll.id}
                  onClick={() => setActivePoll(poll)}
                  className={`w-full text-left p-3 hover:bg-muted/50 transition-colors ${
                    activePoll?.id === poll.id ? "bg-muted/50" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-sm line-clamp-2">{poll.question}</h3>
                    {poll.hasVoted && (
                      <div className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full flex items-center">
                        <Check className="w-3 h-3 mr-0.5" /> Voted
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{poll.totalVotes} votes</span>
                    <span>{formatTime(poll.createdAt)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Online users */}
        <div className="p-2 border-t border-border bg-muted/30">
          <div className="flex items-center text-xs text-muted-foreground">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
              <Users className="w-3 h-3 mr-1" />
              <span>{onlineUsers.length} online</span>
            </div>
            <div className="ml-auto flex items-center">
              <span>Logged in as </span>
              <span className="font-medium text-foreground ml-1">{username}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active poll and comments */}
      <div className="w-full md:w-2/3 h-[60%] md:h-full flex flex-col bg-card rounded-lg shadow-md overflow-hidden">
        {/* Connection status */}
        {!isConnected && (
          <div className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 p-2 text-xs flex items-center justify-center">
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            {connectionError}
          </div>
        )}

        {/* Poll view */}
        <div ref={pollContainerRef} className="flex-grow overflow-y-auto p-4">
          {activePoll ? (
            <div>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{activePoll.question}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setChartType("bar")}
                    className={`p-1 rounded-md ${chartType === "bar" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setChartType("pie")}
                    className={`p-1 rounded-md ${chartType === "pie" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  >
                    <PieChart className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <Users className="w-4 h-4 mr-1" />
                <span>{activePoll.totalVotes} votes</span>
                <span className="mx-2">•</span>
                <Clock className="w-4 h-4 mr-1" />
                <span>{formatTime(activePoll.createdAt)}</span>
                <span className="mx-2">•</span>
                <span>Created by {activePoll.createdBy}</span>
              </div>

              {/* Chart */}
              {chartType === "bar" ? renderBarChart(activePoll) : renderPieChart(activePoll)}

              {/* Comments toggle */}
              <div className="mt-6">
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Comments</span>
                  {showComments ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Vote className="w-12 h-12 mb-2" />
              <p>Select a poll to view</p>
            </div>
          )}
        </div>

        {/* Comments section */}
        <AnimatePresence>
          {showComments && activePoll && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "40%" }}
              exit={{ height: 0 }}
              className="border-t border-border overflow-hidden"
            >
              <div className="h-full flex flex-col">
                <div className="p-2 bg-muted/30 text-sm font-medium">
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  Comments
                </div>

                <div className="flex-grow overflow-y-auto p-3 space-y-2">
                  {comments
                    .filter((comment) => comment.pollId === activePoll.id || comment.pollId === "all")
                    .map((comment) => (
                      <div
                        key={comment.id}
                        className={`p-2 rounded-lg max-w-[85%] ${
                          comment.user === username
                            ? "bg-primary/10 ml-auto"
                            : comment.user === "System"
                              ? "bg-muted/50 text-center mx-auto text-xs italic"
                              : "bg-muted"
                        }`}
                      >
                        {comment.user !== "System" && (
                          <div className="text-xs font-medium mb-1 flex justify-between">
                            <span className={comment.user === username ? "text-primary" : "text-foreground/70"}>
                              {comment.user === username ? "You" : comment.user}
                              {comment.user === activePoll.createdBy && (
                                <Crown className="w-3 h-3 inline ml-1 text-yellow-500" />
                              )}
                            </span>
                            <span className="text-muted-foreground text-[10px]">{formatTime(comment.timestamp)}</span>
                          </div>
                        )}
                        <p className="text-sm">{comment.text}</p>
                      </div>
                    ))}
                  <div ref={commentsEndRef} />
                </div>

                <form onSubmit={handleSendComment} className="p-2 border-t border-border flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Type a comment..."
                    className="flex-grow bg-background border border-border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground rounded-md px-3 py-1 text-sm hover:bg-primary/90 transition-colors"
                  >
                    Send
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default LivePolling

