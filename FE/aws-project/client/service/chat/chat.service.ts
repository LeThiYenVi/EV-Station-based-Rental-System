import axios, { AxiosInstance } from "axios";
import { ChatRequest, ChatResponse } from "./chat.types";

const AI_API_BASE_URL =
  import.meta.env.VITE_AI_API_BASE_URL || "http://localhost:8000";

class ChatService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: AI_API_BASE_URL,
      timeout: 60000, // 60 seconds for AI responses
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("ChatService initialized with baseURL:", AI_API_BASE_URL);
  }

  /**
   * Send a chat message to the AI service (non-streaming)
   * @param request - Chat request with message and optional user_id/session_id
   * @returns Promise<ChatResponse>
   */
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await this.instance.post<ChatResponse>(
        "/chat",
        request,
      );
      return response.data;
    } catch (error) {
      console.error("Error sending chat message:", error);
      throw error;
    }
  }

  /**
   * Send a chat message with streaming response (SSE)
   * @param request - Chat request with message and optional user_id/session_id
   * @param onChunk - Callback for each text chunk
   * @param onData - Callback for structured data
   * @param onMetadata - Callback for metadata
   * @param onError - Callback for errors
   * @returns Promise<void>
   */
  async sendMessageStream(
    request: ChatRequest,
    callbacks: {
      onChunk: (text: string) => void;
      onData?: (data: ChatResponse["data"]) => void;
      onMetadata?: (metadata: ChatResponse["metadata"]) => void;
      onSessionId?: (sessionId: string) => void;
      onError?: (error: string) => void;
      onComplete?: () => void;
    },
  ): Promise<void> {
    try {
      const response = await fetch(`${AI_API_BASE_URL}/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          callbacks.onComplete?.();
          break;
        }

        // Decode chunk
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              switch (data.type) {
                case "session":
                  callbacks.onSessionId?.(data.session_id);
                  break;

                case "text":
                  callbacks.onChunk(data.content);
                  break;

                case "data":
                  callbacks.onData?.(data.data);
                  break;

                case "metadata":
                  callbacks.onMetadata?.(data.metadata);
                  break;

                case "error":
                  callbacks.onError?.(data.error);
                  break;

                case "done":
                  // Stream complete
                  break;

                default:
                  console.warn("Unknown SSE event type:", data.type);
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error in streaming chat:", error);
      callbacks.onError?.(
        error instanceof Error ? error.message : "Unknown error",
      );
      throw error;
    }
  }

  /**
   * Health check for AI service
   * @returns Promise<{ status: string }>
   */
  async healthCheck(): Promise<{ status: string }> {
    try {
      const response = await this.instance.get<{ status: string }>("/health");
      return response.data;
    } catch (error) {
      console.error("Error checking AI service health:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const chatService = new ChatService();
export default chatService;
