import React, { useEffect } from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import {
  TbCircleNumber1,
  TbCircleNumber2,
  TbCircleNumber3,
} from "react-icons/tb";
import "./GuidePage.css";

function GuidePage({ onBack, t }) {
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const backButton = window.Telegram.WebApp.BackButton;
      backButton.show();
      backButton.onClick(onBack);
      return () => {
        backButton.hide();
        backButton.offClick();
      };
    }
  }, [onBack]);

  return (
    <div className="guide-page">
      <div className="guide-icon-container">
        <IoMdInformationCircleOutline size={80} color="#000000ff" />
      </div>

      <h1 className="guide-title">{t("guideTitle")}</h1>

      <div className="guide-container">
        <div className="guide-item">
          <div className="guide-item-icon">
            <TbCircleNumber1 size={30} color="#000000ff" />
          </div>
          <div className="guide-item-text">{t("guideStep1")}</div>
        </div>

        <div className="guide-item">
          <div className="guide-item-icon">
            <TbCircleNumber2 size={30} color="#000000ff" />
          </div>
          <div className="guide-item-text">{t("guideStep2")}</div>
        </div>

        <div className="guide-item">
          <div className="guide-item-icon">
            <TbCircleNumber3 size={30} color="#000000ff" />
          </div>
          <div className="guide-item-text">
            {t("guideStep3Part1")}
            <a
              href="https://github.com/Rogi-Vokamre/HSE_Ermakov_Igor_SoMagic/tree/main"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
            >
              {t("guideStep3Part2")}
            </a>
            {t("guideStep3Part3")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuidePage;
