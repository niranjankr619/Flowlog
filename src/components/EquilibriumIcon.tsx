import { motion } from 'motion/react';

interface EquilibriumIconProps {
  variant?: 'primary' | 'matte' | 'flat' | 'animated' | 'login';
  size?: number;
  animated?: boolean;
  className?: string;
}

export const EquilibriumIcon = ({ 
  variant = 'primary', 
  size = 64, 
  animated = false,
  className = '' 
}: EquilibriumIconProps) => {
  
  // Login variant - sophisticated floating with visible rings
  if (variant === 'login') {
    return (
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 1024 1024"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        animate={{
          y: [0, -12, 0],
        }}
        transition={{
          y: {
            duration: 5,
            repeat: Infinity,
            ease: [0.45, 0.05, 0.55, 0.95],
          },
        }}
      >
        <defs>
          {/* Luxurious gradients */}
          <radialGradient id="soulGradientLogin" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#6B7DFF" />
            <stop offset="35%" stopColor="#4B5CFB" />
            <stop offset="70%" stopColor="#2E86D4" />
            <stop offset="100%" stopColor="#00C7B7" />
          </radialGradient>

          <linearGradient id="workRingLogin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4B5CFB" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#6B7DFF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#4B5CFB" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="lifeRingLogin" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00C7B7" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#00E5D0" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#00C7B7" stopOpacity="0.95" />
          </linearGradient>

          <radialGradient id="soulShineLogin" cx="30%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>

          {/* Clip path for sphere - hides orbit segments passing through */}
          <clipPath id="sphereMaskLogin">
            <circle cx="512" cy="512" r="205" />
          </clipPath>

          {/* Inverse mask - shows everything EXCEPT the sphere */}
          <mask id="behindSphereLogin">
            <rect width="1024" height="1024" fill="white" />
            <circle cx="512" cy="512" r="205" fill="black" />
          </mask>

          <filter id="luxuryGlowLogin" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.6 0" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="premiumShadowLogin" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="20" />
            <feOffset dx="0" dy="20" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Everything tilted 25° for natural look */}
        <g transform="rotate(25 512 512)">
          {/* Soft shadow */}
          <ellipse cx="512" cy="680" rx="180" ry="40" fill="#000000" opacity="0.2" filter="blur(20px)" />

          {/* Life Ring - BACK portions (Aqua) - behind sphere, dimmed */}
          <motion.g
            mask="url(#behindSphereLogin)"
            animate={{
              opacity: [0.5, 0.65, 0.5],
            }}
            transition={{
              duration: 4,
              delay: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <ellipse
              cx="512"
              cy="512"
              rx="340"
              ry="120"
              fill="none"
              stroke="url(#lifeRingLogin)"
              strokeWidth="7"
              transform="rotate(-45 512 512)"
              filter="url(#luxuryGlowLogin)"
            />
          </motion.g>

          {/* Work Ring - BACK portions (Indigo) - behind sphere, dimmed */}
          <motion.g
            mask="url(#behindSphereLogin)"
            animate={{
              opacity: [0.45, 0.6, 0.45],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <ellipse
              cx="512"
              cy="512"
              rx="340"
              ry="120"
              fill="none"
              stroke="url(#workRingLogin)"
              strokeWidth="7"
              transform="rotate(45 512 512)"
              filter="url(#luxuryGlowLogin)"
            />
          </motion.g>

          {/* Soul - Central Sphere */}
          <g filter="url(#premiumShadowLogin)">
            <circle cx="512" cy="512" r="200" fill="url(#soulGradientLogin)" />
          </g>

          {/* Soul highlight */}
          <ellipse cx="512" cy="430" rx="110" ry="80" fill="url(#soulShineLogin)" />

          {/* Soul rim light */}
          <circle cx="512" cy="512" r="200" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.3" />
          <circle cx="512" cy="512" r="198" fill="none" stroke="url(#soulGradientLogin)" strokeWidth="1" opacity="0.5" />

          {/* Life Ring - FRONT portions (Aqua) - crossing over sphere */}
          <motion.g
            clipPath="url(#sphereMaskLogin)"
            animate={{
              opacity: [0.9, 1, 0.9],
            }}
            transition={{
              duration: 4,
              delay: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <ellipse
              cx="512"
              cy="512"
              rx="340"
              ry="120"
              fill="none"
              stroke="url(#lifeRingLogin)"
              strokeWidth="7"
              transform="rotate(-45 512 512)"
              filter="url(#luxuryGlowLogin)"
            />
          </motion.g>

          {/* Work Ring - FRONT portions (Indigo) - crossing over sphere */}
          <motion.g
            clipPath="url(#sphereMaskLogin)"
            animate={{
              opacity: [0.85, 1, 0.85],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <ellipse
              cx="512"
              cy="512"
              rx="340"
              ry="120"
              fill="none"
              stroke="url(#workRingLogin)"
              strokeWidth="7"
              transform="rotate(45 512 512)"
              filter="url(#luxuryGlowLogin)"
            />
          </motion.g>
        </g>

        {/* Inner glow */}
        <motion.circle
          cx="512"
          cy="512"
          r="200"
          fill="url(#soulGradientLogin)"
          opacity="0.3"
          filter="url(#luxuryGlowLogin)"
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '512px 512px' }}
        />
      </motion.svg>
    );
  }
  
  // Primary and Animated variants - Full luxury animation
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
          {/* Premium gradients */}
          <radialGradient id="soulGradient" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#6B7DFF" />
            <stop offset="35%" stopColor="#4B5CFB" />
            <stop offset="70%" stopColor="#2E86D4" />
            <stop offset="100%" stopColor="#00C7B7" />
          </radialGradient>

          <linearGradient id="workRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4B5CFB" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#6B7DFF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#4B5CFB" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="lifeRing" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00C7B7" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#00E5D0" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#00C7B7" stopOpacity="0.95" />
          </linearGradient>

          <radialGradient id="soulShine" cx="30%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>

          {/* Clip paths for 3D orbital depth */}
          <clipPath id="sphereMask">
            <circle cx="512" cy="512" r="205" />
          </clipPath>

          <mask id="behindSphere">
            <rect width="1024" height="1024" fill="white" />
            <circle cx="512" cy="512" r="205" fill="black" />
          </mask>

          <filter id="luxuryGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.6 0" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="premiumShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="20" />
            <feOffset dx="0" dy="20" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Everything tilted 25° for natural look */}
        <g transform="rotate(25 512 512)">
          {/* Luxury shadow */}
          <ellipse cx="512" cy="680" rx="180" ry="40" fill="#000000" opacity="0.2" filter="blur(20px)" />

          {/* Life Ring - BACK portions (Aqua) - behind sphere, dimmed */}
          {isAnimated ? (
            <motion.g
              mask="url(#behindSphere)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.3, 1],
                opacity: [0, 0.7, 0.5],
              }}
              transition={{
                duration: 1.8,
                delay: 0.4,
                times: [0, 0.6, 1],
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <ellipse
                cx="512"
                cy="512"
                rx="340"
                ry="120"
                fill="none"
                stroke="url(#lifeRing)"
                strokeWidth="7"
                transform="rotate(-45 512 512)"
                filter="url(#luxuryGlow)"
              />
            </motion.g>
          ) : (
            <g mask="url(#behindSphere)">
              <ellipse
                cx="512"
                cy="512"
                rx="340"
                ry="120"
                fill="none"
                stroke="url(#lifeRing)"
                strokeWidth="7"
                opacity="0.5"
                transform="rotate(-45 512 512)"
                filter="url(#luxuryGlow)"
              />
            </g>
          )}

          {/* Work Ring - BACK portions (Indigo) - behind sphere, dimmed */}
          {isAnimated ? (
            <motion.g
              mask="url(#behindSphere)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.3, 1],
                opacity: [0, 0.65, 0.45],
              }}
              transition={{
                duration: 1.8,
                times: [0, 0.6, 1],
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <ellipse
                cx="512"
                cy="512"
                rx="340"
                ry="120"
                fill="none"
                stroke="url(#workRing)"
                strokeWidth="7"
                transform="rotate(45 512 512)"
                filter="url(#luxuryGlow)"
              />
            </motion.g>
          ) : (
            <g mask="url(#behindSphere)">
              <ellipse
                cx="512"
                cy="512"
                rx="340"
                ry="120"
                fill="none"
                stroke="url(#workRing)"
                strokeWidth="7"
                opacity="0.45"
                transform="rotate(45 512 512)"
                filter="url(#luxuryGlow)"
              />
            </g>
          )}

          {/* Soul - Central Sphere */}
          <g filter="url(#premiumShadow)">
            <circle cx="512" cy="512" r="200" fill="url(#soulGradient)" />
          </g>

          {/* Soul highlight */}
          <ellipse cx="512" cy="430" rx="110" ry="80" fill="url(#soulShine)" />

          {/* Soul rim light */}
          <circle cx="512" cy="512" r="200" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.3" />
          <circle cx="512" cy="512" r="198" fill="none" stroke="url(#soulGradient)" strokeWidth="1" opacity="0.5" />

          {/* Life Ring - FRONT portions (Aqua) - crossing over sphere */}
          {isAnimated ? (
            <motion.g
              clipPath="url(#sphereMask)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.3, 1],
                opacity: [0, 1, 0.9],
              }}
              transition={{
                duration: 1.8,
                delay: 0.4,
                times: [0, 0.6, 1],
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <ellipse
                cx="512"
                cy="512"
                rx="340"
                ry="120"
                fill="none"
                stroke="url(#lifeRing)"
                strokeWidth="7"
                transform="rotate(-45 512 512)"
                filter="url(#luxuryGlow)"
              />
            </motion.g>
          ) : (
            <g clipPath="url(#sphereMask)">
              <ellipse
                cx="512"
                cy="512"
                rx="340"
                ry="120"
                fill="none"
                stroke="url(#lifeRing)"
                strokeWidth="7"
                opacity="0.9"
                transform="rotate(-45 512 512)"
                filter="url(#luxuryGlow)"
              />
            </g>
          )}

          {/* Work Ring - FRONT portions (Indigo) - crossing over sphere */}
          {isAnimated ? (
            <motion.g
              clipPath="url(#sphereMask)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.3, 1],
                opacity: [0, 1, 0.85],
              }}
              transition={{
                duration: 1.8,
                times: [0, 0.6, 1],
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <ellipse
                cx="512"
                cy="512"
                rx="340"
                ry="120"
                fill="none"
                stroke="url(#workRing)"
                strokeWidth="7"
                transform="rotate(45 512 512)"
                filter="url(#luxuryGlow)"
              />
            </motion.g>
          ) : (
            <g clipPath="url(#sphereMask)">
              <ellipse
                cx="512"
                cy="512"
                rx="340"
                ry="120"
                fill="none"
                stroke="url(#workRing)"
                strokeWidth="7"
                opacity="0.85"
                transform="rotate(45 512 512)"
                filter="url(#luxuryGlow)"
              />
            </g>
          )}
        </g>

        {/* Animated soul breathing */}
        {isAnimated && (
          <motion.circle
            cx="512"
            cy="512"
            r="200"
            fill="url(#soulGradient)"
            opacity="0.3"
            filter="url(#luxuryGlow)"
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '512px 512px' }}
          />
        )}
      </svg>
    );
  }

  // Matte variant
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
          <linearGradient id="matteGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        <g transform="rotate(25 512 512)">
          <ellipse cx="512" cy="512" rx="340" ry="120" fill="none" stroke="#FFFFFF" strokeWidth="5" opacity="0.5" transform="rotate(-45 512 512)" />
          <ellipse cx="512" cy="512" rx="340" ry="120" fill="none" stroke="#FFFFFF" strokeWidth="5" opacity="0.6" transform="rotate(45 512 512)" />
          <circle cx="512" cy="512" r="200" fill="url(#matteGradient)" />
          <circle cx="512" cy="512" r="200" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.4" />
        </g>
      </svg>
    );
  }

  // Flat variant
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
        <linearGradient id="flatGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4B5CFB" />
          <stop offset="100%" stopColor="#00C7B7" />
        </linearGradient>
      </defs>

      <g transform="rotate(25 512 512)">
        <ellipse cx="512" cy="512" rx="340" ry="120" fill="none" stroke="#00C7B7" strokeWidth="6" opacity="0.8" transform="rotate(-45 512 512)" />
        <ellipse cx="512" cy="512" rx="340" ry="120" fill="none" stroke="#4B5CFB" strokeWidth="6" opacity="0.7" transform="rotate(45 512 512)" />
        <circle cx="512" cy="512" r="200" fill="url(#flatGradient)" />
        <circle cx="512" cy="512" r="200" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.4" />
      </g>
    </svg>
  );
};
