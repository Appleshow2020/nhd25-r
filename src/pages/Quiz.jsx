import { useState, useEffect } from "react";
import { questions } from "../data/questions";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/Quiz.module.css";

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function Quiz() {
  const [current, setCurrent] = useState(null);
  const [effectType, setEffectType] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [result, setResult] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");

  useEffect(() => {
    const picked = shuffle(questions)[0];
    setCurrent(picked);
  }, []);

  const handleAnswer = (answer) => {
    const correct = answer === current.answer;
    setResult({ id: current.id, correct, hintUsed });
    setEffectType(correct ? "correct" : "wrong");

    setTimeout(() => {
      setResult({ id: current.id, correct, hintUsed });
    }, 1200);
  };

  const checkAnswer = () => {
    if (!userAnswer.trim()) return;
    handleAnswer(userAnswer.trim());
  };

  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const studentId = params.get("student_id");
  const name = params.get("name");

  useEffect(() => {
    if (!studentId || !name) {
      navigate("/");
    }
  }, [studentId, name, navigate]);

  if (!current) return <p>로딩 중...</p>;

  if (result) {
    const snackCount = result.correct && !result.hintUsed ? 3 : 0;

    return (
      <div className={styles.container}>
        <h1>결과</h1>
        <h2>{result.correct ? "정답!" : "오답"}</h2>
        <h3>힌트 사용: {result.hintUsed ? "예" : "아니오"}</h3>
        <h3>간식: {snackCount}개</h3>
      </div>
    );
  }

  return (
    <div className={styles.container}>

      <img src={current.image} className={styles.questionImage} />

      <input
        className={styles.input}
        type="text"
        placeholder="정답을 입력하세요"
        value={userAnswer}
        onChange={e => setUserAnswer(e.target.value)}
      />

      <button className={`${styles.button} ${styles.primary}`} onClick={checkAnswer}>
        제출
      </button>

      <button
        className={`${styles.button} ${styles.secondary}`}
        onClick={() => setShowHint(v => !v) || setHintUsed(true)}
      >
        힌트 보기
      </button>

      {showHint && <div className={styles.hintBox}>{current.hint}</div>}

      {effectType && (
        <div className={styles.overlay}>
          <div className={`${styles.overlayBox} ${styles[effectType]}`}>
            {effectType === "correct" ? "정답!" : "오답!"}
          </div>
        </div>
      )}
    </div>
  );
}
