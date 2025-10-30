import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../lib/AppContext';
import { EquilibriumIcon } from './EquilibriumIcon';
import { soundManager } from '../lib/sounds';

export const SplashScreen = () => {
  const { setCurrentScreen, setShowSplash } = useApp();

  useEffect(() => {
    // Play ambient entrance music
    playAmbientMusic();
    
    const timer = setTimeout(() => {
      setShowSplash(false);
      setCurrentScreen('login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [setCurrentScreen, setShowSplash]);

  // Melodious, grand, luxurious cinematic music for splash screen
  const playAmbientMusic = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create lush reverb for cathedral-like grandeur
    const createReverb = () => {
      const convolver = audioContext.createConvolver();
      const rate = audioContext.sampleRate;
      const length = rate * 3.5; // Extended reverb for luxury
      const impulse = audioContext.createBuffer(2, length, rate);
      const impulseL = impulse.getChannelData(0);
      const impulseR = impulse.getChannelData(1);
      
      for (let i = 0; i < length; i++) {
        const n = length - i;
        // Smoother decay for luxurious tail
        impulseL[i] = (Math.random() * 2 - 1) * Math.pow(n / length, 2.8);
        impulseR[i] = (Math.random() * 2 - 1) * Math.pow(n / length, 2.8);
      }
      
      convolver.buffer = impulse;
      return convolver;
    };
    
    const reverb = createReverb();
    const reverbGain = audioContext.createGain();
    reverbGain.gain.value = 0.5; // Rich reverb
    reverb.connect(reverbGain);
    reverbGain.connect(audioContext.destination);
    
    const masterGain = audioContext.createGain();
    masterGain.gain.value = 0.25; // Audible but luxurious
    masterGain.connect(audioContext.destination);
    
    // Play a shimmering harmonic with multiple partials (like a piano or strings)
    const playRichNote = (baseFreq: number, startTime: number, duration: number, volume: number = 0.06) => {
      // Add harmonics for richness (fundamental + overtones)
      const harmonics = [1, 2, 3, 4, 5, 6]; // Overtone series
      const harmonicVolumes = [1, 0.5, 0.3, 0.2, 0.15, 0.1]; // Decreasing volumes
      
      harmonics.forEach((harmonic, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        // Mix of sine and triangle for warmth
        oscillator.type = i < 2 ? 'sine' : 'triangle';
        oscillator.frequency.value = baseFreq * harmonic;
        
        // Gentle filtering for warmth
        filter.type = 'lowpass';
        filter.frequency.value = 3000 - (i * 200);
        filter.Q.value = 0.7;
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(masterGain);
        gainNode.connect(reverb);
        
        // Cinematic swell with gentle attack
        const noteVolume = volume * harmonicVolumes[i];
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(noteVolume, startTime + 0.6);
        gainNode.gain.linearRampToValueAtTime(noteVolume * 0.9, startTime + duration - 1.5);
        gainNode.gain.linearRampToValueAtTime(0.001, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      });
    };
    
    // Play ascending arpeggio with rich harmonics (cinematic rise)
    const playArpeggio = (frequencies: number[], startTime: number, noteSpacing: number, noteDuration: number) => {
      frequencies.forEach((freq, i) => {
        playRichNote(freq, startTime + (i * noteSpacing), noteDuration, 0.04 + (i * 0.008));
      });
    };

    const now = audioContext.currentTime;
    
    // Cinematic opening: Ascending major arpeggio with grandeur
    // C major pentatonic ascending (C, D, E, G, A, C) - uplifting and majestic
    const openingArpeggio = [
      261.63, // C4
      293.66, // D4
      329.63, // E4
      392.00, // G4
      440.00, // A4
      523.25, // C5
    ];
    
    playArpeggio(openingArpeggio, now + 0.2, 0.25, 2.5);
    
    // Grand sustained chord (Cmaj9 voicing) - arrives at peak
    const peakChord = [
      523.25,  // C5
      659.25,  // E5
      783.99,  // G5
      987.77,  // B5
      1174.66, // D6
    ];
    
    // Play each note of the chord with slight delay for shimmer
    peakChord.forEach((freq, i) => {
      playRichNote(freq, now + 1.7 + (i * 0.08), 3.5, 0.045);
    });
    
    // Descending melody line over the chord - adds motion and elegance
    const melody = [
      1174.66, // D6
      1046.50, // C6
      987.77,  // B5
      880.00,  // A5
    ];
    
    melody.forEach((freq, i) => {
      playRichNote(freq, now + 2.5 + (i * 0.4), 1.8, 0.035);
    });
  };

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 overflow-hidden"
      style={{
        width: '430px',
        height: '932px',
        background: 'linear-gradient(180deg, #000000 0%, #0A0A14 50%, #0F0F1E 100%)',
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Premium atmospheric layers */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 45%, rgba(75, 92, 251, 0.12) 0%, transparent 60%)',
          filter: 'blur(120px)',
        }}
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 55%, rgba(0, 199, 183, 0.1) 0%, transparent 60%)',
          filter: 'blur(100px)',
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Sophisticated rotating light rays */}
      {[0, 1].map((i) => (
        <motion.div
          key={`ray-${i}`}
          className="absolute inset-0"
          style={{
            background: `conic-gradient(from ${i * 180}deg at 50% 50%, 
              transparent 0deg, 
              rgba(75, 92, 251, 0.04) 30deg,
              transparent 60deg,
              transparent 180deg,
              rgba(0, 199, 183, 0.04) 210deg,
              transparent 240deg)`,
            filter: 'blur(40px)',
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 50 - i * 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Elegant particle field */}
      {[...Array(40)].map((_, i) => {
        const isWork = i % 2 === 0;
        const size = Math.random() * 2.5 + 0.8;
        const delay = Math.random() * 3;
        const duration = 7 + Math.random() * 4;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `${x}%`,
              top: `${y}%`,
              background: isWork ? '#4B5CFB' : '#00C7B7',
              boxShadow: `0 0 ${size * 3}px ${isWork ? 'rgba(75, 92, 251, 0.6)' : 'rgba(0, 199, 183, 0.6)'}`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.7, 0.3, 0],
              scale: [0, 1, 0.6, 0],
              y: [0, -80, -150],
              x: [0, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 60],
            }}
            transition={{
              duration: duration,
              delay: delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        );
      })}

      {/* Luxury expanding rings */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute rounded-full"
          style={{
            border: i % 2 === 0 ? '1px solid rgba(75, 92, 251, 0.1)' : '1px solid rgba(0, 199, 183, 0.1)',
          }}
          initial={{ width: 280, height: 280, opacity: 0 }}
          animate={{
            width: [280, 900, 1400],
            height: [280, 900, 1400],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: 4,
            delay: i * 0.5,
            ease: [0.23, 1, 0.32, 1],
          }}
        />
      ))}

      {/* Main content - with safe area consideration and perfect centering */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center"
        style={{
          paddingTop: '60px', // Top safe area
          paddingBottom: '48px', // Bottom safe area
          width: '100%',
        }}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ 
          scale: 1,
          opacity: 1,
        }}
        transition={{ 
          duration: 1.2, 
          delay: 0.3,
          ease: [0.23, 1, 0.32, 1],
        }}
      >
        {/* Icon section with cinematic 3D entrance */}
        <motion.div
          className="relative mb-12"
          initial={{ scale: 0.5, rotateX: -90, z: -400 }}
          animate={{ 
            scale: 1,
            rotateX: 0,
            z: 0,
          }}
          transition={{ 
            duration: 2,
            delay: 0.6,
            ease: [0.23, 1, 0.32, 1],
          }}
          style={{ 
            transformStyle: 'preserve-3d',
            perspective: 1500,
          }}
        >
          {/* Premium glow aura */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(75, 92, 251, 0.3) 0%, rgba(0, 199, 183, 0.25) 40%, transparent 65%)',
              filter: 'blur(60px)',
              width: 480,
              height: 480,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              opacity: [0.4, 0.7, 0.4],
              scale: [0.95, 1.1, 0.95],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Orbital light trails - -45° diagonal (Aqua) - BACK */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`life-trail-${i}`}
              className="absolute"
              style={{
                width: 340 + i * 55,
                height: 120 + i * 22,
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) rotate(20deg)`,
                border: '1px solid rgba(0, 199, 183, 0.12)',
                borderRadius: '50%',
                filter: 'blur(0.5px)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.3, 1],
                opacity: [0, 0.5, 0.12],
              }}
              transition={{
                duration: 2.2,
                delay: 1.5 + i * 0.2,
                ease: [0.23, 1, 0.32, 1],
              }}
            />
          ))}

          {/* Orbital light trails - 45° diagonal (Indigo) - FRONT */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`work-trail-${i}`}
              className="absolute"
              style={{
                width: 340 + i * 55,
                height: 120 + i * 22,
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) rotate(70deg)`,
                border: '1px solid rgba(75, 92, 251, 0.12)',
                borderRadius: '50%',
                filter: 'blur(0.5px)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.3, 1],
                opacity: [0, 0.5, 0.12],
              }}
              transition={{
                duration: 2.2,
                delay: 1.2 + i * 0.2,
                ease: [0.23, 1, 0.32, 1],
              }}
            />
          ))}

          {/* Orbiting energy particles on X paths */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const angle = (i * 45);
            const distance = 200;
            const isWork = i % 2 === 0;
            
            return (
              <motion.div
                key={`orbit-${i}`}
                className="absolute rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  background: isWork ? '#4B5CFB' : '#00C7B7',
                  boxShadow: `0 0 16px ${isWork ? 'rgba(75, 92, 251, 0.8)' : 'rgba(0, 199, 183, 0.8)'}`,
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: [
                    Math.cos((angle + 45) * Math.PI / 180) * distance,
                    Math.cos((angle + 45 + 360) * Math.PI / 180) * distance,
                  ],
                  y: [
                    Math.sin((angle + 45) * Math.PI / 180) * distance * 0.35,
                    Math.sin((angle + 45 + 360) * Math.PI / 180) * distance * 0.35,
                  ],
                  scale: [1, 1.6, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 10,
                  delay: 2 + i * 0.2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            );
          })}

          {/* Central icon with subtle 3D rotation */}
          <motion.div 
            className="relative"
            style={{ width: 280, height: 280 }}
            animate={{
              rotateY: [0, 12, 0, -12, 0],
              rotateX: [0, 4, 0, -4, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <EquilibriumIcon variant="animated" size={280} animated={true} />
          </motion.div>

          {/* Balance indicators - Work & Life labels following natural orbital paths */}
          {[
            { x: -160, y: -35, label: 'WORK', color: '#4B5CFB' },
            { x: 160, y: -35, label: 'LIFE', color: '#00C7B7' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 1],
                scale: [0, 1, 1],
                x: [item.x * 0.8, item.x, item.x],
                y: [item.y * 0.8, item.y - 8, item.y],
              }}
              transition={{
                opacity: { duration: 0.8, delay: 2.5 + i * 0.15 },
                scale: { duration: 0.5, delay: 2.5 + i * 0.15 },
                x: { duration: 3, delay: 2.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
                y: { duration: 3, delay: 2.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
              }}
            >
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: item.color,
                    boxShadow: `0 0 16px ${item.color}, 0 0 24px ${item.color}80`,
                  }}
                  animate={{
                    scale: [1, 1.6, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <span
                  className="text-white"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textShadow: `0 0 12px ${item.color}CC, 0 0 20px ${item.color}80, 0 2px 4px rgba(0, 0, 0, 0.4)`,
                    opacity: 0.9,
                  }}
                >
                  {item.label}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Brand section - Perfectly centered */}
        <motion.div
          className="text-center px-8 w-full flex flex-col items-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.2, duration: 1, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* FLOWLOG wordmark - Perfectly centered with letter-spacing compensation */}
          <motion.div className="relative mb-3 flex justify-center">
            <motion.h1
              className="text-white text-center"
              style={{
                fontSize: '3.5rem',
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 200,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                paddingLeft: '0.35em', // Compensate for letter-spacing visual offset
              }}
            >
              FLOW
              <span 
                style={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #4B5CFB 0%, #00C7B7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                LOG
              </span>
            </motion.h1>

            {/* Text glow effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                fontSize: '3.5rem',
                fontFamily: "'Urbanist', sans-serif",
                fontWeight: 200,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                filter: 'blur(18px)',
                opacity: 0.3,
                color: '#4B5CFB',
                paddingLeft: '0.35em', // Match compensation
              }}
              animate={{
                opacity: [0.25, 0.4, 0.25],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              FLOWLOG
            </motion.div>
          </motion.div>

          {/* Tagline - Enhanced visibility */}
          <motion.p
            className="text-white/80 mb-10"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              fontWeight: 400,
              letterSpacing: '0.12em',
              textShadow: '0 2px 12px rgba(75, 92, 251, 0.4), 0 4px 24px rgba(0, 199, 183, 0.3)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.6 }}
          >
            Balance Your Soul. Master Your Flow.
          </motion.p>

          {/* Premium equilibrium indicator */}
          <motion.div
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
          >
            <motion.div
              className="flex items-center gap-3"
              animate={{
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-primary"
                style={{
                  boxShadow: '0 0 8px #4B5CFB',
                }}
                animate={{
                  scale: [1, 1.4, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <span
                className="text-white/65"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textShadow: '0 2px 8px rgba(75, 92, 251, 0.3)',
                }}
              >
                EQUILIBRIUM
              </span>
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-secondary"
                style={{
                  boxShadow: '0 0 8px #00C7B7',
                }}
                animate={{
                  scale: [1, 1.4, 1],
                }}
                transition={{
                  duration: 2,
                  delay: 1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <div className="w-12 h-px bg-gradient-to-l from-transparent via-secondary to-transparent opacity-60" />
            </motion.div>
          </motion.div>

          {/* Refined loading dots */}
          <motion.div
            className="flex items-center justify-center gap-2 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="rounded-full"
                style={{
                  width: 5,
                  height: 5,
                  background: i === 1 ? '#4B5CFB' : '#00C7B7',
                  boxShadow: `0 0 8px ${i === 1 ? '#4B5CFB' : '#00C7B7'}`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.3, 0.8],
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 1.6,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Refined vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 30%, rgba(0, 0, 0, 0.3) 70%, rgba(0, 0, 0, 0.7) 100%)',
        }}
      />

      {/* Corner accents - respecting safe areas */}
      {[
        { top: 68, left: 24, rotation: 0 },
        { top: 68, right: 24, rotation: 90 },
        { bottom: 56, left: 24, rotation: 270 },
        { bottom: 56, right: 24, rotation: 180 },
      ].map((pos, i) => (
        <motion.div
          key={`corner-${i}`}
          className="absolute"
          style={{
            ...pos,
            width: 40,
            height: 40,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.25, scale: 1 }}
          transition={{ delay: 1 + i * 0.08, duration: 0.6 }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              d="M0 0 L28 0 M0 0 L0 28"
              stroke={i % 2 === 0 ? '#4B5CFB' : '#00C7B7'}
              strokeWidth="1"
              opacity="0.4"
            />
            <circle
              cx="0"
              cy="0"
              r="2"
              fill={i % 2 === 0 ? '#4B5CFB' : '#00C7B7'}
              opacity="0.6"
            />
          </svg>
        </motion.div>
      ))}
    </motion.div>
  );
};
