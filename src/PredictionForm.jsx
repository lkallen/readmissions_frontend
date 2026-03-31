import { useState } from "react";
import { CircleAlert, Loader2, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FIELD_OPTIONS } from "./fieldOptions";
import { SAMPLE_PATIENTS } from "./samplePatients";

const API_URL = "https://readmitprediction.vercel.app/predict";

const initialState = {
  insurance_type: "",
  prev_readmit_group: "",
  los_group: "",
  dc_location: "",
  primary_dx: "",
  age_bin: "",
};

const AGE_BIN_TO_CODE = {
  "0-51 years": 1,
  "52-67 years": 2,
  "68+ years": 3,
};

const PREV_READMIT_TO_CODE = {
  "0 prior readmissions": 0,
  "1 prior readmission": 1,
  "2 or more prior readmissions": 2,
};

const LOS_GROUP_TO_BACKEND = {
  "0-5 days": "5 or less",
  "6-8 days": "6 to 8",
  "9+ days": "9+",
};

const INSURANCE_TO_GROUP = {
  Private: "Private",
  Medicare: "Medicare/Medicaid",
  Medicaid: "Medicare/Medicaid",
  Uninsured: "Uninsured",
};

const DC_LOCATION_TO_GROUP = {
  Home: "Home/Rehab",
  "Home Health": "HH/SNF",
  "Skilled Nursing": "HH/SNF",
  Rehab: "Home/Rehab",
};

const DIAGNOSIS_TO_TIER = {
  Appendicitis: "lower",
  Pneumonia: "lower",
  Diabetes: "lower",
  Fracture: "lower",
  Hypertension: "lower",
  Influenza: "lower",
  COPD: "higher",
  "Kidney Disease": "higher",
  "Heart Failure": "higher",
  Sepsis: "higher",
  Stroke: "higher",
};

const FIELD_CONFIG = [
  {
    name: "age_bin",
    label: "Patient Age",
    placeholder: "Select patient age",
  },
  {
    name: "insurance_type",
    label: "Insurance Type",
    placeholder: "Select insurance type",
  },
  {
    name: "primary_dx",
    label: "Primary Diagnosis",
    placeholder: "Select primary diagnosis",
  },
  {
    name: "prev_readmit_group",
    label: "Prior Readmissions",
    placeholder: "Select number of prior readmissions",
  },
  {
    name: "los_group",
    label: "Length of Stay",
    placeholder: "Select current length of stay",
  },
  {
    name: "dc_location",
    label: "Discharge Location",
    placeholder: "Select discharge location",
  },
];

