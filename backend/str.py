# import streamlit as st
# import pandas as pd
# import numpy as np
# import joblib
# import pickle
# from datetime import datetime

# # Load the trained model and label encoders
# model = pickle.load(open('fraud_detection_model.pkl', 'rb'))
# label_encoders = joblib.load("label_encoders copy.pkl")

# # Load expected feature names from the model
# model_features = model.feature_names_in_

# # Define categorical columns
# categorical_cols = ["MerchantCategory", "TransactionType", "CardType", "EntryMode",
#                     "DeviceType", "TransactionLocation", "IP_Address"]

# # Function to preprocess user input
# def preprocess_input(data):
#     # Convert dictionary to DataFrame
#     data = pd.DataFrame([data])

#     # Convert TransactionDateTime to UNIX timestamp
#     try:
#         data['TransactionDateTime'] = pd.to_datetime(data['TransactionDateTime']).apply(lambda x: x.timestamp())
#     except Exception as e:
#         st.error(f"Invalid Date Format: {e}")
#         return None

#     # Apply Label Encoding
#     for col in categorical_cols:
#         if col in data.columns:
#             encoder = label_encoders.get(col, None)
#             if encoder:
#                 try:
#                     data[col] = encoder.transform(data[col])
#                 except ValueError:
#                     data[col] = -1  # Assign -1 for unknown categories
#             else:
#                 data[col] = -1  # Assign -1 if no encoder exists

#     # Apply One-Hot Encoding (OHE)
#     data = pd.get_dummies(data)

#     # Ensure missing columns from training get zero-filled
#     data = data.reindex(columns=model_features, fill_value=0)

#     return data


# # Streamlit UI
# st.title("💳 Credit Card Fraud Detection")
# st.write("Enter transaction details to predict whether it's fraudulent.")

# # User input fields
# TransactionAmount = st.number_input("Transaction Amount", min_value=0.0, format="%.2f")
# TransactionDateTime = st.text_input("Transaction Date Time (YYYY-MM-DD HH:MM:SS)", "2025-01-01 12:00:00")
# MerchantCategory = st.selectbox("Merchant Category", ['Entertainment', 'Dining', 'Electronics', 'Grocery', 'Clothing', 'Travel'])
# TransactionType = st.selectbox("Transaction Type", ['ATM', 'Online', 'POS', 'Transfer'])
# CardType = st.selectbox("Card Type", ['Visa', 'MasterCard', 'Amex', 'Discover'])
# EntryMode = st.selectbox("Entry Mode", ['Swipe', 'Chip', 'Online', 'Contactless'])
# TransactionLocation = st.text_input("Transaction Location", "New York, NY")
# IP_Address = st.text_input("IP Address", "192.168.1.1")
# DeviceType = st.selectbox("Device Type", ['Mobile', 'Desktop', 'POS'])
# CardPresent = st.selectbox("Card Present", [0, 1])
# PreviousFraudTransactions = st.number_input("Previous Fraud Transactions", min_value=0, format="%d")
# AccountAge = st.number_input("Account Age (in years)", min_value=0, format="%d")
# DailyTransactionCount = st.number_input("Daily Transaction Count", min_value=0, format="%d")
# DailyTransactionAmount = st.number_input("Daily Transaction Amount", min_value=0.0, format="%.2f")
# IsInternational = st.selectbox("Is International", [0, 1])
# TimeSinceLastTransaction = st.number_input("Time Since Last Transaction (minutes)", min_value=0, format="%d")

# # Predict button
# if st.button("🔍 Predict Fraud"):
#     user_input = {
#         "TransactionAmount": TransactionAmount,
#         "TransactionDateTime": TransactionDateTime,
#         "MerchantCategory": MerchantCategory,
#         "TransactionType": TransactionType,
#         "CardType": CardType,
#         "EntryMode": EntryMode,
#         "TransactionLocation": TransactionLocation,
#         "IP_Address": IP_Address,
#         "DeviceType": DeviceType,
#         "CardPresent": CardPresent,
#         "PreviousFraudTransactions": PreviousFraudTransactions,
#         "AccountAge": AccountAge,
#         "DailyTransactionCount": DailyTransactionCount,
#         "DailyTransactionAmount": DailyTransactionAmount,
#         "IsInternational": IsInternational,
#         "TimeSinceLastTransaction": TimeSinceLastTransaction
#     }

