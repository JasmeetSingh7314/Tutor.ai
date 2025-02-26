import logging
import os
from dotenv import load_dotenv
import instructor
from openai import OpenAI
from models.card_models import VocabularyCards
from utils.common_functions import deduplicate_cards

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger=logging.getLogger(__name__)

# # Explicit prompt with formatting rules
def generate_card_prompt(lang: str, level: str,knownwords:str) -> str:
    return f"""You are a {lang} vocabulary teacher. Generate 2 vocabulary cards for {level}-level learners. 
    -MAKE SURE TO NOT REPEAT THESE WORDS:{knownwords} 
    - Return STRICTLY in JSON format.  
    - Use the appropriate script for the word in sentences (e.g., Kanji for Japanese, Hanzi for Chinese, etc.).  
    - Sentences must use the word naturally.  
    - Never use placeholders like "...".  
    - Ensure NO REPEATED WORDS OR SENTENCES.  
    - Do NOT include Markdown code blocks (e.g., ```json) or any other formatting.  
    - Follow the structure of the `VocabularyCards` class provided below:  

    {{
        "vocab": [
            {{
                "word_details": {{
                    "word": "aprender",
                    "reading": "a-pren-der",
                    "meaning": "to learn",
                    "components": ["a", "prender"],
                    "component_meanings": ["to", "grasp or seize"],
                    "literal_meaning": "to grasp knowledge"
                }},
                "pronunciation_guide": {{
                    "guide": "1. Break it into syllables: 'a' (ah), 'pren' (pren), 'der' (der). 2. Stress the second syllable 'pren'.",
                    "tips": "Practice rolling the 'r' sound in 'pren' and 'der' for better pronunciation."
                }},
                "usage_examples": {{
                    "examples": ["Voy a aprender español este año.", "Ella quiere aprender a cocinar."],
                    "dialogues": ["A: ¿Qué quieres aprender? B: Quiero aprender a tocar la guitarra."]
                }},
                "formal_vs_informal": {{
                    "formal": "aprender (used in all contexts, formal and informal)",
                    "informal": "aprenderse (less common, used colloquially in some regions)"
                }},
                "variations": {{
                    "variations": ["aprendizaje", "aprendido", "aprendiz"]
                }},
                "writing_guide": {{
                    "guide": "1. Write 'a' (a single letter). 2. Write 'prender' (p-r-e-n-d-e-r).",
                    "tips": "Remember that 'aprender' has two 'r's, and the second one is rolled."
                }},
                "cultural_note": {{
                    "note": "In Spanish-speaking cultures, learning is highly valued, and education is often seen as a path to personal and professional growth."
                }},
                "practice_tips": {{
                    "tips": "Use flashcards to memorize the verb conjugations and practice using it in sentences daily."
                }}
            }}
        ]
    }}"""

def create_language_lesson(lang:str,level:str,knownwords):  
    """Function to create the language lesson"""

    logger.info("Generating Lesson")
    
    open_router_key=os.getenv('OPEN_ROUTER_KEY')

    client=instructor.patch(
        OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=open_router_key
        ),
        mode=instructor.Mode.JSON
    )
    card_prompt=generate_card_prompt(lang,level,knownwords)
    completion = client.beta.chat.completions.parse(
        model="deepseek/deepseek-chat:free",
        response_format=VocabularyCards,
        messages=[
            {"role": "system", "content": card_prompt},
            {"role": "user", "content": f"I want to learn {lang} and I want to work on my vocab skills. I am currently at {level} level. Teach me other things i already know {knownwords}"}
        ],
        temperature=0.1,
        max_tokens=3000
        
    )
    logger.info("Deck generation completed")
    cards = completion.choices[0].message.parsed
    # print(cards.model_dump())



    unique_cards = get_unique_cards(cards.model_dump())


    return unique_cards

def get_unique_cards(json_data):
    """
    Takes JSON data and returns an array of unique cards based on the 'word' field.
    """
    unique_cards = []
    seen_words = set()  # Track words we've already seen

    # Iterate through each card in the JSON data
    for card in json_data:
        word = card['word_details']['word']
        
        # If the word hasn't been seen, add the card to the unique list
        if word not in seen_words:
            unique_cards.append(card)
            seen_words.add(word)  # Mark the word as seen

    return {"vocab":unique_cards}