from http.client import HTTPException
import json
import logging

from dotenv import load_dotenv
from prompts.intent_prompt import generate_intent_prompt
from prompts.lesson_prompt import generate_card_prompt
from prompts.chat_prompt import generate_system_prompt
from utils.common_functions import get_unique_cards
from src.action_handler import register_action
from src.types.card_models import VocabularyCards

logger = logging.getLogger("agent")

# Note: These action handlers are currently simple passthroughs to the openai_connection methods.


@register_action("generate-intent")
def generate_intent(agent,**kwargs):
    try:
        prompt=kwargs.get('prompt')
        intent_prompt=generate_intent_prompt(prompt)
        
        llm_call=agent.connection_manager.connections["openai"].generate_text(
            prompt=prompt,
            system_prompt=intent_prompt
        )
        # Extract the intent from the response
        print(llm_call)
        return llm_call
        
    except Exception as e:
        logger.error(f"Failed to generate intent: {str(e)}")
        return None

@register_action("chat")
def generate_chat(agent,**kwargs):
    try:
        prompt=kwargs.get('prompt')
        user=kwargs.get('user')
        conversation_history=kwargs.get('conversation_history')
        
        
        conversation_array=json.loads(conversation_history) 
        
        chat_prompt=generate_system_prompt(json.loads(user),conversation_array,agent._construct_system_prompt())
        
        
        llm_call=agent.connection_manager.connections["openai"].generate_text(
            prompt=prompt,
            system_prompt=chat_prompt
        )
        # Extract the intent from the response
        print(llm_call)
        return llm_call
        
    except Exception as e:
        logger.error(f"Failed to generate intent: {str(e)}")
        return None
        
        
    except Exception as e:
        logger.error(f"Failed to generate intent: {str(e)}")
        return None
    
@register_action("generate-lesson")
def generate_lesson(agent, **kwargs) -> str:
    """Generate Lessons"""
    """Function to create the language lesson"""
    try:
        logger.info("Generating Lesson")
        
        language=kwargs.get("language")
        level=kwargs.get('level')
        known_words=kwargs.get('knownWords')
        
        print("language is:",language,level,known_words)
        
        user_prompt= f"I want to learn {language} and I want to work on my vocab skills. I am currently at {level} level. Teach me other things i already know {known_words}"
        
        card_prompt=generate_card_prompt(language,level,known_words)
        
        llm_call=agent.connection_manager.connections["openai"].generate_parsed_text(
            prompt=user_prompt,
            system_prompt=card_prompt,
            format=VocabularyCards
            
        )
         
        logger.info("Deck generation completed")
        
        unique_cards = get_unique_cards(llm_call.model_dump())

        return unique_cards
    
    except Exception as e:
        logger.error(f"Unexpected error in create_lesson: {e}")
        raise HTTPException(status_code=500, detail=str(e))

        
@register_action("generate-quiz")
def generate_quiz(agent, **kwargs):
        try:
            load_dotenv()
            # agent.connection_manager.connections["openai"].generate_text(
            # prompt=
            # )
            
            try: 
                # If we get here, the model exists
                return True
            except Exception:
                return False
        except Exception as e:
            logger.error(f"Failed to generate quiz: {str(e)}")
            return None