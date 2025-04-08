
export interface User {
  id?: string;
  name: string;
  email?: string;
  preferences?: UserPreferences;
  learningHistory?: LearningSession[];
}

export interface UserPreferences {
  subjects: string[];
  learningStyle?: "visual" | "auditory" | "reading" | "kinesthetic";
  difficultyLevel?: "beginner" | "intermediate" | "advanced";
}

export interface LearningSession {
  id: string;
  timestamp: string;
  subject: string;
  duration: number; // in minutes
  topics: string[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}
