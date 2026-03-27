import { Stethoscope } from 'lucide-react';
import PredictionForm from './PredictionForm';

function App() {
  return (
    <main className="relative overflow-hidden px-4 py-10 sm:px-6 sm:py-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 -top-18 h-72 w-72 rounded-full bg-primary/16 blur-3xl" />
        <div className="absolute -right-20 top-8 h-64 w-64 rounded-full bg-emerald-300/22 blur-3xl" />
        <div className="absolute -left-16 top-[52%] h-64 w-64 rounded-full bg-sky-200/24 blur-3xl" />
        <div className="absolute -right-20 top-[56%] h-72 w-72 rounded-full bg-emerald-200/20 blur-3xl" />
        <div className="absolute left-1/2 top-[72%] h-80 w-80 -translate-x-1/2 rounded-full bg-sky-200/20 blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section className="mx-auto w-full max-w-4xl">
          <div className="rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/8 via-white/80 to-emerald-100/50 p-6 text-center shadow-sm sm:p-8">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/75 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-primary uppercase">
              <Stethoscope className="size-3.5" />
              Clinical Decision Support
            </p>
            <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Readmission Risk Prediction
            </h1>
          </div>
        </section>

        <PredictionForm />
      </div>
    </main>
  );
}

export default App;
