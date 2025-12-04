import { useState, useEffect } from "react";
import { questions } from "../data/questions";

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function Quiz() {
  const TOTAL_TIME = 480; // 8분
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

  const [quizList, setQuizList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [effectType, setEffectType] = useState(null); // "correct" | "wrong" | null
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState({}); // {id: true}

  const [results, setResults] = useState([]); // {id, correct: true/false}

  const [quizOver, setQuizOver] = useState(false);

  // 문제 5개 랜덤 추출
  useEffect(() => {
    const picked = shuffle(questions).slice(0, 5);
    setQuizList(picked);
  }, []);

  // 타이머
  useEffect(() => {
    if (quizOver) return;

    if (timeLeft <= 0) {
      // 남은 문제들 전부 오답 처리
      finishAllAsWrong();
      return;
    }

    const t = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, quizOver]);

  // 타이머 0초 → 모두 오답 처리
  const finishAllAsWrong = () => {
    let remainingResults = [];

    for (let i = currentIndex; i < quizList.length; i++) {
      remainingResults.push({ id: quizList[i].id, correct: false });
    }

    setResults(prev => [...prev, ...remainingResults]);
    setQuizOver(true);
  };

  // 남은 문제 없으면 종료
  const nextQuestion = () => {
    setEffectType(null);
    setShowHint(false);

    if (currentIndex + 1 >= quizList.length) {
      setQuizOver(true);
    } else {
      setCurrentIndex(i => i + 1);
    }
  };

  // 정답 / 오답 처리
  const handleAnswer = (choice) => {
    const current = quizList[currentIndex];
    const correct = choice === current.answer;

    setResults(prev => [...prev, { id: current.id, correct }]);
    setEffectType(correct ? "correct" : "wrong");

    // 오답 → 1분 감소
    if (!correct) {
      setTimeLeft(t => Math.max(0, t - 60));
    }

    // 1.2초 효과 후 다음 문제
    setTimeout(() => nextQuestion(), 1200);
  };

  // 시간 표시 형식 함수
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (quizList.length === 0) return <p>로딩 중...</p>;

  // ---------------------------
  // 결과 페이지
  // ---------------------------
  if (quizOver) {
    const correctCount = results.filter(r => r.correct).length;
    const hintCount = Object.keys(hintUsed).length;
    const snackCount = (correctCount - hintCount) * 3;

    return (
      <div style={{ padding: 24 }}>
        <h1>결과</h1>
        <h2>총 점수: {correctCount} / {quizList.length}</h2>

        <h3>문항별 결과</h3>
        <ul>
          {results.map(r => (
            <li key={r.id}>
              문제 {r.id}: {r.correct ? "정답" : "오답"}
            </li>
          ))}
        </ul>
        <h3>힌트 사용: {hintCount}회</h3>
        <h3>관리자에게 간식 {snackCount}개를 수령하세요.</h3>
      </div>
    );
  }

  const current = quizList[currentIndex];

  return (
    <div style={{ position: "relative", padding: 24 }}>
      <h2>남은 시간: {formatTime(timeLeft)}</h2>
      <h3>문제 {currentIndex + 1} / {quizList.length}</h3>

      <img
        src={current.image}
        alt="문제 이미지"
        style={{ width: "300px", marginBottom: 16 }}
      />

      {/* 선택지 */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {shuffle(current.choices).map((choice, idx) => (
          <li key={idx} style={{ marginBottom: 8 }}>
            <button
              onClick={() => handleAnswer(choice)}
              style={{ fontSize: 16, padding: "8px 16px" }}
            >
              {choice}
            </button>
          </li>
        ))}
      </ul>

      {/* 힌트 */}
      <button
        onClick={() => {
          setShowHint(v => !v);
          setHintUsed(prev => ({ ...prev, [current.id]: true }));
        }}
        style={{ marginTop: 10, fontSize: 15 }}
      >
        힌트 보기
      </button>

      {showHint && (
        <p style={{ marginTop: 10, fontStyle: "italic" }}>
          {current.hint}
        </p>
        
      )}

      {/* 정답/오답 효과 */}
      {effectType && (
        <div style={overlayStyle}>
          <div style={boxStyle}>
            {effectType === "correct" ? "정답!" : "오답!"}
          </div>
        </div>
      )}
    </div>
  );
}

// Blur overlay
const overlayStyle = {
  position: "absolute",
  inset: 0,
  backdropFilter: "blur(4px)",
  background: "rgba(0,0,0,0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

// Box in the center
const boxStyle = {
  padding: "24px 40px",
  background: "white",
  borderRadius: "12px",
  fontSize: "24px",
  fontWeight: "bold",
};
