import { VocabCard } from "@/components/lesson/VocabCard";
import { Button } from "@heroui/react";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Drawer } from "@/components/lesson/Drawer";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import updateWords from "@/apis/users/updateWords";

const Lesson = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const location = useLocation();
  const data = location.state.lesson;

  const isNew = location.state.isNew;

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
            <Button
              variant="ghost"
              color="warning"
              onPress={() => {
                if (isNew) {
                  updateWords(userId, data);
                }
                navigate("/profile");
              }}
              className="rounded-md p-6 "
            >
              <Menu className="h-5 w-5" /> End Lesson
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
