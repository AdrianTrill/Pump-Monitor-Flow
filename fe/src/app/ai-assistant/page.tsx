"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { MagnifyingGlassIcon, SparklesIcon, ChatBubbleLeftRightIcon, LightBulbIcon } from "@heroicons/react/24/outline";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AnimatedCounter from "../components/AnimatedCounter";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatSuggestion {
  suggestions: string[];
}

const anomalyCorrelations = [
  { name: "Vibration + Heat", value: 85 },
  { name: "Pressure + Flow", value: 75 },
  { name: "Heat + Power", value: 60 },
  { name: "Vibration + Pressure", value: 40 },
];

const keyFindings = [
  "Strong correlation between vibration and heat anomalies (89%)",
  "Pressure and flow issues often occur together (76%)",
  "Most failures preceded by combined sensor anomalies",
];

const insights = [
  {
    title: "Schedule inspection for Pump A23",
    desc: "Bearing wear detected with 85% confidence",
    color: "bg-red-50 border-red-200",
    button: { label: "Schedule Now", color: "bg-[#3D5DE8] text-white hover:bg-[#274bb6]" },
    icon: SparklesIcon,
    iconColor: "text-red-500",
    confidence: 85,
  },
  {
    title: "Review lubrication schedule",
    desc: "Multiple pumps showing increased friction",
    color: "bg-yellow-50 border-yellow-200",
    button: { label: "View Details", color: "bg-[#3D5DE8] text-white hover:bg-[#274bb6]" },
    icon: LightBulbIcon,
    iconColor: "text-yellow-500",
    confidence: 78,
  },
  {
    title: "Temperature monitoring alert",
    desc: "Unit C pumps running above normal range",
    color: "bg-red-50 border-red-200",
    button: { label: "Investigate", color: "bg-[#3D5DE8] text-white hover:bg-[#274bb6]" },
    icon: SparklesIcon,
    iconColor: "text-red-500",
    confidence: 92,
  },
  {
    title: "Preventive maintenance due",
    desc: "5 pumps approaching maintenance interval",
    color: "bg-blue-50 border-blue-200",
    button: { label: "Plan Maintenance", color: "bg-[#3D5DE8] text-white hover:bg-[#274bb6]" },
    icon: LightBulbIcon,
    iconColor: "text-blue-500",
    confidence: 95,
  },
];

import { apiClient } from "../lib/api-client";

// --- Animation Variants ---
const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const headerVariants: Variants = {
  hidden: { y: -30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const searchVariants: Variants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.2 } },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  hover: { 
    scale: 1.02, 
    transition: { type: "spring", stiffness: 300 } 
  },
};

const messageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// Initial suggestions displayed before any conversation
const initialSuggestions = [
  "What's the overall system health?",
  "Show me all pump statuses", 
  "Which pumps have critical alerts?",
  "Tell me about maintenance schedules",
  "Show me pumps with overheating risk",
  "What are the current anomalies?"
];

