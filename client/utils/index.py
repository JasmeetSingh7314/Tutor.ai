import pymongo
import os
import requests
from sentence_transformers import SentenceTransformer

mongo_url=os.getenv('MONGO_URL')
client=pymongo.MongoClient(mongo_url)

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

db=client.sample_mflix

collection=db.movies

items=collection.find().limit(5)

# for item in items:
#     print(item)


def generateEmbeddings(text:str)->list[float]:
    return model.encode("freecode camp is great ig!")
    
for doc in collection.find({'plot':{'$exists':True}}).limit(50):
    # new field to the db
    doc['plot_embedding_fn']=generateEmbeddings(doc['plot'])
    collection.replace_one({'_id':doc['_id']},doc)



print(generateEmbeddings("Freecode camp is good lol!"))