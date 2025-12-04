import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={wrap}>
      <h1>NHD25 Quiz</h1>
      <input type="text" placeholder="이름 입력" name="studentName" required />
      <input type="number" placeholder="학번 입력" name="studentId" required />
      <button onClick={() => {
        navigate("/quiz");
        
      }}>
        시작하기
      </button>
    </div>
  );
}

const wrap = {
  textAlign: "center",
  marginTop: "80px"
};
