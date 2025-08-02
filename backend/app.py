from flask import Flask, request, jsonify
import numpy as np
import pickle
from tensorflow.keras.models import load_model
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load model and scaler
model = load_model("model.keras")
with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    features = [
        float(data["age"]),
        int(data["sex"]),
        int(data["chestPainType"]),
        float(data["restingBP"]),
        float(data["cholesterol"]),
        int(data["fastingBS"]),
        int(data["restingECG"]),
        float(data["maxHR"]),
        int(data["exerciseAngina"]),
        float(data["oldpeak"]),
        int(data["stSlope"]),
    ]

    # Scale input and predict
    input_scaled = scaler.transform([features])
    prediction = model.predict(input_scaled)
    prob = float(prediction[0][0])
    result = int(prob > 0.5)

    return jsonify({"prediction": result, "probability": prob})

if __name__ == "__main__":
    app.run(debug=True)
