'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center text-slate-700">
      <h2 className="text-2xl font-bold pb-4">Something went wrong loading mics.</h2>
      <p className="text-sm text-slate-500 pb-4">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="underline text-blue-700 hover:text-blue-900"
      >
        Try again
      </button>
    </div>
  );
}
