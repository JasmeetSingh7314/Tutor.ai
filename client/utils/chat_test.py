import logging
import os

import instructor
from openai import OpenAI
from pprint import pprint
from dotenv import load_dotenv

load_dotenv()
## LESSON CLASSES
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger=logging.getLogger(__name__)

messages=[]
logger.info("Begin chatting!")


api_key=os.getenv('OPEN_ROUTER_KEY')
client =instructor.patch(
                OpenAI(
                    base_url="https://openrouter.ai/api/v1",
                    api_key=api_key,
                ),
                mode=instructor.Mode.JSON
)





message=input("Enter your message:")
    
completion=client.chat.completions.create(
model="deepseek/deepseek-chat:free",
messages=[
        {
            'role':'system',
            'content':f"You are a chill friend."
        },{
            "role":'user',
            'content':message
        }
    ]
)
print(completion.choices[0].message.content)

messages.append({
        "user":message,
        "system":completion.choices[0].message.content
        
})
    
pprint(messages)