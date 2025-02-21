import React, { useState } from "react";
import { Moon, Sun, Languages } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import type {
  FormData,
  Language,
  Proficiency,
  PrimaryGoal,
  LearningStyle,
} from "../types";

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

export default function OnboardingForm() {
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    nativeLanguage: "",
    targetLanguage: "",
    proficiency: "beginner",
    goals: "",
    primaryGoal: "personal",
    learningStyle: "visual",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <Languages className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Tutor AI
              </h1>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Welcome to Tutor AI!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              To personalize your learning experience, please fill out the
              following details.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="nativeLanguage"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Native Language
                  </label>
                  <select
                    id="nativeLanguage"
                    name="nativeLanguage"
                    value={formData.nativeLanguage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    required
                  >
                    <option value="">Select your native language</option>
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="targetLanguage"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Language You Want to Learn
                  </label>
                  <select
                    id="targetLanguage"
                    name="targetLanguage"
                    value={formData.targetLanguage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    required
                  >
                    <option value="">Select target language</option>
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Proficiency Level
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {proficiencyLevels.map((level) => (
                      <div key={level.value} className="flex items-center">
                        <input
                          type="radio"
                          id={level.value}
                          name="proficiency"
                          value={level.value}
                          checked={formData.proficiency === level.value}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                        />
                        <label
                          htmlFor={level.value}
                          className="ml-2 text-sm text-gray-700 dark:text-gray-200"
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
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    What Are You Looking to Achieve?
                  </label>
                  <textarea
                    id="goals"
                    name="goals"
                    value={formData.goals}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    placeholder="Describe your language learning goals..."
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="primaryGoal"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Primary Goal for Learning the Language
                  </label>
                  <select
                    id="primaryGoal"
                    name="primaryGoal"
                    value={formData.primaryGoal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    required
                  >
                    {primaryGoals.map((goal) => (
                      <option key={goal.value} value={goal.value}>
                        {goal.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    What's Your Learning Style?
                  </label>
                  <div className="space-y-2">
                    {learningStyles.map((style) => (
                      <div key={style.value} className="flex items-center">
                        <input
                          type="radio"
                          id={style.value}
                          name="learningStyle"
                          value={style.value}
                          checked={formData.learningStyle === style.value}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                        />
                        <label
                          htmlFor={style.value}
                          className="ml-2 text-sm text-gray-700 dark:text-gray-200"
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Start My Learning Journey
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
