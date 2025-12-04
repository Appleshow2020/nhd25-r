import { useState, useEffect } from "react";
import { shuffle } from "../utils/shuffle";

export default function QuestionCard({ question, onSelect }) {
  const [choices, setChoices] = useState([]);

  useEffect(() => {
    setChoices(shuffle(question.choices));
  }, [question]);

  return (
    <div style={{ padding: 16 }}>
      <img
        src={question.image}
        alt="문제"
        style={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 8,
          marginBottom: 20
        }}
      />

      {choices.map((c, i) => (
        <button
          key={i}
          onClick={() => onSelect(c)}
          style={btn}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

const btn = {
  display: "block",
  width: "100%",
  maxWidth: 300,
  padding: "12px",
  marginBottom: 10,
  borderRadius: "8px",
  fontSize: "16px",
  cursor: "pointer"
};
