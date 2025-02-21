import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { Brain, Sparkles, Globe } from 'lucide-react';

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated background with reduced glow */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0.1, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#00FF94_0%,_transparent_70%)]"
          style={{ filter: 'blur(120px)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Learn Languages{' '}
            <span className="text-[#00FF94]">Smarter</span>,{' '}
            <br className="hidden md:block" />
            Not Harder
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Experience personalized language learning with AI tutors that adapt to your needs
            and help you achieve fluency faster than ever.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="min-w-[200px]">
              Start Learning Now
            </Button>
            <Button size="lg" variant="outline" className="min-w-[200px]">
              Meet Your AI Tutor
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Brain, text: 'AI-Powered Tutoring' },
              { icon: Sparkles, text: 'Gamified Learning' },
              { icon: Globe, text: 'Multiple Languages' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex flex-col items-center"
              >
                <feature.icon className="w-12 h-12 text-[#00FF94] mb-4" />
                <p className="text-gray-300">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};