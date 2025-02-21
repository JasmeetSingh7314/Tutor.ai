import json
from fastapi import FastAPI, HTTPException
import logging
import httpx
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from agents.card_generation import create_language_lesson
from agents.quiz_generation import generate_quiz
from agents.word_meaning import get_meaning
from models.api_models import GenerateQuizRequest, GetMeaningRequest, LanguageLessonRequest

## LESSON CLASSES
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger=logging.getLogger(__name__)

NODE_BACKEND_URL = "http://localhost:3000/api/material"

user_id="67b18930f627f99425bbc8e6"

# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Replace with your React app's URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

sampleData = {
    "vocab": [
        {
            "word_details": {
                "word": "努力",
                "reading": "どりょく",
                "meaning": "effort",
                "components": ["努", "力"],
                "component_meanings": ["to strive", "power or strength"],
                "literal_meaning": "striving with strength"
            },
            "pronunciation_guide": {
                "guide": "1. Break it into syllables: 'ど' (do), 'りょ' (ryo), 'く' (ku). 2. Stress the first syllable 'ど'.",
                "tips": "The 'りょ' sound is a combination of 'ri' and 'yo', so practice blending them smoothly."
            },
            "usage_examples": {
                "examples": [
                    "彼は毎日努力しています。",
                    "成功するためには努力が必要です。"
                ],
                "dialogues": [
                    "A: どうして日本語が上手になったの？ B: 毎日努力したからです。"
                ]
            },
            "formal_vs_informal": {
                "formal": "努力 (used in all contexts, formal and informal)",
                "informal": "がんばる (more casual, often used in everyday conversation)"
            },
            "variations": {
                "variations": ["努力家", "努力する", "努力不足"]
            },
            "writing_guide": {
                "guide": "1. Write '努' (left radical: 力, right radical: 奴). 2. Write '力' (a single character meaning power).",
                "tips": "Remember that '努' has a complex structure, so practice writing it slowly."
            },
            "cultural_note": {
                "note": "In Japanese culture, effort and perseverance are highly valued, and the concept of 'gambaru' (to persist) is deeply ingrained in daily life."
            },
            "practice_tips": {
                "tips": "Use the word in daily affirmations or journal entries to reinforce its meaning and usage."
            }
        },
        {
            "word_details": {
                "word": "経験",
                "reading": "けいけん",
                "meaning": "experience",
                "components": ["経", "験"],
                "component_meanings": ["to pass through", "to test or verify"],
                "literal_meaning": "passing through tests"
            },
            "pronunciation_guide": {
                "guide": "1. Break it into syllables: 'けい' (kei), 'けん' (ken). 2. Stress the first syllable 'けい'.",
                "tips": "The 'けい' sound is similar to 'kay', and 'けん' is like 'ken'."
            },
            "usage_examples": {
                "examples": [
                    "彼は多くの経験を持っています。",
                    "この仕事は貴重な経験になります。"
                ],
                "dialogues": [
                    "A: なぜその仕事を選んだの？ B: 新しい経験がしたかったからです。"
                ]
            },
            "formal_vs_informal": {
                "formal": "経験 (used in all contexts, formal and informal)",
                "informal": "体験 (more casual, often used for personal experiences)"
            },
            "variations": {
                "variations": ["経験者", "経験談", "経験不足"]
            },
            "writing_guide": {
                "guide": "1. Write '経' (left: 糸, right: 巠). 2. Write '験' (left: 馬, right: 僉).",
                "tips": "Both characters are complex, so practice writing them stroke by stroke."
            },
            "cultural_note": {
                "note": "In Japan, experience is often seen as a key factor in personal and professional growth, and sharing experiences is a common way to build connections."
            },
            "practice_tips": {
                "tips": "Reflect on your own experiences and write about them in Japanese to practice using the word naturally."
            }
        }
    ]
}



class LessonRequest(BaseModel):
    user_id:str

@app.options("/create-lesson")
async def preflight_handler():
    return {}


# API Endpoints
@app.post("/create-lesson")
async def create_lesson(request: LessonRequest):
    """
    Create lesson: Sending lesson data through this proxy.
    """
    # try:
    #     # Fetch user data
    #     user_response = await get_user()
    #     known_words = user_response['data']['knownWords']
    #     target_language = user_response['data']['targetLanguage']
    #     prior_experience = user_response['data']['priorExperience']
        
        
    #     print(known_words,target_language,prior_experience)
    #     # Create lesson
    #     lesson_response = create_language_lesson(target_language, prior_experience, " ".join(known_words))

    #     # Prepare final JSON
    #     final_json = {
    #         "createdBy": request.user_id,
    #         "lesson": lesson_response,
    #         "quiz": {}
    #     }

    #     # Hit the Node.js backend endpoint
    #     async with httpx.AsyncClient() as client:
    #         response = await client.post(
    #             f"{NODE_BACKEND_URL}/create-material",
    #             json=final_json
    #         )
    #         response.raise_for_status()
    #         logger.info("Material created successfully.")

    #     return {"message": "Lesson created successfully", "data": final_json}
 
    return sampleData



    # except Exception as e:
    #     logger.error(f"Unexpected error in create_lesson: {e}")
    #     raise HTTPException(status_code=500, detail=str(e))

@app.post("/create-quiz")
async def create_quiz(request:GenerateQuizRequest):
    """
    Fetch lesson data from the Node.js backend by hitting its endpoint.
    """
    lesson=get_lesson()
         
    quiz_data=generate_quiz(request.lang,request.level,json.dumps(lesson))
    
    try:
        # Hit the Node.js backend endpoint
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{NODE_BACKEND_URL}/create-material",
                json=quiz_data 
            )
            response.raise_for_status() 
            logger.info("Material created successfully.")

    except httpx.HTTPStatusError as e:
        logger.error(f"HTTP error while creating material: {e}")
        raise HTTPException(status_code=e.response.status_code, detail="Error fetching lesson data")

    except Exception as e:
        logger.error(f"Unexpected error in create_lesson: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": "Lesson created successfully", "data": quiz_data}
        
    
        
        
        

@app.get("/get-lesson")
async def get_lesson():
    """
    Fetch lesson data from the Node.js backend by hitting its endpoint.
    """
    user="67b8897d52639ae91ec00343"
    try:
        # Hit the Node.js backend endpoint
        async with httpx.AsyncClient() as client:

            response = await client.get(f"http://localhost:3000/api/material/get-material/67b8c16373ed219f81d758a8?fieldName=lesson")
            logger.info(f"Response from backend: {response.status_code}")

            response.raise_for_status()

            lesson_data = response.json()
            logger.info("Successfully fetched lesson data from the backend.")


            return lesson_data 

    except httpx.HTTPStatusError as e:
        # Handle HTTP errors (e.g., 4xx, 5xx)
        logger.error(f"HTTP error while fetching lesson data: {e}")
        raise HTTPException(status_code=e.response.status_code, detail="Error fetching lesson data from the backend")

    except Exception as e:
        # Handle unexpected errors
        logger.error(f"Unexpected error in get_lesson: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
    
    
@app.get("/get-user")
async def get_user():
    """
    Fetch lesson data from the Node.js backend by hitting its endpoint.
    """
    user="67b8897d52639ae91ec00343"
    try:
        # Hit the Node.js backend endpoint
        async with httpx.AsyncClient() as client:

            response = await client.get(f"http://localhost:3000/api/users/get-user/67b8c16373ed219f81d758a8")
            logger.info(f"Response from backend: {response.status_code}")

            response.raise_for_status()

            lesson_data = response.json()
            logger.info("Successfully fetched lesson data from the backend.")


            return lesson_data 

    except httpx.HTTPStatusError as e:
        # Handle HTTP errors (e.g., 4xx, 5xx)
        logger.error(f"HTTP error while fetching lesson data: {e}")
        raise HTTPException(status_code=e.response.status_code, detail="Error fetching lesson data from the backend")

    except Exception as e:
        # Handle unexpected errors
        logger.error(f"Unexpected error in get_lesson: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.post("/get-meaning")
async def get_meaning_api(request: GetMeaningRequest):
    try:
        meaning = get_meaning(request.lang, request.word)
        return meaning
    except Exception as e:
        logger.error(f"Error in get_meaning: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Run the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, port=8000)

# get_string=create_language_lesson(language,level)

# generate_quiz(language,level,get_string)

# get_meaning(language,"旅行")



# @app.post("/create-lesson")
# async def create_lesson(request: LessonRequest):
#     """
#     Create lesson: Sending lesson data through this proxy.
#     """
#     # Initialize lesson response
    
#     user_response=await get_user()
#     print(user_response['data']['knownWords'],user_response['data']['targetLanguage'],user_response['data']['priorExperience'])
#     print(request.user_id)
#     known_words=user_response['data']['knownWords']
    # lesson_response = create_language_lesson(user_response['data']['target_language'],user_response['data']['priorExperience']," ".join(known_words))
     
    # final_json={ 
    #             "createdBy":{request.user_id},
    #              "lesson":lesson_response,
    #               "quiz":{}
                    
    # }

    # try:
    #     # Hit the Node.js backend endpoint
    #     async with httpx.AsyncClient() as client:
    #         response = await client.post(
    #             f"{NODE_BACKEND_URL}/create-material",
    #             json=final_json # Pass the object as JSON
    #         )
    #         response.raise_for_status()  # Raise an exception for HTTP errors
    #         logger.info("Material created successfully.")

    # except Exception as e:
    #     logger.error(f"Unexpected error in create_lesson: {e}")
    #     raise HTTPException(status_code=500, detail=str(e))

    # return {"message": "Lesson created successfully", "data":{} }

