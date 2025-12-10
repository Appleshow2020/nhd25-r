import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";

const isAdmin = () => {
  return (
    localStorage.getItem("studentId") === "20329" &&
    localStorage.getItem("name") === "이준서"
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/admin" element={
            isAdmin() ? <Admin /> : <Navigate to="/" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
