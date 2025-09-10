import React, { useState } from "react";
import Menu from "../Menu/Menu";
import ProfilePage from "../ProfilePage/ProfilePage";
import GuidePage from "../GuidePage/GuidePage";
import ChecksPage from "../ChecksPage/ChecksPage";
import ArchivePage from "../ArchivePage/ArchivePage";
import "./SecondPage.css";

function SecondPage({ saveToArchive, archive, t, language, setLanguage }) {
  const [currentPage, setCurrentPage] = useState("menu");

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  if (currentPage === "profile") {
    return <ProfilePage onBack={() => setCurrentPage("menu")} />;
  }

  if (currentPage === "guide") {
    return <GuidePage onBack={() => setCurrentPage("menu")} />;
  }

  if (currentPage === "checks") {
    return (
      <ChecksPage
        onBack={() => setCurrentPage("menu")}
        saveToArchive={saveToArchive}
        t={t} // ← ПЕРЕДАЁМ t
      />
    );
  }

  if (currentPage === "archive") {
    return (
      <ArchivePage
        onBack={() => setCurrentPage("menu")}
        archive={archive}
        t={t} // ← ПЕРЕДАЁМ t
      />
    );
  }

  return (
    <div className="second-page">
      {/* Логотип */}
      <div className="logo-container">
        <img
          src="/somagic logo.svg"
          alt="SoMagic Logo"
          className="so-magic-logo"
        />
      </div>
      {/* Меню "Команды" */}
      <h3 className="menu-title-outside-commands">Команды</h3>
      <Menu type="commands" onNavigate={handleNavigate} t={t} />{" "}
      {/* ← ПЕРЕДАЁМ t */}
      {/* Меню "Настройки" */}
      <h3 className="menu-title-outside-settings" style={{ marginTop: "25px" }}>
        Настройки
      </h3>
      <Menu type="settings" onNavigate={handleNavigate} t={t} />{" "}
      {/* ← ПЕРЕДАЁМ t */}
      {/* Спонсор */}
      <div className="sponsor-container-menu">
        <span className="sponsor-text">При поддержке АО "Шард"</span>
        <img
          src="/shard logo.png"
          alt="Логотип АО Шард"
          className="sponsor-logo"
        />
      </div>
    </div>
  );
}

export default SecondPage;
