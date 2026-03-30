import { Stethoscope } from 'lucide-react';
import PredictionForm from './PredictionForm';

function App() {
  return (
    <main className="px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section className="mx-auto w-full max-w-4xl">
          <div className="rounded-3xl border border-black/20 bg-white p-6 text-center shadow-none ring-0 sm:p-8">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-black/20 bg-white px-3 py-1 text-xs font-semibold tracking-[0.08em] text-black uppercase">
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
