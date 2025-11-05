
"""
Student Performance Prediction - Complete Python Project Script
Place 'StudentsPerformance.csv' in the same folder as this script to use the Kaggle dataset.
If not present, a small synthetic dataset will be generated so you can run the pipeline.
Outputs saved to current folder:
 - student_perf_model.pkl    (trained RandomForestClassifier)
 - scaler.pkl                (StandardScaler for numeric features)
 - encoder.pkl               (OneHotEncoder for categorical features)
 - student_performance_project_report.csv (sample predictions + test labels)
Usage:
    python student_performance_project.py

Dependencies:
    pandas, numpy, scikit-learn, matplotlib, joblib
Install with: pip install pandas numpy scikit-learn matplotlib joblib
"""

import os
import sys
import warnings
warnings.filterwarnings("ignore")

import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
import joblib
import matplotlib.pyplot as plt

DATAFILE = "StudentsPerformance.csv"

def load_or_create_dataset(path=DATAFILE):
    if os.path.exists(path):
        print(f"Loading dataset from {path} ...")
        df = pd.read_csv(path)
        print(f"Dataset loaded. Shape: {df.shape}")
        return df
    else:
        print(f"Dataset file '{path}' not found. Generating a synthetic small dataset for demo...")
        rng = np.random.RandomState(42)
        n = 500
        genders = rng.choice(['male','female'], size=n)
        parent_edu = rng.choice(["bachelor's degree","some college","master's degree","high school","associate's degree"], size=n)
        lunch = rng.choice(['standard','free/reduced'], size=n, p=[0.7,0.3])
        test_prep = rng.choice(['none','completed'], size=n, p=[0.6,0.4])
        math = np.clip((rng.normal(65,15,size=n) + (test_prep=='completed')*5 + (genders=='male')*2).round().astype(int), 0, 100)
        reading = np.clip((rng.normal(68,12,size=n) + (test_prep=='completed')*4 + (genders=='female')*3).round().astype(int), 0, 100)
        writing = np.clip((rng.normal(66,13,size=n) + (test_prep=='completed')*3 + (genders=='female')*2).round().astype(int), 0, 100)
        df = pd.DataFrame({
            'gender': genders,
            'parental level of education': parent_edu,
            'lunch': lunch,
            'test preparation course': test_prep,
            'math score': math,
            'reading score': reading,
            'writing score': writing
        })
        print(f"Synthetic dataset generated. Shape: {df.shape}")
        return df


def create_target(df):
    # Create a total and average score then map to performance categories
    df = df.copy()
    df['total_score'] = df[['math score','reading score','writing score']].sum(axis=1)
    df['avg_score'] = df['total_score'] / 3.0
    # Define thresholds: Low < 60, Medium 60-80, High > 80 (adjustable)
    bins = [0, 60, 80, 1000]
    labels = ['Low', 'Medium', 'High']
    df['performance_level'] = pd.cut(df['avg_score'], bins=bins, labels=labels, include_lowest=True)
    return df

def build_and_train(df, random_state=42):
    # Select features and target
    features = ['gender','parental level of education','lunch','test preparation course',
                'math score','reading score','writing score']
    target = 'performance_level'
    X = df[features]
    y = df[target].astype(str)
    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=random_state, stratify=y)
    # Preprocessing pipelines
    cat_features = ['gender','parental level of education','lunch','test preparation course']
    num_features = ['math score','reading score','writing score']
    cat_transformer = OneHotEncoder(handle_unknown='ignore', sparse=False)
    num_transformer = StandardScaler()
    preprocessor = ColumnTransformer(transformers=[
        ('num', num_transformer, num_features),
        ('cat', cat_transformer, cat_features)
    ])
    # Model pipeline
    clf = Pipeline(steps=[('pre', preprocessor),
                          ('model', RandomForestClassifier(n_estimators=200, random_state=random_state))])
    # Train
    clf.fit(X_train, y_train)
    # Predictions and evaluation
    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Test Accuracy: {acc:.4f}")
    print("\nClassification Report:\n", classification_report(y_test, y_pred))
    print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))
    # Save components: full pipeline is easiest to reuse
    joblib.dump(clf, 'student_perf_model.pkl')
    print("Saved trained pipeline to 'student_perf_model.pkl'")
    # For demonstration, save a CSV of X_test with predictions and real labels
    results = X_test.copy()
    results['y_true'] = y_test.values
    results['y_pred'] = y_pred
    results.to_csv('student_performance_project_report.csv', index=False)
    print("Saved sample results to 'student_performance_project_report.csv'")
    return clf, X_test, y_test, y_pred

