# Import necessary libraries
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import nltk
import re
import joblib
import os

# Ensure stopwords are downloaded
try:
    nltk.download('stopwords', quiet=True)
except Exception as e:
    print(f"Error downloading stopwords: {e}")

from nltk.corpus import stopwords

# Dataset generation function (same as previous artifact)
def generate_fraud_dataset(num_samples=1000):
    """
    Generate a synthetic dataset for fraud detection
    """
    import random
    
    # Lists of keywords and phrases
    legitimate_phrases = [
        "Grocery shopping at local store",
        "Fuel purchase at gas station",
        "Online purchase from reputable retailer",
        "Monthly utility bill payment",
        "Salary deposit",
        "Restaurant dinner",
        "Coffee shop purchase"
    ]
    
    fraud_phrases = [
        "Unusual transaction in foreign country",
        "Multiple high-value purchases in short time",
        "Suspicious online transfer",
        "Unexpected large withdrawal",
        "Transaction from unknown location",
        "Repeated small transactions",
        "High-risk merchant purchase"
    ]
    
    # Generate data
    data = {
        'text': [],
        'amount': [],
        'fraud_label': []
    }
    
    for _ in range(num_samples):
        if random.random() < 0.2:  # 20% fraud rate
            text = random.choice(fraud_phrases)
            fraud_label = 1
            amount = round(random.uniform(500, 5000), 2)
        else:
            text = random.choice(legitimate_phrases)
            fraud_label = 0
            amount = round(random.uniform(10, 500), 2)
        
        data['text'].append(text)
        data['amount'].append(amount)
        data['fraud_label'].append(fraud_label)
    
    # Create DataFrame
    df = pd.DataFrame(data)
    
    # Save to CSV
    df.to_csv('fraud_data.csv', index=False)
    print(f"Generated {num_samples} samples. Fraud rate: {df['fraud_label'].mean()*100:.2f}%")
    
    return df

# Text preprocessing function
def preprocess_text(text):
    # Convert to lowercase
    text = text.lower()
    
    # Remove special characters and digits
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    text = ' '.join([word for word in text.split() if word not in stop_words])
    
    return text

def train_fraud_detection_model(data_path):
    # Load data
    df = pd.read_csv(data_path)
    
    # Preprocess text
    df['processed_text'] = df['text'].apply(preprocess_text)
    
    # Vectorize text
    vectorizer = TfidfVectorizer(max_features=5000)
    X = vectorizer.fit_transform(df['processed_text'])
    y = df['fraud_label']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train model
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    
    # Evaluate
    y_pred = clf.predict(X_test)
    print("Classification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save model and vectorizer
    joblib.dump(clf, 'fraud_model.pkl')
    joblib.dump(vectorizer, 'vectorizer.pkl')
    
    return clf, vectorizer

def predict_fraud(text, model, vectorizer):
    """
    Predict fraud for a single text input
    """
    processed_text = preprocess_text(text)
    vectorized_text = vectorizer.transform([processed_text])
    prediction = model.predict(vectorized_text)
    probability = model.predict_proba(vectorized_text)
    
    return {
        'fraud_label': prediction[0],
        'fraud_probability': probability[0][1]
    }

def main():
    # Generate dataset if not exists
    if not os.path.exists('fraud_data.csv'):
        generate_fraud_dataset()
    
    # Train model
    model, vectorizer = train_fraud_detection_model('fraud_data.csv')
    
    # Example prediction
    test_texts = [
        "Unusual transaction in foreign country",
        "Grocery shopping at local store"
    ]
    
    print("\nFraud Prediction Examples:")
    for text in test_texts:
        result = predict_fraud(text, model, vectorizer)
        print(f"\nText: {text}")
        print(f"Fraud Label: {result['fraud_label']}")
        print(f"Fraud Probability: {result['fraud_probability']:.2%}")

if __name__ == "__main__":
    main()