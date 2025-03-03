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
        {/* Home Route */}
        <Route path="/" element={<Home />} />

        {/* Onboarding Route */}
        <Route path="/sign-up" element={<Onboarding />} />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/lesson"
          element={
            <ProtectedRoutes>
              <Lesson />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoutes>
              <QuizPage />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoutes>
              <Chat />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
