from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
from datetime import datetime, timedelta
import os
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import pickle
from dotenv import load_dotenv

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = '1234656u43243456234'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

load_dotenv()
MONGO_URI = os.getenv('MONGO_URI')
jwt = JWTManager(app)
CORS(app)

# MongoDB connection
try:
    # Option 1: Use local MongoDB (recommended for development)
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    
    # Test the connection
    client.admin.command('ping')
    
    # Option 2: Use MongoDB Atlas (cloud) - uncomment the line below and comment the lines above
    # client = MongoClient('mongodb+srv://RecipeSharingApp:RecipeSharingApp@cluster0.nakwd.mongodb.net/ai_security_system?retryWrites=true&w=majority&appName=Cluster0')
    
    db = client['student_performance_db']
    users_collection = db['users']
    predictions_collection = db['predictions']
    print("✅ Connected to MongoDB successfully!")
    USE_MONGODB = True
except Exception as e:
    print(f"⚠️  Failed to connect to MongoDB: {e}")
    print("🔄 Running in fallback mode (in-memory storage)")
    print("   Note: Data will not persist between server restarts")
    users_collection = None
    predictions_collection = None
    USE_MONGODB = False
    
    # In-memory storage for fallback mode
    in_memory_users = {}
    in_memory_predictions = []

# Train and save model on startup
def train_model():
    """Train the model if it doesn't exist"""
    model_path = 'student_model.pkl'
    encoders_path = 'label_encoders.pkl'
    
    if not os.path.exists(model_path):
        print("Training new model...")
        
        # Create synthetic data for demo (replace with actual StudentsPerformance.csv)
        np.random.seed(42)
        n = 1000
        
        data = pd.read_csv('StudentsPerformance.csv')
        
        df = pd.DataFrame(data)
        df['avg_score'] = (df['math score'] + df['reading score'] + df['writing score']) / 3
        df['performance'] = pd.qcut(df['avg_score'], q=3, labels=['Low', 'Medium', 'High'])
        
        # Label encoding
        label_encoders = {}
        categorical_columns = ['gender', 'race/ethnicity', 'parental level of education', 
                             'lunch', 'test preparation course']
        
        for col in categorical_columns:
            le = LabelEncoder()
            df[col + '_encoded'] = le.fit_transform(df[col])
            label_encoders[col] = le
        
        # Prepare features
        feature_columns = [col + '_encoded' for col in categorical_columns] + ['math score', 'reading score', 'writing score']
        X = df[feature_columns]
        y = df['performance']
        
        # Train model
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X, y)
        
        # Save model and encoders
        joblib.dump(model, model_path)
        joblib.dump(label_encoders, encoders_path)
        
        print("Model trained and saved successfully!")
        return model, label_encoders
    else:
        print("Loading existing model...")
        model = joblib.load(model_path)
        label_encoders = joblib.load(encoders_path)
        return model, label_encoders

# Load model
model, label_encoders = train_model()

@app.route('/api', methods=['GET'])
def api():
    return jsonify({'message': 'Student Performance Prediction API is running'}), 200
