import { useState } from 'react';
import { FIELD_OPTIONS } from './fieldOptions';

const API_URL = 'https://readmitprediction.vercel.app/predict';

const initialState = {
  insurance_type: '',
  prev_readmit_group: '',
  los_group: '',
  risk_score_bin: '',
  dc_location: '',
  primary_dx_tier: '',
  age_bin: '',
};

function PredictionForm() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleReset = () => {
    setForm(initialState);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    // Build input, casting values
    const payload = {
      insurance_type: form.insurance_type,
      prev_readmit_group: parseInt(form.prev_readmit_group, 10),
      los_group: form.los_group,
      risk_score_bin: parseInt(form.risk_score_bin, 10),
      dc_location: form.dc_location,
      primary_dx_tier: form.primary_dx_tier,
      age_bin: parseInt(form.age_bin, 10),
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail ? JSON.stringify(err.detail) : response.statusText);
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  // Utility to render each dropdown
  const renderDropdown = (name, label, options) => (
    <div className="mb-5">
      <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200" htmlFor={name}>{label}</label>
      <select
        id={name}
        name={name}
        className="w-full rounded border px-3 py-2 text-gray-900 dark:text-gray-900 dark:bg-gray-100 focus:outline-none focus:ring-2 focus:border-blue-500"
        value={form[name]}
        onChange={handleChange}
        required
        disabled={loading}
      >
        <option value="" disabled>Select...</option>
        {options.map(opt => (
          <option key={String(opt)} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      {renderDropdown('insurance_type', 'Insurance Type', FIELD_OPTIONS.insurance_type)}
      {renderDropdown('prev_readmit_group', 'Previous Readmit Group', FIELD_OPTIONS.prev_readmit_group)}
      {renderDropdown('los_group', 'LOS Group', FIELD_OPTIONS.los_group)}
      {renderDropdown('risk_score_bin', 'Risk Score Bin', FIELD_OPTIONS.risk_score_bin)}
      {renderDropdown('dc_location', 'Discharge Location', FIELD_OPTIONS.dc_location)}
      {renderDropdown('primary_dx_tier', 'Primary Diagnosis Tier', FIELD_OPTIONS.primary_dx_tier)}
      {renderDropdown('age_bin', 'Age Bin', FIELD_OPTIONS.age_bin)}

      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          className="w-1/2 py-2 rounded bg-blue-600 text-white font-semibold disabled:opacity-60 transition"
          disabled={loading || Object.values(form).some(v => !v)}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        <button
          type="button"
          className="w-1/2 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold transition"
          onClick={handleReset}
          disabled={loading}
        >
          Reset
        </button>
      </div>

      {error && <div className="mt-4 p-3 text-red-700 bg-red-100 rounded">{error}</div>}
      {result && (
        <div className="mt-6 p-4 bg-green-50 text-green-900 rounded">
          <div className="mb-2 font-bold">Prediction Result:</div>
          <pre className="overflow-x-auto text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </form>
  );
}

export default PredictionForm;
