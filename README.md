# Hospital Readmission Prediction

**Live Application:** https://readmissionprediction.vercel.app/

This project is a clinical decision-support web application that estimates a patient's probability of 30-day hospital readmission from a set of structured patient factors.

The model is trained on **high-quality, realistic synthetic clinical data**, which is designed to reflect real-world hospital patterns while avoiding direct use of real patient records.

## Project Purpose

- Translate a trained readmission model into a fast, clinician-friendly interface.
- Support earlier risk stratification using common discharge-era variables.
- Standardize how teams discuss readmission risk by providing one consistent probability output.

## Clinical Applications

- Discharge planning: identify patients who may benefit from additional transition support.
- Care management triage: prioritize follow-up calls, home health, and post-acute resources.
- Interdisciplinary huddles: add a quantitative risk signal to case review discussions.
- Quality improvement: explore how modifiable factors and pathways relate to readmission risk.

## What the App Does

- Collects key patient factors in a guided form:
  - Age
  - Insurance type
  - Primary diagnosis
  - Prior readmissions
  - Current length of stay
  - Discharge location
- Maps user-friendly selections to backend model features.
- Calls a prediction API and returns estimated probability of 30-day readmission.

## Data Source

- Dataset reference: [Hospital Patient Readmission Dataset (Kaggle)](https://www.kaggle.com/datasets/mohamedasak/hospital-patient-readmission-dataset/data)
- The dataset is synthetic, but structured to be realistic and suitable for prototyping, model development, and workflow simulation.

## Modeling Notes

- Feature engineering was applied to improve model signal and prediction performance.
- Inputs are transformed into model-ready features before inference.

## Tech Stack

- Frontend
  - React 19 + Vite
  - JavaScript (ES modules)
  - Tailwind CSS v4
  - shadcn/ui + Radix primitives for UI components
  - Lucide React icons
- Model Serving API
  - FastAPI
  - Pydantic for request validation
  - pandas for preprocessing
  - joblib for loading serialized model artifacts

**Backend Repo:** https://github.com/lkallen/readmit_prediction_BE
