import './index.css';
import PredictionForm from './PredictionForm';

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 ">
      <div className="max-w-xl mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          Readmission Risk Prediction
        </h1>
        <p className="mb-8 text-center text-gray-500 dark:text-gray-300">Enter patient data to get a risk prediction.</p>
        <PredictionForm />
      </div>
    </div>
  );
}

export default App;
