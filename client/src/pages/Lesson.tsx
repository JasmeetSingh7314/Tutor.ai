import { createLesson } from "@/apis/materials/get_lesson";
import updateUser from "@/apis/users/updateUser";
import { useTheme } from "@/components/ThemeProvider";

import { VocabCard } from "@/components/VocabCard";
import { Button } from "@heroui/react";
import { Menu, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Drawer } from "@/components/Drawer";
const Lesson = () => {
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

      console.log(lessonResponse.data.lesson.vocab);
      setData(lessonResponse.data.lesson.vocab);
    };
    getLesson();
  }, [toggle]);

  const setAlco = async () => {
    setToggle(!toggle);
  };

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
            <Button variant="ghost" color="warning" className="rounded-md p-6">
              Hit API
            </Button>
          </div>
        </div>
        <div></div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <VocabCard
          word={data[currentWordIndex]}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />

        <div className="flex justify-center items-center gap-x-5">
          <Button
            variant="ghost"
            color="warning"
            onPress={() => {
              updateUser("knownWords", data);
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
};

export default Lesson;
