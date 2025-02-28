from http.client import HTTPException
import logging
import os
from typing import Dict, Any
from dotenv import load_dotenv, set_key
import instructor
from openai import OpenAI
from prompts.lesson_prompt import generate_card_prompt
from src.types.card_models import VocabularyCards
from src.connections.base_connection import BaseConnection, Action, ActionParameter
from utils.common_functions import get_unique_cards

logger = logging.getLogger("connections.openai_connection")

class TutorConnectionError(Exception):
    """Base exception for OpenAI connection errors"""
    pass


class TutorAPIError(TutorConnectionError):
    """Raised when OpenAI API requests fail"""
    pass

class TutorConnection(BaseConnection):
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self._client = None

    @property
    def is_llm_provider(self) -> bool:
        return False

    def validate_config(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Validate Tutor configuration from JSON"""
        required_fields = ["model"]
        missing_fields = [field for field in required_fields if field not in config]
        
        if missing_fields:
            raise ValueError(f"Missing required configuration fields: {', '.join(missing_fields)}")
            
        # Validate model exists (will be checked in detail during configure)
        if not isinstance(config["model"], str):
            raise ValueError("model must be a string")
            
        return config

    def register_actions(self) -> None:
        """Register available Tutor actions"""
        self.actions = {
            "generate-lesson": Action(
                name="generate-lesson",
                parameters=[
                    ActionParameter("Language",True, str, "The language in which the lesson must be generated."),
                    ActionParameter("Level", True, str, "The level of the lesson(Beginner | Intermediate | Advanced)"),
                    ActionParameter("KnownWords",True, str, "The words the user already claims to know."),
                    
                ],
                description="Generate Lessons using Tutor"
            ),
            "generate-quiz": Action(
                name="genearate-quiz",
                parameters=[
                    ActionParameter("lesson", True, str, "Lesson that will be used for quiz generation.")
                ],
                description="Generate a quiz for the user"
            ),
        }

    def _get_client(self) -> OpenAI:
        """Get or create OpenAI client"""
        if not self._client:
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise TutorConnectionError("OpenAI API key not found in environment")
            self._client = OpenAI(api_key=api_key)
        return self._client

    def configure(self) -> bool:
        """Sets up Tutor authentication"""
        logger.info("\n🤖 TUTOR SETUP")

        if self.is_configured():
            logger.info("\nTUTOR is already configured.")
            response = input("Do you want to reconfigure? (y/n): ")
            if response.lower() != 'y':
                return True

        logger.info("\n📝 To get your  API credentials:")

        
        api_key ="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"

        try:
            if not os.path.exists('.env'):
                with open('.env', 'w') as f:
                    f.write('')

            set_key('.env', 'OPENAI_API_KEY', api_key)
            
            # Validate the API key by trying to list models
            
            client =instructor.patch(
                OpenAI(
                    base_url="https://openrouter.ai/api/v1",
                    api_key=api_key,
                ),
                mode=instructor.Mode.JSON
            )
            client.models.list()

            logger.info("\n✅ OpenAI API configuration successfully saved!")
            logger.info("Your API key has been stored in the .env file.")
            return True

        except Exception as e:
            logger.error(f"Configuration failed: {e}")
            return False

    def is_configured(self, verbose = False) -> bool:
        """Check if Tutor key is configured and valid"""
        try:
            load_dotenv()
            api_key = os.getenv('OPENAI_API_KEY')
            if not api_key:
                return False

            client =instructor.patch(
                OpenAI(
                    base_url="https://openrouter.ai/api/v1",
                    api_key=api_key,
                ),
                mode=instructor.Mode.JSON
            )
            client.models.list()
            return True
            
        except Exception as e:
            if verbose:
                logger.debug(f"Configuration check failed: {e}")
            return False

    def generate_lesson(self, Language:str,Level:str,KnownWords:list[str], **kwargs) -> str:
        """Generate Lessons"""
        """Function to create the language lesson"""

        logger.info("Generating Lesson")
        print("language is:",Language,Level,KnownWords)
        
        load_dotenv()
        api_key = os.getenv('OPENAI_API_KEY')

        try:
            client=instructor.patch(
            OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=api_key
            ),
            mode=instructor.Mode.JSON
           )
            card_prompt=generate_card_prompt(Language,Level,KnownWords)
            completion = client.beta.chat.completions.parse(
                model="deepseek/deepseek-chat:free",
                response_format=VocabularyCards,
                messages=[
                    {"role": "system", "content": card_prompt},
                    {"role": "user", "content": f"I want to learn {Language} and I want to work on my vocab skills. I am currently at {Level} level. Teach me other things i already know {KnownWords}"}
                ],
                temperature=0.1,
                max_tokens=3000
                
            )
            logger.info("Deck generation completed")
            cards = completion.choices[0].message.parsed
            # print(cards.model_dump())

            unique_cards = get_unique_cards(cards.model_dump())


            return unique_cards
        except Exception as e:
            logger.error(f"Unexpected error in create_lesson: {e}")
            raise HTTPException(status_code=500, detail=str(e))
        

    def generate_quiz(self, model, **kwargs):
        try:
            load_dotenv()
            api_key = os.getenv('OPENAI_API_KEY')
            client =instructor.patch(
                OpenAI(
                    base_url="https://openrouter.ai/api/v1",
                    api_key=api_key,
                ),
                mode=instructor.Mode.JSON
            )
            try:
                client.models.retrieve(model=model)
                # If we get here, the model exists
                return True
            except Exception:
                return False
        except Exception as e:
            raise TutorAPIError(e)
    
    def perform_action(self, action_name: str, kwargs) -> Any:
        """Execute a Twitter action with validation"""
        if action_name not in self.actions:
            raise KeyError(f"Unknown action: {action_name}")

        action = self.actions[action_name]
        errors = action.validate_params(kwargs)
        if errors:
            raise ValueError(f"Invalid parameters: {', '.join(errors)}")

        # Call the appropriate method based on action name
        method_name = action_name.replace('-', '_')
        method = getattr(self, method_name)
        return method(**kwargs)
