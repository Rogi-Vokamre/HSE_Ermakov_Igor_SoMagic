import React, { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaUserAstronaut } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { LuTicketPlus } from "react-icons/lu";
import "./ProfilePage.css";

function ProfilePage({ onBack }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Проверяем, запущено ли в Telegram
    if (window.Telegram?.WebApp) {
      const backButton = window.Telegram.WebApp.BackButton;
      const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;

      // Устанавливаем обработчик
      backButton.show();
      backButton.onClick(() => {
        onBack(); // Возвращаемся в меню
      });

      // Сохраняем данные пользователя
      if (tgUser) {
        setUser(tgUser);
      }

      // Очистка при размонтировании
      return () => {
        backButton.hide();
        backButton.offClick();
      };
    }
  }, [onBack]);

  // Формируем имя пользователя
  const displayName = user
    ? `${user.first_name}${user.last_name ? " " + user.last_name : ""}`
    : "Пользователь";

  return (
    <div className="profile-page">
      {/* Иконка профиля */}
      <div className="profile-icon-container">
        <CgProfile size={80} color="#000000ff" />
      </div>

      {/* Заголовок */}
      <h1 className="profile-title">Профиль</h1>

      {/* Контейнер с информацией */}
      <div className="profile-container">
        {/* Пункт 1: Пользователь */}
        <div className="profile-item">
          <div className="profile-item-icon">
            <FaUserAstronaut size={20} color="#000000ff" />
          </div>
          <div className="profile-item-text">Пользователь: {displayName}</div>
        </div>

        {/* Пункт 2: Количество проверок */}
        <div className="profile-item">
          <div className="profile-item-icon">
            <CiCircleCheck size={20} color="#000000ff" />
          </div>
          <div className="profile-item-text">
            Количество доступных проверок: неограниченное количество проверок до
            1 ноября 2025
          </div>
        </div>

        {/* Пункт 3: Тарифный план */}
        <div className="profile-item">
          <div className="profile-item-icon">
            <LuTicketPlus size={20} color="#000000ff" />
          </div>
          <div className="profile-item-text">
            Тарифный план: "Разработчик" до 1 ноября 2025
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
