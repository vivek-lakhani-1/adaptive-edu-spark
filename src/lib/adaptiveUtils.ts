import { ChatMessage, UserLearningProfile, AdaptiveResponse } from "@/types";

// Subject detection keywords
const subjectKeywords: Record<string, string[]> = {
  math: ["math", "algebra", "calculus", "equation", "geometry", "statistics", "probability"],
  science: ["science", "physics", "chemistry", "biology", "scientific", "molecule", "atom"],
  history: ["history", "historical", "century", "ancient", "civilization", "war", "revolution"],
  literature: ["literature", "book", "novel", "author", "poem", "character", "shakespeare"],
  technology: ["technology", "computer", "programming", "code", "software", "hardware", "algorithm"]
};

// Learning style detection keywords
const learningStyleKeywords: Record<string, string[]> = {
  visual: ["see", "look", "view", "show", "image", "picture", "diagram", "visualize"],
  verbal: ["explain", "tell", "describe", "define", "summarize", "words", "text"],
  interactive: ["try", "practice", "example", "exercise", "interact", "activity", "hands-on"],
  analytical: ["why", "how", "analyze", "examine", "investigate", "reason", "logic"]
};

// Initialize a learning profile with default values
export function initializeLearningProfile(): UserLearningProfile {
  return {
    subjectInterests: {
      math: 5,
      science: 5,
      history: 5,
      literature: 5,
      technology: 5
    },
    complexityPreference: 3,
    learningStyle: undefined,
    recentTopics: [],
    responseLength: "balanced"
  };
}

// Analyze a user message for subject interests
export function analyzeSubjectInterests(
  message: string, 
  currentProfile: UserLearningProfile
): UserLearningProfile {
  const lowerMessage = message.toLowerCase();
  const newProfile = { ...currentProfile };
  let detected = false;
  
  // Check for subject keywords
  Object.entries(subjectKeywords).forEach(([subject, keywords]) => {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      // Increment interest in this subject (max 10)
      newProfile.subjectInterests[subject] = Math.min(
        (newProfile.subjectInterests[subject] || 5) + 1, 
        10
      );
      detected = true;
    }
  });
  
  // If topic detected, add to recent topics (keep only last 5)
  if (detected) {
    const detectedTopics = Object.entries(subjectKeywords)
      .filter(([_, keywords]) => keywords.some(keyword => lowerMessage.includes(keyword)))
      .map(([subject, _]) => subject);
    
    if (detectedTopics.length > 0) {
      newProfile.recentTopics = [
        ...detectedTopics, 
        ...newProfile.recentTopics
      ].slice(0, 5);
    }
  }
  
  return newProfile;
}

// Analyze learning style based on message
export function analyzeLearningStyle(
  message: string, 
  currentProfile: UserLearningProfile
): UserLearningProfile {
  const lowerMessage = message.toLowerCase();
  const newProfile = { ...currentProfile };
  
  // Count occurrences of each style's keywords
  const styleCounts: Record<string, number> = {
    visual: 0,
    verbal: 0,
    interactive: 0,
    analytical: 0
  };
  
  Object.entries(learningStyleKeywords).forEach(([style, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) {
        styleCounts[style]++;
      }
    });
  });
  
  // Find the dominant style if any
  const entries = Object.entries(styleCounts);
  const maxCount = Math.max(...entries.map(([_, count]) => count));
  
  if (maxCount > 0) {
    const dominantStyles = entries
      .filter(([_, count]) => count === maxCount)
      .map(([style, _]) => style as "visual" | "verbal" | "interactive" | "analytical");
    
    if (dominantStyles.length > 0) {
      // If there's a tie, keep the previous style if it's among the dominant ones
      if (dominantStyles.length > 1 && newProfile.learningStyle && dominantStyles.includes(newProfile.learningStyle)) {
        // Keep current style
      } else {
        newProfile.learningStyle = dominantStyles[0] as "visual" | "verbal" | "interactive" | "analytical";
      }
    }
  }
  
  return newProfile;
}

