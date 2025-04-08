
import { ChatMessage, ApiResponse } from "@/types";

// API configuration
const API_URL = import.meta.env.VITE_MISTRAL_API_URL || "https://api.mistral.ai/v1";

// Function to generate AI responses
export async function generateResponse(
  messages: ChatMessage[],
  apiKey?: string
): Promise<ApiResponse> {
  // For development without an API key
  if (!apiKey) {
    console.warn("No API key provided - using mock response");
    return mockResponse(messages);
  }

  try {
    const response = await fetch(`${API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: messages.map(m => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.content
        })),
        temperature: 0.7,
        max_tokens: 800
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "API request failed");
    }

    return {
      success: true,
      data: data.choices[0].message.content
    };
  } catch (error) {
    console.error("API error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

// Mock response for development without API key
function mockResponse(messages: ChatMessage[]): ApiResponse {
  const lastUserMessage = [...messages].reverse().find(m => m.sender === "user")?.content || "";
  
  // Simple logic to generate mock responses
  let response = "I don't have enough information to help with that yet.";
  
  if (lastUserMessage.toLowerCase().includes("math")) {
    response = "I'd be happy to help with math! Here's an example of a properly formatted equation: $E = mc^2$. For more complex equations, we can use display math: $$\\int_{a}^{b} f(x)dx$$";
  } else if (lastUserMessage.toLowerCase().includes("history")) {
    response = "History is fascinating! Which period or event would you like to learn more about?";
  } else if (lastUserMessage.toLowerCase().includes("science")) {
    response = "Science covers many fields! Are you interested in biology, chemistry, physics, astronomy, or something else?";
  } else if (lastUserMessage.toLowerCase().includes("hello") || lastUserMessage.toLowerCase().includes("hi")) {
    response = "Hello! I'm your adaptive AI tutor. What subject would you like to explore today?";
  }
  
  // Simulate API delay
  return {
    success: true,
    data: response
  };
}

// Function to save user preferences
export async function saveUserPreferences(userId: string, preferences: any): Promise<ApiResponse> {
  // In a real app, this would save to a database
  console.log("Saving preferences for user", userId, preferences);
  return {
    success: true
  };
}
