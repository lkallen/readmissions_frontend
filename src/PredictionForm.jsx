import { useState } from 'react';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

const FIELD_CONFIG = [
  {
    name: 'insurance_type',
    label: 'Insurance Type',
    placeholder: 'Select insurance type',
  },
  {
    name: 'prev_readmit_group',
    label: 'Previous Readmit Group',
    placeholder: 'Select previous readmit group',
  },
  {
    name: 'los_group',
    label: 'LOS Group',
    placeholder: 'Select LOS group',
  },
  {
    name: 'risk_score_bin',
    label: 'Risk Score Bin',
    placeholder: 'Select risk score bin',
  },
  {
    name: 'dc_location',
    label: 'Discharge Location',
    placeholder: 'Select discharge location',
  },
  {
    name: 'primary_dx_tier',
    label: 'Primary Diagnosis Tier',
    placeholder: 'Select primary diagnosis tier',
  },
  {
    name: 'age_bin',
    label: 'Age Bin',
    placeholder: 'Select age bin',
  },
];

function PredictionForm() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const validateForm = values => {
    const nextErrors = {};
    FIELD_CONFIG.forEach(field => {
      if (!values[field.name]) {
        nextErrors[field.name] = `${field.label} is required.`;
      }
    });

    return nextErrors;
  };

  const handleValueChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));

    if (submitAttempted) {
      setFieldErrors(prev => {
        if (!prev[name]) {
          return prev;
        }

        const nextErrors = { ...prev };
        delete nextErrors[name];
        return nextErrors;
      });
    }
  };

  const handleReset = () => {
    setForm(initialState);
    setResult(null);
    setError(null);
    setFieldErrors({});
    setSubmitAttempted(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitAttempted(true);
    setError(null);
    setResult(null);

    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

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
        throw new Error(
          err.detail ? JSON.stringify(err.detail) : response.statusText
        );
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  const missingFieldCount = Object.keys(fieldErrors).length;

  return (
    <Card className="mx-auto w-full max-w-4xl border-white/60 bg-white/85 shadow-2xl backdrop-blur-sm">
      <CardHeader className="border-b border-border/60 pb-5">
        <CardTitle className="text-2xl">Patient Prediction Inputs</CardTitle>
        <CardDescription>
          Provide patient factors to generate a readmission prediction.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
          {FIELD_CONFIG.map(field => (
            <div
              key={field.name}
              className={field.name === 'age_bin' ? 'space-y-2 sm:col-span-2' : 'space-y-2'}
            >
              <Label htmlFor={field.name}>{field.label}</Label>
              <Select
                value={form[field.name]}
                onValueChange={value => handleValueChange(field.name, value)}
                disabled={loading}
              >
                <SelectTrigger
                  id={field.name}
                  className={`h-11 w-full rounded-xl bg-background/70 ${
                    fieldErrors[field.name]
                      ? 'border-destructive focus-visible:ring-destructive/30'
                      : ''
                  }`}
                >
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_OPTIONS[field.name].map(option => {
                    const optionValue = String(option);
                    return (
                      <SelectItem key={optionValue} value={optionValue}>
                        {optionValue}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {fieldErrors[field.name] && (
                <p className="text-xs text-destructive">{fieldErrors[field.name]}</p>
              )}
            </div>
          ))}

          <div className="sm:col-span-2 flex flex-col gap-3 rounded-xl border border-primary/15 bg-primary/5 p-4">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <CircleAlert className="size-4 text-primary" />
              Complete all fields before submitting for prediction.
            </p>
            {submitAttempted && missingFieldCount > 0 && (
              <p className="text-sm text-destructive">
                {missingFieldCount} field{missingFieldCount > 1 ? 's' : ''} still required.
              </p>
            )}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="submit"
                size="lg"
                className="h-11 flex-1 rounded-xl text-sm font-semibold"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="h-11 flex-1 rounded-xl text-sm font-semibold"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </Button>
            </div>
          </div>

          {error && (
            <div className="sm:col-span-2 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {result && (
            <div className="sm:col-span-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <div className="mb-2 text-sm font-semibold text-emerald-900">
                Prediction Result:
              </div>
              <pre className="overflow-x-auto text-sm text-emerald-950">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

export default PredictionForm;
