import { motion } from 'framer-motion';
import { Bot, Trophy, BookOpen, Target, Sparkles, Brain, Globe, Zap } from 'lucide-react';

const BentoItem = ({ icon: Icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <Icon className="w-8 h-8 text-primary mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
};

export const BentoGrid = () => {
  const items = [
    {
      icon: Bot,
      title: "AI Tutors",
      description: "Personalized language tutoring with advanced AI that adapts to your learning style and pace."
    },
    {
      icon: Trophy,
      title: "Gamified Learning",
      description: "Earn points, badges, and climb leaderboards while mastering new languages."
    },
    {
      icon: BookOpen,
      title: "Personalized Decks",
      description: "Custom flashcard decks tailored to your interests and proficiency level."
    },
    {
      icon: Target,
      title: "Weakness Detection",
      description: "AI-powered analysis identifies and helps you overcome learning obstacles."
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Smart Features for <span className="text-primary">Smarter Learning</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Our AI-powered platform adapts to your unique learning style
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, index) => (
            <BentoItem
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};