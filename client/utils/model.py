import pymongo
import os
from dotenv import load_dotenv
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from pprint import pprint

# Load environment variables
load_dotenv()

# MongoDB connection
mongo_url = os.getenv('MONGO_URL')
client = pymongo.MongoClient(mongo_url)
db = client.tutor
collection = db.users

# Query the document
user_id = "12345"
quiz_id = "67890"


def make_data(user_id,quiz_id):
    document = collection.find_one({"user_id": user_id, "quiz_id": quiz_id})
    # Extract data from the document
    data = []
    for question in document['questions']:
        data.append({
            "user_id": document["user_id"],
            "question_text": question["question_text"],
            "correct_answer": question["correct_answer"],
            "user_answer": question["user_answer"],
            "is_correct": question["is_correct"],
            "category": question["category"],
            "subcategory": question["subcategory"]
        })

    # Create DataFrame
    df = pd.DataFrame(data)
    return df
    
def generate_embeddings(df):
    # Initialize SentenceTransformer model
    model = SentenceTransformer('all-MiniLM-L6-v2')

    # Generate embeddings
    df['question_embedding'] = df['question_text'].apply(lambda x: model.encode(x))
    df['user_answer_embedding'] = df['user_answer'].apply(lambda x: model.encode(x))
    df['correct_answer_embedding'] = df['correct_answer'].apply(lambda x: model.encode(x))
    return df
     
    
# Calculate cosine similarity
def get_similarity(user_embedding, correct_embedding):
    return cosine_similarity([user_embedding], [correct_embedding])[0][0]


def generate_weaknesses(df):
    df['similarity'] = df.apply(lambda row: get_similarity(row['user_answer_embedding'], row['correct_answer_embedding']), axis=1)

    # Classify mistakes based on similarity
    df['mistake_severity'] = pd.cut(df['similarity'], bins=[-1, 0.3, 0.6, 1], labels=['high', 'medium', 'low'])

    # Group by user_id, category, and subcategory
    weaknesses = df[df['is_correct'] == False].groupby(['user_id', 'question_text','category', 'subcategory']).size().reset_index(name='mistake_count')

    # Sort weaknesses by mistake_severity and mistake_count
    weaknesses['mistake_severity'] = weaknesses['subcategory'].map(
        df.drop_duplicates('subcategory').set_index('subcategory')['mistake_severity']
    )

    # Define the priority order for mistake_severity
    severity_order = {'high': 3, 'medium': 2, 'low': 1}
    weaknesses['severity_score'] = weaknesses['mistake_severity'].map(severity_order)

    # Sort by severity_score and mistake_count
    weaknesses = weaknesses.sort_values(by=['severity_score', 'mistake_count'], ascending=[True,True])

    return weaknesses

def get_weaknesses(user_id,quiz_id):
    data=make_data(user_id,quiz_id)
    
    embeddings=generate_embeddings(data)
    
    weaknesses=generate_weaknesses(embeddings)
    
    recommendations = []
    
    priority=[]
    for _, row in weaknesses.iterrows():
        # Create the recommendation object
        recommendation = {
            "recommendation": f"Practice {row['subcategory']} in {row['category']}",
            "question": row['question_text'],
            "severity": row['mistake_severity']
        }
        
        # Append to recommendations list
        recommendations.append(recommendation)
        
        # Append to priority list if severity is not 'low' or NaN
        if row['mistake_severity'] != 'low' and not pd.isna(row['mistake_severity']):
            priority.append(recommendation)
            
        pprint(priority)
    
    return priority
        

get_weaknesses(user_id,quiz_id)

    
    


# # Function to recommend lessons
# def recommend_lessons(user_id):
#     user_weaknesses = weaknesses[weaknesses['user_id'] == user_id]
#     recommendations = []
#     for _, row in user_weaknesses.iterrows():
#         recommendations.append(f"Practice {row['subcategory']} in {row['category']}")
#     return recommendations

# # Print recommendations
# print(recommend_lessons(user_id))

# # Function to prioritize recommendations
# def prioritize_recommendations(user_id, clf, X_user):
#     # Get recommendations
    
    
    
#     return prioritized_recommendations



# # Print prioritized recommendations
# print("Prioritized Recommendations for user", user_id)
# print(prioritize_recommendations(user_id, clf, X_user, encoder))


# # Split the data
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# # Initialize OneHotEncoder
# encoder = OneHotEncoder(handle_unknown='ignore', sparse_output=False)

# # Fit and transform the training data
# X_train_encoded = encoder.fit_transform(X_train[['mistake_severity', 'subcategory']])
# X_test_encoded = encoder.transform(X_test[['mistake_severity', 'subcategory']])

# # Combine encoded features with the rest of the data
# X_train_final = np.hstack((X_train[['user_id', 'similarity']].values, X_train_encoded))
# X_test_final = np.hstack((X_test[['user_id', 'similarity']].values, X_test_encoded))

# # Train a logistic regression model
# clf = LogisticRegression(max_iter=1000)  # Increase max_iter to ensure convergence
# clf.fit(X_train_final, y_train)

# # Evaluate the model
# y_pred = clf.predict(X_test_final)
# print(classification_report(y_test, y_pred))