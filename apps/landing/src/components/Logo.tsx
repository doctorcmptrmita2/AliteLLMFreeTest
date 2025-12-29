export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* CodexFlow Logo - Lightning + Code */}
      <defs>
        <linearGradient id="codexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      
      {/* Lightning bolt */}
      <path
        d="M50 10 L35 40 L45 40 L30 90 L55 50 L45 50 L60 10 Z"
        fill="url(#codexGradient)"
      />
      
      {/* Code brackets */}
      <path
        d="M20 60 L15 50 L20 40 M80 60 L85 50 L80 40"
        stroke="url(#codexGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Flow lines */}
      <path
        d="M25 50 Q50 45, 75 50"
        stroke="url(#codexGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  )
}
