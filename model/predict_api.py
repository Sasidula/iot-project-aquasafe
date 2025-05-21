from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd

# Load model and label encoder
model = joblib.load("safety_level_model.pkl")
label_encoder = joblib.load("label_encoder.pkl")

# Safety messages based on level
safety_messages = {
    "Safe": "Conditions are safe for swimming",
    "Moderate": "Use caution – moderate flow rates in effect",
    "Danger": "Do not swim – high turbidity or unsafe conditions detected"
}

# Define the Flask app
app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:5173"}})  # Allow requests from localhost:5173

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Load input JSON
        data = request.get_json()

        # Expected features
        expected_features = ['depth', 'current', 'temp', 'air_temp', 'turbidity', 'rainfall',
                             'wind_speed', 'gust_speed', 'humidity', 'cloud',
                             'feels_like', 'dew_point', 'uv_index', 'is_night', 'condition']

        # Validate input
        if not all(feature in data for feature in expected_features):
            return jsonify({"error": "Missing one or more required features"}), 400

        # Convert to DataFrame
        df = pd.DataFrame([data], columns=expected_features)

        # Predict
        pred_encoded = model.predict(df)[0]
        safety_level = label_encoder.inverse_transform([pred_encoded])[0]
        message = safety_messages.get(safety_level, "No message available")

        return jsonify({
            "safety_level": safety_level,
            "status_message": message
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