// Suggestion component with improved styling
const SuggestionPrompt = ({
  text,
  onClick,
}: {
  text: string;
  onClick: (text: string) => void;
}) => {
  return (
    <motion.div
      className="py-1.5 px-3 text-xs rounded-full bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100 border border-blue-200 transition-all duration-200 shadow-sm"
      onClick={() => onClick(text)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {text}
    </motion.div>
  );
};

// Enhanced markdown formatter for better text display
const formatMarkdown = (text: string): string => {
  let formatted = text;

  // Format headers with proper styling
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900 block mb-2 mt-3">$1</strong>');
  
  // Format lists with proper indentation and spacing
  formatted = formatted.replace(/^- (.+)$/gm, '<div class="ml-4 mb-1 flex items-start"><span class="text-blue-600 mr-2">•</span><span>$1</span></div>');
  
  // Format paragraphs
  formatted = formatted.replace(/\n\n/g, '</p><p class="mb-2">');
  formatted = '<p class="mb-2">' + formatted + '</p>';
  
  // Clean up any double paragraphs
  formatted = formatted.replace(/<p class="mb-2"><\/p>/g, '');
  
  return formatted;
};

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI assistant for pump monitoring and predictive maintenance. I can help you analyze pump performance, investigate alerts, predict failures, and provide maintenance recommendations. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([]);
  const [showDynamicSuggestions, setShowDynamicSuggestions] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Generate initial suggestions after the first message
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === "assistant") {
      getChatSuggestions("", messages);
    }
  }, [messages.length]);

  const getChatSuggestions = async (lastMessage: string, currentMessages: Message[]) => {
    try {
      const response = await apiClient.getChatSuggestions(
        lastMessage, 
        currentMessages.slice(0, -1).map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      );

      if (response.data) {
        setDynamicSuggestions((response.data as ChatSuggestion).suggestions || []);
      }
    } catch (error) {
      console.error("Error getting suggestions:", error);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      handleSendMessage(search.trim());
      setSearch("");
    }
  };

  const handleSendMessage = async (messageToSend: string) => {
    if (!messageToSend.trim()) return;

    setInput("");
    setIsLoading(true);

    // Reset dynamic suggestions every time user sends a new message
    setDynamicSuggestions([]);
    setShowDynamicSuggestions(false);

    // Add user message
    const newMessages = [...messages, { role: "user" as const, content: messageToSend }];
    setMessages(newMessages);

    // Add empty assistant message that we'll update
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    try {
      // Stream the response using API client
      const response = await apiClient.streamChatMessage(messageToSend, messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })));

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      let assistantMessage = "";
      const decoder = new TextDecoder();
      let hasReceivedContent = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        console.log("Received chunk:", chunk); // Debug log
        
        if (chunk.trim()) {
          hasReceivedContent = true;
          assistantMessage += chunk;

          // Update the last assistant message
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: assistantMessage };
            return updated;
          });
        }
      }

      // If no content was received, show error message
      if (!hasReceivedContent || !assistantMessage.trim()) {
        console.error("No content received from stream");
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { 
            role: "assistant", 
            content: "I apologize, but I didn't receive a proper response. Please try your question again." 
          };
          return updated;
        });
      } else {
        // Get suggestions for the conversation
        await getChatSuggestions(messageToSend, [...newMessages, { role: "assistant", content: assistantMessage }]);
      }

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { 
          role: "assistant", 
          content: "I apologize, but I encountered an error processing your request. Please try again." 
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    const messageToSend = input.trim();
    if (!messageToSend) return;
    await handleSendMessage(messageToSend);
  };

  const handleSuggestionClick = async (suggestion: string) => {
    await handleSendMessage(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible" 
      variants={pageVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100"
    >
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-10">
        
        {/* Page Title */}
        <motion.div variants={headerVariants} className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <SparklesIcon className="w-10 h-10 text-[#3D5DE8]" />
            </motion.div>
            <h1 className="text-4xl font-bold text-slate-800">AI Assistant</h1>
          </div>
          <p className="text-slate-600 text-lg">Intelligent insights and recommendations for optimal pump performance</p>
        </motion.div>
        
        {/* Large Search Bar */}
        <motion.div variants={searchVariants} className="flex justify-center mb-12">
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-5xl">
            <motion.input
              className="w-full border-2 border-gray-200 rounded-2xl pl-14 pr-28 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#3D5DE8] focus:border-[#3D5DE8] bg-white/80 backdrop-blur-sm shadow-xl text-gray-900 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Ask me anything about your pumps... (e.g., 'Show pumps with overheating risk')"
              value={search}
              onChange={e => setSearch(e.target.value)}
              disabled={isLoading}
              whileFocus={{ scale: 1.02 }}
              whileHover={!isLoading ? { scale: 1.01 } : {}}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <MagnifyingGlassIcon className="w-6 h-6 text-gray-400 absolute left-5 top-1/2 -translate-y-1/2" />
            <motion.button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#3D5DE8] text-white px-6 py-2 rounded-xl hover:bg-[#274bb6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !search.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Search
            </motion.button>
          </form>
        </motion.div>
        
        {/* Main Content: Suggestions + Chat */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 mb-10">
          {/* AI Suggestions Card */}
          <motion.div 
            variants={cardVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <LightBulbIcon className="w-6 h-6 text-[#3D5DE8]" />
              <div className="font-semibold text-gray-900 text-xl">AI Insights</div>
            </div>
            <motion.div 
              className="flex flex-col gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {insights.map((s, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
                  className={`border-2 ${s.color} rounded-xl px-6 py-4 flex items-center justify-between shadow-sm`}
                >
                  <div className="flex items-start gap-3">
                    <s.icon className={`w-5 h-5 ${s.iconColor} mt-1`} />
                    <div>
                      <div className="font-semibold text-gray-900 text-base mb-1">{s.title}</div>
                      <div className="text-gray-700 text-sm mb-2">{s.desc}</div>
                      <div className="text-xs text-gray-500 font-medium">
                        Confidence: <AnimatedCounter to={s.confidence} />%
                      </div>
                    </div>
                  </div>
                  <motion.button
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition ${s.button.color}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {s.button.label}
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* AI Chat Card */}
          <motion.div 
            variants={cardVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-[#3D5DE8]" />
                <div className="font-semibold text-gray-900 text-xl">AI Chat</div>
              </div>
            </div>
            <div className="flex flex-col h-[489px] justify-between">
              {/* Chat Messages */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto flex flex-col gap-3 px-6 pt-4 pr-8 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent min-h-0">
                {messages.map((msg, i) => (
                  <motion.div 
                    key={i}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <motion.div
                        className={`max-w-[85%] px-4 py-3 rounded-xl text-sm whitespace-pre-line shadow-sm ${
                          msg.role === "user"
                            ? "bg-[#3D5DE8] text-white rounded-br-sm"
                            : "bg-gray-100 text-gray-900 rounded-bl-sm border border-gray-200"
                        }`}
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div 
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ 
                            __html: msg.role === "assistant" ? formatMarkdown(msg.content) : msg.content 
                          }} 
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div 
                    className="flex justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="bg-gray-100 text-gray-900 rounded-xl rounded-bl-sm px-4 py-3 border border-gray-200">
                      <div className="flex space-x-1">
                        <motion.div 
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.1 }}
                        />
                        <motion.div 
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.1, delay: 0.2 }}
                        />
                        <motion.div 
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.1, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Suggestions and Input Section - Fixed at bottom */}
              <div className="border-t border-gray-200 px-6 py-4 flex-shrink-0 bg-gray-50/50">
                {/* Initial suggestions if no conversation yet */}
                {messages.length === 1 ? (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2 font-medium">
                      Here are some things you can ask me:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {initialSuggestions.map((prompt, index) => (
                        <SuggestionPrompt
                          key={index}
                          text={prompt}
                          onClick={handleSuggestionClick}
                        />
                      ))}
                    </div>
                  </div>
                ) : 
                dynamicSuggestions.length > 0 ? (
                  <div className="mb-3">
                    {!showDynamicSuggestions ? (
                      /* Link to show suggestions with improved styling and animation */
                      <motion.div 
                        className="flex items-center gap-1 text-[#3D5DE8] cursor-pointer hover:text-[#274bb6] transition-all duration-300 ease-in-out mb-2"
                        onClick={() => setShowDynamicSuggestions(true)}
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          strokeWidth={1.5} 
                          stroke="currentColor" 
                          className="w-3 h-3 animate-pulse"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                        </svg>
                        <span className="text-xs font-medium hover:underline">Show suggestions</span>
                      </motion.div>
                    ) : (
                      <>
                        <p className="text-xs text-gray-500 mb-2 font-medium">Suggested follow-ups:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {dynamicSuggestions.map((prompt, index) => (
                            <SuggestionPrompt
                              key={index}
                              text={prompt}
                              onClick={handleSuggestionClick}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : null}

                {/* Input Section */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D5DE8] focus:border-[#3D5DE8] disabled:opacity-50"
                    placeholder="Type your message or select a suggestion..."
                    disabled={isLoading}
                  />
                  <motion.button
                    onClick={handleSend}
                    className="bg-[#3D5DE8] text-white font-medium px-3 py-2.5 rounded-lg hover:bg-[#274bb6] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm"
                    disabled={isLoading || !input.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Send
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Anomaly Correlations + Key Findings */}
        <motion.div 
          variants={cardVariants}
          className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-xl p-8 flex flex-col xl:flex-row gap-12"
        >
          <motion.div 
            variants={itemVariants}
            className="flex-1 min-w-[250px]"
          >
            <div className="font-semibold text-gray-900 mb-4 text-lg">Anomaly Correlations</div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={anomalyCorrelations} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: '#182363', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: 8, borderColor: '#e5e7eb', fontSize: 12 }} 
                    formatter={(value) => [`${value}%`, 'Correlation']}
                  />
                  <Bar dataKey="value" fill="#232e6b" radius={[6, 6, 0, 0]} barSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          <motion.div 
            variants={itemVariants}
            className="flex-1 min-w-[220px] flex flex-col justify-center"
          >
            <div className="font-semibold text-gray-700 mb-4 text-lg">Key Findings:</div>
            <motion.ul 
              className="list-disc pl-5 text-gray-700 text-base space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {keyFindings.map((finding, i) => (
                <motion.li 
                  key={i}
                  variants={itemVariants}
                  className="leading-relaxed"
                >
                  {finding}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}