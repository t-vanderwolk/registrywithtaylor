export default function GuideSignoffMark({ className }: { className?: string }) {
  const handwrittenPrintFontFamily = '"Caveat", "Segoe Print", "Bradley Hand", "Comic Sans MS", cursive';

  return (
    <svg
      viewBox="0 0 760 470"
      aria-hidden="true"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="currentColor">
        <text
          x="80"
          y="212"
          transform="rotate(-5 380 170)"
          style={{ fontFamily: handwrittenPrintFontFamily, fontWeight: 600, fontSize: '214px', fontStyle: 'normal', letterSpacing: '8px' }}
        >
          xoxo
        </text>
        <text
          x="230"
          y="408"
          style={{ fontFamily: handwrittenPrintFontFamily, fontWeight: 600, fontSize: '178px', fontStyle: 'normal', letterSpacing: '2px' }}
        >
          -T
        </text>
      </g>
    </svg>
  );
}
