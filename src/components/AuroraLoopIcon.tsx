import { motion } from 'motion/react';

interface AuroraLoopIconProps {
  variant?: 'primary' | 'matte' | 'flat' | 'animated';
  size?: number;
  animated?: boolean;
  className?: string;
}

export const AuroraLoopIcon = ({ 
  variant = 'primary', 
  size = 64, 
  animated = false,
  className = '' 
}: AuroraLoopIconProps) => {
  
  // Primary and Animated variants - Full 3D Aurora Loop
  if (variant === 'primary' || variant === 'animated') {
    const isAnimated = animated || variant === 'animated';
    
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
          {/* Background gradient - Deep navy glass */}
          <radialGradient id="auroraBackground" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#11172E" />
            <stop offset="100%" stopColor="#0B0F2C" />
          </radialGradient>

          {/* Main Aurora gradient - Indigo to Aqua to Soft Teal */}
          <linearGradient id="auroraMainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4B5CFB" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#2A8FD9" stopOpacity="0.92" />
            <stop offset="60%" stopColor="#00C7B7" stopOpacity="0.90" />
            <stop offset="100%" stopColor="#56F0E5" stopOpacity="0.85" />
          </linearGradient>

          {/* Aurora inner glow gradient */}
          <linearGradient id="auroraInnerGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4B5CFB" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#56F0E5" stopOpacity="0.5" />
          </linearGradient>

          {/* Top highlight gradient - cool white */}
          <linearGradient id="topHighlight" x1="30%" y1="0%" x2="70%" y2="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#E0F2FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Bottom aqua reflection */}
          <linearGradient id="bottomReflection" x1="50%" y1="100%" x2="50%" y2="50%">
            <stop offset="0%" stopColor="#00C7B7" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#56F0E5" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#00C7B7" stopOpacity="0" />
          </linearGradient>

          {/* Edge fade gradient - for tapering ends */}
          <linearGradient id="edgeFadeLeft" x1="0%" y1="50%" x2="30%" y2="50%">
            <stop offset="0%" stopColor="#4B5CFB" stopOpacity="0" />
            <stop offset="100%" stopColor="#4B5CFB" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="edgeFadeRight" x1="70%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#56F0E5" stopOpacity="1" />
            <stop offset="100%" stopColor="#56F0E5" stopOpacity="0" />
          </linearGradient>

          {/* Inner bloom at midpoint */}
          <radialGradient id="midpointBloom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="40%" stopColor="#00C7B7" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#00C7B7" stopOpacity="0" />
          </radialGradient>

          {/* Ambient glow behind loop */}
          <radialGradient id="ambientGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00C7B7" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#4B5CFB" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#4B5CFB" stopOpacity="0" />
          </radialGradient>

          {/* Shimmer gradient for animation */}
          <linearGradient id="shimmerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Filters */}
          <filter id="auroraGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1.5 0"/>
          </filter>

          <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="15" />
            <feOffset dx="0" dy="20" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glassBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>

          <filter id="fineDetail">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" />
          </filter>

          <filter id="dispersionSparkle">
            <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="3" result="noise" seed="5" />
            <feColorMatrix in="noise" type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 0 0 1" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="noise" mode="screen" />
          </filter>

          <filter id="innerBloom" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="25" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1.8 0"/>
          </filter>

          {/* Reflection gradient for ground plane */}
          <linearGradient id="reflectionPlane" x1="50%" y1="70%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#00C7B7" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#00C7B7" stopOpacity="0" />
          </linearGradient>

          {/* Clip path for arc - 240° loop */}
          <clipPath id="arcClip">
            <path d="M 512 512 L 872 512 A 360 360 0 1 1 242 272 L 512 512 Z" />
          </clipPath>
        </defs>

        {/* Background */}
        <circle
          cx="512"
          cy="512"
          r="512"
          fill="url(#auroraBackground)"
        />

        {/* Ambient glow behind the loop */}
        <circle
          cx="512"
          cy="512"
          r="380"
          fill="url(#ambientGlow)"
          filter="url(#auroraGlow)"
        />

        {/* Reflection plane (glass ground effect) */}
        <ellipse
          cx="512"
          cy="700"
          rx="350"
          ry="80"
          fill="url(#reflectionPlane)"
          opacity="0.6"
        />

        {/* Main Aurora Loop with shadow */}
        <g filter="url(#softShadow)">
          {/* Base arc path - semi-open loop 240° */}
          <path
            d="M 780 240 A 340 340 0 1 1 244 780"
            fill="none"
            stroke="url(#auroraMainGradient)"
            strokeWidth="85"
            strokeLinecap="round"
            opacity="0.92"
          />

          {/* Inner glow layer */}
          <path
            d="M 780 240 A 340 340 0 1 1 244 780"
            fill="none"
            stroke="url(#auroraInnerGlow)"
            strokeWidth="60"
            strokeLinecap="round"
            opacity="0.7"
            filter="url(#glassBlur)"
          />

          {/* Outer edge definition */}
          <path
            d="M 780 240 A 340 340 0 1 1 244 780"
            fill="none"
            stroke="url(#auroraMainGradient)"
            strokeWidth="92"
            strokeLinecap="round"
            opacity="0.5"
            filter="url(#glassBlur)"
          />
        </g>

        {/* Top-left cool highlight */}
        <path
          d="M 700 190 A 340 340 0 0 1 850 350"
          fill="none"
          stroke="url(#topHighlight)"
          strokeWidth="40"
          strokeLinecap="round"
          filter="url(#fineDetail)"
        />

        {/* Top gloss spot */}
        <ellipse
          cx="770"
          cy="250"
          rx="45"
          ry="22"
          fill="#FFFFFF"
          opacity="0.35"
          filter="url(#glassBlur)"
        />

        {/* Bottom-right aqua reflection */}
        <path
          d="M 150 700 A 340 340 0 0 1 280 830"
          fill="none"
          stroke="url(#bottomReflection)"
          strokeWidth="50"
          strokeLinecap="round"
          filter="url(#fineDetail)"
        />

        {/* Bottom aqua accent spot */}
        <ellipse
          cx="260"
          cy="765"
          rx="40"
          ry="20"
          fill="#00C7B7"
          opacity="0.3"
          filter="url(#glassBlur)"
        />

        {/* Inner edge highlights for 3D depth */}
        <path
          d="M 780 240 A 340 340 0 1 1 244 780"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.15"
        />

        <path
          d="M 765 255 A 320 320 0 1 1 259 765"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.1"
        />

        {/* Midpoint inner bloom */}
        <circle
          cx="195"
          cy="512"
          r="70"
          fill="url(#midpointBloom)"
          filter="url(#innerBloom)"
        />

        {/* White glow at midpoint (left edge of arc) */}
        <circle
          cx="195"
          cy="512"
          r="35"
          fill="#FFFFFF"
          opacity="0.25"
        />

        {/* Dispersion sparkle overlay */}
        <path
          d="M 780 240 A 340 340 0 1 1 244 780"
          fill="none"
          stroke="url(#auroraMainGradient)"
          strokeWidth="85"
          strokeLinecap="round"
          opacity="0.05"
          filter="url(#dispersionSparkle)"
        />

        {/* Shimmer animation overlay */}
        {isAnimated && (
          <motion.path
            d="M 780 240 A 340 340 0 1 1 244 780"
            fill="none"
            stroke="url(#shimmerGradient)"
            strokeWidth="85"
            strokeLinecap="round"
            initial={{ strokeDasharray: "2400", strokeDashoffset: 2400 }}
            animate={{ strokeDashoffset: [2400, 0, 2400] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Breathing pulse effect on main arc */}
        {isAnimated && (
          <motion.path
            d="M 780 240 A 340 340 0 1 1 244 780"
            fill="none"
            stroke="url(#auroraInnerGlow)"
            strokeWidth="60"
            strokeLinecap="round"
            animate={{
              opacity: [0.7, 0.9, 0.7],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Soft inner shadow for depth */}
        <path
          d="M 780 240 A 340 340 0 1 1 244 780"
          fill="none"
          stroke="#000000"
          strokeWidth="75"
          strokeLinecap="round"
          opacity="0.15"
          transform="translate(0, 8)"
          filter="url(#glassBlur)"
        />

        {/* Edge taper effects - soften the ends */}
        <circle
          cx="780"
          cy="240"
          r="50"
          fill="url(#edgeFadeLeft)"
          opacity="0.3"
          filter="url(#glassBlur)"
        />

        <circle
          cx="244"
          cy="780"
          r="50"
          fill="url(#edgeFadeRight)"
          opacity="0.3"
          filter="url(#glassBlur)"
        />

        {/* Fine refractive edge details */}
        <path
          d="M 750 220 A 340 340 0 0 1 800 270"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.2"
        />

        <path
          d="M 220 750 A 340 340 0 0 1 270 800"
          fill="none"
          stroke="#56F0E5"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.2"
        />
      </svg>
    );
  }

  // Matte variant - Frosted gradient band
  if (variant === 'matte') {
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
          <radialGradient id="matteBackground" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1A1F3A" />
            <stop offset="100%" stopColor="#0F1428" />
          </radialGradient>

          <linearGradient id="matteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#E0F2FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#A0E7FF" stopOpacity="0.3" />
          </linearGradient>

          <filter id="matteFrosted">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>

          <filter id="matteGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
          </filter>
        </defs>

        <circle cx="512" cy="512" r="512" fill="url(#matteBackground)" />

        {/* Glow layer */}
        <path
          d="M 780 240 A 340 340 0 1 1 244 780"
          fill="none"
          stroke="url(#matteGradient)"
          strokeWidth="85"
          strokeLinecap="round"
          opacity="0.3"
          filter="url(#matteGlow)"
        />

        {/* Main frosted arc */}
        <path
          d="M 780 240 A 340 340 0 1 1 244 780"
          fill="none"
          stroke="url(#matteGradient)"
          strokeWidth="85"
          strokeLinecap="round"
          opacity="0.7"
          filter="url(#matteFrosted)"
        />

        {/* Edge highlights */}
        <path
          d="M 780 240 A 340 340 0 1 1 244 780"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.2"
        />

        {/* Midpoint glow */}
        <circle
          cx="195"
          cy="512"
          r="35"
          fill="#FFFFFF"
          opacity="0.15"
          filter="url(#matteGlow)"
        />
      </svg>
    );
  }

  // Flat variant - Simplified two-color gradient arc for app launcher
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
        <radialGradient id="flatBackground" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#11172E" />
          <stop offset="100%" stopColor="#0B0F2C" />
        </radialGradient>

        <linearGradient id="flatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B5CFB" />
          <stop offset="50%" stopColor="#00C7B7" />
          <stop offset="100%" stopColor="#56F0E5" />
        </linearGradient>
      </defs>

      <circle cx="512" cy="512" r="512" fill="url(#flatBackground)" />

      {/* Simple flat arc */}
      <path
        d="M 780 240 A 340 340 0 1 1 244 780"
        fill="none"
        stroke="url(#flatGradient)"
        strokeWidth="80"
        strokeLinecap="round"
      />

      {/* Single highlight */}
      <path
        d="M 750 220 A 340 340 0 0 1 800 270"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  );
};
