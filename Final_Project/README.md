# Student Performance Prediction System

A full-stack web application that predicts student performance using machine learning.

## Features

- **User Authentication**: Secure registration and login system
- **Performance Prediction**: ML-powered student performance prediction
- **Dashboard**: Interactive dashboard with charts and statistics
- **History Tracking**: View all past predictions
- **User Profile**: Manage account settings

## Tech Stack

### Backend
- Python Flask
- MongoDB
- JWT Authentication
- Scikit-learn for ML
- Flask-CORS for cross-origin requests

### Frontend
- React 19
- Redux Toolkit for state management
- Tailwind CSS for styling
- Recharts for data visualization
- React Router for navigation

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Make sure MongoDB is running on your system or update the connection string in `app.py`

5. Run the Flask application:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the react directory:
```bash
cd react
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

1. Register a new account or login with existing credentials
2. Navigate to the "New Prediction" page
3. Fill in the student information form
4. Click "Predict Performance" to get the prediction
5. View your prediction history on the Dashboard
6. Manage your profile in the Profile section

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login

### Predictions
- `POST /api/predict` - Make new prediction (requires auth)
- `GET /api/user/predictions` - Get user's predictions (requires auth)
- `GET /api/stats` - Get user statistics (requires auth)

### User
- `GET /api/user/profile` - Get user profile (requires auth)

## Model Information

The machine learning model uses a Random Forest Classifier trained on student performance data including:
- Gender
- Race/Ethnicity
- Parental level of education
- Lunch type (standard/free-reduced)
- Test preparation course completion
- Math, Reading, and Writing scores

The model predicts performance levels as High, Medium, or Low with confidence scores.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes.