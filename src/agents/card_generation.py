import os
import re
import instructor
from typing import List, Set
from pydantic import BaseModel,Field, ValidationError
from openai import OpenAI

client=instructor.patch(
     OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=os.getenv("OPEN_ROUTER_KEY")
    ),
    mode=instructor.Mode.JSON
)

class Card(BaseModel):
    word: str = Field(..., min_length=1, description="Target vocabulary word")
    reading: str = Field(..., pattern=r"^[\u3040-\u309Fー]+$", description="Furigana in hiragana")
    sentence: str = Field(..., min_length=5, description="Example sentence using the word")
    translation: str = Field(..., min_length=5, description="English translation")

class VocabularyCards(BaseModel):
    examples: List[Card]

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

def deduplicate_cards(cards: List[Card]) -> List[Card]:
    seen_words: Set[str] = set()
    unique_cards: List[Card] = []

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
# Serialize Exercise objects into a readable string
unique_cards_str = "\n".join(
    f"Word: {card.word}\nReading: {card.reading}\nSentence: {card.sentence}\nTranslation: {card.translation}\n"
    for card in unique_cards
)

client2=instructor.patch(
     OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=os.getenv("OPEN_ROUTER_KEY_2")
    ),
    mode=instructor.Mode.JSON
)
class Questions(BaseModel):
    ques:str=Field( min_length=5, description="Question used for practice of that word")
    ans:str=Field(min_length=2,description='Answer to the question i.e the word')
    options:List[str]=Field(min_length=4,max_length=4,description='Give 4 options to the fill in ques')

class Quiz_Model(BaseModel):
 question_list:List[Questions]


# Create quiz prompt
quiz_prompt = f"""
You are a Japanese vocabulary teacher. Generate 5 fill-in-the-blank exercises for N4-level learners.
- Use the following vocabulary words and sentences:
{unique_cards_str}
- Provide 4 options for each question, including the correct answer.
- Return STRICTLY in JSON format with the root key `quiz`.
- Example:
{{
  "quiz": [
    {{
      "ques": "母は毎晩_______を作ります。",
      "ans": "料理",
      "options": ["料理", "消す", "遅い", "電気"]
    }}
  ]
}}
- Never use placeholders like "...".
- Ensure NO REPEATED WORDS OR SENTENCES.
"""

# Generate quiz questions
response = client2.beta.chat.completions.parse(
    model="deepseek/deepseek-chat:free",
    response_format=Quiz_Model,  
    messages=[
        {"role": "system", "content": quiz_prompt},
        {"role": "user", "content": "Generate quiz questions for these words."}
    ],
    temperature=0.1,
    max_tokens=1000, 
)
# Extract JSON from markdown (if present)
def extract_json_from_markdown(response: str) -> str:
    match = re.search(r"```json\s*({.*?})\s*```", response, re.DOTALL)
    if match:
        return match.group(1)
    return response  # Fallback: return the raw response


raw_response = response.choices[0].message.parsed
json_response = extract_json_from_markdown(raw_response)


# Print the raw response to debug
print("Raw response:",json_response)

# # Parse and validate the response
# try:
#     exercises = Quiz_Model.model_validate_json(response.choices[0].message.content)
# except ValidationError as e:
#     print(f"Validation error: {e}")
# else:
#     # Print the result
#     for question in exercises.quiz:
#         print(f"Question: {question.ques}")
#         print(f"Options: {question.options}")
#         print(f"Answer: {question.ans}")
#         print("*******************************************************")
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