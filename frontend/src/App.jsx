// src/App.jsx
import React from "react";
import PredictForm from "./components/PredictForm";
import "./index.css";

const App = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="container">
          <h1 className="logo">❤️ HeartRisk.AI</h1>
          <ul className="nav-links">
            <li><a href="#predict">Predict</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#footer">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero section */}
      <header className="hero">
        <div className="container">
          <h2>Predict Heart Disease Risk with AI</h2>
          <p>Enter your health data to get an instant, AI-powered heart disease risk prediction.</p>
        </div>
      </header>

      {/* Main form */}
      <main id="predict">
        <PredictForm />
      </main>

      {/* About section */}
      <section id="about" className="about">
        <div className="container">
          <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6 mt-8">
  <h2 className="text-2xl font-bold text-gray-800 mb-4">🫀 About This App</h2>
  <p className="text-gray-700 mb-4">
    This application helps in predicting the likelihood of a person having heart disease based on key medical indicators. The prediction is powered by a machine learning model trained on real-world clinical data.
  </p>
  <ul className="list-disc list-inside text-gray-700 space-y-2">
    <li>
      ✅ <strong>Instant Predictions:</strong> Get quick results based on your medical data inputs.
    </li>
    <li>
      📊 <strong>Probabilistic Confidence:</strong> The model provides a confidence percentage to help interpret the result.
    </li>
    <li>
      🧠 <strong>Backed by AI:</strong> The model was trained using a <a className="text-blue-600 underline" href="https://www.kaggle.com/competitions/heart-disease-prediction-dataquest/data" target="_blank" rel="noopener noreferrer">Kaggle dataset</a> provided by DataQuest.
    </li>
    <li>
      🔒 <strong>Privacy:</strong> No data is stored. Everything runs locally in your browser and temporarily on the backend server.
    </li>
  </ul>
  <p className="mt-4 text-sm text-gray-500">
    ⚠️ This tool is not a substitute for professional medical diagnosis. Please consult a healthcare provider for clinical evaluation.
  </p>
</div>


        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="footer">
        <div className="container">
          <p>&copy; 2025 HeartRisk.AI | Built with React and Python Flask</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
