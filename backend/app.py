# from flask import Flask, request, jsonify
# import torch
# import numpy as np
# from flask_cors import CORS
# import pandas as pd
# from model import Model  # Ensure this imports your defined `Model` class


# app = Flask(__name__)

# CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# # Device configuration
# device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# # predictors = ['category', 'amt', 'gender', 'street', 'city', 'state', 'zip', 'lat', 'long', 
# #  'city_pop', 'job', 'is_fraud', 'trans_year', 'trans_month', 'trans_day', 
# #  'trans_hour', 'age']

# predictors = [ 'amt', 'gender','zip',
#  'city_pop', 'job','trans_year', 'age']


# input_size = len(predictors)
# model = Model(input_size)
# model.load_state_dict(torch.load("./model.pth", map_location=device, weights_only=True))
# model.to(device)
# model.eval()

# @app.route('/predict', methods=['POST'])
# def predict():
#     data = request.json
    
#     try:
#         input_data = [float(data[p]) for p in predictors]
#     except KeyError as e:
#         return jsonify({"error": f"Missing key: {str(e)}"}), 400
#     except ValueError as e:
#         return jsonify({"error": f"Invalid value for input: {str(e)}"}), 400
    
#     input_data = np.array(input_data).reshape(1, -1)
    
#     prediction = model.predict_tensor(input_data)
#     print(prediction)
    
#     return jsonify({"prediction": int(prediction[0])})


# if __name__ == '__main__':
#     app.run(debug=True)



from flask import Flask, request, jsonify
import pickle
import joblib
import numpy as np
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Enable CORS for frontend

# Load the trained model, label encoders, and scaler
MODEL_FILE = "fraud_detection_model.pkl"
ENCODER_FILE = "label_encoders.pkl"
SCALER_FILE = "scaler.pkl"

try:
    with open(MODEL_FILE, 'rb') as file:
        model = pickle.load(file)
    label_encoders = joblib.load(ENCODER_FILE)
    scaler = joblib.load(SCALER_FILE) if SCALER_FILE else None
except Exception as e:
    print(f"Error loading model or encoders: {e}")
    model, label_encoders, scaler = None, None, None  # Prevents crashes

# Define categorical columns that need encoding
CATEGORICAL_COLUMNS = ["MerchantCategory", "TransactionType", "CardType", "EntryMode", "DeviceType", "TransactionLocation", "IP_Address"]

def encode_input(value, column):
    """Encodes categorical values using label encoders."""
    if column in label_encoders:
        encoder = label_encoders[column]
        if value in encoder.classes_:
            return int(encoder.transform([value])[0])  # Convert to Python int
        else:
            encoder.classes_ = np.append(encoder.classes_, value)  # Handle unseen categories
            return int(encoder.transform([value])[0])  # Convert to Python int
    return value  # If no encoder, return as is

@app.route('/predict', methods=['POST'])
def predict():
    if model is None or label_encoders is None:
        return jsonify({"error": "Model or encoders not loaded. Check the server logs."}), 500

    try:
        data = request.json  # Get JSON request data

        # Extract inputs
        input_features = {
            "TransactionAmount": float(data.get("TransactionAmount", 0)),
            "MerchantCategory": data.get("MerchantCategory", "Retail"),
            "TransactionType": data.get("TransactionType", "Purchase"),
            "CardType": data.get("CardType", "Debit"),
            "EntryMode": data.get("EntryMode", "Chip"),
            "TransactionLocation": data.get("TransactionLocation", "New York"),
            "IP_Address": data.get("IP_Address", "192.168.1.1"),
            "DeviceType": data.get("DeviceType", "Mobile"),
            "CardPresent": int(data.get("CardPresent", 0)),
            "PreviousFraudTransactions": int(data.get("PreviousFraudTransactions", 0)),
            "AccountAge": int(data.get("AccountAge", 1)),
            "DailyTransactionCount": int(data.get("DailyTransactionCount", 1)),
            "DailyTransactionAmount": float(data.get("DailyTransactionAmount", 1.0)),
            "IsInternational": int(data.get("IsInternational", 0)),
            "TimeSinceLastTransaction": int(data.get("TimeSinceLastTransaction", 0)),
        }

        # Encode categorical inputs
        for col in CATEGORICAL_COLUMNS:
            input_features[col] = encode_input(input_features[col], col)

        # Convert to NumPy array and reshape
        input_data = np.array(list(input_features.values()), dtype=object).reshape(1, -1)

        # Scale the input if a scaler is available
        if scaler:
            if input_data.shape[1] != scaler.n_features_in_:
                return jsonify({"error": "Feature mismatch: Ensure all inputs are correctly provided."}), 400
            input_data = scaler.transform(input_data)

        # Make a prediction
        prediction = model.predict(input_data)[0]
        probability = float(model.predict_proba(input_data)[0][1])  # Convert np.float32 to float

        response = {
            "fraudulent": bool(prediction),
            "confidence": round(probability if prediction == 1 else 1 - probability, 2)
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