# Authentication routes
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not username or not email or not password:
            return jsonify({'error': 'Missing required fields'}), 400
        
        if USE_MONGODB:
            # Check if user already exists in MongoDB
            if users_collection.find_one({'$or': [{'username': username}, {'email': email}]}):
                return jsonify({'error': 'User already exists'}), 400
        else:
            # Check if user already exists in memory
            if username in in_memory_users or any(user['email'] == email for user in in_memory_users.values()):
                return jsonify({'error': 'User already exists'}), 400
        
        # Create new user
        hashed_password = generate_password_hash(password)
        user_data = {
            'username': username,
            'email': email,
            'password_hash': hashed_password,
            'created_at': datetime.utcnow()
        }
        
        if USE_MONGODB:
            result = users_collection.insert_one(user_data)
            user_id = str(result.inserted_id)
        else:
            # Store in memory with generated ID
            import uuid
            user_id = str(uuid.uuid4())
            user_data['_id'] = user_id
            in_memory_users[username] = user_data
        
        return jsonify({
            'message': 'User registered successfully',
            'user_id': user_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Missing username or password'}), 400
        
        # Find user
        if USE_MONGODB:
            user = users_collection.find_one({'username': username})
        else:
            user = in_memory_users.get(username)
        
        if user and check_password_hash(user['password_hash'], password):
            access_token = create_access_token(identity=str(user['_id']))
            return jsonify({
                'access_token': access_token,
                'user': {
                    'id': str(user['_id']),
                    'username': user['username'],
                    'email': user['email']
                }
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Prediction routes
@app.route('/api/predict', methods=['POST'])
@jwt_required()
def predict():
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        
        # Extract features
        features = {
            'gender': data.get('gender'),
            'race/ethnicity': data.get('race_ethnicity'),
            'parental level of education': data.get('parental_education'),
            'lunch': data.get('lunch'),
            'test preparation course': data.get('test_preparation'),
            'math score': int(data.get('math_score')),
            'reading score': int(data.get('reading_score')),
            'writing score': int(data.get('writing_score'))
        }
        
        # Encode categorical features
        encoded_features = []
        categorical_columns = ['gender', 'race/ethnicity', 'parental level of education', 
                            'lunch', 'test preparation course']
        
        for col in categorical_columns:
            if col in label_encoders:
                try:
                    encoded_value = label_encoders[col].transform([features[col]])[0]
                    encoded_features.append(encoded_value)
                except ValueError:
                    # Handle unknown categories
                    encoded_features.append(0)
            else:
                encoded_features.append(0)
        
        # Add numeric features
        encoded_features.extend([
            features['math score'],
            features['reading score'],
            features['writing score']
        ])
        
        # Make prediction
        prediction = model.predict([encoded_features])[0]
        prediction_proba = model.predict_proba([encoded_features])[0]
        confidence = max(prediction_proba)
        
        # Save prediction to database
        prediction_data = {
            'user_id': user_id,
            'input_data': features,
            'prediction': prediction,
            'confidence': float(confidence),
            'timestamp': datetime.utcnow()
        }
        
        if USE_MONGODB:
            predictions_collection.insert_one(prediction_data)
        else:
            # Store in memory
            in_memory_predictions.append(prediction_data)
        
        return jsonify({
            'prediction': prediction,
            'confidence': float(confidence),
            'input_data': features
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/predictions', methods=['GET'])
@jwt_required()
def get_user_predictions():
    try:
        user_id = get_jwt_identity()
        
        if USE_MONGODB:
            predictions = list(predictions_collection.find(
                {'user_id': user_id},
                {'_id': 0, 'user_id': 0}
            ).sort('timestamp', -1))
        else:
            # Filter in-memory predictions for the user
            predictions = [pred for pred in in_memory_predictions if pred['user_id'] == user_id]
            # Sort by timestamp (newest first)
            predictions.sort(key=lambda x: x['timestamp'], reverse=True)
            # Remove user_id from response
            predictions = [{k: v for k, v in pred.items() if k != 'user_id'} for pred in predictions]
        
        # Convert datetime to string for JSON serialization
        for pred in predictions:
            if isinstance(pred['timestamp'], datetime):
                pred['timestamp'] = pred['timestamp'].isoformat()
        
        return jsonify({'predictions': predictions}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    try:
        user_id = get_jwt_identity()
        
        if USE_MONGODB:
            from bson import ObjectId
            user = users_collection.find_one({'_id': ObjectId(user_id)}, {'password_hash': 0})
            if user:
                user['_id'] = str(user['_id'])
                user['created_at'] = user['created_at'].isoformat()
        else:
            # Find user in memory
            user = None
            for stored_user in in_memory_users.values():
                if stored_user['_id'] == user_id:
                    user = stored_user.copy()
                    del user['password_hash']  # Don't return password hash
                    user['created_at'] = user['created_at'].isoformat()
                    break
        
        if user:
            return jsonify({'user': user}), 200
        else:
            return jsonify({'error': 'User not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stats', methods=['GET'])
@jwt_required()
def get_stats():
    try:
        user_id = get_jwt_identity()
        
        # Get user's prediction statistics
        if USE_MONGODB:
            user_predictions = list(predictions_collection.find({'user_id': user_id}))
        else:
            user_predictions = [pred for pred in in_memory_predictions if pred['user_id'] == user_id]
        
        if not user_predictions:
            return jsonify({
                'total_predictions': 0,
                'performance_distribution': {},
                'average_confidence': 0
            }), 200
        
        # Calculate statistics
        total_predictions = len(user_predictions)
        performance_counts = {}
        total_confidence = 0
        
        for pred in user_predictions:
            performance = pred['prediction']
            performance_counts[performance] = performance_counts.get(performance, 0) + 1
            total_confidence += pred['confidence']
        
        average_confidence = total_confidence / total_predictions if total_predictions > 0 else 0
        
        return jsonify({
            'total_predictions': total_predictions,
            'performance_distribution': performance_counts,
            'average_confidence': round(average_confidence, 2)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Profile management routes
@app.route('/api/user/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        username = data.get('username')
        email = data.get('email')
        
        if not username or not email:
            return jsonify({'error': 'Username and email are required'}), 400
        
        # Check if username or email already exists (excluding current user)
        if USE_MONGODB:
            from bson import ObjectId
            existing_user = users_collection.find_one({
                '_id': {'$ne': ObjectId(user_id)},
                '$or': [{'username': username}, {'email': email}]
            })
            
            if existing_user:
                return jsonify({'error': 'Username or email already exists'}), 400
            
            # Update user
            result = users_collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': {'username': username, 'email': email}}
            )
            
            if result.modified_count == 0:
                return jsonify({'error': 'User not found or no changes made'}), 404
                
        else:
            # Find and update user in memory
            user_found = False
            for stored_user in in_memory_users.values():
                if stored_user['_id'] == user_id:
                    # Check if username/email exists for other users
                    for other_user in in_memory_users.values():
                        if other_user['_id'] != user_id and (other_user['username'] == username or other_user['email'] == email):
                            return jsonify({'error': 'Username or email already exists'}), 400
                    
                    stored_user['username'] = username
                    stored_user['email'] = email
                    user_found = True
                    break
            
            if not user_found:
                return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'message': 'Profile updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/password', methods=['PUT'])
@jwt_required()
def change_password():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        current_password = data.get('currentPassword')
        new_password = data.get('newPassword')
        
        if not current_password or not new_password:
            return jsonify({'error': 'Current password and new password are required'}), 400
        
        if len(new_password) < 6:
            return jsonify({'error': 'New password must be at least 6 characters long'}), 400
        
        # Find user and verify current password
        if USE_MONGODB:
            from bson import ObjectId
            user = users_collection.find_one({'_id': ObjectId(user_id)})
        else:
            user = None
            for stored_user in in_memory_users.values():
                if stored_user['_id'] == user_id:
                    user = stored_user
                    break
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if not check_password_hash(user['password_hash'], current_password):
            return jsonify({'error': 'Current password is incorrect'}), 400
        
        # Update password
        new_password_hash = generate_password_hash(new_password)
        
        if USE_MONGODB:
            users_collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': {'password_hash': new_password_hash}}
            )
        else:
            user['password_hash'] = new_password_hash
        
        return jsonify({'message': 'Password changed successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/email', methods=['PUT'])
@jwt_required()
def change_email():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        new_email = data.get('newEmail')
        password = data.get('password')
        
        if not new_email or not password:
            return jsonify({'error': 'New email and password are required'}), 400
        
        # Find user and verify password
        if USE_MONGODB:
            from bson import ObjectId
            user = users_collection.find_one({'_id': ObjectId(user_id)})
        else:
            user = None
            for stored_user in in_memory_users.values():
                if stored_user['_id'] == user_id:
                    user = stored_user
                    break
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if not check_password_hash(user['password_hash'], password):
            return jsonify({'error': 'Password is incorrect'}), 400
        
        # Check if email already exists
        if USE_MONGODB:
            existing_user = users_collection.find_one({
                '_id': {'$ne': ObjectId(user_id)},
                'email': new_email
            })
        else:
            existing_user = None
            for stored_user in in_memory_users.values():
                if stored_user['_id'] != user_id and stored_user['email'] == new_email:
                    existing_user = stored_user
                    break
        
        if existing_user:
            return jsonify({'error': 'Email already exists'}), 400
        
        # Update email
        if USE_MONGODB:
            users_collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': {'email': new_email}}
            )
        else:
            user['email'] = new_email
        
        return jsonify({'message': 'Email updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/account', methods=['DELETE'])
@jwt_required()
def delete_account():
    try:
        user_id = get_jwt_identity()
        
        # Delete user and all associated data
        if USE_MONGODB:
            from bson import ObjectId
            # Delete user's predictions
            predictions_collection.delete_many({'user_id': user_id})
            # Delete user
            result = users_collection.delete_one({'_id': ObjectId(user_id)})
            
            if result.deleted_count == 0:
                return jsonify({'error': 'User not found'}), 404
        else:
            # Delete from memory
            user_found = False
            username_to_delete = None
            
            for username, stored_user in in_memory_users.items():
                if stored_user['_id'] == user_id:
                    username_to_delete = username
                    user_found = True
                    break
            
            if not user_found:
                return jsonify({'error': 'User not found'}), 404
            
            # Delete user
            del in_memory_users[username_to_delete]
            
            # Delete user's predictions
            in_memory_predictions[:] = [pred for pred in in_memory_predictions if pred['user_id'] != user_id]
        
        return jsonify({'message': 'Account deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)