import json
from fastapi import FastAPI, HTTPException
import logging
import httpx
from pydantic import BaseModel
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

class LessonRequest(BaseModel):
    lang: str
    level: str


# API Endpoints
@app.post("/create-lesson")
async def create_lesson(request: LessonRequest):
    """
    Create lesson: Sending lesson data through this proxy.
    """
    # Initialize lesson response
    lesson_response = create_language_lesson(request.lang,request.level)

    try:
        # Hit the Node.js backend endpoint
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{NODE_BACKEND_URL}/create-material",
                json=lesson_response  # Pass the object as JSON
            )
            response.raise_for_status()  # Raise an exception for HTTP errors
            logger.info("Material created successfully.")

    except httpx.HTTPStatusError as e:
        logger.error(f"HTTP error while creating material: {e}")
        raise HTTPException(status_code=e.response.status_code, detail="Error fetching lesson data")

    except Exception as e:
        logger.error(f"Unexpected error in create_lesson: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": "Lesson created successfully", "data": lesson_response}


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
    user="67b18930f627f99425bbc8e6"
    try:
        # Hit the Node.js backend endpoint
        async with httpx.AsyncClient() as client:

            response = await client.get(f"http://localhost:3000/api/material/get-material/67b18930f627f99425bbc8e6")
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
    uvicorn.run(app, host="0.0.0.0", port=8000)

# get_string=create_language_lesson(language,level)

# generate_quiz(language,level,get_string)

# get_meaning(language,"旅行")



