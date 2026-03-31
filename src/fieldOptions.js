export const FIELD_OPTIONS = {
  insurance_type: ['Private', 'Medicare', 'Medicaid', 'Uninsured'],
  prev_readmit_group: [
    { value: '0 prior readmissions', label: '0 prior readmissions' },
    { value: '1 prior readmission', label: '1 prior readmission' },
    {
      value: '2 or more prior readmissions',
      label: '2 or more prior readmissions',
    },
  ],
  los_group: ['5 or less', '6 to 8', '9+'],
  dc_location: ['Home', 'Home Health', 'Skilled Nursing', 'Rehab'],
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
    { value: '0-51 years', label: '0-51 years' },
    { value: '52-67 years', label: '52-67 years' },
    { value: '68+ years', label: '68+ years' },
  ],
};
