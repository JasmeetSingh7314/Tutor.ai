import logging
import os
from typing import Dict, Any
from dotenv import load_dotenv, set_key
import instructor
from openai import OpenAI
from src.connections.base_connection import BaseConnection, Action, ActionParameter

logger = logging.getLogger("connections.openai_connection")

class OpenAIConnectionError(Exception):
    """Base exception for OpenAI connection errors"""
    pass

class OpenAIConfigurationError(OpenAIConnectionError):
    """Raised when there are configuration/credential issues"""
    pass

class OpenAIAPIError(OpenAIConnectionError):
    """Raised when OpenAI API requests fail"""
    pass

class OpenAIConnection(BaseConnection):
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self._client = None

    @property
    def is_llm_provider(self) -> bool:
        return True

    def validate_config(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Validate OpenAI configuration from JSON"""
        required_fields = ["model"]
        missing_fields = [field for field in required_fields if field not in config]
        
        if missing_fields:
            raise ValueError(f"Missing required configuration fields: {', '.join(missing_fields)}")
            
        # Validate model exists (will be checked in detail during configure)
        if not isinstance(config["model"], str):
            raise ValueError("model must be a string")
            
        return config

    def register_actions(self) -> None:
        """Register available OpenAI actions"""
        self.actions = {
            "generate-text": Action(
                name="generate-text",
                parameters=[
                    ActionParameter("prompt", True, str, "The input prompt for text generation"),
                    ActionParameter("Language", True, str, "The language the user wants to learn."),
                    
                ],
                description="Generate text using OpenAI models"
            ),
            "find-intent":Action(
                name="find-intent",
                parameters=[
                    ActionParameter("prompt", True, str, "The input prompt for intent analysis"),
                    
                ],
                description="Find out the intent behind the calls"              
            ),
            "check-model": Action(
                name="check-model",
                parameters=[
                    ActionParameter("model", True, str, "Model name to check availability")
                ],
                description="Check if a specific model is available"
            ),
            "list-models": Action(
                name="list-models",
                parameters=[],
                description="List all available OpenAI models"
            )
        }

    def _get_client(self) -> OpenAI:
        """Get or create OpenAI client"""
        if not self._client:
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise OpenAIConfigurationError("OpenAI API key not found in environment")
            self._client = OpenAI(api_key=api_key)
        return self._client

    def configure(self) -> bool:
        """Sets up OpenAI API authentication"""
        logger.info("\n🤖 OPENAI API SETUP")

        if self.is_configured():
            logger.info("\nOpenAI API is already configured.")
            response = input("Do you want to reconfigure? (y/n): ")
            if response.lower() != 'y':
                return True

        logger.info("\n📝 To get your OpenAI API credentials:")
        logger.info("1. Go to https://platform.openai.com/account/api-keys")
        logger.info("2. Create a new project or open an existing one.")
        logger.info("3. In your project settings, navigate to the API keys section and create a new API key")
        
        api_key=os.getenv('OPENAI_API_KEY')

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
        """Check if OpenAI API key is configured and valid"""
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

    def generate_text(self, prompt: str, Language: str,**kwargs) -> str:
        """Generate text using OpenAI models"""
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
            system_prompt=f"I'm your {Language} tutor. How can I help you today? We can practice conversations, learn new vocabulary, or review grammar concepts."
            print(prompt,system_prompt)
            # # Use configured model if none provided
            # if not model:
            #     model = self.config["model"]

            completion = client.chat.completions.create(
                model=self.config["model"],
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt},
                ],
                 
            )

            return completion.choices[0].message.content
            
        except Exception as e:
            raise OpenAIAPIError(f"Text generation failed: {e}")
    
    def find_intent(self,prompt: str,**kwargs):
        # Define the prompt
        system_prompt = f"""
            Classify the following user input into one of these intents:
            - lesson: The user wants to start or continue a lesson. Examples: "Start a lesson", "Teach me something new", "Continue my lesson".
            - quiz: The user wants to take a quiz. Examples: "Give me a quiz", "Test my knowledge", "I want to take a test".
            - word meanings: The user wants to learn the meaning of a word. Examples: "What does this word mean?", "Define this term", "Explain this word".
            - progress: The user wants to check their learning progress. Examples: "Show me my progress", "How am I doing?", "What's my current level?".
            - general: The input is unrelated to learning, nonsensical, or unclear. Examples: "Hello", "What's the weather?", "Tell me a joke".

            Rules:
            1. If the input clearly matches one of the intents (lesson, quiz, word meanings, progress), classify it accordingly.
            2. If the input is unrelated, nonsensical, or unclear, classify it as "general".
            3. Return only the intent (lesson, quiz, word meanings, progress, or general). Do not include any additional text.

            User Input: "{prompt}"
            """
        
        load_dotenv()
        api_key = os.getenv('OPENAI_API_KEY')
        client =instructor.patch(
                OpenAI(
                    base_url="https://openrouter.ai/api/v1",
                    api_key=api_key,
                ),
                mode=instructor.Mode.JSON
        )

        # Make the LLM call
        response = client.chat.completions.create(
              model=self.config["model"],
              messages=[
                   {"role": "system", "content": system_prompt},
              ],
                
        )

        # Extract the intent from the response
        intent = response.choices[0].message.content
        print(intent)
        return intent

    def check_model(self, model, **kwargs):
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
            raise OpenAIAPIError(e)

    def list_models(self, **kwargs) -> None:
        """List all available OpenAI models"""
        try:
            # client = self._get_client()
            load_dotenv()
            api_key = os.getenv('OPENAI_API_KEY')
            client =instructor.patch(
                OpenAI(
                    base_url="https://openrouter.ai/api/v1",
                    api_key=api_key,
                ),
                mode=instructor.Mode.JSON
            )
            response = client.models.list().data
            
            fine_tuned_models = [
                model for model in response 
                if model.owned_by in ["organization", "user", "organization-owner"]
            ]

            logger.info("\nGPT MODELS:")
            logger.info("1. gpt-3.5-turbo")
            logger.info("2. gpt-4")
            logger.info("3. gpt-4-turbo")
            logger.info("4. gpt-4o")
            logger.info("5. gpt-4o-mini")
            
            if fine_tuned_models:
                logger.info("\nFINE-TUNED MODELS:")
                for i, model in enumerate(fine_tuned_models):
                    logger.info(f"{i+1}. {model.id}")
                    
        except Exception as e:
            raise OpenAIAPIError(f"Listing models failed: {e}")
    
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
