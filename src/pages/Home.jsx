import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Home.module.css";

export default function Home() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const startQuiz = () => {
    if (studentId.trim() === "" || name.trim() === "") {
      setError("학번과 이름을 모두 입력해야 합니다.");
      return;
    }
    localStorage.setItem("studentId", studentId);
    localStorage.setItem("name", name);
    if (name === "이준서" && studentId === "20329") {
      navigate("/admin");
    } else {
      navigate(`/quiz?student_id=${studentId}&name=${name}`);
    }
 
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>수학 퀴즈</h1>

      <input
        className={styles.input}
        placeholder="학번 입력"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />

      <input
        className={styles.input}
        placeholder="이름 입력"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {error && <p className={styles.error}>{error}</p>}

      <button className={styles.startButton} onClick={startQuiz}>
        시작하기
      </button>
    </div>
  );
}