function PredictionForm() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const validateForm = (values) => {
    const nextErrors = {};
    FIELD_CONFIG.forEach((field) => {
      if (!values[field.name]) {
        nextErrors[field.name] = `${field.label} is required.`;
      }
    });

    return nextErrors;
  };

  const handleValueChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    if (submitAttempted) {
      setFieldErrors((prev) => {
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

  const handleFillSample = () => {
    const sample =
      SAMPLE_PATIENTS[Math.floor(Math.random() * SAMPLE_PATIENTS.length)];

    setForm({
      insurance_type: sample.insurance_type,
      prev_readmit_group: sample.prev_readmit_group,
      los_group: sample.los_group,
      dc_location: sample.dc_location,
      primary_dx: sample.primary_dx,
      age_bin: sample.age_bin,
    });

    setResult(null);
    setError(null);
    setFieldErrors({});
    setSubmitAttempted(false);
  };

  const handleSubmit = async (e) => {
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
      insurance_type: INSURANCE_TO_GROUP[form.insurance_type],
      prev_readmit_group: PREV_READMIT_TO_CODE[form.prev_readmit_group],
      los_group: LOS_GROUP_TO_BACKEND[form.los_group],
      dc_location: DC_LOCATION_TO_GROUP[form.dc_location],
      primary_dx_tier: DIAGNOSIS_TO_TIER[form.primary_dx],
      age_bin: AGE_BIN_TO_CODE[form.age_bin],
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(
          err.detail ? JSON.stringify(err.detail) : response.statusText,
        );
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const probabilityValue = Number(result?.probability);
  const hasProbability = Number.isFinite(probabilityValue);
  const probabilityPercent = hasProbability
    ? (probabilityValue * 100).toFixed(1)
    : null;

  return (
    <Card className="mx-auto w-full max-w-4xl rounded-3xl border-2 border-white/90 bg-white/90 shadow-[0_30px_70px_-45px_oklch(0.33_0.07_242)] ring-2 ring-primary/20 backdrop-blur-md">
      <CardHeader className="border-b border-border/80 pb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl text-foreground">
              Patient Prediction Inputs
            </CardTitle>
            <CardDescription>
              Provide patient factors to generate the probability of hospital
              readmission within 30 days.
            </CardDescription>
          </div>
          <Button
            type="button"
            size="lg"
            variant="secondary"
            className="h-11 rounded-xl px-4 text-sm font-semibold"
            onClick={handleFillSample}
            disabled={loading}
          >
            <WandSparkles className="size-4" />
            Generate Sample Patient
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form
          onSubmit={handleSubmit}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FIELD_CONFIG.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Select
                value={form[field.name]}
                onValueChange={(value) => handleValueChange(field.name, value)}
                disabled={loading}
              >
                <SelectTrigger
                  id={field.name}
                  className={`h-11 w-full rounded-xl border-border/90 bg-white/95 shadow-[0_1px_0_0_oklch(0.98_0_0)] transition-[border-color,box-shadow] hover:border-primary/40 ${
                    fieldErrors[field.name]
                      ? "border-destructive focus-visible:ring-destructive/30"
                      : "focus-visible:border-primary/70 focus-visible:ring-primary/25"
                  }`}
                >
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_OPTIONS[field.name].map((option) => {
                    const isObjectOption =
                      typeof option === "object" && option !== null;
                    const optionValue = isObjectOption
                      ? String(option.value)
                      : String(option);
                    const optionLabel = isObjectOption
                      ? String(option.label)
                      : String(option);
                    return (
                      <SelectItem key={optionValue} value={optionValue}>
                        {optionLabel}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <p
                className={`min-h-4 text-xs leading-4 ${
                  fieldErrors[field.name]
                    ? "text-destructive"
                    : "text-transparent"
                }`}
              >
                {fieldErrors[field.name] || "This field is required."}
              </p>
            </div>
          ))}

          <div className="col-span-full flex flex-col gap-3 rounded-xl border border-accent/70 bg-gradient-to-r from-accent/50 via-white to-secondary/35 p-4">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <CircleAlert className="size-4 text-primary" />
              Complete all fields before calculating 30-day readmission
              likelihood.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Button
                type="submit"
                size="lg"
                className="h-11 flex-1 rounded-xl bg-gradient-to-r from-primary to-primary/90 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_-14px_oklch(0.4_0.16_245)] hover:from-primary/95 hover:to-primary lg:max-w-56 lg:flex-none"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Predicting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="h-11 flex-1 rounded-xl border-border/90 bg-white/90 text-sm font-semibold hover:bg-muted/70 lg:max-w-40 lg:flex-none"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </Button>
            </div>

            {loading && (
              <div className="rounded-lg border border-primary/20 bg-primary/10 p-3 text-sm text-primary">
                <p className="flex items-center gap-2 font-medium">
                  <Loader2 className="size-4 animate-spin" />
                  Calculating 30-day readmission likelihood...
                </p>
                <p className="mt-1 text-primary/90">
                  This can take a few seconds while the model response is
                  generated.
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="col-span-full rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {result && (
            <div className="col-span-full rounded-xl border border-success/45 bg-success/20 p-4">
              <div className="text-sm font-semibold text-success-foreground">
                Prediction Result
              </div>
              {hasProbability ? (
                <>
                  <p className="mt-2 text-3xl font-semibold text-foreground">
                    {probabilityPercent}%
                  </p>
                  <p className="mt-1 text-sm text-foreground/85">
                    Estimated probability of hospital readmission within 30
                    days.
                  </p>
                </>
              ) : (
                <p className="mt-2 text-sm text-foreground/90">
                  Prediction received, but a probability value was not returned.
                </p>
              )}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

export default PredictionForm;
