import { Stethoscope } from 'lucide-react';
import PredictionForm from './PredictionForm';

function App() {
  return (
    <main className="relative overflow-hidden px-4 py-10 sm:px-6 sm:py-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-8 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            <Stethoscope className="size-4" />
            Readmission Risk Prediction
          </p>
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
            Readmission Risk Prediction
          </h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Enter patient data to get a risk prediction.
          </p>
        </section>

        <PredictionForm />
      </div>
    </main>
  );
}

export default App;
