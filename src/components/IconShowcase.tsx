import { useState } from 'react';
import { motion } from 'motion/react';
import { RippleCoreIcon } from './RippleCoreIcon';
import { DualFlowIcon } from './DualFlowIcon';
import { GlassHaloIcon } from './GlassHaloIcon';
import { AuroraLoopIcon } from './AuroraLoopIcon';
import { DualHaloIcon } from './DualHaloIcon';
import { EquilibriumIcon } from './EquilibriumIcon';
import { useApp } from '../lib/AppContext';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export const IconShowcase = () => {
  const { setCurrentScreen } = useApp();
  const [activeTab, setActiveTab] = useState('equilibrium');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => setCurrentScreen('login')}
            className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            <span className="text-sm" style={{ fontWeight: 600 }}>Back</span>
          </button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="mb-3" style={{ letterSpacing: '0.05em' }}>
              FLOWLOG Icon Concepts
            </h1>
            <p className="text-muted-foreground">
              Two symbolic approaches representing balance, flow, and mindful time tracking.
            </p>
          </motion.div>
        </div>

        {/* Tabs for different icon concepts */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-8 overflow-x-auto">
            <TabsList className="grid w-full grid-cols-6 min-w-max">
              <TabsTrigger value="equilibrium">Equilibrium</TabsTrigger>
              <TabsTrigger value="dual-halo">Dual Halo</TabsTrigger>
              <TabsTrigger value="aurora-loop">Aurora Loop</TabsTrigger>
              <TabsTrigger value="glass-halo">Glass Halo</TabsTrigger>
              <TabsTrigger value="dual-flow">Dual Flow</TabsTrigger>
              <TabsTrigger value="ripple-core">Ripple Core</TabsTrigger>
            </TabsList>
          </div>

          {/* EQUILIBRIUM CONCEPT */}
          <TabsContent value="equilibrium" className="space-y-8">
            {/* Hero Section */}
            <motion.div
              className="glass-card rounded-3xl p-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-center mb-8 rounded-2xl p-12" style={{ background: 'radial-gradient(circle, rgba(75, 92, 251, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%)' }}>
                <EquilibriumIcon variant="animated" size={280} animated={true} />
              </div>
              <h2 className="mb-3" style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 300, letterSpacing: '0.15em' }}>
                ORBITAL <span style={{ fontWeight: 700 }}>TIME</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto" style={{ letterSpacing: '0.03em' }}>
                Two orbital rings encircle a gradient sphere with a golden star traveling the path — 
                symbolizing time's continuous flow, cyclical nature, and the perfect harmony of tracked moments.
              </p>
            </motion.div>

            {/* Icon Variants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Primary Variant */}
              <motion.div
                className="glass-card rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-center mb-6">
                  <h3 className="mb-2" style={{ fontWeight: 700 }}>Primary 3D</h3>
                  <p className="text-sm text-muted-foreground">
                    Full luxury sphere with gradient & glow
                  </p>
                </div>
                <div className="flex items-center justify-center mb-6 rounded-xl p-8" style={{ background: 'radial-gradient(circle, rgba(75, 92, 251, 0.08) 0%, rgba(0, 0, 0, 0.6) 100%)' }}>
                  <EquilibriumIcon variant="primary" size={160} />
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Sphere:</span>
                    <span>Indigo→Aqua gradient</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Rings:</span>
                    <span>Dual orbital paths</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Star:</span>
                    <span>Gold time pointer</span>
                  </div>
                </div>
              </motion.div>

              {/* Matte Variant */}
              <motion.div
                className="glass-card rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-center mb-6">
                  <h3 className="mb-2" style={{ fontWeight: 700 }}>Matte</h3>
                  <p className="text-sm text-muted-foreground">
                    Frosted sphere for dark mode
                  </p>
                </div>
                <div className="flex items-center justify-center mb-6 rounded-xl p-8" style={{ background: 'radial-gradient(circle, rgba(75, 92, 251, 0.08) 0%, rgba(0, 0, 0, 0.6) 100%)' }}>
                  <EquilibriumIcon variant="matte" size={160} />
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Style:</span>
                    <span>Frosted white</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Use Case:</span>
                    <span>Dark UI</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Texture:</span>
                    <span>Soft blur</span>
                  </div>
                </div>
              </motion.div>

              {/* Flat Variant */}
              <motion.div
                className="glass-card rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-center mb-6">
                  <h3 className="mb-2" style={{ fontWeight: 700 }}>Flat</h3>
                  <p className="text-sm text-muted-foreground">
                    Simplified for app launcher
                  </p>
                </div>
                <div className="flex items-center justify-center mb-6 rounded-xl p-8" style={{ background: 'radial-gradient(circle, rgba(75, 92, 251, 0.08) 0%, rgba(0, 0, 0, 0.6) 100%)' }}>
                  <EquilibriumIcon variant="flat" size={160} />
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Style:</span>
                    <span>Flat gradients</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Detail:</span>
                    <span>Minimal</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Use Case:</span>
                    <span>iOS/Android</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Design Philosophy */}
            <motion.div
              className="glass-card rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="mb-6" style={{ fontWeight: 700 }}>Design Philosophy</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Time Logging Symbolism</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Central Sphere:</strong> Your time log/record at the core</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Two Orbital Rings:</strong> Cyclical nature of time (work/rest cycles)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Traveling Star:</strong> Current moment/time pointer moving forward</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Continuous Motion:</strong> Ongoing time tracking, never stops</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Gradient Flow:</strong> Transition from work (Indigo) to life (Aqua)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Luxury & Motion</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Orbital Mechanics:</strong> Sophisticated, cosmic elegance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Golden Star:</strong> Precious jewel-like time marker</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Smooth Animation:</strong> Hypnotic 6-second orbit cycle</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Soft Glows:</strong> Ambient lighting creates calm presence</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">3D Depth:</strong> Floating sphere with orbital perspective</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Technical Details */}
            <motion.div
              className="glass-card rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="mb-6" style={{ fontWeight: 700 }}>Technical Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Structure</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Sphere radius: 180pt</li>
                    <li>• Ring 1: 340pt × 110pt (Indigo)</li>
                    <li>• Ring 2: 340pt × 110pt (Aqua)</li>
                    <li>• Star core: 8pt diameter</li>
                    <li>• Star glow: 20pt radius</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Colors</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Sphere: #4B5CFB → #00C7B7</li>
                    <li>• Ring 1: #4B5CFB (Indigo)</li>
                    <li>• Ring 2: #00C7B7 (Aqua)</li>
                    <li>• Star: White + #FFD700 gold</li>
                    <li>• BG: Transparent (no square)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Animation</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Star orbit: 6s continuous</li>
                    <li>• Star pulse: 1.5s scale/glow</li>
                    <li>• Sphere pulse: 4s subtle</li>
                    <li>• Soft shadows</li>
                    <li>• Ambient glows</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Size Variations */}
            <motion.div
              className="glass-card rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="mb-6" style={{ fontWeight: 700 }}>Size Variations</h2>
              <div className="flex items-end justify-around gap-4 rounded-xl p-8" style={{ background: 'radial-gradient(circle, rgba(75, 92, 251, 0.06) 0%, rgba(0, 0, 0, 0.4) 100%)' }}>
                <div className="text-center">
                  <EquilibriumIcon variant="primary" size={32} />
                  <p className="text-xs text-muted-foreground mt-2">32pt</p>
                </div>
                <div className="text-center">
                  <EquilibriumIcon variant="primary" size={48} />
                  <p className="text-xs text-muted-foreground mt-2">48pt</p>
                </div>
                <div className="text-center">
                  <EquilibriumIcon variant="primary" size={64} />
                  <p className="text-xs text-muted-foreground mt-2">64pt</p>
                </div>
                <div className="text-center">
                  <EquilibriumIcon variant="primary" size={96} />
                  <p className="text-xs text-muted-foreground mt-2">96pt</p>
                </div>
                <div className="text-center">
                  <EquilibriumIcon variant="primary" size={128} />
                  <p className="text-xs text-muted-foreground mt-2">128pt</p>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* DUAL HALO CONCEPT */}
          <TabsContent value="dual-halo" className="space-y-8">
            {/* Hero Section */}
            <motion.div
              className="glass-card rounded-3xl p-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-center mb-8 bg-background/50 rounded-2xl p-12">
                <DualHaloIcon variant="animated" size={240} animated={true} />
              </div>
              <h2 className="mb-3" style={{ letterSpacing: '0.03em' }}>Dual Halo</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Two concentric glowing rings orbiting a luminous core, representing balanced duality 
                between focus and rest — precise like an instrument, serene like meditation.
              </p>
            </motion.div>

            {/* Icon Variants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Primary Variant */}
              <motion.div
                className="glass-card rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-center mb-6">
                  <h3 className="mb-2" style={{ fontWeight: 700 }}>Primary</h3>
                  <p className="text-sm text-muted-foreground">
                    Dual gradient glass rings with core glow
                  </p>
                </div>
                <div className="flex items-center justify-center mb-6 bg-background/50 rounded-xl p-8">
                  <DualHaloIcon variant="primary" size={160} />
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Inner Ring:</span>
                    <span>Aqua gradient</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Outer Ring:</span>
                    <span>Indigo gradient</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Core:</span>
                    <span>White bloom 30%</span>
                  </div>
                </div>
              </motion.div>

              {/* Matte Variant */}
              <motion.div
                className="glass-card rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-center mb-6">
                  <h3 className="mb-2" style={{ fontWeight: 700 }}>Matte</h3>
                  <p className="text-sm text-muted-foreground">
                    Frosted halo variant for dark mode
                  </p>
                </div>
                <div className="flex items-center justify-center mb-6 bg-background/50 rounded-xl p-8">
                  <DualHaloIcon variant="matte" size={160} />
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Style:</span>
                    <span>Frosted white</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Use Case:</span>
                    <span>Dark UI</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Texture:</span>
                    <span>Soft blur</span>
                  </div>
                </div>
              </motion.div>

              {/* Flat Variant */}
              <motion.div
                className="glass-card rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-center mb-6">
                  <h3 className="mb-2" style={{ fontWeight: 700 }}>Flat</h3>
                  <p className="text-sm text-muted-foreground">
                    Simplified for app launcher
                  </p>
                </div>
                <div className="flex items-center justify-center mb-6 bg-background/50 rounded-xl p-8">
                  <DualHaloIcon variant="flat" size={160} />
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Style:</span>
                    <span>Flat gradients</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Detail:</span>
                    <span>Minimal</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Use Case:</span>
                    <span>iOS/Android</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Design Philosophy */}
            <motion.div
              className="glass-card rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="mb-6" style={{ fontWeight: 700 }}>Design Philosophy</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Symbolism</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Two Rings:</strong> Balanced duality (focus & rest)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Concentric Orbits:</strong> Harmony and alignment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Luminous Core:</strong> Centered consciousness</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Floating Effect:</strong> Suspension in mindful space</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Perfect Circles:</strong> Completeness and infinity</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Premium Qualities</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Ultra-Premium:</strong> Instrument-grade precision</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Calm Power:</strong> Serene yet powerful presence</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Glass Clarity:</strong> Translucent refractive layers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Counter-Rotation:</strong> Living orbital motion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Balanced Composition:</strong> Perfect symmetry</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Technical Details */}
            <motion.div
              className="glass-card rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="mb-6" style={{ fontWeight: 700 }}>Technical Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Structure</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Core diameter: 25% of frame</li>
                    <li>• Inner ring: Radius 260pt</li>
                    <li>• Outer ring: Radius 360pt</li>
                    <li>• Ring gap: Balanced spacing</li>
                    <li>• Inner stroke: 50pt (9%)</li>
                    <li>• Outer stroke: 70pt (13%)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Colors</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Inner: #00C7B7 → #56F0E5</li>
                    <li>• Outer: #4B5CFB → #2E3092</li>
                    <li>• Core: White 95% → 30%</li>
                    <li>• Background: #0B0F2C → #141A36</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Effects</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Glass refraction layers</li>
                    <li>• Light diffusion 10-15%</li>
                    <li>• Noise grain for realism</li>
                    <li>• Z-layer separation</li>
                    <li>• Floating soft shadows</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Animation Details */}
            <motion.div
              className="glass-card rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="mb-6" style={{ fontWeight: 700 }}>Motion Design</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Outer Ring Rotation</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Slow clockwise rotation creates a sense of continuous movement and orbital flow.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span>Duration: 8 seconds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span>Direction: Clockwise</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span>Easing: Linear flow</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Inner Ring Counter-Rotation</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Counter-clockwise rotation creates dynamic balance and represents the duality of flow states.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span>Duration: 10 seconds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span>Direction: Counter-clockwise</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span>Easing: Linear flow</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Core Breathing Pulse</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Subtle brightness oscillation symbolizing life, consciousness, and mindful presence.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span>Duration: 6 seconds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span>Range: 30% - 50% opacity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span>Feel: Living breath</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Size Variations */}
            <motion.div
              className="glass-card rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="mb-6" style={{ fontWeight: 700 }}>Size Variations</h2>
              <div className="flex items-end justify-around gap-4 bg-background/50 rounded-xl p-8">
                <div className="text-center">
                  <DualHaloIcon variant="primary" size={32} />
                  <p className="text-xs text-muted-foreground mt-2">32pt</p>
                </div>
                <div className="text-center">
                  <DualHaloIcon variant="primary" size={48} />
                  <p className="text-xs text-muted-foreground mt-2">48pt</p>
                </div>
                <div className="text-center">
                  <DualHaloIcon variant="primary" size={64} />
                  <p className="text-xs text-muted-foreground mt-2">64pt</p>
                </div>
                <div className="text-center">
                  <DualHaloIcon variant="primary" size={96} />
                  <p className="text-xs text-muted-foreground mt-2">96pt</p>
                </div>
                <div className="text-center">
                  <DualHaloIcon variant="primary" size={128} />
                  <p className="text-xs text-muted-foreground mt-2">128pt</p>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* AURORA LOOP CONCEPT */}
          <TabsContent value="aurora-loop" className="space-y-8">
            {/* Hero Section */}
            <motion.div
              className="glass-card rounded-3xl p-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-center mb-8 bg-background/50 rounded-2xl p-12">
                <AuroraLoopIcon variant="animated" size={240} animated={true} />
              </div>
              <h2 className="mb-3" style={{ letterSpacing: '0.03em' }}>Aurora Loop</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A graceful curved band of light symbolizing flow, balance, and continuous rhythm — 
                light sculpted into motion, representing infinite progress and mindful productivity.
              </p>
            </motion.div>

            {/* Icon Variants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Primary 3D Glass Variant */}
              <motion.div
                className="glass-card rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-center mb-6">
                  <h3 className="mb-2" style={{ fontWeight: 700 }}>Primary</h3>
                  <p className="text-sm text-muted-foreground">
                    Full 3D aurora with gradient & glow
                  </p>
                </div>
                <div className="flex items-center justify-center mb-6 bg-background/50 rounded-xl p-8">
                  <AuroraLoopIcon variant="primary" size={160} />
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Arc Range:</span>
                    <span>240° loop</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Gradient:</span>
                    <span>Indigo→Aqua→Teal</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Effects:</span>
                    <span>Glass refraction</span>
                  </div>
                </div>
              </motion.div>

              {/* Matte Variant */}
              <motion.div
                className="glass-card rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-center mb-6">
                  <h3 className="mb-2" style={{ fontWeight: 700 }}>Matte</h3>
                  <p className="text-sm text-muted-foreground">
                    Frosted gradient band for dark mode
                  </p>
                </div>
                <div className="flex items-center justify-center mb-6 bg-background/50 rounded-xl p-8">
                  <AuroraLoopIcon variant="matte" size={160} />
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Style:</span>
                    <span>Frosted white</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Use Case:</span>
                    <span>Dark UI</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Texture:</span>
                    <span>Soft blur</span>
                  </div>
                </div>
              </motion.div>

              {/* Flat Variant */}
              <motion.div
                className="glass-card rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-center mb-6">
                  <h3 className="mb-2" style={{ fontWeight: 700 }}>Flat</h3>
                  <p className="text-sm text-muted-foreground">
                    Simplified for app launcher
                  </p>
                </div>
                <div className="flex items-center justify-center mb-6 bg-background/50 rounded-xl p-8">
                  <AuroraLoopIcon variant="flat" size={160} />
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Style:</span>
                    <span>Two-color arc</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Detail:</span>
                    <span>Minimal</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Use Case:</span>
                    <span>iOS/Android</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Design Philosophy */}
            <motion.div
              className="glass-card rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="mb-6" style={{ fontWeight: 700 }}>Design Philosophy</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Symbolism</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Curved Band:</strong> Continuous flow and rhythm</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Semi-Open Loop:</strong> Infinite progress and freedom</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Gradient Light:</strong> Evolution and transformation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Core Negative Space:</strong> Centered focus</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Floating Arc:</strong> Liberation and grace</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Cinematic Qualities</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Ultra-Premium:</strong> Luxury glass sculpture</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">3D Depth:</strong> Suspended in dark space</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Living Light:</strong> Shimmer and breathing pulse</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Minimalist:</strong> No text or literal forms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Calm Power:</strong> Refined and unforgettable</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Technical Details */}
            <motion.div
              className="glass-card rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="mb-6" style={{ fontWeight: 700 }}>Technical Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Structure</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Arc span: 240 degrees</li>
                    <li>• Stroke width: 85pt</li>
                    <li>• Radius: 340pt</li>
                    <li>• Tapered ends</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Colors</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Start: Indigo #4B5CFB</li>
                    <li>• Mid: Aqua #00C7B7</li>
                    <li>• End: Teal #56F0E5</li>
                    <li>• Glow: White 25%</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Effects</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Glass refraction</li>
                    <li>• Dispersion sparkle</li>
                    <li>• Soft shadow depth</li>
                    <li>• Reflection plane</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Animation Details */}
            <motion.div
              className="glass-card rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="mb-6" style={{ fontWeight: 700 }}>Motion Design</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Shimmer Effect</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    A gentle shimmer travels along the loop every 5 seconds, creating the illusion of light flowing through the arc.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span>Duration: 5 seconds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span>Type: Gradient displacement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span>Easing: Smooth flow</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Breathing Pulse</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    The arc gently pulses in brightness, symbolizing "alive flow" and creating a living, organic presence.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span>Duration: 5 seconds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span>Range: 70% - 90% opacity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span>Feel: Organic breath</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Size Variations */}
            <motion.div
              className="glass-card rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="mb-6" style={{ fontWeight: 700 }}>Size Variations</h2>
              <div className="flex items-end justify-around gap-4 bg-background/50 rounded-xl p-8">
                <div className="text-center">
                  <AuroraLoopIcon variant="primary" size={32} />
                  <p className="text-xs text-muted-foreground mt-2">32pt</p>
                </div>
                <div className="text-center">
                  <AuroraLoopIcon variant="primary" size={48} />
                  <p className="text-xs text-muted-foreground mt-2">48pt</p>
                </div>
                <div className="text-center">
                  <AuroraLoopIcon variant="primary" size={64} />
                  <p className="text-xs text-muted-foreground mt-2">64pt</p>
                </div>
                <div className="text-center">
                  <AuroraLoopIcon variant="primary" size={96} />
                  <p className="text-xs text-muted-foreground mt-2">96pt</p>
                </div>
                <div className="text-center">
                  <AuroraLoopIcon variant="primary" size={128} />
                  <p className="text-xs text-muted-foreground mt-2">128pt</p>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* GLASS HALO CONCEPT */}
          <TabsContent value="glass-halo" className="space-y-8">
            {/* Hero Section */}
            <motion.div
              className="glass-card rounded-3xl p-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-center mb-8 bg-background/50 rounded-2xl p-12">
                <GlassHaloIcon variant="animated" size={240} animated={true} />
              </div>
              <h2 className="mb-3" style={{ letterSpacing: '0.03em' }}>Glass Halo</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A circular ring of translucent glass with soft internal glow — embodying refined elegance, 
                calm power, and fluid intelligence through precision-crafted luminosity.
              </p>
            </motion.div>

            {/* Icon Variants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Primary 3D Glass Variant */}
              <motion.div
                className="glass-card rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-center mb-6">
                  <h3 className="mb-2" style={{ fontWeight: 700 }}>Primary</h3>
                  <p className="text-sm text-muted-foreground">
                    Full 3D glass gradient halo
                  </p>
                </div>
                <div className="flex items-center justify-center mb-6 bg-background/50 rounded-xl p-8">
                  <GlassHaloIcon variant="primary" size={160} />
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Core Light:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ background: '#00C7B7' }} />
                      <span>Aqua</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Outer Rim:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ background: '#4B5CFB' }} />
                      <span>Indigo</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Style:</span>
                    <span>Liquid glass</span>
                  </div>
                </div>
              </motion.div>

              {/* Frosted Variant */}
              <motion.div
                className="glass-card rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-center mb-6">
                  <h3 className="mb-2" style={{ fontWeight: 700 }}>Secondary</h3>
                  <p className="text-sm text-muted-foreground">
                    Matte frosted halo for dark mode
                  </p>
                </div>
                <div className="flex items-center justify-center mb-6 bg-background/50 rounded-xl p-8">
                  <GlassHaloIcon variant="secondary" size={160} />
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Style:</span>
                    <span>Frosted white</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Use Case:</span>
                    <span>Dark UI</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Texture:</span>
                    <span>Matte blur</span>
                  </div>
                </div>
              </motion.div>

              {/* Animated Variant */}
              <motion.div
                className="glass-card rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-center mb-6">
                  <h3 className="mb-2" style={{ fontWeight: 700 }}>Animated</h3>
                  <p className="text-sm text-muted-foreground">
                    Gentle breathing pulse (6s)
                  </p>
                </div>
                <div className="flex items-center justify-center mb-6 bg-background/50 rounded-xl p-8">
                  <GlassHaloIcon variant="animated" size={160} animated={true} />
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Motion:</span>
                    <span>Center pulse</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Duration:</span>
                    <span>6 seconds</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Effect:</span>
                    <span>Living flow</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Design Philosophy */}
            <motion.div
              className="glass-card rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="mb-6" style={{ fontWeight: 700 }}>Design Philosophy</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Symbolism</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Circular Ring:</strong> Completeness, infinity, continuous flow</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Glass Material:</strong> Clarity, transparency, precision</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Inner Aqua Glow:</strong> Living presence and mindful center</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Indigo Rim:</strong> Focus, structure, calm power</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Center Pulse:</strong> Time alive, breath of flow</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Luxury Qualities</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Refined Elegance:</strong> Minimal yet sophisticated</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Calm Power:</strong> Serene yet present</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Fluid Intelligence:</strong> Dynamic glass refractions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Jewelry-Grade:</strong> Precision-crafted luminosity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">3D Depth:</strong> Layered translucency and shadows</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Technical Details */}
            <motion.div
              className="glass-card rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="mb-6" style={{ fontWeight: 700 }}>Technical Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Structure</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Ring thickness: 140pt</li>
                    <li>• Outer radius: 390pt</li>
                    <li>• Inner radius: 235pt</li>
                    <li>• Center core: 50pt</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Effects</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• 3-layer glass stack</li>
                    <li>• Internal refraction</li>
                    <li>• Bloom highlights</li>
                    <li>• Fine shadow depth</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Lighting</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Top-left key gloss</li>
                    <li>• Bottom-right aqua</li>
                    <li>• Center living pulse</li>
                    <li>• Outer indigo halo</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Size Variations */}
            <motion.div
              className="glass-card rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="mb-6" style={{ fontWeight: 700 }}>Size Variations</h2>
              <div className="flex items-end justify-around gap-4 bg-background/50 rounded-xl p-8">
                <div className="text-center">
                  <GlassHaloIcon variant="primary" size={32} />
                  <p className="text-xs text-muted-foreground mt-2">32pt</p>
                </div>
                <div className="text-center">
                  <GlassHaloIcon variant="primary" size={48} />
                  <p className="text-xs text-muted-foreground mt-2">48pt</p>
                </div>
                <div className="text-center">
                  <GlassHaloIcon variant="primary" size={64} />
                  <p className="text-xs text-muted-foreground mt-2">64pt</p>
                </div>
                <div className="text-center">
                  <GlassHaloIcon variant="primary" size={96} />
                  <p className="text-xs text-muted-foreground mt-2">96pt</p>
                </div>
                <div className="text-center">
                  <GlassHaloIcon variant="primary" size={128} />
                  <p className="text-xs text-muted-foreground mt-2">128pt</p>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* DUAL FLOW CONCEPT */}
          <TabsContent value="dual-flow" className="space-y-8">
            {/* Hero Section */}
            <motion.div
              className="glass-card rounded-3xl p-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-center mb-8 bg-background/50 rounded-2xl p-12">
                <DualFlowIcon variant="animated" size={240} animated={true} />
              </div>
              <h2 className="mb-3" style={{ letterSpacing: '0.03em' }}>Dual Flow</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Two mirrored liquid arcs in graceful equilibrium — representing the duality of focus and flow, 
                effort and rest, structure and freedom unified in continuous motion.
              </p>
            </motion.div>

            {/* Icon Variants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Full Color Variant */}
              <motion.div
                className="glass-card rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-center mb-6">
                  <h3 className="mb-2" style={{ fontWeight: 700 }}>Full Color</h3>
                  <p className="text-sm text-muted-foreground">
                    Indigo-aqua gradient with glass depth
                  </p>
                </div>
                <div className="flex items-center justify-center mb-6 bg-background/50 rounded-xl p-8">
                  <DualFlowIcon variant="primary" size={160} />
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Upper Arc:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ background: '#4B5CFB' }} />
                      <span>Indigo</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Lower Arc:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ background: '#00C7B7' }} />
                      <span>Aqua</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Center:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ background: '#FFFFFF' }} />
                      <span>White glow</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Monotone Variant */}
              <motion.div
                className="glass-card rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-center mb-6">
                  <h3 className="mb-2" style={{ fontWeight: 700 }}>Monotone</h3>
                  <p className="text-sm text-muted-foreground">
                    Clean white for dark UI contexts
                  </p>
                </div>
                <div className="flex items-center justify-center mb-6 bg-background/50 rounded-xl p-8">
                  <DualFlowIcon variant="secondary" size={160} />
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Style:</span>
                    <span>Pure white</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Use Case:</span>
                    <span>Dark themes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Opacity:</span>
                    <span>30% - 70%</span>
                  </div>
                </div>
              </motion.div>

              {/* Animated Variant */}
              <motion.div
                className="glass-card rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-center mb-6">
                  <h3 className="mb-2" style={{ fontWeight: 700 }}>Animated</h3>
                  <p className="text-sm text-muted-foreground">
                    Slow counter-rotation loop (20s)
                  </p>
                </div>
                <div className="flex items-center justify-center mb-6 bg-background/50 rounded-xl p-8">
                  <DualFlowIcon variant="animated" size={160} animated={true} />
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Motion:</span>
                    <span>Counter-rotate</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Duration:</span>
                    <span>20 seconds</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Effect:</span>
                    <span>Continuous flow</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Design Philosophy */}
            <motion.div
              className="glass-card rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="mb-6" style={{ fontWeight: 700 }}>Design Philosophy</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Symbolism</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Upper Arc (Indigo):</strong> Focus, concentration, effort</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Lower Arc (Aqua):</strong> Flow, rest, fluidity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Interlocking Shape:</strong> Balance and equilibrium</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Central Glow:</strong> Mindful center point</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Negative Space:</strong> Vertical flow axis</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Duality Expressed</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Focus ⟷ Rest:</strong> Active work vs mindful pause</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Effort ⟷ Ease:</strong> Intensity vs natural flow</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Structure ⟷ Freedom:</strong> Discipline vs fluidity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Time ⟷ Timeless:</strong> Tracking vs being present</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Motion ⟷ Calm:</strong> Dynamic yet serene</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Size Variations */}
            <motion.div
              className="glass-card rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="mb-6" style={{ fontWeight: 700 }}>Size Variations</h2>
              <div className="flex items-end justify-around gap-4 bg-background/50 rounded-xl p-8">
                <div className="text-center">
                  <DualFlowIcon variant="primary" size={32} />
                  <p className="text-xs text-muted-foreground mt-2">32pt</p>
                </div>
                <div className="text-center">
                  <DualFlowIcon variant="primary" size={48} />
                  <p className="text-xs text-muted-foreground mt-2">48pt</p>
                </div>
                <div className="text-center">
                  <DualFlowIcon variant="primary" size={64} />
                  <p className="text-xs text-muted-foreground mt-2">64pt</p>
                </div>
                <div className="text-center">
                  <DualFlowIcon variant="primary" size={96} />
                  <p className="text-xs text-muted-foreground mt-2">96pt</p>
                </div>
                <div className="text-center">
                  <DualFlowIcon variant="primary" size={128} />
                  <p className="text-xs text-muted-foreground mt-2">128pt</p>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* RIPPLE CORE CONCEPT */}
          <TabsContent value="ripple-core" className="space-y-8">
            {/* Hero Section */}
            <motion.div
              className="glass-card rounded-3xl p-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-center mb-8 bg-background/50 rounded-2xl p-12">
                <RippleCoreIcon variant="primary" size={240} animated={true} />
              </div>
              <h2 className="mb-3" style={{ letterSpacing: '0.03em' }}>Ripple Core</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A glowing center with expanding translucent ripples — representing time in motion, 
                balanced rhythm, and continuous flow radiating from a single point of focus.
              </p>
            </motion.div>

            {/* Icon Variants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Primary Variant */}
              <motion.div
                className="glass-card rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-center mb-6">
                  <h3 className="mb-2" style={{ fontWeight: 700 }}>Primary</h3>
                  <p className="text-sm text-muted-foreground">
                    Full-color 3D glass with gradients and bloom
                  </p>
                </div>
                <div className="flex items-center justify-center mb-6 bg-background/50 rounded-xl p-8">
                  <RippleCoreIcon variant="primary" size={160} animated={true} />
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Core Glow:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ background: '#00C7B7' }} />
                      <span>#00C7B7</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Mid Ripple:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ background: '#4B5CFB' }} />
                      <span>#4B5CFB</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Background:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ background: '#0B0F2C' }} />
                      <span>#0B0F2C</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Secondary Variant */}
              <motion.div
                className="glass-card rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-center mb-6">
                  <h3 className="mb-2" style={{ fontWeight: 700 }}>Secondary</h3>
                  <p className="text-sm text-muted-foreground">
                    Monoline minimal white for dark themes
                  </p>
                </div>
                <div className="flex items-center justify-center mb-6 bg-background/50 rounded-xl p-8">
                  <RippleCoreIcon variant="secondary" size={160} />
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Style:</span>
                    <span>Monotone white</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Use Case:</span>
                    <span>Dark backgrounds</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Opacity:</span>
                    <span>10% - 90%</span>
                  </div>
                </div>
              </motion.div>

              {/* Adaptive Variant */}
              <motion.div
                className="glass-card rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-center mb-6">
                  <h3 className="mb-2" style={{ fontWeight: 700 }}>Adaptive</h3>
                  <p className="text-sm text-muted-foreground">
                    Flat version for light/dark OS themes
                  </p>
                </div>
                <div className="flex items-center justify-center mb-6 bg-background/50 rounded-xl p-8">
                  <RippleCoreIcon variant="adaptive" size={160} />
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Style:</span>
                    <span>Simplified glass</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Use Case:</span>
                    <span>App icons / OS</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Adaptability:</span>
                    <span>Theme aware</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Design Philosophy */}
            <motion.div
              className="glass-card rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="mb-6" style={{ fontWeight: 700 }}>Design Philosophy</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Symbolism</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Central Orb:</strong> The user's focus point and flow state</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Ripples:</strong> Time and effort waves expanding outward</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Glass Effect:</strong> Transparency and clarity in tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Circular Form:</strong> Completeness, balance, and rhythm</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3" style={{ fontWeight: 600 }}>Technical Details</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Resolution:</strong> 1024×1024 pt scalable SVG</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Ripple Layers:</strong> 3 layers with progressive opacity fade</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Light Source:</strong> Top-left soft directional lighting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span><strong className="text-foreground">Animation:</strong> Optional 5s pulse ripple with fade loop</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Size Variations */}
            <motion.div
              className="glass-card rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="mb-6" style={{ fontWeight: 700 }}>Size Variations</h2>
              <div className="flex items-end justify-around gap-4 bg-background/50 rounded-xl p-8">
                <div className="text-center">
                  <RippleCoreIcon variant="primary" size={32} />
                  <p className="text-xs text-muted-foreground mt-2">32pt</p>
                </div>
                <div className="text-center">
                  <RippleCoreIcon variant="primary" size={48} />
                  <p className="text-xs text-muted-foreground mt-2">48pt</p>
                </div>
                <div className="text-center">
                  <RippleCoreIcon variant="primary" size={64} />
                  <p className="text-xs text-muted-foreground mt-2">64pt</p>
                </div>
                <div className="text-center">
                  <RippleCoreIcon variant="primary" size={96} />
                  <p className="text-xs text-muted-foreground mt-2">96pt</p>
                </div>
                <div className="text-center">
                  <RippleCoreIcon variant="primary" size={128} />
                  <p className="text-xs text-muted-foreground mt-2">128pt</p>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Comparison Section */}
        <motion.div
          className="glass-card rounded-2xl p-8 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="mb-6" style={{ fontWeight: 700 }}>Concept Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            {/* Dual Halo */}
            <div>
              <div className="flex items-center justify-center mb-4 bg-background/50 rounded-xl p-5">
                <DualHaloIcon variant="primary" size={90} />
              </div>
              <h3 className="mb-3 text-center" style={{ fontWeight: 600 }}>Dual Halo</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  <span>Most <strong className="text-foreground">balanced</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  <span><strong className="text-foreground">Dual orbits</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  <span>Focus & <strong className="text-foreground">rest</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  <span><strong className="text-foreground">Precision</strong></span>
                </li>
              </ul>
            </div>

            {/* Aurora Loop */}
            <div>
              <div className="flex items-center justify-center mb-4 bg-background/50 rounded-xl p-5">
                <AuroraLoopIcon variant="primary" size={90} />
              </div>
              <h3 className="mb-3 text-center" style={{ fontWeight: 600 }}>Aurora Loop</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                  <span>Most <strong className="text-foreground">cinematic</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                  <span><strong className="text-foreground">Infinite</strong> flow</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                  <span>Living <strong className="text-foreground">shimmer</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                  <span><strong className="text-foreground">Grace</strong></span>
                </li>
              </ul>
            </div>

            {/* Glass Halo */}
            <div>
              <div className="flex items-center justify-center mb-4 bg-background/50 rounded-xl p-5">
                <GlassHaloIcon variant="primary" size={90} />
              </div>
              <h3 className="mb-3 text-center" style={{ fontWeight: 600 }}>Glass Halo</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  <span>Most <strong className="text-foreground">luxurious</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  <span><strong className="text-foreground">Jewelry-grade</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  <span>Perfect <strong className="text-foreground">symmetry</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  <span><strong className="text-foreground">Pulse</strong></span>
                </li>
              </ul>
            </div>

            {/* Dual Flow */}
            <div>
              <div className="flex items-center justify-center mb-4 bg-background/50 rounded-xl p-5">
                <DualFlowIcon variant="primary" size={90} />
              </div>
              <h3 className="mb-3 text-center" style={{ fontWeight: 600 }}>Dual Flow</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>Most <strong className="text-foreground">dynamic</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span><strong className="text-foreground">Duality</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>Yin-yang <strong className="text-foreground">balance</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>Counter <strong className="text-foreground">rotate</strong></span>
                </li>
              </ul>
            </div>

            {/* Ripple Core */}
            <div>
              <div className="flex items-center justify-center mb-4 bg-background/50 rounded-xl p-5">
                <RippleCoreIcon variant="primary" size={90} />
              </div>
              <h3 className="mb-3 text-center" style={{ fontWeight: 600 }}>Ripple Core</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                  <span>Most <strong className="text-foreground">meditative</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                  <span><strong className="text-foreground">Focus</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                  <span>Time <strong className="text-foreground">waves</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                  <span>Pulse <strong className="text-foreground">rhythm</strong></span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
