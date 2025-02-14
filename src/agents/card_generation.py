import os
import instructor
from typing import List, Set
from pydantic import BaseModel,Field
from openai import OpenAI

client=instructor.patch(
     OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=os.getenv("OPEN_ROUTER_KEY")
    ),
    mode=instructor.Mode.JSON
)

class Exercise(BaseModel):
    word: str = Field(..., min_length=1, description="Target vocabulary word")
    reading: str = Field(..., pattern=r"^[\u3040-\u309Fー]+$", description="Furigana in hiragana")
    sentence: str = Field(..., min_length=5, description="Example sentence using the word")
    translation: str = Field(..., min_length=5, description="English translation")

class VocabularyCards(BaseModel):
    examples: List[Exercise]

# Explicit prompt with formatting rules
card_prompt = """You are a Japanese vocabulary teacher. Generate 15 vocabulary cards for N4-level learners.
- Return STRICTLY in JSON format
- Use ONLY hiragana for readings (e.g., かくにん)
- Use KANJI ONLY for the word in sentences
- Sentences must use the word naturally
- Never use placeholders like "..."
- Ensure NO REPEATED WORDS OR SENTENCES
- Example:
{
  "examples": [
    {
      "word": "確認",
      "reading": "かくにん",
      "sentence": "明日の会議の時間を確認してください。",
      "translation": "Please confirm the time for tomorrow's meeting."
    }
  ]
}"""
completion=client.beta.chat.completions.parse(
   model='deepseek/deepseek-chat:free',
   response_format=VocabularyCards,
    messages=[
        {
         'role':'system',
         'content':card_prompt
        },
        {
         'role':'user',
         'content':f'I want to learn Japanese and I want to work on my vocab skills.I am currently a N4'}
       
    ],
    temperature=0.1,      # Reduce randomness
    max_tokens=1000,      # Allocate enough tokens

)

def deduplicate_cards(cards: List[Exercise]) -> List[Exercise]:
    seen_words: Set[str] = set()
    unique_cards: List[Exercise] = []

    for card in cards:
        if card.word not in seen_words:
            seen_words.add(card.word)
            unique_cards.append(card)

    return unique_cards

cards=completion.choices[0].message.parsed.examples
unique_cards = deduplicate_cards(cards)


for i in unique_cards:
    print(i.word)
    print(i.reading)
    print(i.sentence)
    print(i.translation)
    print("*******************************************************")

### GENERATING PRACTICE EXERCISES
class Questions(BaseModel):
    ques:str=Field(..., min_length=5, description="Question used for practice of that word")
    ans:str=Field(...,min_length=2,description='Answer to the question i.e the word')
    options:List[str]=Field(...,min_length=4,description='Give 4 options to the fill in ques')

class Practice(BaseModel):
 quiz:List[Questions]


quiz_prompt=f"""
You are a Japanese vocabulary teacher. Generate 5 vocabulary fill in the blanks exercises for N4-level learners.
-Provide 4 options to confuse the user
- Return STRICTLY in JSON format
- Sentences must use the word naturally
- Never use placeholders like "..."
- Ensure NO REPEATED WORDS OR SENTENCES
 Create exercises from this array which contains the word. The array is given below:
   {unique_cards}
"""

exercises=client.beta.chat.completions.parse(
   model='deepseek/deepseek-chat:free',
   response_format=Practice,
    messages=[
        {
         'role':'system',
         'content':quiz_prompt
        },
        {
         'role':'user',
         'content':f'Test me on my knowledge'}
       
    ],
    temperature=0.1,      # Reduce randomness
    max_tokens=1000,      # Allocate enough tokens 
)
quiz=completion.choices[0].message.parsed.quiz
for i in quiz:
    print(i.ques)
    print(i.ans)
    print(i.options)
    print("*******************************************************")
#
# client=instructor.patch(
#      OpenAI(
#         base_url="http://localhost:11434/v1",
#         api_key="ollama"
#     ),
#     mode=instructor.Mode.JSON
# )
# language=input('Enter the language you want to learn:')
# known_lang=input('Enter the language you know:')
# Type=input('Enter the type of exercise (vocab/grammar):')

# language="japanese"
# known_lang='english'
# Type='Vocabulary'
# level='Beginner'

# class User_prompt(BaseModel):
#     name :str=Field(title='Student Name',description='This is the name of the student')
#     language:str=Field(...,description='Language that the user wants to study')
#     Type:str=Field(...,description='What the user wants to study could be vocabulary,speaking skills,etc.')
#     level:str=Field(title='Level',description='Level or proficiency in current language')
#     known_language:str=Field(...,description='The language the user already understands and learns in.')