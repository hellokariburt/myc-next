'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center text-slate-700">
      <h2 className="text-2xl font-bold pb-4">Something went wrong loading this mic.</h2>
      <button
        onClick={reset}
        className="underline text-blue-700 hover:text-blue-900"
      >
        Try again
      </button>
    </div>
  );
}