#     # Preprocess input
#     processed_input = preprocess_input(user_input)

#     if processed_input is not None:
#         # Predict
#         prediction = model.predict(processed_input)[0]

#         # Display result
#         if prediction == 1:
#             st.error("🚨 Fraudulent Transaction Detected!")
#         else:
#             st.success("✅ Transaction is Legitimate.")

import streamlit as st
import pickle
import joblib
import numpy as np
import pandas as pd

# Load the trained model and label encoders
model_filename = "fraud_detection_model.pkl"
encoder_filename = "label_encoders.pkl"
scaler_filename = "scaler.pkl"

with open(model_filename, 'rb') as file:
    model = pickle.load(file)

label_encoders = joblib.load(encoder_filename)
scaler = joblib.load(scaler_filename) if scaler_filename else None

# Streamlit UI
st.title("Fraud Detection System")
st.write("Enter transaction details to check if it is fraudulent.")

# User inputs
transaction_amount = st.number_input("Transaction Amount", min_value=1.0, max_value=10000.0, step=1.0)
merchant_category = st.selectbox("Merchant Category", ["Retail", "Electronics", "Food", "Travel", "Entertainment"])
transaction_type = st.selectbox("Transaction Type", ["Purchase", "Withdrawal", "Transfer"])
card_type = st.selectbox("Card Type", ["Debit", "Credit", "Prepaid"])
entry_mode = st.selectbox("Entry Mode", ["Chip", "Magstripe", "Contactless", "Online"])
transaction_location = st.text_input("Transaction Location", "New York")
ip_address = st.text_input("IP Address", "192.168.1.1")
device_type = st.selectbox("Device Type", ["Mobile", "Desktop", "Tablet", "POS"])
card_present = st.selectbox("Card Present", [0, 1])
previous_fraud_transactions = st.number_input("Previous Fraud Transactions", min_value=0, max_value=10, step=1)
account_age = st.number_input("Account Age (days)", min_value=1, max_value=3650, step=1)
daily_transaction_count = st.number_input("Daily Transaction Count", min_value=1, max_value=10, step=1)
daily_transaction_amount = st.number_input("Daily Transaction Amount", min_value=1.0, max_value=10000.0, step=1.0)
is_international = st.selectbox("Is International", [0, 1])
time_since_last_transaction = st.number_input("Time Since Last Transaction (seconds)", min_value=0, max_value=86400, step=1)

# Convert categorical inputs using label encoders
def encode_input(value, column):
    if column in label_encoders:
        encoder = label_encoders[column]
        if value in encoder.classes_:
            return encoder.transform([value])[0]
        else:
            encoder.classes_ = np.append(encoder.classes_, value)  # Add unseen label
            return encoder.transform([value])[0]
    return value

encoded_inputs = [
    transaction_amount, 
    encode_input(merchant_category, "MerchantCategory"),
    encode_input(transaction_type, "TransactionType"),
    encode_input(card_type, "CardType"),
    encode_input(entry_mode, "EntryMode"),
    encode_input(transaction_location, "TransactionLocation"),
    encode_input(ip_address, "IP_Address"),
    encode_input(device_type, "DeviceType"),
    card_present, previous_fraud_transactions, account_age,
    daily_transaction_count, daily_transaction_amount, is_international, time_since_last_transaction
]

# Ensure correct feature count before scaling
input_data = np.array(encoded_inputs, dtype=object).reshape(1, -1)

if scaler:
    if input_data.shape[1] == scaler.n_features_in_:
        input_data_scaled = scaler.transform(input_data)
    else:
        st.error("Feature mismatch: Ensure all inputs are correctly provided.")
        input_data_scaled = input_data
else:
    input_data_scaled = input_data

# Predict fraud
if st.button("Check Fraudulent Transaction"):
    prediction = model.predict(input_data_scaled)[0]
    probability = model.predict_proba(input_data_scaled)[0][1]
    
    if prediction == 1:
        st.error(f"🚨 Fraudulent Transaction Detected! (Confidence: {probability:.2f})")
    else:
        st.success(f"✅ Transaction is Legitimate! (Confidence: {1-probability:.2f})")
