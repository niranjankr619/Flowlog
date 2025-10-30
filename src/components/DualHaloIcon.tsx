import { motion } from 'motion/react';

interface DualHaloIconProps {
  variant?: 'primary' | 'matte' | 'flat' | 'animated';
  size?: number;
  animated?: boolean;
  className?: string;
}

export const DualHaloIcon = ({ 
  variant = 'primary', 
  size = 64, 
  animated = false,
  className = '' 
}: DualHaloIconProps) => {
  
  // Primary and Animated variants - Full 3D Dual Halo
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
          <radialGradient id="dualHaloBackground" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#141A36" />
            <stop offset="100%" stopColor="#0B0F2C" />
          </radialGradient>

          {/* Inner ring gradient - Aqua */}
          <linearGradient id="innerRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00C7B7" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#1BD6C7" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#56F0E5" stopOpacity="0.8" />
          </linearGradient>

          {/* Outer ring gradient - Indigo */}
          <linearGradient id="outerRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4B5CFB" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#3A48D9" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2E3092" stopOpacity="0.75" />
          </linearGradient>

          {/* Inner ring glass refraction */}
          <radialGradient id="innerRingRefraction" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="30%" stopColor="#00C7B7" stopOpacity="0.15" />
            <stop offset="70%" stopColor="#00C7B7" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#56F0E5" stopOpacity="0.1" />
          </radialGradient>

          {/* Outer ring glass refraction */}
          <radialGradient id="outerRingRefraction" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.2" />
            <stop offset="30%" stopColor="#4B5CFB" stopOpacity="0.12" />
            <stop offset="70%" stopColor="#4B5CFB" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#2E3092" stopOpacity="0.08" />
          </radialGradient>

          {/* Core glow gradient */}
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="30%" stopColor="#F0F9FF" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#B8E6FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00C7B7" stopOpacity="0" />
          </radialGradient>

          {/* Core bloom */}
          <radialGradient id="coreBloom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="40%" stopColor="#E0F2FF" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#00C7B7" stopOpacity="0" />
          </radialGradient>

          {/* Ambient glow */}
          <radialGradient id="ambientGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#56F0E5" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#4B5CFB" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#2E3092" stopOpacity="0" />
          </radialGradient>

          {/* Top-left gloss highlight */}
          <linearGradient id="topGloss" x1="30%" y1="20%" x2="70%" y2="60%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#E0F2FF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Bottom-right aqua reflection */}
          <linearGradient id="bottomReflection" x1="50%" y1="100%" x2="50%" y2="50%">
            <stop offset="0%" stopColor="#00C7B7" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#56F0E5" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#00C7B7" stopOpacity="0" />
          </linearGradient>

          {/* Filters */}
          <filter id="dualHaloGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="25" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1.5 0"/>
          </filter>

          <filter id="coreBloomFilter" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="35" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2 0"/>
          </filter>

          <filter id="softShadow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="18" />
            <feOffset dx="0" dy="15" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.35" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glassBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
          </filter>

          <filter id="fineGlassDetail">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
          </filter>

          <filter id="noiseGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" seed="7" />
            <feColorMatrix in="noise" type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 1" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="noise" mode="overlay" />
          </filter>

          <filter id="innerLightDiffusion">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1.2 0"/>
          </filter>
        </defs>

        {/* Background */}
        <circle
          cx="512"
          cy="512"
          r="512"
          fill="url(#dualHaloBackground)"
        />

        {/* Ambient glow behind rings */}
        <circle
          cx="512"
          cy="512"
          r="400"
          fill="url(#ambientGlow)"
          filter="url(#dualHaloGlow)"
        />

        {/* Soft shadows for floating effect */}
        <g filter="url(#softShadow)">
          {/* Outer ring shadow */}
          <circle
            cx="512"
            cy="527"
            r="360"
            fill="none"
            stroke="#000000"
            strokeWidth="72"
            opacity="0.2"
          />
          
          {/* Inner ring shadow */}
          <circle
            cx="512"
            cy="524"
            r="260"
            fill="none"
            stroke="#000000"
            strokeWidth="52"
            opacity="0.15"
          />
        </g>

        {/* Outer ring - Indigo */}
        {isAnimated ? (
          <motion.g
            animate={{ rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{ transformOrigin: 'center' }}
          >
            {/* Main outer ring */}
            <circle
              cx="512"
              cy="512"
              r="360"
              fill="none"
              stroke="url(#outerRingGradient)"
              strokeWidth="70"
            />
            
            {/* Outer ring glass layer */}
            <circle
              cx="512"
              cy="512"
              r="360"
              fill="none"
              stroke="url(#outerRingRefraction)"
              strokeWidth="50"
              filter="url(#glassBlur)"
            />

            {/* Outer ring edge definition */}
            <circle
              cx="512"
              cy="512"
              r="360"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              opacity="0.15"
            />

            <circle
              cx="512"
              cy="512"
              r="395"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1"
              opacity="0.08"
            />

            {/* Outer ring inner edge */}
            <circle
              cx="512"
              cy="512"
              r="325"
              fill="none"
              stroke="#2E3092"
              strokeWidth="1"
              opacity="0.2"
            />
          </motion.g>
        ) : (
          <g>
            {/* Main outer ring */}
            <circle
              cx="512"
              cy="512"
              r="360"
              fill="none"
              stroke="url(#outerRingGradient)"
              strokeWidth="70"
            />
            
            {/* Outer ring glass layer */}
            <circle
              cx="512"
              cy="512"
              r="360"
              fill="none"
              stroke="url(#outerRingRefraction)"
              strokeWidth="50"
              filter="url(#glassBlur)"
            />

            {/* Outer ring edge definition */}
            <circle
              cx="512"
              cy="512"
              r="360"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              opacity="0.15"
            />

            <circle
              cx="512"
              cy="512"
              r="395"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1"
              opacity="0.08"
            />

            {/* Outer ring inner edge */}
            <circle
              cx="512"
              cy="512"
              r="325"
              fill="none"
              stroke="#2E3092"
              strokeWidth="1"
              opacity="0.2"
            />
          </g>
        )}

        {/* Outer ring top-left gloss */}
        <ellipse
          cx="400"
          cy="200"
          rx="90"
          ry="35"
          fill="url(#topGloss)"
          transform="rotate(-35 400 200)"
          filter="url(#fineGlassDetail)"
        />

        {/* Outer ring bottom-right reflection */}
        <ellipse
          cx="640"
          cy="750"
          rx="80"
          ry="30"
          fill="url(#bottomReflection)"
          transform="rotate(25 640 750)"
          filter="url(#fineGlassDetail)"
        />

        {/* Inner ring - Aqua */}
        {isAnimated ? (
          <motion.g
            animate={{ rotate: -360 }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{ transformOrigin: 'center' }}
          >
            {/* Main inner ring */}
            <circle
              cx="512"
              cy="512"
              r="260"
              fill="none"
              stroke="url(#innerRingGradient)"
              strokeWidth="50"
            />
            
            {/* Inner ring glass layer */}
            <circle
              cx="512"
              cy="512"
              r="260"
              fill="none"
              stroke="url(#innerRingRefraction)"
              strokeWidth="35"
              filter="url(#glassBlur)"
            />

            {/* Inner ring edge highlights */}
            <circle
              cx="512"
              cy="512"
              r="260"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              opacity="0.2"
            />

            <circle
              cx="512"
              cy="512"
              r="285"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              opacity="0.12"
            />

            {/* Inner ring inner edge */}
            <circle
              cx="512"
              cy="512"
              r="235"
              fill="none"
              stroke="#56F0E5"
              strokeWidth="1.2"
              opacity="0.25"
            />
          </motion.g>
        ) : (
          <g>
            {/* Main inner ring */}
            <circle
              cx="512"
              cy="512"
              r="260"
              fill="none"
              stroke="url(#innerRingGradient)"
              strokeWidth="50"
            />
            
            {/* Inner ring glass layer */}
            <circle
              cx="512"
              cy="512"
              r="260"
              fill="none"
              stroke="url(#innerRingRefraction)"
              strokeWidth="35"
              filter="url(#glassBlur)"
            />

            {/* Inner ring edge highlights */}
            <circle
              cx="512"
              cy="512"
              r="260"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              opacity="0.2"
            />

            <circle
              cx="512"
              cy="512"
              r="285"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              opacity="0.12"
            />

            {/* Inner ring inner edge */}
            <circle
              cx="512"
              cy="512"
              r="235"
              fill="none"
              stroke="#56F0E5"
              strokeWidth="1.2"
              opacity="0.25"
            />
          </g>
        )}

        {/* Inner ring top gloss */}
        <ellipse
          cx="512"
          cy="220"
          rx="70"
          ry="25"
          fill="#FFFFFF"
          opacity="0.3"
          filter="url(#fineGlassDetail)"
        />

        {/* Inner ring aqua accent */}
        <ellipse
          cx="512"
          cy="770"
          rx="60"
          ry="22"
          fill="#00C7B7"
          opacity="0.25"
          filter="url(#fineGlassDetail)"
        />

        {/* Core glow with breathing pulse */}
        {isAnimated ? (
          <motion.g
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <circle
              cx="512"
              cy="512"
              r="128"
              fill="url(#coreGlow)"
              filter="url(#coreBloomFilter)"
            />
          </motion.g>
        ) : (
          <circle
            cx="512"
            cy="512"
            r="128"
            fill="url(#coreGlow)"
            filter="url(#coreBloomFilter)"
            opacity="0.3"
          />
        )}

        {/* Core solid orb */}
        <circle
          cx="512"
          cy="512"
          r="64"
          fill="url(#coreBloom)"
        />

        {/* Core center white */}
        <circle
          cx="512"
          cy="512"
          r="35"
          fill="#FFFFFF"
          opacity="0.8"
        />

        {/* Core top highlight */}
        <ellipse
          cx="512"
          cy="490"
          rx="28"
          ry="18"
          fill="#FFFFFF"
          opacity="0.5"
          filter="url(#glassBlur)"
        />

        {/* Core subtle shimmer */}
        <circle
          cx="512"
          cy="512"
          r="55"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          opacity="0.15"
        />

        {/* Light diffusion layer for inner glow */}
        <circle
          cx="512"
          cy="512"
          r="260"
          fill="none"
          stroke="url(#innerRingGradient)"
          strokeWidth="50"
          opacity="0.15"
          filter="url(#innerLightDiffusion)"
        />

        <circle
          cx="512"
          cy="512"
          r="360"
          fill="none"
          stroke="url(#outerRingGradient)"
          strokeWidth="70"
          opacity="0.1"
          filter="url(#innerLightDiffusion)"
        />

        {/* Noise grain overlay for realism */}
        <circle
          cx="512"
          cy="512"
          r="360"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="70"
          opacity="0.06"
          filter="url(#noiseGrain)"
        />

        <circle
          cx="512"
          cy="512"
          r="260"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="50"
          opacity="0.05"
          filter="url(#noiseGrain)"
        />
      </svg>
    );
  }

  // Matte variant - Frosted halo for dark mode
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

          <filter id="matteFrosted">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" />
          </filter>

          <filter id="matteGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
          </filter>
        </defs>

        <circle cx="512" cy="512" r="512" fill="url(#matteBackground)" />

        {/* Glow layers */}
        <circle
          cx="512"
          cy="512"
          r="360"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="70"
          opacity="0.15"
          filter="url(#matteGlow)"
        />

        <circle
          cx="512"
          cy="512"
          r="260"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="50"
          opacity="0.2"
          filter="url(#matteGlow)"
        />

        {/* Main frosted rings */}
        <circle
          cx="512"
          cy="512"
          r="360"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="70"
          opacity="0.4"
          filter="url(#matteFrosted)"
        />

        <circle
          cx="512"
          cy="512"
          r="260"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="50"
          opacity="0.5"
          filter="url(#matteFrosted)"
        />

        {/* Edge highlights */}
        <circle
          cx="512"
          cy="512"
          r="360"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          opacity="0.2"
        />

        <circle
          cx="512"
          cy="512"
          r="260"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          opacity="0.25"
        />

        {/* Core */}
        <circle
          cx="512"
          cy="512"
          r="64"
          fill="#FFFFFF"
          opacity="0.2"
          filter="url(#matteGlow)"
        />

        <circle
          cx="512"
          cy="512"
          r="35"
          fill="#FFFFFF"
          opacity="0.4"
        />
      </svg>
    );
  }

  // Flat variant - Simplified for app launcher
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

        <linearGradient id="flatInnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00C7B7" />
          <stop offset="100%" stopColor="#56F0E5" />
        </linearGradient>

        <linearGradient id="flatOuterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B5CFB" />
          <stop offset="100%" stopColor="#2E3092" />
        </linearGradient>
      </defs>

      <circle cx="512" cy="512" r="512" fill="url(#flatBackground)" />

      {/* Simple flat rings */}
      <circle
        cx="512"
        cy="512"
        r="360"
        fill="none"
        stroke="url(#flatOuterGradient)"
        strokeWidth="68"
      />

      <circle
        cx="512"
        cy="512"
        r="260"
        fill="none"
        stroke="url(#flatInnerGradient)"
        strokeWidth="48"
      />

      {/* Simple core */}
      <circle
        cx="512"
        cy="512"
        r="40"
        fill="#FFFFFF"
        opacity="0.5"
      />

      {/* Highlights */}
      <circle
        cx="512"
        cy="512"
        r="360"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2"
        opacity="0.2"
      />

      <circle
        cx="512"
        cy="512"
        r="260"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2"
        opacity="0.25"
      />
    </svg>
  );
};
