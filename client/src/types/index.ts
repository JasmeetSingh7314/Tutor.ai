export type Message = {
  id: string;
  text: string;
  sender: "ai" | "user";
  timestamp: Date;
};

export type Conversation = {
  id: string;
  title: string;
  timestamp: Date;
};
export interface User {
  _id: string;
  fullName: string;
  email: string;
  walletAddress: string;
  profileImage?: string; // Optional field with a default value
  preference?: string; // Optional field
  targetLanguage?: string; // Optional field
  priorExperience?: string; // Optional field
  nativeLanguage?: string; // Optional field
  knownWords: string[]; // Array of strings
  reviewWords: string[]; // Array of strings
  weaknesses: object[]; // Array of objects
  completedLessons: string[]; // Array of strings
  completedQuizzes: object[]; // Array of ObjectIds referencing "quiz"
  conversations: object[]; // Array of objects
}
