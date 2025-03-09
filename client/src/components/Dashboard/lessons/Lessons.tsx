import { getMaterial } from "@/apis/materials/getLesson";
import { useEffect, useRef, useState } from "react";
import LessonCard from "./LessonCard";
import { useNavigate } from "react-router-dom";


const Lessons = () => {
  const [lessonData, setLessonData] = useState([]);
  const [data, setData] = useState([]);
  const [toggle, setToggle] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);

  const isRender = useRef(true);
  const userId: string = localStorage.getItem("userId") as string;
  const navigate = useNavigate();
  useEffect(() => {
    const getLesson = async () => {
      const response = await getMaterial(userId);
      //   console.log(response?.data[0]?.lesson);
      setLessonData(response?.data[0]?.lesson);
      console.log("get lesson", response?.data[0]?.lesson);
    };
    getLesson();
  }, []);

  useEffect(() => {
    console.log("Use effect", userId);
    const getLesson = async () => {
      setLoading(true);
      const lessonResponse = await createLesson(userId);

      console.log(lessonResponse.data.lesson.vocab);
      setData(lessonResponse.data.lesson.vocab);

      setLoading(false);

      navigate("/lesson", {
        state: { lesson: lessonResponse.data.lesson.vocab, isNew: true },
      });
    };

    if (isRender.current) {
      isRender.current = false;
      return;
    } else {
      getLesson();
    }
  }, [toggle]);

  function handleNewLesson() {
    setToggle(!toggle);
  }

  return (
    <section className=" flex flex-col gap-y-8">
    

      <span className="text-3xl font-nunito text-white">Saved Lessons</span>

      <div className="grid grid-cols-2 gap-10">
        {lessonData?.map((lesson, index) => (
          <LessonCard
            lesson={lesson}
            key={index}
            index={index}
            data={lessonData[index]?.lesson}
          />
        ))}
      </div>
    </section>
  );
};

export default Lessons;
