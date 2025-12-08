import { useState, useEffect } from "react";
import { questions } from "../data/questions";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/Quiz.module.css";

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function Quiz() {
  const TOTAL_TIME = 480;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

  const [quizList, setQuizList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [effectType, setEffectType] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState({});
  const [results, setResults] = useState([]);
  const [quizOver, setQuizOver] = useState(false);

  const [userAnswer, setUserAnswer] = useState("");

  useEffect(() => {
    const picked = shuffle(questions).slice(0, 5);
    setQuizList(picked);
  }, []);

  useEffect(() => {
    if (quizOver) return;

    if (timeLeft <= 0) {
      finishAllAsWrong();
      return;
    }

    const t = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, quizOver]);

  const finishAllAsWrong = () => {
    let remaining = [];
    for (let i = currentIndex; i < quizList.length; i++) {
      remaining.push({ id: quizList[i].id, correct: false });
    }
    setResults(prev => [...prev, ...remaining]);
    setQuizOver(true);
  };

  const nextQuestion = () => {
    setEffectType(null);
    setShowHint(false);
    setUserAnswer("");

    if (currentIndex + 1 >= quizList.length) setQuizOver(true);
    else setCurrentIndex(i => i + 1);
  };

  const handleAnswer = (answer) => {
    const current = quizList[currentIndex];
    const correct = answer === current.answer;

    setResults(prev => [...prev, { id: current.id, correct }]);
    setEffectType(correct ? "correct" : "wrong");

    if (!correct) setTimeLeft(t => Math.max(0, t - 60));

    setTimeout(() => nextQuestion(), 1200);
  };

  const checkAnswer = () => {
    if (!userAnswer.trim()) return;
    handleAnswer(userAnswer.trim());
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const studentId = params.get("student_id");
  const name = params.get("name");

  // 필수 값 없으면 홈으로 튕겨냄
  useEffect(() => {
    if (!studentId || !name) {
      navigate("/");
    }
  }, [studentId, name, navigate]);

  
  if (quizList.length === 0) return <p>로딩 중...</p>;

  if (quizOver) {
    const correctCount = results.filter(r => r.correct).length;
    const hintCount = Object.keys(hintUsed).length;
    const snackCount = (correctCount - hintCount) * 3;

    return (
      <div className={styles.container}>
        <h1>결과</h1>
        <h2>총 점수: {correctCount} / {quizList.length}</h2>

        <ul>
          {results.map(r => (
            <li key={r.id}>문제 {r.id}: {r.correct ? "정답" : "오답"}</li>
          ))}
        </ul>

        <h3>힌트: {hintCount}</h3>
        <h3>간식: {snackCount}개</h3>
      </div>
    );
  }

  const current = quizList[currentIndex];
  const timerPercent = (timeLeft / TOTAL_TIME) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.timer}>남은 시간: {formatTime(timeLeft)}</div>

      <div className={styles.timerBar}>
        <div
          className={styles.timerBarFill}
          style={{ width: timerPercent + "%" }}
        />
      </div>

      <h3>문제 {currentIndex + 1} / {quizList.length}</h3>

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
        onClick={() => {
          setShowHint(v => !v);
          setHintUsed(prev => ({ ...prev, [current.id]: true }));
        }}
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
