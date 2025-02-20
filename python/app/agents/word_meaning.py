import logging
import os
import instructor
from openai import OpenAI
from pydantic import BaseModel, Field


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger=logging.getLogger(__name__)

class Meaning(BaseModel):
   word: str = Field(..., min_length=1, description="Target vocabulary word")
   reading: str = Field(..., description="Pronunciation or reading of the word (e.g., Hiragana for Japanese, Pinyin for Chinese)")
   meaning:str=Field(...,description='Meaning of that word or verb')

def generate_prompt(lang:str,word:str)->str:
      return f"""You are a {lang} vocabulary teacher. Generate a meaning card for the word: {word}.
    - Return STRICTLY in JSON format
    - Use the appropriate script for the word (e.g., Kanji for Japanese, Hanzi for Chinese, etc.)
    - Provide the pronunciation or reading of the word (e.g., Hiragana for Japanese, Pinyin for Chinese)
    - Include the meaning of the word or verb
    - Ensure the response matches the following format:
    {{
      
        "word": "<word>",
        "reading": "<reading>",
        "meaning": "<meaning>"
     
    }}
    - Do NOT include Markdown code blocks (e.g., ```json) or any other formatting.
    - Example:
    {{
     
        "word": "確認",
        "reading": "かくにん",
        "meaning": "confirmation"
    
    }}"""

def get_meaning(lang:str,word:str):
    """Function to create meaning card"""

    logger.info("Finding Meaning")

    client=instructor.patch(
        OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=os.getenv("OPEN_ROUTER_KEY")
        ),
        mode=instructor.Mode.JSON
    )

    card_prompt=generate_prompt(lang,word)
    completion = client.beta.chat.completions.parse(
        model="deepseek/deepseek-chat:free",
        response_format=Meaning,
        messages=[
            {"role": "system", "content": card_prompt},
            {"role": "user", "content": f"I want to know the meaning of this word:{word}"}
        ],
        temperature=0.1,
        max_tokens=1000,
        
    )
    logger.info("Deck generation completed")
    response = completion.choices[0].message.parsed
    print(response.model_dump())

    # print(cards.)
    # print(i.reading)
    # print(i.sentence)
    # print(i.translation)
    # print("*******************************************************")