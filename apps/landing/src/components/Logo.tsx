export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Roo (Kanguru) silüeti */}
      <path
        d="M50 20 C35 20, 25 30, 25 45 L25 60 C25 70, 30 75, 35 75 L40 75 L40 85 L45 85 L45 75 L55 75 L55 85 L60 85 L60 75 L65 75 C70 75, 75 70, 75 60 L75 45 C75 30, 65 20, 50 20 Z"
        fill="url(#gradient1)"
      />
      {/* Kuyruk */}
      <path
        d="M75 50 Q85 45, 90 50 Q85 55, 75 50"
        fill="url(#gradient1)"
      />
      {/* Göz */}
      <circle cx="40" cy="40" r="4" fill="#1e293b" />
      {/* Code sembolü */}
      <path
        d="M30 55 L35 60 L30 65 M50 55 L45 60 L50 65 M70 55 L65 60 L70 65"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  )
}

