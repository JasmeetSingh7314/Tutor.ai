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

def identify_weaknesses():
    return