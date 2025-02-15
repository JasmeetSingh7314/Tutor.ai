from agents.card_generation import create_language_lesson
from agents.quiz_generation import generate_quiz

###  GLOBAL SETTINGS
language="punjabi"
# known_lang='english'
# Type='Vocabulary'
level='Beginner'


### TESTING

get_string=create_language_lesson(language,level)

generate_quiz(language,level,get_string)


