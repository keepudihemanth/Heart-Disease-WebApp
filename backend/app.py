import os
import warnings

# Disable oneDNN optimization warnings (optional, just to clean logs)
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

# Suppress sklearn version mismatch warnings
warnings.filterwarnings("ignore", category=UserWarning)

from flask import Flask, request, jsonify
import numpy as np
import pickle
import tensorflow as tf
from tensorflow.keras.models import load_model
from flask_cors import CORS
import keras
import pennylane as qml

# Define quantum system size and depth
n_qubits = 8  # same as training
n_layers = 2  # same as training

# PennyLane device
dev = qml.device("default.qubit", wires=n_qubits)

# Encodes classical inputs and applies parameterized quantum operations for feature extraction.
def variational_circuit(params, x=None):
    qml.templates.AngleEmbedding(x, wires=range(n_qubits))
    for l in range(params.shape[0]):
        for q in range(n_qubits):
            qml.RX(params[l, q, 0], wires=q)
            qml.RY(params[l, q, 1], wires=q)
            qml.RZ(params[l, q, 2], wires=q)
        for q in range(n_qubits):
            qml.CNOT(wires=[q, (q + 1) % n_qubits])

# A PennyLane QNode wrapped for TensorFlow, returns expectation values
@qml.qnode(dev, interface="tf")
def qnode_tf(inputs, weights):
    variational_circuit(weights, x=inputs)
    return [qml.expval(qml.PauliZ(wires=i)) for i in range(n_qubits)]

# QNN Layer
# Wrapping the QNN node as a TensorFlow layer
@keras.saving.register_keras_serializable()
class QNNLayer(tf.keras.layers.Layer):
    def __init__(self, n_qubits, n_layers, **kwargs):
        super().__init__(**kwargs)
        init_weights = np.random.uniform(low=0, high=2 * np.pi, size=(n_layers, n_qubits, 3))
        self.weights_var = tf.Variable(init_weights, dtype=tf.float32, trainable=True)
        self.n_qubits = n_qubits
        self.n_layers = n_layers

    def call(self, inputs):
        return tf.map_fn(
            lambda x: tf.cast(qnode_tf(x, self.weights_var), tf.float32),
            inputs,
            fn_output_signature=tf.TensorSpec(shape=(self.n_qubits,), dtype=tf.float32)
        )

    def get_config(self):
        config = super().get_config()
        config.update({
            "n_qubits": self.n_qubits,
            "n_layers": self.n_layers,
        })
        return config

# Flask app
# Using CORS for cross-origin handling of web requests
app = Flask(__name__)
CORS(app)

# Load trained model (fix optimizer mismatch issue using compile=False)
model = load_model(
    "model1.keras",
    custom_objects={"QNNLayer": QNNLayer},
    compile=False  # avoid optimizer mismatch warnings
)

# Load scaler
with open("scaler2.pkl", "rb") as f:
    scaler = pickle.load(f)

# API route for prediction
# Accepts JSON data representing user inputs
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    # Extract features from request data
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

    # Scale input and make prediction
    input_scaled = scaler.transform([features])
    prediction = model.predict(input_scaled)
    prob = float(prediction[0][0])
    result = int(prob > 0.5)

    # Determine confidence level based on probability
    # High confidence: probability very close to 0 or 1
    # Medium confidence: probability moderately confident
    # Low confidence: probability around 0.5 (uncertain)
    if prob >= 0.8 or prob <= 0.2:
        confidence = "High"
    elif 0.6 <= prob < 0.8 or 0.2 < prob <= 0.4:
        confidence = "Medium"
    else:
        confidence = "Low"

    # Return result as JSON including confidence level
    return jsonify({
        "prediction": result,
        "probability": prob,
        "confidence": confidence
    })

# Main entry point
if __name__ == "__main__":
    app.run(debug=True)
