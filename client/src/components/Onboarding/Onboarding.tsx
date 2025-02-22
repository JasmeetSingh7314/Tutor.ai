import { useForm, SubmitHandler } from "react-hook-form";
import type {
  FormData,
  Language,
  Proficiency,
  PrimaryGoal,
  LearningStyle,
} from "../../lib/types";
import { useEffect } from "react";
import updateUser from "@/apis/users/updateUser";
import { useNavigate } from "react-router-dom";

const languages: Language[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
];

const proficiencyLevels: { value: Proficiency; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "native", label: "Native Speaker" },
];

const primaryGoals: { value: PrimaryGoal; label: string }[] = [
  { value: "academic", label: "Academic Purposes" },
  { value: "career", label: "Career Advancement" },
  { value: "personal", label: "Personal Interest" },
  { value: "travel", label: "Travel and Communication" },
  { value: "other", label: "Other" },
];

const learningStyles: { value: LearningStyle; label: string }[] = [
  { value: "visual", label: "Visual (prefer images, diagrams)" },
  { value: "auditory", label: "Auditory (prefer listening to audio)" },
  { value: "kinesthetic", label: "Kinesthetic (prefer hands-on activities)" },
  {
    value: "reading_writing",
    label: "Reading/Writing (prefer reading texts and writing notes)",
  },
];
const Onboarding = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      nativeLanguage: "",
      targetLanguage: "",
      goals: "",
      primaryGoal: "personal",
    },
  });
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log("Form submitted:", data);
    const userId = localStorage.getItem("userId");

    const patchUser = await updateUser(userId, data);

    localStorage.setItem("userDetails", JSON.stringify(patchUser.data));

    navigate("/profile");

    // Handle form submission here
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f0d] transition-colors duration-200">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="container mx-auto px-4 py-4">
        {/* Header */}

        {/* Onboarding Form */}
        <div className="max-w-2xl mx-auto flex flex-col p-8">
          <div className="bg-white dark:bg-[#0A0F0D] backdrop-blur-sm rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
              Personalize Your Learning Experience
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-14">
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                    Your Name:
                  </label>
                  <input
                    id="fullName"
                    {...register("fullName", {
                      required: "Dont be shy.. enter your name",
                    })}
                    placeholder="Enter name"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent"
                  ></input>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                    Email:
                  </label>
                  <input
                    id="email"
                    {...register("email", {
                      required: "come on now.. enter your email",
                    })}
                    placeholder="enter your email"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent"
                  ></input>
                </div>
                <div>
                  <label
                    htmlFor="nativeLanguage"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1"
                  >
                    Native Language
                  </label>
                  <select
                    id="nativeLanguage"
                    {...register("nativeLanguage", {
                      required: "Please select your native language",
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent"
                  >
                    <option value="">Select your native language</option>
                    {languages.map((lang, index) => (
                      <option key={index} value={lang.name}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                  {errors.nativeLanguage && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.nativeLanguage.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="targetLanguage"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1"
                  >
                    Language You Want to Learn
                  </label>
                  <select
                    id="targetLanguage"
                    {...register("targetLanguage", {
                      required: "Please select a target language",
                    })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent"
                  >
                    <option value="">Select target language</option>
                    {languages.map((lang, index) => (
                      <option key={index} value={lang.name}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                  {errors.targetLanguage && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.targetLanguage.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                    Proficiency Level
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {proficiencyLevels.map((level) => (
                      <div key={level.value} className="flex items-center">
                        <input
                          type="radio"
                          id={level.value}
                          {...register("priorExperience")}
                          value={level.value}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-600"
                        />
                        <label
                          htmlFor={level.value}
                          className="ml-2 text-sm text-slate-700 dark:text-slate-200"
                        >
                          {level.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="goals"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1"
                  >
                    What Are You Looking to Achieve?
                  </label>
                  <textarea
                    id="goals"
                    {...register("goals", {
                      required: "Please describe your goals",
                    })}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent"
                    placeholder="Describe your language learning goals..."
                  />
                  {errors.goals && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.goals.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="primaryGoal"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1"
                  >
                    Primary Goal for Learning the Language
                  </label>
                  <select
                    id="primaryGoal"
                    {...register("primaryGoal")}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent"
                  >
                    {primaryGoals.map((goal) => (
                      <option key={goal.value} value={goal.value}>
                        {goal.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                    What's Your Learning Style?
                  </label>
                  <div className="space-y-2">
                    {learningStyles.map((style) => (
                      <div key={style.value} className="flex items-center">
                        <input
                          type="radio"
                          id={style.value}
                          {...register("preference")}
                          value={style.value}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-600"
                        />
                        <label
                          htmlFor={style.value}
                          className="ml-2 text-sm text-slate-700 dark:text-slate-200"
                        >
                          {style.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
              >
                Start My Learning Journey
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
