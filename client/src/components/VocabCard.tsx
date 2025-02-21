import { AnimatePresence, motion } from "framer-motion";
import { VocabWord } from "../lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@heroui/react";
import { cn } from "@/lib/utils";
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Globe,
  MessageCircle,
  Pencil,
  Speaker as SpeakerHigh,
  Sparkles,
} from "lucide-react";

interface VocabCardProps {
  word: VocabWord;
  className?: string;
  onPrevious?: () => void;
  onNext?: () => void;
}

const MiniCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className={cn(
      " backdrop-blur-lg bg-card/30 border border-border/50 rounded-lg shadow-lg",
      className
    )}
  >
    {children}
  </motion.div>
);

export function VocabCard({
  word,
  className,
  onPrevious,
  onNext,
}: VocabCardProps) {
  return (
    <div className={cn("relative min-h-[calc(100vh-8rem)]", className)}>
      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="lg"
        onPress={onPrevious}
        className="fixed p-4 left-4 top-1/2 -translate-y-1/2  rounded-full h-16 w-16  bg-transparent"
      >
        <ChevronLeft className="h-16 w-16 text-[20px] " />
      </Button>
      <Button
        variant="ghost"
        size="lg"
        onPress={onNext}
        className="fixed p-4 right-4 top-1/2 -translate-y-1/2 rounded-full h-16 w-16 bg-transparent"
      >
        <ChevronRight className="h-16 w-16 text-[20px] " />
      </Button>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.3, type: "spring", bounce: 0.4 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center mb-20"
        >
          {/* Main Card */}
          <Card className="relative w-full min-h-[800px] bg-[#1D202A]/10 backdrop-blur-xl border-border/50 overflow-hidden p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/2 to-transparent" />

            {/* Main Word Section */}
            <h2 className="text-8xl font-bold text-primary mb-4">
              {word.word_details.word}
            </h2>
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-3xl text-muted-foreground">
                {word.word_details.reading}
              </span>
              <Button variant="ghost" className="rounded-full">
                <Volume2 className="w-6 h-6" />
              </Button>
            </div>
            <p className="text-2xl">{word.word_details.meaning}</p>
            <p className="text-lg text-muted-foreground mt-2 mb-8">
              {word.word_details.literal_meaning}
            </p>

            {/* Mini Cards Container */}
            <div className="w-full h-full p-14 grid grid-cols-3 gap-y-10 gap-x-20">
              {/* Components Card - Top Left */}
              <MiniCard className="bg-card p-6 border-2 border-[#1D202A] ">
                <div className="flex items-center gap-2 mb-4 ">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Components</h3>
                </div>
                <div className="space-y-3 flex flex-col">
                  {word.word_details.components.map((component, i) => (
                    <div key={i} className="p-3 rounded-lg bg-secondary/30">
                      <span className="text-xl font-semibold block mb-1">
                        {component}
                      </span>
                      <span className="text-sm text-primary">
                        {word.word_details.component_meanings[i]}
                      </span>
                    </div>
                  ))}
                </div>
              </MiniCard>

              {/* Pronunciation Guide - Top Center */}
              <MiniCard className="bg-card -translate-x-1/2 w-fit p-6 border-2 border-[#1D202A]">
                <div className="flex items-center gap-2 mb-4">
                  <SpeakerHigh className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Pronunciation</h3>
                </div>
                <p className="text-sm mb-3">{word.pronunciation_guide.guide}</p>
                <p className="text-sm text-muted-foreground">
                  {word.pronunciation_guide.tips}
                </p>
              </MiniCard>

              {/* Usage Examples - Top Right */}
              <MiniCard className="bg-card p-6 border-2 border-[#1D202A]">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Examples</h3>
                </div>
                <div className="space-y-3 flex flex-col">
                  {word.usage_examples.examples.map((example, i) => (
                    <p key={i} className="text-sm">
                      {example}
                    </p>
                  ))}
                </div>
              </MiniCard>

              {/* Writing Guide - Bottom Left */}
              <MiniCard className="bg-card p-6 border-2 border-[#1D202A]">
                <div className="flex items-center gap-2 mb-4">
                  <Pencil className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Writing Guide</h3>
                </div>
                <p className="text-sm mb-3">{word.writing_guide.guide}</p>
                <p className="text-sm text-muted-foreground">
                  {word.writing_guide.tips}
                </p>
              </MiniCard>

              {/* Variations - Bottom Center */}
              <MiniCard className="bg-card -translate-x-1/2  p-6 border-2 border-[#1D202A]">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Variations</h3>
                </div>
                <div className="space-y-2 flex flex-col">
                  {word.variations.variations.map((variation, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-secondary/30 text-sm text-center"
                    >
                      {variation}
                    </div>
                  ))}
                </div>
              </MiniCard>

              {/* Cultural Reference - Bottom Right */}
              <MiniCard className="bg-card p-6 border border-[#1D202A]">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Cultural Context</h3>
                </div>
                <p className="text-sm mb-4 leading-relaxed">
                  {word.cultural_note.note}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-secondary/30">
                    <h4 className="text-xs text-primary mb-1">Formal</h4>
                    <p className="text-sm">{word.formal_vs_informal.formal}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/30">
                    <h4 className="text-xs text-primary mb-1">Informal</h4>
                    <p className="text-sm">
                      {word.formal_vs_informal.informal}
                    </p>
                  </div>
                </div>
              </MiniCard>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
