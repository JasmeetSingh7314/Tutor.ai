import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, Trophy, Star, BarChart } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Drawer({ isOpen, onClose }: DrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border z-50"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Progress & Rewards</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <ScrollArea className="h-[calc(100vh-4rem)] p-4">
              <div className="space-y-6">
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Achievements</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {['Beginner', 'Quick Learner', '7-Day Streak', 'Perfect Score'].map((achievement) => (
                      <div
                        key={achievement}
                        className="p-3 rounded-lg bg-muted/50 text-center"
                      >
                        <Star className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <p className="text-sm">{achievement}</p>
                      </div>
                    ))}
                  </div>
                </section>
                
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Statistics</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Words Learned', value: '120' },
                      { label: 'Daily Streak', value: '7 days' },
                      { label: 'Accuracy', value: '92%' },
                      { label: 'Time Spent', value: '5.2 hours' },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="flex justify-between items-center p-3 rounded-lg bg-muted/50"
                      >
                        <span className="text-sm">{stat.label}</span>
                        <span className="font-medium">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}