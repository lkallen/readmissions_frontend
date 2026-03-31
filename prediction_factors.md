# Prediction Factors Reference

This document maps the values shown to users in the frontend form to the values sent to the backend `/predict` endpoint.

The target outcome is the probability of **hospital readmission within 30 days**.

## Backend Payload Shape

The frontend sends this payload:

- `insurance_type` (string)
- `prev_readmit_group` (integer)
- `los_group` (string)
- `dc_location` (string)
- `primary_dx_tier` (string)
- `age_bin` (integer)

## Direct Pass-Through Fields

These form values are sent to the backend exactly as selected.

### insurance_type -> insurance_type

- `Medicare/Medicaid` -> `Medicare/Medicaid`
- `Private` -> `Private`
- `Uninsured` -> `Uninsured`

### los_group (Current Length of Stay) -> los_group

- `5 or less` -> `5 or less`
- `6 to 8` -> `6 to 8`
- `9+` -> `9+`

### dc_location -> dc_location

- `HH/SNF` -> `HH/SNF`
- `Home/Rehab` -> `Home/Rehab`

## Mapped Fields

These user-visible values are converted before sending the request.

### Previous Readmit Group (display) -> prev_readmit_group (backend integer)

- `0 prior readmissions` -> `0`
- `1 prior readmission` -> `1`
- `2 or more prior readmissions` -> `2`

### Age Bin (display) -> age_bin (backend integer)

- `51 years or younger` -> `1`
- `52 to 67 years` -> `2`
- `68 years or older` -> `3`

### Primary Diagnosis (display) -> primary_dx_tier (backend string)

- `Appendicitis` -> `lower`
- `Pneumonia` -> `lower`
- `Diabetes` -> `lower`
- `Fracture` -> `lower`
- `Hypertension` -> `lower`
- `Influenza` -> `lower`
- `COPD` -> `higher`
- `Kidney Disease` -> `higher`
- `Heart Failure` -> `higher`
- `Sepsis` -> `higher`
- `Stroke` -> `higher`
