import { Stethoscope } from "lucide-react";
import PredictionForm from "./PredictionForm";

function App() {
  return (
    <main className="px-4 py-10 sm:px-6 sm:py-16 lg:py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 sm:gap-10">
        <section className="mx-auto w-full max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl border-2 border-white/90 bg-white/85 p-6 text-center shadow-[0_24px_80px_-45px_oklch(0.38_0.08_238)] ring-2 ring-primary/20 backdrop-blur-md sm:p-8">
            <div className="pointer-events-none absolute -top-24 -left-20 h-64 w-64 rounded-full bg-gradient-to-br from-secondary/65 to-transparent blur-2xl" />
            <div className="pointer-events-none absolute -right-24 -bottom-28 h-72 w-72 rounded-full bg-gradient-to-tl from-primary/25 to-transparent blur-2xl" />
            <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-primary uppercase">
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
