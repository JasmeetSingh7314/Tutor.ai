from typing import List
from pydantic import BaseModel, Field

# class Questions(BaseModel):
#     ques:str=Field( min_length=5, description="Question used for practice of that word")
#     ans:str=Field(min_length=1,description='Answer to the question i.e the word')
#     options:List[Meaning]=Field(min_length=4,max_length=4,description='Give 4 options to the fill in ques')

# class Quiz_Model(BaseModel):
#  quiz:List[Questions]

class Meaning(BaseModel):
    word: str = Field(..., min_length=1, description="Target vocabulary word")
    reading: str = Field(..., description="Pronunciation/reading (e.g., Hiragana for Japanese, Pinyin for Chinese)")
    meaning: str = Field(..., description="Meaning of the word")

class Questions(BaseModel):
    ques: str = Field(..., min_length=5, description="Original question sentence")
    simplified_ques:str=Field(...,description="Keep the sentence in Pronunciation/reading (e.g., Hiragana for Japanese, Pinyin for Chinese)")
    translation:str=Field(...,description="Translated sentence that the user can understand")
    ans: str = Field(..., min_length=1, description="Correct answer word")
    options: List[Meaning] = Field(..., min_length=4, max_length=4, description="4 multiple-choice options")
    category:str=Field(..., min_length=1, description="Category of the question")
    subcategory:str=Field(..., min_length=1, description="Subcategory of the question")

class Quiz_Model(BaseModel):
    quiz: List[Questions]