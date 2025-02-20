# from fastapi import HTTPException, logger
# import httpx


# async def fetch(url:str):
#     try:
#         # Hit the Node.js backend endpoint
#         async with httpx.AsyncClient() as client:

#             response = await client.get(url)
#             logger.info(f"Response from backend: {response.status_code}")

#             response.raise_for_status()

#             data = response.json()
#             logger.info("Successfully fetched lesson data from the backend.")


#             return data

#     except httpx.HTTPStatusError as e:
#         # Handle HTTP errors (e.g., 4xx, 5xx)
#         logger.error(f"HTTP error while fetching lesson data: {e}")
#         raise HTTPException(status_code=e.response.status_code, detail="Error fetching lesson data from the backend")

#     except Exception as e:
#         # Handle unexpected errors
#         logger.error(f"Unexpected error in get_lesson: {e}")
#         raise HTTPException(status_code=500, detail="Internal server error")