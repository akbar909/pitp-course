# Student Performance Prediction System

## Project Overview

Student Performance Prediction System is a concise full‑stack application that uses a trained machine learning model to predict a student's overall performance level (High / Medium / Low) from demographic and assessment-related inputs. The application pairs a Python Flask backend (model inference, API, and user data) with a React frontend (forms, dashboard, and visualizations) to provide quick predictions and per-user prediction history.

## Key Features

- Predicts student performance levels from inputs such as demographics, parental education, lunch type, test-preparation status, and exam scores.
- Returns both a categorical prediction and a confidence score.
- Stores and shows per-user prediction history and simple dashboard statistics.

## Tech Stack

- **Backend:** Python, Flask, Scikit-learn (Random Forest), Flask-CORS, PyJWT (or similar for auth), MongoDB (data & history)
- **Frontend:** React, Redux Toolkit, React Router, Tailwind CSS, Recharts (charts & visualizations)
- **Dev / Build:** Vite (frontend dev server), standard Python tooling for backend dependencies
