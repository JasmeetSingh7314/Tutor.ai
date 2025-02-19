from fastapi import FastAPI, HTTPException, requests
import logging

from pydantic import BaseModel
from agents.card_generation import create_language_lesson
from agents.quiz_generation import generate_quiz
from agents.word_meaning import get_meaning

###  GLOBAL SETTINGS
language="Spanish"
# known_lang='english'
# Type='Vocabulary'
level='Advanced'


## LESSON CLASSES
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger=logging.getLogger(__name__)


# Pydantic models for request/response validation
class LanguageLessonRequest(BaseModel):
    lang: str
    level: str

class GenerateQuizRequest(BaseModel):
    lang: str
    level: str
    unique_cards_str: str

class GetMeaningRequest(BaseModel):
    lang: str
    word: str

# Initialize FastAPI app
app = FastAPI()

# API Endpoints
@app.post("/create-lesson")
async def create_lesson(request: LanguageLessonRequest):
    try:
        lesson_response = create_language_lesson(request.lang, request.level)
        # quiz_result = generate_quiz(request.lang, request.level, lesson_response[1])

        node_server_url = "http://localhost:3000/receive-lesson"  # Replace with your Node.js server URL
        
        headers = {"Content-Type": "application/json"}
        response = requests.post(node_server_url, json=lesson_response, headers=headers)

        # Check if the request was successful
        if response.status_code == 200:
            return {"message": "Lesson data sent successfully!", "data": lesson_response}
        else:
            raise HTTPException(status_code=response.status_code, detail="Failed to send data to Node.js server")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    except Exception as e:
        logger.error(f"Error in create_lesson: {e}")
        raise HTTPException(status_code=500, detail=str(e))


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
    uvicorn.run(app, host="0.0.0.0", port=8000)

# get_string=create_language_lesson(language,level)

# generate_quiz(language,level,get_string)

# get_meaning(language,"旅行")



