import { Button } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizCard from "./QuizCard";
import { getMaterial } from "@/apis/materials/getLesson";
import { createQuiz } from "@/apis/materials/createQuiz";

type QuizProps = {
  userId: string;
};

const Quizzes = ({ userId }: QuizProps) => {
  const [quizData, setQuizData] = useState([]);
  const [data, setData] = useState([]);
  const [toggle, setToggle] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);

  const isRender = useRef(true);

  const navigate = useNavigate();

  useEffect(() => {
    const getLesson = async () => {
      const response = await getMaterial(userId);
      //   console.log(response?.data[0]?.lesson);
      setQuizData(response?.data[0]?.quiz);
      console.log("get lesson", response?.data[0].quiz);
    };
    getLesson();
  }, []);

//   useEffect(() => {
//     console.log("Use effect", userId);
//     const getLesson = async () => {
//       setLoading(true);
//       const quizResponse = await createQuiz(userId);

//       console.log(quizResponse.data);
//       //   setData(quizResponse.data.quiz);

//       setLoading(false);

//       navigate("/lesson", {
//         state: { lesson: lessonResponse.data.lesson.vocab, isNew: true },
//       });
//     };

//     if (isRender.current) {
//       isRender.current = false;

//       return;
//     } else {
//       getLesson();
//     }
//   }, [toggle]);

  function handleNewQuiz(): void {
    setToggle(!toggle);
  }

  return (
    <section className=" flex flex-col gap-y-8">
      <div className="flex justify-between items-center gap-x-8">
        <span className="text-3xl font-nunito text-white text-left">
          Start new quiz!
        </span>
        <Button
          variant="solid"
          size="lg"
          className="rounded-md bg-cyan-600 font-nunito font-bold p-4 tracking-wider"
          onPress={() => handleNewQuiz()}
        >
          {loading ? "Generating...." : "New Quiz!"}
        </Button>
      </div>

      <span className="text-3xl font-nunito text-white">
        Completed Quizzes:
      </span>

      <div className="grid grid-cols-2 gap-10">
        {quizData?.map((quiz, index) => (
          <QuizCard quiz={quiz} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Quizzes;
