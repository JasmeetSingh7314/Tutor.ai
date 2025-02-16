import os
import instructor
from typing import List, Set
from pydantic import BaseModel,Field, ValidationError
from openai import OpenAI

## QUIZ CLASSES
class Questions(BaseModel):
    ques:str=Field( min_length=5, description="Question used for practice of that word")
    ans:str=Field(min_length=2,description='Answer to the question i.e the word')
    options:List[str]=Field(min_length=4,max_length=4,description='Give 4 options to the fill in ques')

class Quiz_Model(BaseModel):
 quiz:List[Questions]

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
    quiz_client=instructor.patch(
        OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=os.getenv("OPEN_ROUTER_KEY_2")
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
        max_tokens=1000, 
    )

    raw_response=response.choices[0].message.parsed

    # Print the raw response to debug
    print("Raw response:",raw_response)
    for i in raw_response.quiz:
        print(i.ques)
        for index, j in enumerate(i.options, start=1):
            print(f"{index}. {j}")
        print(i.ans)
        print("*******************************************************")


    return raw_response