// Detect complexity preference
export function analyzeComplexityPreference(
  message: string, 
  currentProfile: UserLearningProfile
): UserLearningProfile {
  const lowerMessage = message.toLowerCase();
  const newProfile = { ...currentProfile };
  
  // Keywords suggesting complexity preference
  const simpleKeywords = ["simple", "basic", "beginner", "easy", "fundamental", "elementary"];
  const advancedKeywords = ["advanced", "complex", "detailed", "in-depth", "thorough", "comprehensive"];
  
  // Check for simple keywords
  if (simpleKeywords.some(keyword => lowerMessage.includes(keyword))) {
    newProfile.complexityPreference = Math.max(newProfile.complexityPreference - 1, 1);
  }
  
  // Check for advanced keywords
  if (advancedKeywords.some(keyword => lowerMessage.includes(keyword))) {
    newProfile.complexityPreference = Math.min(newProfile.complexityPreference + 1, 5);
  }
  
  return newProfile;
}

// Analyze response length preference
export function analyzeResponseLengthPreference(
  message: string, 
  currentProfile: UserLearningProfile
): UserLearningProfile {
  const lowerMessage = message.toLowerCase();
  const newProfile = { ...currentProfile };
  
  // Keywords indicating preference for response length
  if (lowerMessage.includes("brief") || 
      lowerMessage.includes("short") || 
      lowerMessage.includes("quick") ||
      lowerMessage.includes("summarize")) {
    newProfile.responseLength = "concise";
  } else if (lowerMessage.includes("detail") || 
             lowerMessage.includes("explain fully") || 
             lowerMessage.includes("elaborate") ||
             lowerMessage.includes("comprehensive")) {
    newProfile.responseLength = "detailed";
  }
  
  return newProfile;
}

// Adapt response based on learning profile
export function adaptResponse(
  response: string, 
  profile: UserLearningProfile
): AdaptiveResponse {
  let adaptedResponse = response;
  const adaptationsApplied: string[] = [];
  
  // Apply length adaptation
  if (profile.responseLength === "concise" && response.length > 500) {
    adaptedResponse = adaptedResponse.replace(/\n\n/g, '\n');
    // Summarize paragraphs, keep critical information
    adaptationsApplied.push("Concise response format");
  } else if (profile.responseLength === "detailed" && response.length < 1000) {
    // This would expand response in a real implementation
    adaptationsApplied.push("Detailed response format");
  }
  
  // Apply learning style adaptation - only if a learning style is defined
  if (profile.learningStyle === "visual") {
    adaptedResponse = adaptedResponse.replace(
      /(?:For example|For instance)([^.$]*)/gi,
      'For example, let\'s visualize this$1 Imagine a diagram where...'
    );
    adaptationsApplied.push("Visual learning style adaptations");
  } else if (profile.learningStyle === "interactive") {
    adaptedResponse = adaptedResponse + "\n\n## Practice This Concept\nTry working through this example problem to reinforce your understanding:";
    adaptationsApplied.push("Interactive exercises added");
  } else if (profile.learningStyle === "analytical") {
    adaptedResponse = adaptedResponse.replace(
      /(?:In summary|To summarize)([^.$]*)/gi,
      'Let\'s analyze why this is important$1 The underlying principles are...'
    );
    adaptationsApplied.push("Analytical perspective emphasized");
  }
  
  // Apply complexity adaptation
  if (profile.complexityPreference <= 2) {
    adaptedResponse = "## Simplified Explanation\n\n" + adaptedResponse;
    adaptationsApplied.push("Simplified complexity level");
  } else if (profile.complexityPreference >= 4) {
    adaptedResponse = adaptedResponse + "\n\n## Advanced Insights\nFor a deeper understanding, consider these additional concepts:";
    adaptationsApplied.push("Advanced complexity level");
  }
  
  return {
    content: adaptedResponse,
    adaptationApplied: adaptationsApplied
  };
}

// Update learning profile based on user message
export function updateLearningProfile(
  message: string,
  currentProfile: UserLearningProfile
): UserLearningProfile {
  let updatedProfile = { ...currentProfile };
  
  // Apply all analysis functions
  updatedProfile = analyzeSubjectInterests(message, updatedProfile);
  updatedProfile = analyzeLearningStyle(message, updatedProfile);
  updatedProfile = analyzeComplexityPreference(message, updatedProfile);
  updatedProfile = analyzeResponseLengthPreference(message, updatedProfile);
  
  // Update last interaction time
  updatedProfile.lastInteractionTime = new Date();
  
  return updatedProfile;
}
