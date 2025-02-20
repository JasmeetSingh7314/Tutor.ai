from fastapi import FastAPI, HTTPException
import logging
import httpx
from pydantic import BaseModel
from agents.card_generation import create_language_lesson
from agents.quiz_generation import generate_quiz
from agents.word_meaning import get_meaning
from models.api_models import GetMeaningRequest, LanguageLessonRequest

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
    # Prepare material data
    material_data = {
        "created_By": user_id,  # Use user_id from the request
        "dailyLessons": [
            "Lesson 1: Introduction to Grammar",
            "Lesson 2: Basic Vocabulary"
        ],
        "regularLessons": [
            "Lesson 1: Advanced Grammar",
            "Lesson 2: Reading Comprehension"
        ],
        "quizScore": [
            "Quiz 1: 85%",
            "Quiz 2: 90%"
        ],
        "lesson": lesson_response
    }

    try:
        # Hit the Node.js backend endpoint
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{NODE_BACKEND_URL}/create-material",
                json=material_data  # Pass the object as JSON
            )
            response.raise_for_status()  # Raise an exception for HTTP errors
            logger.info("Material created successfully.")

    except httpx.HTTPStatusError as e:
        logger.error(f"HTTP error while creating material: {e}")
        raise HTTPException(status_code=e.response.status_code, detail="Error fetching lesson data")

    except Exception as e:
        logger.error(f"Unexpected error in create_lesson: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": "Lesson created successfully", "data": material_data}

@app.get("/get-lesson")
async def get_lesson():
    """
    Fetch lesson data from the Node.js backend by hitting its endpoint.
    """
    user="67b18930f627f99425bbc8e6"
    try:
        # Hit the Node.js backend endpoint
        async with httpx.AsyncClient() as client:
            # Make a GET request to the backend
            response = await client.get(f"http://localhost:3000/api/material/get-material/67b18930f627f99425bbc8e6")
            logger.info(f"Response from backend: {response.status_code}")

            # Raise an exception for HTTP errors (4xx, 5xx)
            response.raise_for_status()

            # Parse the JSON response
            lesson_data = response.json()
            logger.info("Successfully fetched lesson data from the backend.")

            # If you need to process the response further (e.g., generate a quiz), do it here
            # quiz_response = generate_quiz(lesson_data.get("lang"), lesson_data.get("level"), json.dumps(lesson_data.get("lesson")))

            return lesson_data  # Return the fetched lesson data

    except httpx.HTTPStatusError as e:
        # Handle HTTP errors (e.g., 4xx, 5xx)
        logger.error(f"HTTP error while fetching lesson data: {e}")
        raise HTTPException(status_code=e.response.status_code, detail="Error fetching lesson data from the backend")

    except Exception as e:
        # Handle unexpected errors
        logger.error(f"Unexpected error in get_lesson: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
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



