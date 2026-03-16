interface GuideIntroProps {
  guide: {
    title: string;
    category: string;
    content: string;
  };
}

export default function GuideIntro({ guide }: GuideIntroProps) {
  // Extract the first paragraph from content as intro
  const introText = guide.content.split('\n\n')[0]?.replace(/^#+\s*/, '') || '';

  return (
    <div className="mb-16">
      <div className="max-w-4xl">
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-10">
          <h2 className="text-2xl font-serif text-charcoal mb-6">What This Guide Covers</h2>
          <p className="text-lg text-neutral-700 leading-relaxed mb-6">
            {introText}
          </p>
          <div className="flex items-center gap-4 text-sm text-neutral-500">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Expert analysis
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Real parent feedback
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Data-driven recommendations
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}