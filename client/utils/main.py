import json
import os
from dotenv import load_dotenv
import chromadb
import instructor
from openai import OpenAI
from chromadb.utils import embedding_functions
from sentence_transformers import SentenceTransformer

#loading the environment variables
load_dotenv()

openrouter_key=os.getenv('OPEN_ROUTER_KEY')

# #Initiating Chroma-client
# chroma_client=chromadb.PersistentClient(path=".chromadb")

# collection_name="docs_collection"

# Creating the collection
chroma_client = chromadb.PersistentClient()
collection_name = "user_data"
collection = chroma_client.create_collection(name=collection_name)

# Initialize the embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Sample data
weaknesses = ["grammar", "vocabulary"]
known_words = ["俯瞰", "模索", "醸成", "拮抗", "陶冶", "醸造", "模倣", "拮抗", "陶冶", "洞察", "革新", "継承", "顕著", "均衡", "模範", "深化", "変遷", "俯瞰", "模索"]

# Function to add weaknesses
def add_weaknesses(user_id, weaknesses):
    weakness_embeddings = model.encode(weaknesses)  # Encode all weaknesses
    for i, (weakness, embedding) in enumerate(zip(weaknesses, weakness_embeddings)):
        collection.add(
            ids=[f"weakness_{user_id}_{i}"],  # Unique ID for each weakness
            embeddings=[embedding.tolist()],  # Convert embedding to list
            metadatas=[{"user_id": user_id, "type": "weakness", "data": weakness}]  # Metadata
        )

# Function to add known words
def add_words(user_id, known_words):
    word_embeddings = model.encode(known_words)  # Encode all known words
    for i, (word, embedding) in enumerate(zip(known_words, word_embeddings)):
        collection.add(
            ids=[f"word_{user_id}_{i}"],  # Unique ID for each word
            embeddings=[embedding.tolist()],  # Convert embedding to list
            metadatas=[{"user_id": user_id, "type": "known_word", "data": word}]  # Metadata
        )

# Add data to the collection
user_id = 123
add_weaknesses(user_id, weaknesses)
add_words(user_id, known_words)

# Fetch and print all data from the collection
results = collection.get()
print("Data in the collection:", json.dumps(results))

client=instructor.patch(
        OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=openrouter_key
        ),
        mode=instructor.Mode.JSON
)

# response=client.chat.completions.create(
#     model="deepseek/deepseek-chat:free",
#     messages=[
#         {
#             'role':'system',
#             'content':"You are a helpful assistant."
#         },
#         {
#             'role':'user',
#             'content':'Who is Jin Sakai?'
#         }
#     ]
# )

# print(response.choices[0].message.content)