export interface WordDetails {
  word: string;
  reading: string;
  meaning: string;
  components: string[];
  component_meanings: string[];
  literal_meaning: string;
}

export interface PronunciationGuide {
  guide: string;
  tips: string;
}

export interface UsageExamples {
  examples: string[];
  dialogues: string[];
}

export interface FormalVsInformal {
  formal: string;
  informal: string;
}

export interface Variations {
  variations: string[];
}

export interface WritingGuide {
  guide: string;
  tips: string;
}

export interface CulturalNote {
  note: string;
}

export interface PracticeTips {
  tips: string;
}

export interface VocabWord {
  word_details: WordDetails;
  pronunciation_guide: PronunciationGuide;
  usage_examples: UsageExamples;
  formal_vs_informal: FormalVsInformal;
  variations: Variations;
  writing_guide: WritingGuide;
  cultural_note: CulturalNote;
  practice_tips: PracticeTips;
}

export interface VocabData {
  vocab: VocabWord[];
}

export type Proficiency = "beginner" | "intermediate" | "advanced" | "native";
export type PrimaryGoal =
  | "academic"
  | "career"
  | "personal"
  | "travel"
  | "other";
export type LearningStyle =
  | "visual"
  | "auditory"
  | "kinesthetic"
  | "reading_writing";

export type FormData = {
  fullName: string;
  email: string;
  nativeLanguage: string;
  targetLanguage: string;
  priorExperience: Proficiency;
  goals: string;
  primaryGoal: PrimaryGoal;
  preference: LearningStyle;
};
export interface Language {
  name: string;
  progress: number;
  wordsLearned: number;
  level: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  achieved: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  score?: number;
  dueDate?: string;
}

export interface UserProgress {
  totalXp: number;
  nextLevelXp: number;
  currentLevel: number;
  streak: number;
}
export interface QuizOption {
  word: string;
  reading: string;
  meaning: string;
}

export interface QuizQuestion {
  ques: string;
  simplified_ques: string;
  translation: string;
  ans: string;
  options: QuizOption[];
}

export interface QuizAnswer {
  questionIndex: number;
  selectedAnswer: string;
  isCorrect: boolean;
}
