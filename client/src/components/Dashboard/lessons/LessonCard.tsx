import { createQuiz } from "@/apis/materials/createQuiz";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

type LessonCardProps = {
  lesson: any;
  index: number;
  data: any;
};
const LessonCard = ({ lesson, index, data }: LessonCardProps) => {
  const userId = localStorage.getItem("userId");
  // console.log(lesson, index);
  const navigate = useNavigate();
  const handleCardOnClick = () => {
    navigate("/lesson", {
      state: {
        lesson: lesson.lesson.vocab,
        isNew: false,
        lessonId: lesson._id,
      },
    });
  };
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.1 }}
      whileHover={{ scale: 1.001 }}
      className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl hover:border hover: border-gray-200/55 p-6 group h-fit cursor-pointer font-nunito "
      onClick={() => handleCardOnClick()}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <h3 className="text-xl font-semibold text-white mb-2">{`Lesson ${
        index + 1
      }`}</h3>
      <p className="text-gray-400/55 mb-4">Words covered:</p>
      <ul className="flex flex-col gap-y-5 list-disc px-6">
        {lesson.lesson.vocab.map((detail: any, index: number) => (
          <li key={index} className="text-gray-400 text-xl ">
            {detail?.word_details?.word}
          </li>
        ))}
      </ul>
      <Button
        variant="solid"
        color="warning"
        onPress={() => {
          createQuiz(lesson._id, userId, data);
        }}
        className="rounded-md p-6 bg-gray-600/45 font-nunito my-4 float-right"
      >
        <Menu className="h-5 w-5" /> Generate Quiz
      </Button>
    </motion.div>
  );
};

export default LessonCard;
