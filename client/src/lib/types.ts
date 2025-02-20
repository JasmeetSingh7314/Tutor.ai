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