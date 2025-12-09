import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Bot,
  User,
  Car,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import apiClient from "@/service/api/apiClient";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  data?: AIResponseData | null;
  metadata?: AIMetadata;
}

interface AIResponseData {
  type: "vehicles" | "stations" | "bookings" | "mixed" | null;
  items?: any[];
  vehicles?: Vehicle[];
  stations?: Station[];
  bookings?: any[];
}

interface AIMetadata {
  has_structured_data: boolean;
  data_type: string | null;
  items_count: number;
  response_tokens?: number;
  tools_used?: string[];
  source?: string;
  error_type?: string;
  timestamp?: string;
}

interface Vehicle {
  id: string;
  stationId: string;
  licensePlate: string;
  name: string;
  brand: string;
  color: string;
  fuelType: string;
  rating: number;
  capacity: number;
  rentCount: number;
  photos: string[];
  status: string;
  hourlyRate: number;
  dailyRate: number;
  depositAmount: number;
}

interface Station {
  id: string;
  name: string;
  address: string;
  rating: number;
  latitude: number;
  longitude: number;
  hotline: string;
  status: string;
  photo: string;
  startTime: string;
  endTime: string;
  totalVehicles: number;
  availableVehicles: number;
}

interface ChatAPIRequest {
  message: string;
  session_id?: string;
  user_id: string;
}

interface ChatAPIResponse {
  success: boolean;
  message: string;
  session_id: string;
  data: AIResponseData | null;
  error: string | null;
  metadata: AIMetadata;
}

