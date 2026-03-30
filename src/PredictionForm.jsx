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

  return (
    <Card className="mx-auto w-full max-w-4xl rounded-3xl border-2 border-white/90 bg-white/90 shadow-[0_30px_70px_-45px_oklch(0.33_0.07_242)] ring-2 ring-primary/20 backdrop-blur-md">
      <CardHeader className="border-b border-border/80 pb-5">
        <CardTitle className="text-2xl text-foreground">Patient Prediction Inputs</CardTitle>
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
                  className={`h-11 w-full rounded-xl border-border/90 bg-white/95 shadow-[0_1px_0_0_oklch(0.98_0_0)] transition-[border-color,box-shadow] hover:border-primary/40 ${
                    fieldErrors[field.name]
                      ? 'border-destructive focus-visible:ring-destructive/30'
                      : 'focus-visible:border-primary/70 focus-visible:ring-primary/25'
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
              <p
                className={`min-h-4 text-xs leading-4 ${
                  fieldErrors[field.name] ? 'text-destructive' : 'text-transparent'
                }`}
              >
                {fieldErrors[field.name] || 'This field is required.'}
              </p>
            </div>
          ))}

          <div className="sm:col-span-2 flex flex-col gap-3 rounded-xl border border-accent/70 bg-gradient-to-r from-accent/50 via-white to-secondary/35 p-4">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <CircleAlert className="size-4 text-primary" />
              Complete all fields before submitting for prediction.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="submit"
                size="lg"
                className="h-11 flex-1 rounded-xl bg-gradient-to-r from-primary to-primary/90 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_-14px_oklch(0.4_0.16_245)] hover:from-primary/95 hover:to-primary"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="h-11 flex-1 rounded-xl border-border/90 bg-white/90 text-sm font-semibold hover:bg-muted/70"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </Button>
            </div>
          </div>

          {error && (
            <div className="sm:col-span-2 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {result && (
            <div className="sm:col-span-2 rounded-xl border border-success/45 bg-success/20 p-4">
              <div className="mb-2 text-sm font-semibold text-success-foreground">
                Prediction Result:
              </div>
              <pre className="overflow-x-auto text-sm text-foreground/90">
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
