
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

// New interfaces for adaptive learning
export interface UserLearningProfile {
  subjectInterests: Record<string, number>; // Subject -> interest level (0-10)
  complexityPreference: number; // 1-5 scale (1: simple, 5: advanced)
  learningStyle: "visual" | "verbal" | "interactive" | "analytical" | undefined; // Changed "undefined" to actual undefined
  recentTopics: string[]; // Last 5 topics discussed
  responseLength: "concise" | "detailed" | "balanced"; // Preferred response length
  lastInteractionTime?: Date;
}

export interface AdaptiveResponse {
  content: string;
  adaptationApplied: string[];
}
