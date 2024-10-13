import streamlit as st
import numpy as np
import joblib

# Load the trained model
model = joblib.load("./best_xgboost_model.pkl")

# Define the predictors/feature names
predictors = [
    'Time', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10',
    'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17', 'V18', 'V19',
    'V20', 'V21', 'V22', 'V23', 'V24', 'V25', 'V26', 'V27', 'V28', 
    'Amount'
]

# Title and description
st.title("Fraud Detection Prediction App")
st.write("Provide the input features to predict whether a transaction is fraudulent.")

# Create input fields for each predictor
input_data = []
for predictor in predictors:
    value = st.number_input(f"Enter {predictor}:", value=0.0, format="%.5f")
    input_data.append(value)

# Make prediction on button click
if st.button("Predict"):
    input_array = np.array(input_data).reshape(1, -1)
    prediction = model.predict(input_array)
    result = "Fraudulent" if prediction[0] == 1 else "Not Fraudulent"
    st.success(f"Prediction: {result}")
