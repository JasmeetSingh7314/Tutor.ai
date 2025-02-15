import os
import instructor
from typing import List, Set
from pydantic import BaseModel,Field, ValidationError
from openai import OpenAI


## LESSON CLASSES
class Card(BaseModel):
    word: str = Field(..., min_length=1, description="Target vocabulary word")
    reading: str = Field(..., description="Pronunciation or reading of the word (e.g., Hiragana for Japanese, Pinyin for Chinese)")
    sentence: str = Field(..., min_length=5, description="Example sentence using the word")
    translation: str = Field(..., min_length=5, description="English translation")

class VocabularyCards(BaseModel):
    examples: List[Card]


## DE-DUPLICATION_LOGIC
def deduplicate_cards(cards: List[Card]) -> List[Card]:
    seen_words: Set[str] = set()
    unique_cards: List[Card] = []

    for card in cards:
        if card.word not in seen_words:
            seen_words.add(card.word)
            unique_cards.append(card)

    return unique_cards

# # Explicit prompt with formatting rules
def generate_card_prompt(lang:str,level:str)->str:
    return f"""You are a {lang} vocabulary teacher. Generate 5 vocabulary cards for {level}-level learners.
    - Return STRICTLY in JSON format
    - Use the appropriate script for the word in sentences (e.g., Kanji for Japanese, Hanzi for Chinese, etc.)
    - Sentences must use the word naturally
    - Never use placeholders like "..."
    - Ensure NO REPEATED WORDS OR SENTENCES
    - Do NOT include Markdown code blocks (e.g., ```json) or any other formatting.
    - Example:
    {{
    "examples": [
        {{
        "word": "確認",
        "reading": "かくにん",
        "sentence": "明日の会議の時間を確認してください。",
        "translation": "Please confirm the time for tomorrow's meeting."
        }}
    ]
    }}"""


def create_language_lesson(lang:str,level:str):   
    client=instructor.patch(
        OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=os.getenv("OPEN_ROUTER_KEY")
        ),
        mode=instructor.Mode.JSON
    )
    card_prompt=generate_card_prompt(lang,level)
    completion = client.beta.chat.completions.parse(
        model="deepseek/deepseek-chat:free",
        response_format=VocabularyCards,
        messages=[
            {"role": "system", "content": card_prompt},
            {"role": "user", "content": f"I want to learn {lang} and I want to work on my vocab skills. I am currently at {level} level."}
        ],
        temperature=0.1,
        max_tokens=1000,
    )

    cards = completion.choices[0].message.parsed.examples
    unique_cards = deduplicate_cards(cards)
    for i in unique_cards:
        print(i.word)
        print(i.reading)
        print(i.sentence)
        print(i.translation)
        print("*******************************************************")
       # Generate quiz
    unique_cards_str = "\n".join(
        f"Word: {card.word}\nReading: {card.reading}\nSentence: {card.sentence}\nTranslation: {card.translation}\n"
        for card in unique_cards
    )
    return unique_cards_str
