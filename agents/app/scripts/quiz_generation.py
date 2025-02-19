import logging
import os
import instructor
from openai import OpenAI

from models.quiz_models import Quiz_Model

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger=logging.getLogger(__name__)

def generate_quiz_prompt(lang:str,level:str,unique_cards_str:str)->str:
    return f"""
    You are a {lang} vocabulary teacher. Generate 5 fill-in-the-blank exercises for {level}-level learners.
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
    - Do NOT include Markdown code blocks (e.g., ```json) or any other formatting.
    """

def generate_quiz(lang:str,level:str,unique_cards_str:str):
    logger.info("Generating quiz")

    quiz_client=instructor.patch(
        OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=os.getenv()
        ),
        mode=instructor.Mode.JSON
    )
    quiz_prompt=generate_quiz_prompt(lang,level,unique_cards_str)

    response=quiz_client.beta.chat.completions.parse(
        model="deepseek/deepseek-chat:free",
        response_format=Quiz_Model,  
        messages=[
            {"role": "system", "content": quiz_prompt},
            {"role": "user", "content": "Generate quiz questions for these words."}
        ],
        temperature=0.1,
        max_tokens=2000, 
    )

    raw_response=response.choices[0].message.parsed

    # Print the raw response to debug
    logger.info("Quiz generation complete.")
    # print("Raw response:",raw_response.model_dump())

    # for i in raw_response.quiz:
    #     print("Question: ",i.ques)
    #     for index, j in enumerate(i.options, start=1):
    #         print("OPTION:",{index})
    #         print(j.word)
    #         print( j.reading)
    #         print( j.sentence)
    #         print( j.translation)
    #         print("*******")
    #     print("The answer is: ",i.ans)
    
    return raw_response.model_dump()
    



    
     
