export default function Overlay({ visible, correct, onClose }) {
  if (!visible) return null;

  return (
    <div style={overlayStyle}>
      <div style={boxStyle}>
        <h2>{correct ? "정답!" : "오답!"}</h2>
        <button onClick={onClose} style={btnStyle}>계속하기</button>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0, left: 0,
  width: "100vw",
  height: "100vh",
  backdropFilter: "blur(8px)",
  background: "rgba(0,0,0,0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const boxStyle = {
  background: "white",
  padding: "32px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 0 10px rgba(0,0,0,0.2)"
};

const btnStyle = {
  marginTop: "20px",
  padding: "10px 20px",
  fontSize: "16px",
  borderRadius: "8px",
  cursor: "pointer"
};