def plot_feature_importances(pipeline):
    # Extract feature importances from RandomForest within pipeline
    model = pipeline.named_steps['model']
    pre = pipeline.named_steps['pre']
    # get numeric feature names
    num_features = pre.transformers_[0][2]
    ohe = pre.transformers_[1][1]
    cat_features = pre.transformers_[1][2]
    # get one-hot names
    try:
        ohe_feature_names = ohe.get_feature_names_out(cat_features)
    except Exception:
        # older sklearn fallback
        ohe_feature_names = ohe.get_feature_names(cat_features)
    feature_names = list(num_features) + list(ohe_feature_names)
    importances = model.feature_importances_
    fi = pd.Series(importances, index=feature_names).sort_values(ascending=False)
    # Plot top 15
    topk = fi.head(15)
    plt.figure(figsize=(8,5))
    topk.plot(kind='bar')
    plt.title('Top feature importances (Random Forest)')
    plt.tight_layout()
    plt.savefig('feature_importances.png')
    plt.close()
    print("Saved feature importance plot to 'feature_importances.png'")
    return fi

def plot_confusion_matrix(y_test, y_pred):
    cm = confusion_matrix(y_test, y_pred, labels=['Low','Medium','High'])
    fig, ax = plt.subplots(figsize=(5,4))
    im = ax.imshow(cm, interpolation='nearest')
    ax.set_title('Confusion Matrix')
    ax.set_xticks(np.arange(len(['Low','Medium','High'])))
    ax.set_yticks(np.arange(len(['Low','Medium','High'])))
    ax.set_xticklabels(['Low','Medium','High'])
    ax.set_yticklabels(['Low','Medium','High'])
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            ax.text(j, i, cm[i, j], ha='center', va='center')
    plt.xlabel('Predicted')
    plt.ylabel('True')
    plt.tight_layout()
    plt.savefig('confusion_matrix.png')
    plt.close()
    print("Saved confusion matrix to 'confusion_matrix.png'")

def predict_new_samples(pipeline):
    # Example prediction for new student(s)
    samples = pd.DataFrame([
        {'gender':'female','parental level of education':"bachelor's degree",'lunch':'standard','test preparation course':'completed','math score':88,'reading score':92,'writing score':90},
        {'gender':'male','parental level of education':"high school",'lunch':'free/reduced','test preparation course':'none','math score':45,'reading score':48,'writing score':42},
    ])
    preds = pipeline.predict(samples)
    proba = pipeline.predict_proba(samples)
    samples['predicted_performance'] = preds
    # include max probability for predicted class
    samples['confidence'] = proba.max(axis=1)
    samples.to_csv('sample_predictions.csv', index=False)
    print("Saved sample predictions to 'sample_predictions.csv'")
    print(samples)
    return samples

def main():
    df = load_or_create_dataset()
    # check required columns
    expected = set(['gender','parental level of education','lunch','test preparation course','math score','reading score','writing score'])
    if not expected.issubset(df.columns):
        print("The dataset does not have the expected columns. Found columns:", df.columns.tolist())
        print("Exiting. Please provide the correct 'StudentsPerformance.csv' from Kaggle or modify the code.")
        return
    df = create_target(df)
    pipeline, X_test, y_test, y_pred = build_and_train(df)
    fi = plot_feature_importances(pipeline)
    plot_confusion_matrix(y_test, y_pred)
    sample_preds = predict_new_samples(pipeline)
    print("\\nAll artifacts saved in the current working directory. Files:")
    print(" - student_perf_model.pkl (trained pipeline)")
    print(" - student_performance_project_report.csv (test sample predictions)")
    print(" - sample_predictions.csv (example predictions)")
    print(" - feature_importances.png, confusion_matrix.png")
    print("\\nYou can reuse the pipeline via joblib.load('student_perf_model.pkl') and call .predict()/.predict_proba() on new data frames.")
    
if __name__ == '__main__':
    main()
