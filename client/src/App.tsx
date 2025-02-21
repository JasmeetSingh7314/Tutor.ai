import { useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { VocabCard } from "@/components/VocabCard";
import { Drawer } from "@/components/Drawer";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";



const sampleData = {
  vocab: [
    {
      word_details: {
        word: "努力",
        reading: "どりょく",
        meaning: "effort",
        components: ["努", "力"],
        component_meanings: ["to strive", "power or strength"],
        literal_meaning: "striving with strength",
      },
      pronunciation_guide: {
        guide:
          "1. Break it into syllables: 'ど' (do), 'りょ' (ryo), 'く' (ku). 2. Stress the first sylldle 'ど'.",
        tips: "The 'りょ' sound is a combination of 'ri' and 'yo', so practice blending them smoothly.",
      },
      usage_examples: {
        examples: [
          "彼は毎日努力しています。",
          "成功するためには努力が必要です。",
        ],
        dialogues: [
          "A: どうして日本語が上手になったの？ B: 毎日努力したからです。",
        ],
      },
      formal_vs_informal: {
        formal: "努力 (used in all contexts, formal and informal)",
        informal: "がんばる (more casual, often used in everyday conversation)",
      },
      variations: {
        variations: ["努力家", "努力する", "努力不足"],
      },
      writing_guide: {
        guide:
          "1. Write '努' (left radical: 力, right radical: 奴). 2. Write '力' (a single character meaning power).",
        tips: "Remember that '努' has a complex structure, so practice writing it slowly.",
      },
      cultural_note: {
        note: "In Japanese culture, effort and perseverance are highly valued, and the concept of 'gambaru' (to persist) is deeply ingrained in daily life.",
      },
      practice_tips: {
        tips: "Use the word in daily affirmations or journal entries to reinforce its meaning and usage.",
      },
    },
    {
      word_details: {
        word: "経験",
        reading: "けいけん",
        meaning: "experience",
        components: ["経", "験"],
        component_meanings: ["to pass through", "to test or verify"],
        literal_meaning: "passing through tests",
      },
      pronunciation_guide: {
        guide:
          "1. Break it into syllables: 'けい' (kei), 'けん' (ken). 2. Stress the first syllable 'けい'.",
        tips: "The 'けい' sound is similar to 'kay', and 'けん' is like 'ken'.",
      },
      usage_examples: {
        examples: [
          "彼は多くの経験を持っています。",
          "この仕事は貴重な経験になります。",
        ],
        dialogues: [
          "A: なぜその仕事を選んだの？ B: 新しい経験がしたかったからです。",
        ],
      },
      formal_vs_informal: {
        formal: "経験 (used in all contexts, formal and informal)",
        informal: "体験 (more casual, often used for personal experiences)",
      },
      variations: {
        variations: ["経験者", "経験談", "経験不足"],
      },
      writing_guide: {
        guide:
          "1. Write '経' (left: 糸, right: 巠). 2. Write '験' (left: 馬, right: 僉).",
        tips: "Both characters are complex, so practice writing them stroke by stroke.",
      },
      cultural_note: {
        note: "In Japan, experience is often seen as a key factor in personal and professional growth, and sharing experiences is a common way to build connections.",
      },
      practice_tips: {
        tips: "Reflect on your own experiences and write about them in Japanese to practice using the word naturally.",
      },
    },
  ],
};

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const { theme, toggleTheme } = useTheme();

  const handlePrevious = () => {
    setCurrentWordIndex(
      (prev) => (prev - 1 + sampleData.vocab.length) % sampleData.vocab.length
    );
  };

  const handleNext = () => {
    setCurrentWordIndex((prev) => (prev + 1) % sampleData.vocab.length);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Tutor AI</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDrawerOpen(true)}
              className="rounded-full"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div>
          <Button onClick={() => apiCall}>api</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <VocabCard
          word={sampleData.vocab[currentWordIndex]}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </main>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}

function AppWrapper() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

export default AppWrapper;
