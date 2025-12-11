export default function SantaHat({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* White fur trim */}
      <ellipse cx="50" cy="75" rx="35" ry="8" fill="#fff" />

      {/* Red hat body */}
      <path
        d="M 15 75 Q 25 20, 45 10 L 55 10 Q 75 20, 85 75 Z"
        fill="#e22"
        stroke="#c11"
        strokeWidth="1"
      />

      {/* White pom-pom */}
      <circle cx="50" cy="8" r="8" fill="#fff" />

      {/* Shadow/depth */}
      <path
        d="M 15 75 Q 25 20, 45 10 L 50 10 Q 30 20, 20 75 Z"
        fill="#c11"
        opacity="0.3"
      />
    </svg>
  );
}
