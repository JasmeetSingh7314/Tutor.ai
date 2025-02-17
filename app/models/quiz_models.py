from typing import List
from pydantic import BaseModel, Field

class Questions(BaseModel):
    ques:str=Field( min_length=5, description="Question used for practice of that word")
    ans:str=Field(min_length=1,description='Answer to the question i.e the word')
    options:List[str]=Field(min_length=4,max_length=4,description='Give 4 options to the fill in ques')

class Quiz_Model(BaseModel):
 quiz:List[Questions]