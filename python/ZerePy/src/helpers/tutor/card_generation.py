import logging
import os
from dotenv import load_dotenv
import instructor
from openai import OpenAI
from types.card_models import VocabularyCards


load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger=logging.getLogger(__name__)

# # Explicit prompt with formatting rules


    

