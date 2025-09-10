import React, { useEffect, useState } from "react";
import "@twa-dev/sdk"; // Импортируем SDK
import FirstPage from "./components/FirstPage/FirstPage";
import SecondPage from "./components/SecondPage/SecondPage";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState(1); // 1 - первая страница, 2 - вторая страница
  const [archive, setArchive] = useState(() => {
    const saved = localStorage.getItem("checksArchive");
    return saved ? JSON.parse(saved) : [];
  });

  // Сохраняем в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem("checksArchive", JSON.stringify(archive));
  }, [archive]);

  // Сохраняем в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("checksArchive", JSON.stringify(archive));
  }, [archive]);

  useEffect(() => {
    // Проверяем, запущено ли в Telegram
    if (window.Telegram?.WebApp) {
      // Говорим Telegram, что приложение готово
      window.Telegram.WebApp.ready();

      // Раскрываем на весь экран
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
    setArchive((prev) => [newEntry, ...prev]); // Новые вверху
  };

  return (
    <div className="App">
      {currentPage === 1 ? (
        <FirstPage onNext={handleNext} />
      ) : (
        <SecondPage saveToArchive={saveToArchive} archive={archive} />
      )}
    </div>
  );
}

export default App;
