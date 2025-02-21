import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { VocabCard } from "@/components/VocabCard";
import { Drawer } from "@/components/Drawer";
// import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import updateUser from "./apis/users/updateUser";
import { Button } from "@heroui/react";
import { sampleData } from "./lib/sampleData";
import { createLesson } from "./apis/materials/get_lesson";

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const [data, setData] = useState([]);
  const [toggle, setToggle] = useState(true);

  const handlePrevious = () => {
    setCurrentWordIndex((prev) => (prev - 1 + data?.length) % data.length);
  };

  const handleNext = () => {
    setCurrentWordIndex((prev) => (prev + 1) % data?.length);
  };

  useEffect(() => {
    const getLesson = async () => {
      const lessonResponse = await createLesson();

      console.log(lessonResponse?.vocab);
      setData(lessonResponse?.vocab);
    };
    getLesson();
    console.log("abcd");
  }, [toggle]);

  const setAlco = async () => {
    setToggle(!toggle);
  };

  console.log(data);
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Tutor AI</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onPress={toggleTheme}
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
              onPress={() => setIsDrawerOpen(true)}
              className="rounded-full"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              color="warning"
              className="rounded-md p-6"
              onPress={() => updateUser("")}
            >
              Hit API
            </Button>
          </div>
        </div>
        <div></div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <VocabCard
          word={data.length > 1 ? data[currentWordIndex] : data[0]}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />

        <div className="flex justify-center items-center gap-x-5">
          <Button
            variant="ghost"
            color="warning"
            onPress={() => {
              updateUser("knownWords");
            }}
            className="rounded-md p-6"
          >
            <Menu className="h-5 w-5" /> End Lesson
          </Button>
          <Button
            variant="ghost"
            onPress={() => setAlco()}
            color="danger"
            className="rounded-md p-6 "
          >
            <Menu className="h-5 w-5" /> Generate Lesson
          </Button>
        </div>
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
