import React, { useEffect, useState } from "react";
import "./TypingText.css";

function TypingText({ onTypingComplete }) {
  const [displayedText, setDisplayedText] = useState("");
  const fullText =
    "Первое мини-приложение в Telegram для риск-скоринга криптовалютных адресов";

  useEffect(() => {
    let index = 0;
    setDisplayedText("");

    const timer = setInterval(() => {
      if (index < fullText.length) {
        const char = fullText[index];
        if (char && char !== "\u00A0" && char !== "\u200B") {
          setDisplayedText((prev) => prev + char);
        }
        index++;
      } else {
        clearInterval(timer);
        // Уведомляем, что печать завершена
        if (onTypingComplete) {
          onTypingComplete();
        }
      }
    }, 80);

    return () => clearInterval(timer);
  }, [onTypingComplete]);

  return <p className="typing-text">{displayedText}</p>;
}

export default TypingText;
