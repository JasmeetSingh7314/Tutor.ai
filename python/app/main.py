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
    try:
        # Fetch user data
        user_response = await get_user(request.user_id)
        known_words = user_response['data']['knownWords']
        target_language = user_response['data']['targetLanguage']
        prior_experience = user_response['data']['priorExperience']
        
        
        print(known_words,target_language,prior_experience,user_id)
        # Create lesson
        lesson_response = create_language_lesson(target_language, prior_experience, " ".join(known_words))

        # Prepare final JSON
        final_json = {
            "createdBy": request.user_id,
            "lesson": lesson_response,
            "quiz": {}
        }

        # Hit the Node.js backend endpoint
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{NODE_BACKEND_URL}/create-material",
                json=final_json
            )
            response.raise_for_status()
            logger.info("Material created successfully.")

        return {"message": "Lesson created successfully", "data": final_json}
 
    



    except Exception as e:
        logger.error(f"Unexpected error in create_lesson: {e}")
        raise HTTPException(status_code=500, detail=str(e))

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

            response = await client.get(f"http://localhost:3000/api/material/get-material/67b89d892178a8e71885c07f?fieldName=lesson")
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
async def get_user(user_id):
    """
    Fetch lesson data from the Node.js backend by hitting its endpoint.
    """
    try:
        print(user_id)
        # Hit the Node.js backend endpoint
        async with httpx.AsyncClient() as client:

            response = await client.get(f"http://localhost:3000/api/users/get-user/{user_id}")
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

