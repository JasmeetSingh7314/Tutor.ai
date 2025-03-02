import { VocabCard } from "@/components/Lesson/VocabCard";
import { Button } from "@heroui/react";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Drawer } from "@/components/Lesson/Drawer";
import { Navbar } from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import updateWords from "@/apis/users/updateWords";
import { createQuiz } from "@/apis/materials/createQuiz";

const Lesson = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const location = useLocation();
  const data = location.state.lesson;

  const isNew = location.state.isNew;

  const lessonId = location.state.lessonId;

  useEffect(() => {
    console.log(data);
  }, [data]);

  const navigate = useNavigate();

  const [userId, setUserID] = useState<string | null>();

  useEffect(() => {
    setUserID(localStorage.getItem("userId"));
    console.log(userId);
  }, [userId]);

  const handlePrevious = () => {
    setCurrentWordIndex((prev) => (prev - 1 + data?.length) % data.length);
  };

  const handleNext = () => {
    setCurrentWordIndex((prev) => (prev + 1) % data?.length);
  };
  const handleWords = async () => {
    const response = await updateWords(userId, data);
    console.log(response);
    if (response?.success) {
      navigate("/profile");
    }
  };

  return (
    <main className="flex flex-col gap-y-12">
      <Navbar />
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300 ">
        <main className="container mx-auto px-4 py-20 mt-24">
          <VocabCard
            word={data[currentWordIndex]}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />

          <div className="flex justify-center items-center gap-x-5">
            {isNew ? (
              <Button
                variant="ghost"
                color="warning"
                onPress={() => {
                  handleWords();
                }}
                className="rounded-md p-6 "
              >
                <Menu className="h-5 w-5" /> Save Lesson
              </Button>
            ) : (
              <Button
                variant="ghost"
                color="warning"
                onPress={() => {
                  navigate("/profile");
                }}
                className="rounded-md p-6 "
              >
                <Menu className="h-5 w-5" /> Return to profile
              </Button>
            )}

            <Button
              variant="ghost"
              color="warning"
              onPress={() => {
                createQuiz(lessonId, userId);
              }}
              className="rounded-md p-6 "
            >
              <Menu className="h-5 w-5" /> Generate Id
            </Button>
          </div>
        </main>

        <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      </div>

      <Footer />
    </main>
  );
};

export default Lesson;
