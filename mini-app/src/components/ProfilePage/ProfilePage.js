import React, { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaUserAstronaut } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { LuTicketPlus } from "react-icons/lu";
import "./ProfilePage.css";

function ProfilePage({ onBack, t }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const backButton = window.Telegram.WebApp.BackButton;
      const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;

      backButton.show();
      backButton.onClick(() => {
        onBack();
      });

      if (tgUser) {
        setUser(tgUser);
      }

      return () => {
        backButton.hide();
        backButton.offClick();
      };
    }
  }, [onBack]);

  const displayName = user
    ? `${user.first_name}${user.last_name ? " " + user.last_name : ""}`
    : "Пользователь";

  return (
    <div className="profile-page">
      <div className="profile-icon-container">
        <CgProfile size={80} color="#000000ff" />
      </div>

      <h1 className="profile-title">{t("profileTitle")}</h1>

      <div className="profile-container">
        <div className="profile-item">
          <div className="profile-item-icon">
            <FaUserAstronaut size={20} color="#000000ff" />
          </div>
          <div className="profile-item-text">
            {t("user")}: {displayName}
          </div>
        </div>

        <div className="profile-item">
          <div className="profile-item-icon">
            <CiCircleCheck size={20} color="#000000ff" />
          </div>
          <div className="profile-item-text">
            {t("availableChecks")}: {t("unlimitedUntil")}
          </div>
        </div>

        <div className="profile-item">
          <div className="profile-item-icon">
            <LuTicketPlus size={20} color="#000000ff" />
          </div>
          <div className="profile-item-text">
            {t("tariffPlan")}: {t("developerUntil")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
