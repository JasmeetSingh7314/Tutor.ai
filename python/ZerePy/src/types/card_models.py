from typing import List
from pydantic import BaseModel, Field

# class Card(BaseModel):
#     """Lesson-card: Card used to convey the meaning."""
#     word: str = Field(..., min_length=1, description="Target vocabulary word")
#     reading: str = Field(..., description="Pronunciation or reading of the word (e.g., Hiragana for Japanese, Pinyin for Chinese)")
#     sentence: str = Field(..., min_length=5, description="Example sentence using the word")
#     translation: str = Field(..., min_length=5, description="English translation")


class WordDetails(BaseModel):
    """Details about the word, including its meaning and pronunciation."""
    word: str = Field(..., description="Target vocabulary word")
    reading: str = Field(..., description="Pronunciation or reading of the word")
    meaning: str = Field(..., description="English meaning of the word")
    components: List[str] = Field(..., description="Breakdown of the word into its components")
    component_meanings: List[str] = Field(..., description="Meanings of each component")
    literal_meaning: str = Field(..., description="Literal meaning of the word or its components")

class PronunciationGuide(BaseModel):
    """Detailed pronunciation guide for the word."""
    guide: str = Field(..., description="Step-by-step pronunciation guide")
    tips: str = Field(..., description="Tips for mastering the pronunciation")

class UsageExamples(BaseModel):
    """Examples of how to use the word in sentences or dialogues."""
    examples: List[str] = Field(..., description="Example sentences using the word")
    dialogues: List[str] = Field(..., description="Example dialogues using the word")

class FormalVsInformal(BaseModel):
    """Explanation of formal and informal usage of the word."""
    formal: str = Field(..., description="Formal usage of the word")
    informal: str = Field(..., description="Informal usage of the word")

class Variations(BaseModel):
    """Variations or related forms of the word."""
    variations: List[str] = Field(..., description="List of variations or related forms")

class WritingGuide(BaseModel):
    """Guide on how to write the word."""
    guide: str = Field(..., description="Step-by-step writing guide")
    tips: str = Field(..., description="Tips for writing the word correctly")

class CulturalNote(BaseModel):
    """Cultural or historical context related to the word."""
    note: str = Field(..., description="Cultural or historical context")
class PracticeTips(BaseModel):
    """Tips for practicing the word."""
    tips: str = Field(..., description="Tips for practicing the word")

class Card(BaseModel):
    """Complete lesson response, including all details about the word."""
    word_details: WordDetails
    pronunciation_guide: PronunciationGuide
    usage_examples: UsageExamples
    formal_vs_informal: FormalVsInformal
    variations: Variations
    writing_guide: WritingGuide
    cultural_note: CulturalNote
    practice_tips: PracticeTips


class VocabularyCards(BaseModel):
    """A Deck of Vocab Cards"""
    vocab: List[Card]
