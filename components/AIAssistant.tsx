import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, X, Loader2 } from "lucide-react";
import { useOpenAI } from "@/hooks/useOpenAI";
import TypingIndicator from "@/components/TypingIndicator";
import Feedback from "@/components/Feedback";
import ReactMarkdown from "react-markdown";

interface Message {
  sender: "user" | "ai";
  text: string;
  pending?: boolean;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { generateResponse, isLoading, error } = useOpenAI();

  const welcomeMessage =
    "Greetings, traveler! I am the cosmic guide to Johnson Ojo's universe of work. How may I assist you on your journey today?";
  const suggestedQuestions = [
    "Tell me about Johnson's latest project.",
    "What are Johnson's key skills?",
    "How can I get in touch with Johnson?",
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ sender: "ai", text: welcomeMessage }]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Focus the input when opening
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue;
    if (textToSend.trim() === "" || isLoading) return;

    // Add user message
    const userMessage: Message = { sender: "user", text: textToSend };
    setMessages((currentMessages) => [...currentMessages, userMessage]);

    // Add pending AI message
    const pendingMessage: Message = {
      sender: "ai",
      text: "Thinking...",
      pending: true,
    };
    setMessages((currentMessages) => [...currentMessages, pendingMessage]);

    // Clear input
    setInputValue("");

    try {
      // Call OpenAI API
      const response = await generateResponse(textToSend);

      // Update messages (remove pending message and add real response)
      setMessages((currentMessages) => {
        const messagesWithoutPending = currentMessages.filter(
          (msg) => !msg.pending
        );
        return [...messagesWithoutPending, { sender: "ai", text: response }];
      });
    } catch (err) {
      // Handle error
      setMessages((currentMessages) => {
        const messagesWithoutPending = currentMessages.filter(
          (msg) => !msg.pending
        );
        return [
          ...messagesWithoutPending,
          {
            sender: "ai",
            text: "Sorry, I encountered an error. Please try again.",
          },
        ];
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Export chat history
  const exportChat = () => {
    const chatContent = messages
      .map((msg) => `${msg.sender === "user" ? "You" : "AI"}: ${msg.text}`)
      .join("\n\n");
    const blob = new Blob([chatContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "chat-with-johnson-ai.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Clear chat
  const clearChat = () => {
    setMessages([{ sender: "ai", text: welcomeMessage }]);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 p-0 bg-gradient-to-br from-blue-800 via-indigo-700 to-purple-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          aria-label="Open chat"
        >
          <Bot className="w-7 h-7 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-96 max-w-[95vw] h-[36rem] max-h-[95vh] flex flex-col bg-gradient-to-br from-slate-900/95 to-indigo-950/90 border-indigo-800 shadow-2xl animate-in fade-in rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b border-indigo-800/60 bg-slate-900/80 rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-semibold text-indigo-100 tracking-wide">
                  Cosmic Guide
                </span>
                <p className="text-xs text-indigo-300">Powered by OpenAI</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={exportChat}
                variant="outline"
                className="text-xs px-2 py-1 h-7"
              >
                Export
              </Button>
              <Button
                onClick={clearChat}
                variant="ghost"
                className="text-xs px-2 py-1 h-7"
              >
                Clear
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChat}
                className="text-indigo-300 hover:text-white hover:bg-indigo-900/50 rounded-full"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full px-4 py-3" ref={scrollRef}>
              <div className="flex flex-col gap-3">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`${
                      msg.sender === "user"
                        ? "self-end ml-12"
                        : "self-start mr-12"
                    } flex flex-col`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm ${
                        msg.sender === "user"
                          ? "bg-gradient-to-br from-indigo-600 to-blue-700 text-white"
                          : msg.pending
                          ? "bg-slate-800/50 text-indigo-200 border border-indigo-900/50 animate-pulse"
                          : "bg-slate-800/80 text-indigo-100 border border-indigo-900"
                      }`}
                    >
                      <div className="prose prose-invert prose-sm">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                      {msg.sender === "ai" && <Feedback />}
                    </div>
                  </div>
                ))}

                {/* Suggested Questions */}
                {messages.length === 1 && messages[0].sender === "ai" && (
                  <div className="mt-3">
                    <div className="text-xs text-indigo-300 mb-2">
                      Or ask me about:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.map((q, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className="border-indigo-700/60 text-indigo-200 hover:bg-indigo-900/60 hover:border-indigo-600 hover:text-white text-xs px-3 py-1.5 rounded-xl"
                          onClick={() => handleSendMessage(q)}
                        >
                          {q}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                {isLoading && <TypingIndicator />}
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="py-3 px-4 border-t border-indigo-800/60 bg-slate-900/80 rounded-b-xl">
            <form
              className="flex w-full gap-2 items-center"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <Input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Johnson's experience..."
                className="flex-1 bg-slate-800/80 border-indigo-700/50 text-indigo-100 placeholder:text-indigo-400/70 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg py-2"
                disabled={isLoading}
                autoFocus
              />
              <Button
                type="submit"
                disabled={isLoading || inputValue.trim() === ""}
                className={`bg-indigo-700 hover:bg-indigo-600 text-white p-2 rounded-lg ${
                  isLoading ? "opacity-70" : ""
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default AIAssistant;
