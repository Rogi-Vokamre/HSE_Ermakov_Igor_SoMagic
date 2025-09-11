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
    return <ProfilePage onBack={() => setCurrentPage("menu")} t={t} />;
  }

  if (currentPage === "guide") {
    return <GuidePage onBack={() => setCurrentPage("menu")} t={t} />;
  }

  if (currentPage === "checks") {
    return (
      <ChecksPage
        onBack={() => setCurrentPage("menu")}
        saveToArchive={saveToArchive}
        t={t}
      />
    );
  }

  if (currentPage === "archive") {
    return (
      <ArchivePage
        onBack={() => setCurrentPage("menu")}
        archive={archive}
        t={t}
      />
    );
  }

  return (
    <div className="second-page">
      <div className="logo-container">
        <img
          src="/somagic logo.svg"
          alt="SoMagic Logo"
          className="so-magic-logo"
        />
      </div>

      <h3 className="menu-title-outside-commands">{t("commands")}</h3>
      <Menu type="commands" onNavigate={handleNavigate} t={t} />

      <h3 className="menu-title-outside-settings" style={{ marginTop: "25px" }}>
        {t("settings")}
      </h3>
      <Menu
        type="settings"
        onNavigate={handleNavigate}
        t={t}
        language={language}
        setLanguage={setLanguage}
      />

      <div className="sponsor-container-menu">
        <span className="sponsor-text">{t("supportedByShard")}</span>
        <img
          src="/shard logo.png"
          alt={t("supportedByShard")} // ← Также переведём alt для доступности
          className="sponsor-logo"
        />
      </div>
    </div>
  );
}

export default SecondPage;


