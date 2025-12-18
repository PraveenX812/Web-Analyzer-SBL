'use client';
import { useState } from "react";
import { JobForm } from "../components/JobForm";
import { JobStatus } from "../components/JobStatus";

export default function Home() {
  const [jobId, setJobId] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="z-10 w-full flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 mb-8 tracking-tight text-center">
          AI Web Analyst
        </h1>

        {!jobId ? (
          <JobForm onJobCreated={setJobId} />
        ) : (
          <JobStatus jobId={jobId} onReset={() => setJobId(null)} />
        )}
      </div>
    </main>
  );
}
