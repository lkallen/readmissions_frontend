export const FIELD_OPTIONS = {
  insurance_type: ['Medicare/Medicaid', 'Private', 'Uninsured'],
  prev_readmit_group: [
    { value: '0 prior readmissions', label: '0 prior readmissions' },
    { value: '1 prior readmission', label: '1 prior readmission' },
    {
      value: '2 or more prior readmissions',
      label: '2 or more prior readmissions',
    },
  ],
  los_group: ['5 or less', '6 to 8', '9+'],
  dc_location: ['HH/SNF', 'Home/Rehab'],
  primary_dx: [
    'Appendicitis',
    'Pneumonia',
    'Diabetes',
    'Fracture',
    'Hypertension',
    'Influenza',
    'COPD',
    'Kidney Disease',
    'Heart Failure',
    'Sepsis',
    'Stroke',
  ],
  age_bin: [
    { value: '51 years or younger', label: '51 years or younger' },
    { value: '52 to 67 years', label: '52 to 67 years' },
    { value: '68 years or older', label: '68 years or older' },
  ],
};
