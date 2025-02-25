import { motion } from 'framer-motion';
import { Brain, Trophy, BookOpen, Target } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <Icon className="w-12 h-12 text-primary mb-6" />
      <h3 className="text-2xl font-semibold text-white mb-4">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  );
};

export const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Tutoring",
      description: "Experience human-like tutoring with our advanced AI that understands your learning patterns and adjusts teaching methods in real-time."
    },
    {
      icon: Trophy,
      title: "Gamified Progress",
      description: "Stay motivated with our engaging reward system. Earn XP, unlock achievements, and compete with friends while learning."
    },
    {
      icon: BookOpen,
      title: "Smart Lesson Plans",
      description: "Access carefully curated content tailored to your proficiency level, interests, and learning goals."
    },
    {
      icon: Target,
      title: "Weakness Analysis",
      description: "Our AI continuously analyzes your performance to identify areas for improvement and creates targeted practice sessions."
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose <span className="text-primary">Tutor AI</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Revolutionary features that transform how you learn languages
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};