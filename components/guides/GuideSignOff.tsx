import GuideSignoffMark from '@/components/blog/GuideSignoffMark';

function isHandwrittenSignature(signature: string) {
  return signature
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim() === 'xoxo t';
}

export default function GuideSignOff({
  signature,
}: {
  signature: string;
}) {
  const trimmedSignature = signature.trim();

  if (!trimmedSignature) {
    return null;
  }

  return (
    <section className="rounded-[1.7rem] border border-[rgba(196,156,94,0.16)] bg-[linear-gradient(180deg,#fffaf7_0%,#f8efe8_100%)] p-6 shadow-[0_18px_45px_rgba(58,36,43,0.08)] md:p-8">
      <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--color-accent-dark)]/82">Sign-off</p>
      {isHandwrittenSignature(trimmedSignature) ? (
        <div className="mt-4 w-[8.5rem] text-[#D986A2] md:w-[9.5rem]">
          <GuideSignoffMark className="h-auto w-full max-w-full" />
        </div>
      ) : (
        <div className="font-handwritten-print mt-4 whitespace-pre-line text-[1.75rem] font-semibold uppercase leading-none tracking-[0.14em] text-[#D986A2] md:text-[2rem]">
          {trimmedSignature}
        </div>
      )}
    </section>
  );
}
