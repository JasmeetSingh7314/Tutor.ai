import React, { useState } from "react";
import {
  Languages,
  MessageCircle,
  Book,
  Trophy,
  Settings,
  Sparkles,
  Send,
  Volume2,
  RefreshCw,
} from "lucide-react";

// Dummy data structure for flashcards
interface Flashcard {
  word: string;
  meaning: string;
  sentence: string;
  breakdown: string;
}

const dummyFlashcards: Flashcard[] = [
  {
    word: "El gato",
    meaning: "The cat",
    sentence: "El gato duerme en la ventana.",
    breakdown:
      "el (the) + gato (cat) + duerme (sleeps) + en (in/on) + la (the) + ventana (window)",
  },
  {
    word: "La mesa",
    meaning: "The table",
    sentence: "La mesa está en la cocina.",
    breakdown:
      "la (the) + mesa (table) + está (is) + en (in) + la (the) + cocina (kitchen)",
  },
  {
    word: "El libro",
    meaning: "The book",
    sentence: "El libro es interesante.",
    breakdown: "el (the) + libro (book) + es (is) + interesante (interesting)",
  },
];

function App() {
  const [message, setMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("Spanish");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = dummyFlashcards[currentCardIndex];

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % dummyFlashcards.length);
    setIsFlipped(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Languages className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">LinguaAI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="rounded-lg border-gray-300 bg-white px-4 py-2 text-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Italian</option>
            </select>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <Settings className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chat Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="h-[500px] flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {/* Flashcard */}
                <div
                  className="w-full aspect-[3/2] cursor-pointer perspective-1000"
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
                      isFlipped ? "rotate-y-180" : ""
                    }`}
                  >
                    {/* Front of card */}
                    <div className="absolute w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden">
                      <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        {currentCard.word}
                      </h2>
                      <p className="text-gray-600">Click to reveal meaning</p>
                    </div>

                    {/* Back of card */}
                    <div className="absolute w-full h-full bg-white rounded-2xl p-8 rotate-y-180 backface-hidden">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-700">
                            Meaning:
                          </h3>
                          <p className="text-gray-600">{currentCard.meaning}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-700">
                            Example:
                          </h3>
                          <p className="text-gray-600">
                            {currentCard.sentence}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-700">
                            Breakdown:
                          </h3>
                          <p className="text-gray-600">
                            {currentCard.breakdown}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  <button
                    onClick={nextCard}
                    className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <RefreshCw className="h-5 w-5" />
                    <span>Next Card</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700">
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Progress
                </h2>
                <Trophy className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Daily Streak</span>
                    <span>7 days</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-indigo-600 rounded-full w-3/4"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Vocabulary</span>
                    <span>124 words</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-indigo-600 rounded-full w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <MessageCircle className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                <span className="block text-sm text-gray-700">
                  Practice Speaking
                </span>
              </button>
              <button className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <Book className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                <span className="block text-sm text-gray-700">Vocabulary</span>
              </button>
              <button className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <Sparkles className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                <span className="block text-sm text-gray-700">
                  Daily Challenge
                </span>
              </button>
              <button className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <Trophy className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                <span className="block text-sm text-gray-700">
                  Achievements
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
