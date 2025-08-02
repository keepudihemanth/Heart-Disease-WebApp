import React, { useState } from "react";
import axios from "axios";

const PredictForm = () => {
  const [formData, setFormData] = useState({
    age: "",
    sex: "0",
    chestPainType: "0",
    restingBP: "",
    cholesterol: "",
    fastingBS: "0",
    restingECG: "0",
    maxHR: "",
    exerciseAngina: "0",
    oldpeak: "",
    stSlope: "0",
  });

  const [result, setResult] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/predict", formData);
      setResult(response.data.prediction);
      setResponseData(response.data);
    } catch (err) {
      setError("Prediction failed. Please check backend.");
      console.error(err);
    }
  };

  const tooltips = {
    chestPainType: `Chest Pain Types:
0 - Typical Angina: Chest pain related to decreased blood flow.
1 - Atypical Angina: Unusual chest pain not related to exertion.
2 - Non-Anginal Pain: Not related to the heart.
3 - Asymptomatic: No chest pain, silent disease.`,
    restingBP: "Resting Blood Pressure (mm Hg): Normal range is around 120/80. Values over 140 may indicate hypertension.",
    cholesterol: "Serum Cholesterol in mg/dl. Normal range is 125-200 mg/dL. High values can indicate risk.",
    fastingBS:"If above 120 Enter Yes else No",
    maxHR: "Maximum Heart Rate Achieved during exercise. Typically 220 minus age.",
    exerciseAngina: "Indicates if exercise-induced chest pain occurred. 1 = Yes, 0 = No.",
    oldpeak: "Oldpeak is the ST depression induced by exercise relative to rest. Measured in mm.",
    stSlope: `ST Slope:
0 - Upsloping
1 - Flat (abnormal)
2 - Downsloping (significant abnormality)`,
  };

  const renderHelpIcon = (fieldName) =>
    tooltips[fieldName] ? (
      <span
        className="ml-2 text-blue-500 cursor-help"
        title={tooltips[fieldName]}
        style={{ fontWeight: "bold" }}
      >
        🛈
      </span>
    ) : null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Heart Disease Predictor
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Fill in the details below to predict risk of heart disease. Hover on 🛈 for help.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Age", name: "age", type: "number" },
            {
              label: "Sex",
              name: "sex",
              type: "select",
              options: [
                { value: "1", label: "Male" },
                { value: "0", label: "Female" },
              ],
            },
            {
              label: "Chest Pain Type",
              name: "chestPainType",
              type: "select",
              options: [
                { value: "0", label: "Typical Angina" },
                { value: "1", label: "Atypical Angina" },
                { value: "2", label: "Non-Anginal Pain" },
                { value: "3", label: "Asymptomatic" },
              ],
            },
            { label: "Resting BP", name: "restingBP", type: "number" },
            { label: "Cholesterol", name: "cholesterol", type: "number" },
            {
              label: "Fasting BS (>120)",
              name: "fastingBS",
              type: "select",
              options: [
                { value: "1", label: "Yes" },
                { value: "0", label: "No" },
              ],
            },
            {
              label: "Resting ECG",
              name: "restingECG",
              type: "select",
              options: [
                { value: "0", label: "Normal" },
                { value: "1", label: "ST" },
                { value: "2", label: "LVH" },
              ],
            },
            { label: "Max HR", name: "maxHR", type: "number" },
            {
              label: "Exercise Angina",
              name: "exerciseAngina",
              type: "select",
              options: [
                { value: "1", label: "Yes" },
                { value: "0", label: "No" },
              ],
            },
            { label: "Oldpeak", name: "oldpeak", type: "number", step: "0.1" },
            {
              label: "ST Slope",
              name: "stSlope",
              type: "select",
              options: [
                { value: "0", label: "Up" },
                { value: "1", label: "Flat" },
                { value: "2", label: "Down" },
              ],
            },
          ].map((field) =>
            field.type === "select" ? (
              <div key={field.name}>
                <label className="block mb-1 text-gray-700 font-semibold">
                  {field.label}
                  {renderHelpIcon(field.name)}
                </label>
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div key={field.name}>
                <label className="block mb-1 text-gray-700 font-semibold">
                  {field.label}
                  {renderHelpIcon(field.name)}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  step={field.step || undefined}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            )
          )}

          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Predict
            </button>
          </div>
        </form>

        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

        {result !== null && (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-bold">
              Prediction:{" "}
              <span className={result === 1 ? "text-red-600" : "text-green-600"}>
                {result === 1 ? "💔 At Risk of Heart Disease" : "❤️ Not at Risk"}
              </span>
            </h2>
            {responseData?.probability !== undefined && (
              <p className="text-gray-700 mt-1">
                Model confidence: {Math.round(responseData.probability * 100)}%
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictForm;
