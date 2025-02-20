
from typing import List
from pydantic import BaseModel


class LanguageLessonRequest(BaseModel):
    user_id: str
    dailyLessons: List[str]
    regularLessons: List[str]
    quizScore: List[str]
    lesson:str

class GenerateQuizRequest(BaseModel):
    lang: str
    level: str
    unique_cards_str: str

class GetMeaningRequest(BaseModel):
    lang: str
    word: str
