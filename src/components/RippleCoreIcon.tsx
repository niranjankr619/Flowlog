import { motion } from 'motion/react';

interface RippleCoreIconProps {
  variant?: 'primary' | 'secondary' | 'adaptive';
  size?: number;
  animated?: boolean;
  className?: string;
}

export const RippleCoreIcon = ({ 
  variant = 'primary', 
  size = 64, 
  animated = false,
  className = '' 
}: RippleCoreIconProps) => {
  
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
          {/* Background gradient - Indigo to Navy */}
          <radialGradient id="bgGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4B5CFB" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#0B0F2C" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0B0F2C" />
          </radialGradient>

          {/* Core glow gradient - Aqua */}
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#00C7B7" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#00C7B7" stopOpacity="0.8" />
          </radialGradient>

          {/* Core inner bloom */}
          <radialGradient id="coreBloom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#00C7B7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00C7B7" stopOpacity="0" />
          </radialGradient>

          {/* Ripple 1 gradient - Aqua to Indigo */}
          <radialGradient id="ripple1Gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00C7B7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4B5CFB" stopOpacity="0.2" />
          </radialGradient>

          {/* Ripple 2 gradient - Indigo dominant */}
          <radialGradient id="ripple2Gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4B5CFB" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4B5CFB" stopOpacity="0.15" />
          </radialGradient>

          {/* Ripple 3 gradient - Faded Indigo */}
          <radialGradient id="ripple3Gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4B5CFB" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0B0F2C" stopOpacity="0.05" />
          </radialGradient>

          {/* Glass highlight gradient - top-left light source */}
          <linearGradient id="glassHighlight" x1="20%" y1="20%" x2="80%" y2="80%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Outer halo glow */}
          <radialGradient id="outerHalo" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#4B5CFB" stopOpacity="0" />
            <stop offset="85%" stopColor="#4B5CFB" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#4B5CFB" stopOpacity="0.05" />
          </radialGradient>

          {/* Soft shadow filter */}
          <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
            <feOffset dx="0" dy="8" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Glass blur for realism */}
          <filter id="glassBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
          </filter>

          {/* Inner bloom glow */}
          <filter id="innerBloom" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1.2 0"/>
          </filter>

          {/* Gradient noise texture for organic feel */}
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
            <feBlend in="SourceGraphic" in2="noise" mode="soft-light" />
          </filter>
        </defs>

        {/* Background dark gradient field */}
        <circle
          cx="512"
          cy="512"
          r="512"
          fill="url(#bgGradient)"
        />

        {/* Outer halo glow */}
        <circle
          cx="512"
          cy="512"
          r="500"
          fill="url(#outerHalo)"
        />

        {/* Ripple Layer 3 - Outermost (5-10% opacity) */}
        {animated ? (
          <motion.circle
            cx="512"
            cy="512"
            r="420"
            fill="none"
            stroke="url(#ripple3Gradient)"
            strokeWidth="60"
            opacity="0.08"
            filter="url(#glassBlur)"
            initial={{ r: 420, opacity: 0.08 }}
            animate={{ r: 450, opacity: 0 }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ) : (
          <circle
            cx="512"
            cy="512"
            r="420"
            fill="none"
            stroke="url(#ripple3Gradient)"
            strokeWidth="60"
            opacity="0.08"
            filter="url(#glassBlur)"
          />
        )}

        {/* Ripple 3 - Shadow for depth */}
        <circle
          cx="512"
          cy="520"
          r="420"
          fill="none"
          stroke="#000000"
          strokeWidth="50"
          opacity="0.03"
        />

        {/* Ripple Layer 2 - Middle */}
        {animated ? (
          <motion.circle
            cx="512"
            cy="512"
            r="300"
            fill="none"
            stroke="url(#ripple2Gradient)"
            strokeWidth="50"
            opacity="0.2"
            filter="url(#glassBlur)"
            initial={{ r: 300, opacity: 0.2 }}
            animate={{ r: 330, opacity: 0.05 }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeOut',
              delay: 1.5,
            }}
          />
        ) : (
          <circle
            cx="512"
            cy="512"
            r="300"
            fill="none"
            stroke="url(#ripple2Gradient)"
            strokeWidth="50"
            opacity="0.2"
            filter="url(#glassBlur)"
          />
        )}

        {/* Ripple 2 - Shadow */}
        <circle
          cx="512"
          cy="518"
          r="300"
          fill="none"
          stroke="#000000"
          strokeWidth="45"
          opacity="0.05"
        />

        {/* Ripple Layer 1 - Inner (Aqua to Indigo) */}
        {animated ? (
          <motion.circle
            cx="512"
            cy="512"
            r="180"
            fill="none"
            stroke="url(#ripple1Gradient)"
            strokeWidth="40"
            opacity="0.35"
            filter="url(#glassBlur)"
            initial={{ r: 180, opacity: 0.35 }}
            animate={{ r: 210, opacity: 0.1 }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeOut',
              delay: 3,
            }}
          />
        ) : (
          <circle
            cx="512"
            cy="512"
            r="180"
            fill="none"
            stroke="url(#ripple1Gradient)"
            strokeWidth="40"
            opacity="0.35"
            filter="url(#glassBlur)"
          />
        )}

        {/* Ripple 1 - Shadow */}
        <circle
          cx="512"
          cy="516"
          r="180"
          fill="none"
          stroke="#000000"
          strokeWidth="38"
          opacity="0.08"
        />

        {/* Inner bloom around core */}
        <circle
          cx="512"
          cy="512"
          r="140"
          fill="url(#coreBloom)"
          filter="url(#innerBloom)"
        />

        {/* Central core orb - main glow */}
        {animated ? (
          <motion.circle
            cx="512"
            cy="512"
            r="64"
            fill="url(#coreGlow)"
            filter="url(#softShadow)"
            animate={{
              r: [64, 68, 64],
              opacity: [1, 0.95, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ) : (
          <circle
            cx="512"
            cy="512"
            r="64"
            fill="url(#coreGlow)"
            filter="url(#softShadow)"
          />
        )}

        {/* Core highlight spot - top-left light source */}
        <ellipse
          cx="490"
          cy="490"
          rx="28"
          ry="24"
          fill="#FFFFFF"
          opacity="0.5"
          filter="url(#glassBlur)"
        />

        {/* Core inner shine */}
        <circle
          cx="512"
          cy="512"
          r="48"
          fill="#FFFFFF"
          opacity="0.25"
        />

        {/* Glass highlight overlay on ripples */}
        <circle
          cx="512"
          cy="512"
          r="450"
          fill="url(#glassHighlight)"
          filter="url(#noise)"
          opacity="0.6"
        />

        {/* Top-left light reflection arc */}
        <path
          d="M 200 300 Q 512 100, 824 300"
          stroke="#FFFFFF"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.15"
          filter="url(#glassBlur)"
        />

        {/* Secondary light arc */}
        <path
          d="M 150 400 Q 512 180, 874 400"
          stroke="#FFFFFF"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.08"
          filter="url(#glassBlur)"
        />
      </svg>
    );
  }

  if (variant === 'secondary') {
    // Monotone white version for dark theme
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
          <filter id="monoGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
        </defs>

        {/* Ripple Layer 3 */}
        <circle
          cx="512"
          cy="512"
          r="420"
          fill="none"
          stroke="white"
          strokeWidth="50"
          opacity="0.1"
        />

        {/* Ripple Layer 2 */}
        <circle
          cx="512"
          cy="512"
          r="300"
          fill="none"
          stroke="white"
          strokeWidth="45"
          opacity="0.2"
        />

        {/* Ripple Layer 1 */}
        <circle
          cx="512"
          cy="512"
          r="180"
          fill="none"
          stroke="white"
          strokeWidth="35"
          opacity="0.35"
        />

        {/* Core glow */}
        <circle
          cx="512"
          cy="512"
          r="100"
          fill="white"
          opacity="0.15"
          filter="url(#monoGlow)"
        />

        {/* Central core */}
        <circle
          cx="512"
          cy="512"
          r="64"
          fill="white"
          opacity="0.9"
        />

        {/* Core highlight */}
        <circle
          cx="490"
          cy="490"
          r="24"
          fill="white"
          opacity="0.5"
        />
      </svg>
    );
  }

  // Adaptive variant - transparent glass for OS themes
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
        <radialGradient id="adaptiveGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00C7B7" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#4B5CFB" stopOpacity="0.6" />
        </radialGradient>

        <filter id="adaptiveBlur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
        </filter>
      </defs>

      {/* Background circle */}
      <circle
        cx="512"
        cy="512"
        r="512"
        fill="url(#adaptiveGradient)"
        opacity="0.95"
      />

      {/* Ripple Layer 3 */}
      <circle
        cx="512"
        cy="512"
        r="420"
        fill="none"
        stroke="white"
        strokeWidth="50"
        opacity="0.15"
        filter="url(#adaptiveBlur)"
      />

      {/* Ripple Layer 2 */}
      <circle
        cx="512"
        cy="512"
        r="300"
        fill="none"
        stroke="white"
        strokeWidth="45"
        opacity="0.25"
        filter="url(#adaptiveBlur)"
      />

      {/* Ripple Layer 1 */}
      <circle
        cx="512"
        cy="512"
        r="180"
        fill="none"
        stroke="white"
        strokeWidth="35"
        opacity="0.4"
        filter="url(#adaptiveBlur)"
      />

      {/* Core bloom */}
      <circle
        cx="512"
        cy="512"
        r="120"
        fill="white"
        opacity="0.2"
      />

      {/* Central core */}
      <circle
        cx="512"
        cy="512"
        r="64"
        fill="white"
        opacity="0.95"
      />

      {/* Core highlight */}
      <ellipse
        cx="490"
        cy="490"
        rx="28"
        ry="24"
        fill="white"
        opacity="0.6"
      />

      {/* Glass overlay */}
      <circle
        cx="512"
        cy="512"
        r="450"
        fill="white"
        opacity="0.05"
      />
    </svg>
  );
};
