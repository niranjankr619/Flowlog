import { motion } from 'motion/react';

interface AppIconProps {
  variant?: 'primary' | 'secondary' | 'adaptive';
  size?: number;
  animated?: boolean;
  className?: string;
}

export const AppIcon = ({ 
  variant = 'primary', 
  size = 64, 
  animated = false,
  className = '' 
}: AppIconProps) => {
  
  if (variant === 'primary') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 1024 1024"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          {/* Main gradient - Indigo to Aqua */}
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4B5CFB" />
            <stop offset="100%" stopColor="#00C7B7" />
          </linearGradient>

          {/* Reverse gradient for depth */}
          <linearGradient id="flowGradientReverse" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#00C7B7" />
            <stop offset="100%" stopColor="#4B5CFB" />
          </linearGradient>

          {/* Glass highlight gradient */}
          <linearGradient id="glassHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="50%" stopColor="white" stopOpacity="0.1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          {/* Radial glow */}
          <radialGradient id="radialGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4B5CFB" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#00C7B7" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0C0E14" stopOpacity="0.95" />
          </radialGradient>

          {/* Shadow filter */}
          <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
            <feOffset dx="0" dy="4" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Glass blur */}
          <filter id="glassBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
          </filter>

          {/* Inner glow */}
          <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="10" />
            <feOffset dx="0" dy="0" result="offsetblur" />
            <feFlood floodColor="#00C7B7" floodOpacity="0.5" />
            <feComposite in2="offsetblur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Ripple animation */}
          {animated && (
            <animate
              attributeName="r"
              values="380;400;380"
              dur="3s"
              repeatCount="indefinite"
            />
          )}
        </defs>

        {/* Background dark glass circle */}
        <circle
          cx="512"
          cy="512"
          r="512"
          fill="url(#radialGlow)"
        />

        {/* Outer glow ring */}
        <circle
          cx="512"
          cy="512"
          r="480"
          fill="none"
          stroke="url(#flowGradient)"
          strokeWidth="2"
          opacity="0.3"
        />

        {/* Main glass circle with shadow */}
        <circle
          cx="512"
          cy="512"
          r="420"
          fill="url(#flowGradient)"
          filter="url(#softShadow)"
          opacity="0.95"
        />

        {/* F + L Wave Orb - Continuous flowing line */}
        <g filter="url(#innerGlow)">
          {/* F shape - top horizontal */}
          <path
            d="M 280 280 Q 320 260, 380 260 L 450 260"
            stroke="white"
            strokeWidth="32"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.95"
          />
          {/* F vertical */}
          <path
            d="M 300 280 Q 290 350, 290 450 Q 290 520, 295 580"
            stroke="white"
            strokeWidth="32"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.95"
          />
          {/* F middle horizontal */}
          <path
            d="M 295 420 Q 320 415, 380 415"
            stroke="white"
            strokeWidth="28"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />

          {/* Flowing connector wave - connects F to L */}
          <path
            d="M 380 415 Q 480 400, 550 440 Q 580 460, 600 500"
            stroke="white"
            strokeWidth="24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />

          {/* L vertical */}
          <path
            d="M 600 300 Q 595 400, 600 500 Q 602 580, 605 650"
            stroke="white"
            strokeWidth="32"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.95"
          />
          {/* L horizontal bottom */}
          <path
            d="M 605 650 Q 640 655, 700 655 L 740 655"
            stroke="white"
            strokeWidth="32"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.95"
          />

          {/* Flow orbs along the path */}
          <circle cx="380" cy="260" r="12" fill="white" opacity="0.9" />
          <circle cx="550" cy="440" r="10" fill="white" opacity="0.8" />
          <circle cx="700" cy="655" r="12" fill="white" opacity="0.9" />
        </g>

        {/* Glass reflection arc - top highlight */}
        <path
          d="M 200 300 Q 512 150, 824 300"
          stroke="url(#glassHighlight)"
          strokeWidth="80"
          fill="none"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Secondary reflection */}
        <ellipse
          cx="512"
          cy="280"
          rx="180"
          ry="60"
          fill="white"
          opacity="0.15"
          filter="url(#glassBlur)"
        />

        {/* Subtle ripple circles */}
        {animated && (
          <>
            <motion.circle
              cx="512"
              cy="512"
              r="380"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.1"
              initial={{ r: 380, opacity: 0.2 }}
              animate={{ r: 450, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
            <motion.circle
              cx="512"
              cy="512"
              r="380"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.1"
              initial={{ r: 380, opacity: 0.2 }}
              animate={{ r: 450, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
                delay: 1,
              }}
            />
          </>
        )}

        {/* Edge highlight ring */}
        <circle
          cx="512"
          cy="512"
          r="420"
          fill="none"
          stroke="white"
          strokeWidth="3"
          opacity="0.2"
        />
      </svg>
    );
  }

  if (variant === 'secondary') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 1024 1024"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Monoline minimal white stroke version */}
        <circle
          cx="512"
          cy="512"
          r="480"
          fill="none"
          stroke="white"
          strokeWidth="4"
          opacity="0.9"
        />

        {/* F + L Wave - minimal strokes */}
        <g>
          {/* F shape */}
          <path
            d="M 280 280 Q 320 260, 380 260 L 450 260"
            stroke="white"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 300 280 Q 290 350, 290 450 Q 290 520, 295 580"
            stroke="white"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 295 420 Q 320 415, 380 415"
            stroke="white"
            strokeWidth="18"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Flowing wave connector */}
          <path
            d="M 380 415 Q 480 400, 550 440 Q 580 460, 600 500"
            stroke="white"
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
          />

          {/* L shape */}
          <path
            d="M 600 300 Q 595 400, 600 500 Q 602 580, 605 650"
            stroke="white"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 605 650 Q 640 655, 700 655 L 740 655"
            stroke="white"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Flow orbs */}
          <circle cx="380" cy="260" r="8" fill="white" opacity="0.9" />
          <circle cx="550" cy="440" r="6" fill="white" opacity="0.7" />
          <circle cx="700" cy="655" r="8" fill="white" opacity="0.9" />
        </g>
      </svg>
    );
  }

  // Adaptive variant - flat for dark/light modes
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="adaptiveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B5CFB" />
          <stop offset="100%" stopColor="#00C7B7" />
        </linearGradient>
      </defs>

      {/* Simple circle background */}
      <circle
        cx="512"
        cy="512"
        r="512"
        fill="url(#adaptiveGradient)"
      />

      {/* F + L Wave - solid fills */}
      <g>
        {/* F shape */}
        <path
          d="M 280 280 Q 320 260, 380 260 L 450 260"
          stroke="white"
          strokeWidth="28"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 300 280 Q 290 350, 290 450 Q 290 520, 295 580"
          stroke="white"
          strokeWidth="28"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 295 420 Q 320 415, 380 415"
          stroke="white"
          strokeWidth="24"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Flowing wave connector */}
        <path
          d="M 380 415 Q 480 400, 550 440 Q 580 460, 600 500"
          stroke="white"
          strokeWidth="20"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />

        {/* L shape */}
        <path
          d="M 600 300 Q 595 400, 600 500 Q 602 580, 605 650"
          stroke="white"
          strokeWidth="28"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 605 650 Q 640 655, 700 655 L 740 655"
          stroke="white"
          strokeWidth="28"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Flow orbs */}
        <circle cx="380" cy="260" r="10" fill="white" />
        <circle cx="550" cy="440" r="8" fill="white" opacity="0.8" />
        <circle cx="700" cy="655" r="10" fill="white" />
      </g>
    </svg>
  );
};
