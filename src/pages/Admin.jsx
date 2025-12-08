import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminPage() {
  const { user } = useAuth();

  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <h1>관리자 페이지</h1>
      <p>관리자: {user.name} / {user.studentId}</p>

      <ul>
        <li>유저 목록 보기</li>
        <li>퀴즈 결과 보기</li>
        <li>설정 관리</li>
      </ul>
    </div>
  );
}
