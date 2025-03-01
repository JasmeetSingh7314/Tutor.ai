from http.client import HTTPException
import logging

import httpx
from src import agent
from src.types.api_models import LessonRequest
from src.action_handler import register_action

logger = logging.getLogger("agent")

NODE_BACKEND_URL = "http://localhost:3000/api/material"

@register_action("generate-intent")
def generate_intent():
    return

@register_action("generate-lesson")
async def generate_lesson():
    """
    Create lesson: Sending lesson data through this proxy.
    """
    try:
        # Fetch user data
        # user_response = await get_user(request.address)
        # known_words = user_response['data']['knownWords']
        # target_language = user_response['data']['targetLanguage']
        # prior_experience = user_response['data']['priorExperience']
        
        Language='Korean'
        Level='Beginner'
        KnownWords=['']
        print(Language,Level,KnownWords)
        # Create lesson
        lesson_response=agent.connection_manager.connections["tutor"].generate_lesson(
            Language,
            Level,
            KnownWords
        )
        # Prepare final JSON
        final_json = {
            
            "lesson": lesson_response,
        }

        # # Hit the Node.js backend endpoint
        # async with httpx.AsyncClient() as client:
        #     response = await client.post(
        #         f"{NODE_BACKEND_URL}/create-material",
        #         json=final_json
        #     )
        #     response.raise_for_status()
        #     logger.info("Material created successfully.")

        return {"message": "Lesson created successfully", "data": final_json}
 
    except Exception as e:
        logger.error(f"Unexpected error in create_lesson: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
async def get_user(address):
    """
    Fetch user data from the Node.js backend by hitting its endpoint.
    """
    try:
        print(address)
        # Hit the Node.js backend endpoint
        async with httpx.AsyncClient() as client:

            response = await client.get(f"http://localhost:3000/api/users/get-user/{address}")
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