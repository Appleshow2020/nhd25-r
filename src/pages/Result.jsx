import { useLocation, useNavigate } from "react-router-dom";

export default function Result() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { score, total } = state || { score: 0, total: 0 };
  const snackCount = score

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1>결과</h1>
      <h2>{score} / {total} 점</h2>
      <button
        style={{ fontSize: "20px", padding: "10px 20px", marginTop: "20px" }}
        onClick={() => navigate("/")}
      >
        다시 시작
      </button>
    </div>
  );
}
