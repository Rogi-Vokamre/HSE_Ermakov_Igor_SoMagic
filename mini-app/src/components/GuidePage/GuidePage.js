import React, { useEffect } from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import {
  TbCircleNumber1,
  TbCircleNumber2,
  TbCircleNumber3,
} from "react-icons/tb";
import "./GuidePage.css";

function GuidePage({ onBack }) {
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const backButton = window.Telegram.WebApp.BackButton;

      backButton.show();
      backButton.onClick(onBack);

      // Очистка при выходе
      return () => {
        backButton.hide();
        backButton.offClick();
      };
    }
  }, [onBack]);

  return (
    <div className="guide-page">
      {/* Иконка гайда */}
      <div className="guide-icon-container">
        <IoMdInformationCircleOutline size={80} color="#000000ff" />
      </div>

      {/* Заголовок */}
      <h1 className="guide-title">Гайд</h1>

      {/* Контейнер с разделами */}
      <div className="guide-container">
        {/* Пункт 1 */}
        <div className="guide-item">
          <div className="guide-item-icon">
            <TbCircleNumber1 size={30} color="#000000ff" />
          </div>
          <div className="guide-item-text">
            В разделе "Проверки" можно проверять криптовалютные адреса.
            Достаточно указать номер кошелька, затем Вы получите полный отчет.
          </div>
        </div>

        {/* Пункт 2 */}
        <div className="guide-item">
          <div className="guide-item-icon">
            <TbCircleNumber2 size={30} color="#000000ff" />
          </div>
          <div className="guide-item-text">
            В разделе "Профиль" указан твой тарифный план, количество доступных
            проверок.
          </div>
        </div>

        {/* Пункт 3 */}
        <div className="guide-item">
          <div className="guide-item-icon">
            <TbCircleNumber3 size={30} color="#000000ff" />
          </div>
          <div className="guide-item-text">
            С пошаговой инструкцией по использованию приложения можно
            ознакомиться на нашей странице в{" "}
            <a
              href="https://github.com/Rogi-Vokamre/HSE_Ermakov_Igor_SoMagic/tree/main"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
            >
              GitHub
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuidePage;
