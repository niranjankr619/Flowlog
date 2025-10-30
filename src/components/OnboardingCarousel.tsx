import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Timer, BarChart3, Trophy } from 'lucide-react';
import { Button } from './ui/button';
import { useApp } from '../lib/AppContext';

const slides = [
  {
    id: 1,
    title: 'Track',
    description: 'Log every second without friction.',
    icon: Timer,
    color: '#4B5CFB',
  },
  {
    id: 2,
    title: 'Analyze',
    description: 'See where your time flows.',
    icon: BarChart3,
    color: '#00C7B7',
  },
  {
    id: 3,
    title: 'Improve',
    description: 'Gamify your focus and win your day.',
    icon: Trophy,
    color: '#F0BB00',
  },
];

export const OnboardingCarousel = () => {
  const { setCurrentScreen } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setCurrentScreen('home');
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            className="text-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Icon */}
            <motion.div
              className="w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${slide.color}20` }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <slide.icon className="w-16 h-16" style={{ color: slide.color }} />
            </motion.div>

            {/* Content */}
            <h1 className="mb-4">{slide.title}</h1>
            <p className="text-muted-foreground text-lg mb-12">
              {slide.description}
            </p>

            {/* Dots */}
            <div className="flex justify-center gap-2 mb-8">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>

            {/* Button */}
            <Button
              onClick={handleNext}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>

            {currentSlide < slides.length - 1 && (
              <button
                onClick={() => setCurrentScreen('home')}
                className="w-full mt-4 text-muted-foreground text-sm hover:text-foreground transition-colors"
              >
                Skip
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
