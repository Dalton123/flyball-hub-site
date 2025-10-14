export function Logo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Flyball Hub</title>
      {/* Outer green circle */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="#2D5A2D"
        stroke="#ffffff"
        strokeWidth="2"
      />

      {/* Inner circle */}
      <circle
        cx="50"
        cy="50"
        r="38"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.5"
      />

      {/* Tennis ball center */}
      <circle cx="50" cy="50" r="12" fill="#B8D42F" />
      <path
        d="M42 45 Q50 50 58 45"
        stroke="#ffffff"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M42 55 Q50 50 58 55"
        stroke="#ffffff"
        strokeWidth="2"
        fill="none"
      />

      {/* FLYBALL text (top arc) */}
      <text
        x="50"
        y="20"
        textAnchor="middle"
        fill="white"
        fontSize="8"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        FLYBALL
      </text>

      {/* HUB text (bottom) */}
      <text
        x="50"
        y="85"
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        HUB
      </text>

      {/* Left paw print */}
      <g fill="#B8D42F" transform="translate(25, 40)">
        <circle cx="0" cy="0" r="1.5" />
        <circle cx="3" cy="-1" r="1" />
        <circle cx="3" cy="1" r="1" />
        <circle cx="6" cy="0" r="1" />
        <ellipse cx="3" cy="3" rx="2" ry="1.5" />
      </g>

      {/* Right paw print */}
      <g fill="#B8D42F" transform="translate(75, 40)">
        <circle cx="0" cy="0" r="1.5" />
        <circle cx="-3" cy="-1" r="1" />
        <circle cx="-3" cy="1" r="1" />
        <circle cx="-6" cy="0" r="1" />
        <ellipse cx="-3" cy="3" rx="2" ry="1.5" />
      </g>

      {/* Decorative lines */}
      <line x1="15" y1="45" x2="20" y2="45" stroke="white" strokeWidth="1.5" />
      <line x1="15" y1="50" x2="18" y2="50" stroke="white" strokeWidth="1.5" />
      <line x1="15" y1="55" x2="20" y2="55" stroke="white" strokeWidth="1.5" />

      <line x1="80" y1="45" x2="85" y2="45" stroke="white" strokeWidth="1.5" />
      <line x1="82" y1="50" x2="85" y2="50" stroke="white" strokeWidth="1.5" />
      <line x1="80" y1="55" x2="85" y2="55" stroke="white" strokeWidth="1.5" />
    </svg>
  );
}
