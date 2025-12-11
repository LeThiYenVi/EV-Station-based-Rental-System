import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Bot,
  User,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { chatService } from "@/service/chat";
import type { ChatResponse, VehicleData, StationData } from "@/service/chat";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { VehicleCard, StationCard } from "./ChatDataCards";
import { useGeolocation } from "@/hooks/useGeolocation";
import SantaHat from "./SantaHat";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  data?: ChatResponse["data"];
  metadata?: ChatResponse["metadata"];
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Xin chào! Tôi là trợ lý ảo Voltgo. Tôi có thể giúp bạn:\n\n✅ Tìm xe điện\n✅ Xem trạm thuê xe gần bạn\n✅ Tư vấn chính sách thuê xe\n\nBạn cần hỗ trợ gì?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    latitude,
    longitude,
    loading: locationLoading,
    error: locationError,
  } = useGeolocation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setError(null);

    // Create placeholder bot message for streaming
    const botMessageId = (Date.now() + 1).toString();
    const botMessage: Message = {
      id: botMessageId,
      text: "",
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);

    try {
      // Get user_id from localStorage if available
      const userId = localStorage.getItem("userId") || undefined;

      // Check if message is asking for nearby locations
      const needsLocation =
        /trạm\s*(gần|ở\s*đâu|quanh|lân\s*cận)|tìm\s*trạm|near|nearby|location/i.test(
          userMessage.text,
        );

      // Prepare metadata with user location ONLY if needed
      const metadata =
        locationEnabled && latitude && longitude && needsLocation
          ? {
              user_location: {
                latitude,
                longitude,
              },
            }
          : undefined;

      // Use streaming API
      await chatService.sendMessageStream(
        {
          message: userMessage.text,
          user_id: userId,
          session_id: sessionId || undefined,
          metadata,
        },
        {
          onSessionId: (newSessionId) => {
            setSessionId(newSessionId);
          },
          onChunk: (chunk) => {
            // Append text chunk to bot message
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === botMessageId
                  ? { ...msg, text: msg.text + chunk }
                  : msg,
              ),
            );
          },
          onData: (data) => {
            // Add structured data to bot message
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === botMessageId ? { ...msg, data: data } : msg,
              ),
            );
          },
          onMetadata: (metadata) => {
            // Add metadata to bot message
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === botMessageId ? { ...msg, metadata: metadata } : msg,
              ),
            );
          },
          onError: (error) => {
            setError(error);
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === botMessageId
                  ? {
                      ...msg,
                      text: "❌ Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn.",
                    }
                  : msg,
              ),
            );
          },
          onComplete: () => {
            setIsTyping(false);
          },
        },
      );
    } catch (err: any) {
      console.error("Chat error:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                text: "❌ Không thể kết nối với trợ lý AI. Vui lòng kiểm tra lại.\nThử lại sau nhé!",
              }
            : msg,
        ),
      );
      setError(err.message || "Connection error");
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Normalize markdown text - ensure proper line breaks
  const normalizeMarkdown = (text: string): string => {
    if (!text) return "";

    // CRITICAL: Convert literal \n strings to actual line breaks
    // Backend might be sending "\n" as text instead of actual newlines
    let normalized = text
      // Replace literal \n with actual newlines
      .replace(/\\n/g, "\n")
      // Clean up excessive newlines (3+ → 2)
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return normalized;
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-transparent border-0 shadow-2xl transition-all duration-300 hover:scale-110 group cursor-pointer"
          aria-label="Open chat"
        >
          <span className="text-5xl group-hover:scale-125 transition-transform animate-bounce block">
            🎅
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] shadow-2xl flex flex-col animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl animate-pulse">🎅</span>
                <div>
                  <CardTitle className="text-lg font-bold">Trợ lý ảo</CardTitle>
                  <p className="text-xs text-green-100 flex items-center gap-1">
                    {locationEnabled && latitude && longitude ? (
                      <>
                        <MapPin className="w-3 h-3" />
                        Đã bật định vị
                      </>
                    ) : (
                      "Luôn sẵn sàng hỗ trợ bạn"
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Location Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocationEnabled(!locationEnabled)}
                  className={`text-white h-8 w-8 p-0 ${
                    locationEnabled && latitude && longitude
                      ? "bg-green-600 hover:bg-green-700"
                      : "hover:bg-green-600"
                  }`}
                  title={locationEnabled ? "Tắt định vị" : "Bật định vị"}
                >
                  <MapPin className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-green-600 h-8 w-8 p-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {/* Location Warning */}
            {locationEnabled && locationError && (
              <Alert className="bg-yellow-50 border-yellow-300">
                <MapPin className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  {locationError}. Một số tính năng tìm kiếm gần bạn có thể
                  không hoạt động.
                </AlertDescription>
              </Alert>
            )}

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {messages.map((message) => {
              try {
                return (
                  <div key={message.id}>
                    <div
                      className={`flex gap-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.sender === "bot" && (
                        <span className="text-2xl flex-shrink-0">🎅</span>
                      )}
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                          message.sender === "user"
                            ? "bg-green-600 text-white rounded-br-none"
                            : "bg-white text-gray-800 shadow-sm rounded-bl-none"
                        }`}
                      >
                        {message.sender === "bot" ? (
                          <div
                            className="prose prose-sm max-w-none"
                            style={{
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                              whiteSpace: "normal",
                            }}
                          >
                            <ReactMarkdown
                              remarkPlugins={[remarkBreaks, remarkGfm]}
                              components={{
                                p: ({ children }) => (
                                  <p
                                    className="mb-3 text-sm leading-relaxed text-gray-700"
                                    style={{ display: "block" }}
                                  >
                                    {children}
                                  </p>
                                ),
                                h1: ({ children }) => (
                                  <h1
                                    className="text-lg font-bold mb-3 mt-4 text-gray-900 border-b border-gray-300 pb-2"
                                    style={{ display: "block" }}
                                  >
                                    {children}
                                  </h1>
                                ),
                                h2: ({ children }) => (
                                  <h2
                                    className="text-base font-bold mb-2 mt-4 text-gray-900"
                                    style={{ display: "block" }}
                                  >
                                    {children}
                                  </h2>
                                ),
                                h3: ({ children }) => (
                                  <h3
                                    className="text-sm font-semibold mb-2 mt-3 text-gray-800"
                                    style={{ display: "block" }}
                                  >
                                    {children}
                                  </h3>
                                ),
                                h4: ({ children }) => (
                                  <h4
                                    className="text-sm font-medium mb-1.5 mt-2 text-gray-700"
                                    style={{ display: "block" }}
                                  >
                                    {children}
                                  </h4>
                                ),
                                ul: ({ children }) => (
                                  <ul
                                    className="list-disc list-outside ml-5 mb-3 space-y-1.5"
                                    style={{ display: "block" }}
                                  >
                                    {children}
                                  </ul>
                                ),
                                ol: ({ children }) => (
                                  <ol
                                    className="list-decimal list-outside ml-5 mb-3 space-y-1.5"
                                    style={{ display: "block" }}
                                  >
                                    {children}
                                  </ol>
                                ),
                                li: ({ children }) => (
                                  <li
                                    className="text-sm leading-relaxed text-gray-700"
                                    style={{ display: "list-item" }}
                                  >
                                    {children}
                                  </li>
                                ),
                                strong: ({ children }) => (
                                  <strong className="font-semibold text-gray-900">
                                    {children}
                                  </strong>
                                ),
                                em: ({ children }) => (
                                  <em className="italic text-gray-700">
                                    {children}
                                  </em>
                                ),
                                code: ({ children }) => (
                                  <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-pink-600">
                                    {children}
                                  </code>
                                ),
                                blockquote: ({ children }) => (
                                  <blockquote
                                    className="border-l-4 border-green-500 pl-4 py-2 my-3 bg-gray-50 text-gray-700 italic"
                                    style={{ display: "block" }}
                                  >
                                    {children}
                                  </blockquote>
                                ),
                                hr: () => (
                                  <hr className="my-4 border-gray-300" />
                                ),
                              }}
                            >
                              {normalizeMarkdown(message.text || "")}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.text}
                          </p>
                        )}
                        <p
                          className={`text-xs mt-1 ${message.sender === "user" ? "text-green-100" : "text-gray-400"}`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                      {message.sender === "user" && (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                      )}
                    </div>

                    {/* Render structured data if available */}
                    {message.sender === "bot" &&
                      message.metadata?.has_structured_data &&
                      message.data && (
                        <div className="ml-10 mt-2">
                          {/* Vehicles */}
                          {(message.data.type === "vehicles" ||
                            message.data.type === "mixed") &&
                            (message.data.items || message.data.vehicles) && (
                              <div className="space-y-2">
                                {(
                                  (message.data.items as VehicleData[]) ||
                                  message.data.vehicles
                                )?.map((vehicle) => (
                                  <VehicleCard
                                    key={vehicle.id}
                                    vehicle={vehicle}
                                  />
                                ))}
                              </div>
                            )}

                          {/* Stations */}
                          {(message.data.type === "stations" ||
                            message.data.type === "mixed") &&
                            (message.data.items || message.data.stations) && (
                              <div className="space-y-2 mt-2">
                                {(
                                  (message.data.items as StationData[]) ||
                                  message.data.stations
                                )?.map((station) => (
                                  <StationCard
                                    key={station.id}
                                    station={station}
                                  />
                                ))}
                              </div>
                            )}
                        </div>
                      )}
                  </div>
                );
              } catch (err) {
                console.error("Error rendering message:", err);
                return (
                  <div key={message.id} className="flex gap-2 justify-start">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="max-w-[75%] rounded-2xl px-4 py-2 bg-red-50 text-red-800 shadow-sm rounded-bl-none">
                      <p className="text-sm">Lỗi hiển thị tin nhắn</p>
                    </div>
                  </div>
                );
              }
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2 justify-start">
                <span className="text-2xl flex-shrink-0 animate-bounce">
                  🎅
                </span>
                <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input Area */}
          <div className="border-t bg-white p-4 rounded-b-lg">
            <div className="flex gap-2 items-end">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 resize-none border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 max-h-24 min-h-[40px]"
                rows={1}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-green-600 hover:bg-green-700 h-10 w-10 p-0 rounded-lg flex-shrink-0"
              >
                {isTyping ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Nhấn Enter để gửi, Shift + Enter để xuống dòng
            </p>
          </div>
        </Card>
      )}
    </>
  );
}
