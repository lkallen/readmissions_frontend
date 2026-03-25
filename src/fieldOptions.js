export const FIELD_OPTIONS = {
  insurance_type: ['Medicare/Medicaid', 'Private', 'Uninsured'],
  prev_readmit_group: [0, 1, 2],
  los_group: ['5 or less', '6 to 8', '9+'],
  risk_score_bin: [1, 2, 3, 4, 5, 6, 7],
  dc_location: ['HH/SNF', 'Home/Rehab'],
  primary_dx_tier: ['higher', 'lower'],
  age_bin: [1, 2, 3], // INTEGER per backend requirements
};