export default function Chatbot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Xin chào! Tôi là trợ lý ảo VoltGo. Tôi có thể giúp bạn:\n\n• Tìm xe điện\n• Tìm trạm sạc gần bạn\n• Hướng dẫn thuê xe\n• Giải đáp chính sách\n\nBạn cần hỗ trợ gì?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get user_id from localStorage
  const getUserId = (): string => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      const newUserId = `guest_${Date.now()}`;
      localStorage.setItem("userId", newUserId);
      return newUserId;
    }
    return userId;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const requestData: ChatAPIRequest = {
        message: inputValue,
        user_id: getUserId(),
      };

      // Add session_id if exists
      if (sessionId) {
        requestData.session_id = sessionId;
      }

      // Call AI chatbot API
      const response = await apiClient.post<ChatAPIResponse>(
        "/chat", // TODO: Replace with actual endpoint
        requestData,
      );

      const { success, message, session_id, data, error, metadata } =
        response.data;

      // Save session_id
      if (session_id) {
        setSessionId(session_id);
        localStorage.setItem("chatbot_session_id", session_id);
      }

      if (success) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: message,
          sender: "bot",
          timestamp: new Date(),
          data: data,
          metadata: metadata,
        };

        setMessages((prev) => [...prev, botMessage]);
      } else {
        // Handle error response
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: message || "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.",
          sender: "bot",
          timestamp: new Date(),
          metadata: metadata,
        };

        setMessages((prev) => [...prev, errorMessage]);
        console.error("Chat API error:", error);
      }
    } catch (error: any) {
      console.error("Chat request failed:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Không thể kết nối đến server. Vui lòng kiểm tra kết nối và thử lại.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleViewVehicle = (vehicleId: string) => {
    setIsOpen(false);
    navigate(`/car/${vehicleId}`);
  };

  const handleViewStation = (stationId: string) => {
    setIsOpen(false);
    navigate(`/place/${stationId}`);
  };

  const renderVehicleCard = (vehicle: Vehicle) => (
    <Card
      key={vehicle.id}
      className="mt-2 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => handleViewVehicle(vehicle.id)}
    >
      <CardContent className="p-3">
        <div className="flex gap-3">
          {vehicle.photos && vehicle.photos[0] && (
            <img
              src={vehicle.photos[0]}
              alt={vehicle.name}
              className="w-20 h-20 object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-car.png";
              }}
            />
          )}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h4 className="font-semibold text-sm">{vehicle.name}</h4>
              <Badge
                variant={
                  vehicle.status === "AVAILABLE" ? "default" : "secondary"
                }
                className={vehicle.status === "AVAILABLE" ? "bg-green-500" : ""}
              >
                {vehicle.status === "AVAILABLE" ? "Có sẵn" : "Đã thuê"}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {vehicle.brand} • {vehicle.color} • {vehicle.capacity} chỗ
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-600">⭐ {vehicle.rating}</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-600">
                {vehicle.rentCount} lượt thuê
              </span>
            </div>
            <p className="text-sm font-bold text-green-600 mt-1">
              {formatCurrency(vehicle.dailyRate)}/ngày
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStationCard = (station: Station) => (
    <Card
      key={station.id}
      className="mt-2 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => handleViewStation(station.id)}
    >
      <CardContent className="p-3">
        <div className="flex gap-3">
          {station.photo && (
            <img
              src={station.photo}
              alt={station.name}
              className="w-20 h-20 object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.jpg";
              }}
            />
          )}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h4 className="font-semibold text-sm">{station.name}</h4>
              <Badge
                variant={station.status === "ACTIVE" ? "default" : "secondary"}
                className={station.status === "ACTIVE" ? "bg-green-500" : ""}
              >
                {station.status === "ACTIVE" ? "Hoạt động" : "Đóng cửa"}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 mt-1 flex items-start gap-1">
              <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
              {station.address}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ⭐ {station.rating} • 📞 {station.hotline}
            </p>
            <p className="text-xs text-green-600 mt-1 font-medium">
              {station.availableVehicles}/{station.totalVehicles} xe khả dụng
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStructuredData = (message: Message) => {
    if (!message.data || !message.metadata?.has_structured_data) {
      return null;
    }

    const { type, items, vehicles, stations } = message.data;

    return (
      <div className="mt-2">
        {/* Render vehicles */}
        {(type === "vehicles" || type === "mixed") && (vehicles || items) && (
          <div className="space-y-2">
            {(vehicles || items)?.map((vehicle: Vehicle) =>
              renderVehicleCard(vehicle),
            )}
          </div>
        )}

        {/* Render stations */}
        {(type === "stations" || type === "mixed") && (stations || items) && (
          <div className="space-y-2">
            {(stations || items)?.map((station: Station) =>
              renderStationCard(station),
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
          aria-label="Open chat"
        >
          <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-[400px] h-[650px] shadow-2xl flex flex-col animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">VoltGo AI</h3>
                  <p className="text-xs text-green-100">Trợ lý thuê xe điện</p>
                </div>
              </div>
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

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "bot" && (
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-green-600" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] ${message.sender === "user" ? "order-first" : ""}`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-green-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 shadow-sm rounded-bl-none"
                    }`}
                  >
                    {message.sender === "bot" ? (
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            h2: ({ children }) => (
                              <h2 className="text-base font-bold mt-2 mb-1">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-sm font-bold mt-2 mb-1">
                                {children}
                              </h3>
                            ),
                            p: ({ children }) => (
                              <p className="text-sm mb-1">{children}</p>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc list-inside text-sm mb-1">
                                {children}
                              </ul>
                            ),
                            li: ({ children }) => (
                              <li className="text-sm">{children}</li>
                            ),
                          }}
                        >
                          {message.text}
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

                  {/* Render structured data (vehicles/stations cards) */}
                  {message.sender === "bot" && renderStructuredData(message)}
                </div>
                {message.sender === "user" && (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-green-600" />
                </div>
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
          </div>

          {/* Input Area */}
          <div className="border-t bg-white p-4 rounded-b-lg">
            <div className="flex gap-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 resize-none border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 max-h-24 min-h-[40px]"
                rows={1}
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-green-600 hover:bg-green-700 h-10 w-10 p-0 rounded-lg"
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
