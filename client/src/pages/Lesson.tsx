import { VocabCard } from "@/components/Lesson/VocabCard";
import { Button } from "@heroui/react";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Drawer } from "@/components/Lesson/Drawer";
import { Navbar } from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import updateWords from "@/apis/users/updateWords";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { updateMaterial } from "@/apis/materials/updateMaterial";

const Lesson = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userId, setUserID] = useState<string | null>();
  const [user, setUser] = useState<any>();

  const location = useLocation();
  const data = location.state.lesson;

  const isNew = location.state.isNew;

  const lessonId = location.state.lessonId;

  useEffect(() => {
    console.log(data);
  }, [data]);

  const navigate = useNavigate();

  useEffect(() => {
    setUserID(localStorage.getItem("userId") as string);
    setUser(JSON.parse(localStorage.getItem("userDetails") as string));
    console.log(user);
    console.log(userId);
  }, [userId]);

  const handlePrevious = () => {
    setCurrentWordIndex(
      (prev) => (prev - 1 + data?.length) % data?.vocab.length
    );
  };

  const handleNext = () => {
    setCurrentWordIndex((prev) => (prev + 1) % data.vocab?.length);
  };

  const handleWords = async () => {
    const response = await updateWords(userId, data.vocab);
    console.log(response);
    if (response.result?.levelResponse?.levelUp) {
      toast("Level up!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    } else {
      toast(" same level keep working hard!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
    if (response?.xp !== 0) {
      try {
        const response = await updateMaterial(userId, data, {});
        const result = response.json();
        console.log(result);
      } catch (err) {
        console.error(err);
      }
    }

    console.log(response);
    console.log("is it successful?", response);
    if (response?.result?.success) {
      toast(`words noted! xp saved is : ${response?.xp}`, {
        position: "bottom-right",
        autoClose: 5000,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
        className: "font-nunito font-bold",
      });
    }

    // if (response?.data?.userId) {
    //   navigate("/profile");
    // }

    // navigate("/profile");
  };

  return (
    <main className="flex flex-col gap-y-12 font-nunito">
      <Navbar />
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300 ">
        <main className="container mx-auto px-4 py-20 mt-24">
          <VocabCard
            word={data.vocab[currentWordIndex]}
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

            {/* <Button
              variant="ghost"
              color="warning"
              onPress={() => {
                createQuiz(lessonId, userId);
              }}
              className="rounded-md p-6 "
            >
              <Menu className="h-5 w-5" /> Generate Id
            </Button> */}
          </div>
        </main>

        <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      </div>

      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </main>
  );
};

export default Lesson;
