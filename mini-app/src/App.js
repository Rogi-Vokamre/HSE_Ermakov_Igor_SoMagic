import React, { useEffect, useState } from "react";
import "@twa-dev/sdk";
import FirstPage from "./components/FirstPage/FirstPage";
import SecondPage from "./components/SecondPage/SecondPage";
import translations from "./translation";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [archive, setArchive] = useState(() => {
    const saved = localStorage.getItem("checksArchive");
    return saved ? JSON.parse(saved) : [];
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("appLanguage") || "ru";
  });

  useEffect(() => {
    localStorage.setItem("checksArchive", JSON.stringify(archive));
  }, [archive]);

  useEffect(() => {
    localStorage.setItem("appLanguage", language);
  }, [language]);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.requestFullscreen();
    }
  }, []);

  const handleNext = () => {
    setCurrentPage(2);
  };

  const saveToArchive = (result) => {
    const newEntry = {
      id: archive.length + 1,
      timestamp: new Date().toLocaleString("ru-RU"),
      ...result,
    };
    setArchive((prev) => [newEntry, ...prev]);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "ru" ? "en" : "ru"));
  };

  const t = (key) => translations[language][key] || key;

  return (
    <div className="App">
      {currentPage === 1 ? (
        <FirstPage onNext={handleNext} t={t} />
      ) : (
        <SecondPage
          saveToArchive={saveToArchive}
          archive={archive}
          t={t}
          language={language}
          setLanguage={setLanguage}
        />
      )}
    </div>
  );
}

export default App;
