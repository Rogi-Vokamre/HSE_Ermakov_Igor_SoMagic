import React, { useEffect, useState } from "react";
import "@twa-dev/sdk";
import FirstPage from "./components/FirstPage/FirstPage";
import SecondPage from "./components/SecondPage/SecondPage";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      
      window.Telegram.WebApp.ready();

      window.Telegram.WebApp.requestFullscreen();
    }
  }, []);

  const handleNext = () => {
    setCurrentPage(2);
  };

  return (
    <div className="App">
      {currentPage === 1 ? <FirstPage onNext={handleNext} /> : <SecondPage />}
    </div>
  );
}

export default App;
