import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Lesson from "./pages/Lesson";

import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import { Navbar } from "@heroui/react";
import { ProtectedRoutes } from "./components/ProtectedRoute";
import QuizPage from "./pages/QuizPage";
import Chat from "./pages/Chat";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/lesson" element={<Lesson />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/sign-up" element={<Onboarding />} />
        <Route path="/chat" element={<Chat />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
