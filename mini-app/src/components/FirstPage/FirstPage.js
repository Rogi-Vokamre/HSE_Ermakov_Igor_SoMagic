import React from "react";
import RingAnimation from "../RingAnimation/RingAnimation";
import TypingText from "../TypingText/TypingText";
import "./FirstPage.css";

function FirstPage({ onNext, t }) {
  return (
    <>
      <RingAnimation />
      <TypingText />
      <button className="next-button" onClick={onNext}>
        {t("nextButton")}
      </button>

      <div className="sponsor-container">
        <span className="sponsor-text">При поддержке АО "Шард"</span>
        <img
          src="/shard logo.png"
          alt="Логотип АО Шард"
          className="sponsor-logo"
        />
      </div>
    </>
  );
}

export default FirstPage;
