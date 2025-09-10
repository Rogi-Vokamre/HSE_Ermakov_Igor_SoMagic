import React, { useEffect } from "react";
import { IoArchiveOutline } from "react-icons/io5"; // Убедись, что верный импорт
import "./ArchivePage.css";

function ArchivePage({ onBack, archive }) {
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

  // Функция копирования отчёта в буфер обмена
  const copyReportToClipboard = () => {
    const report = [
      "АРХИВ ПРОВЕРОК SoMagic",
      `Дата формирования отчёта: ${new Date().toLocaleString("ru-RU")}`,
      `Всего проверок: ${archive.length}`,
      "",
      ...archive.map((item) => {
        const risk = Math.round(item.risk_score);
        const tags = (item.report_risk?.risk_tags || [])
          .map((t) => t.tag)
          .join(", ");
        return `#${item.id} | ${item.timestamp} | ${item.meta.network} | ${
          item.meta.address
        } | Риск: ${risk} из 100${
          item.balance ? ` | Баланс: ${item.balance}` : ""
        }\nТеги: ${tags || "—"}`;
      }),
    ].join("\n\n");

    navigator.clipboard
      .writeText(report)
      .then(() => {
        alert(
          "✅ Отчёт скопирован в буфер обмена!\nВставьте его в Telegram, Google Docs или Notes."
        );
      })
      .catch((err) => {
        console.error("Ошибка копирования: ", err);
        alert("Не удалось скопировать. Попробуйте вручную.");
      });
  };

  // Определяем цвет фона по уровню риска
  const getRiskBgColor = (riskScore) => {
    if (riskScore >= 80) return "#ffebee"; // светло-алый
    if (riskScore >= 60) return "#fff3e0"; // светло-оранжевый
    if (riskScore >= 30) return "#fffde7"; // светло-жёлтый
    return "#f3fde8"; // светло-зелёный
  };

  if (!archive || archive.length === 0) {
    return (
      <div className="archive-page">
        <div className="archive-icon-container">
          <IoArchiveOutline size={80} color="#000000ff" />
        </div>
        <h1 className="archive-title">Архив проверок</h1>
        <p className="archive-empty">Нет сохранённых результатов</p>
      </div>
    );
  }

  return (
    <div className="archive-page">
      {/* Иконка */}
      <div className="archive-icon-container">
        <IoArchiveOutline size={80} color="#000000ff" />
      </div>

      {/* Заголовок */}
      <h1 className="archive-title">Архив проверок</h1>

      {/* Список записей */}
      <div className="archive-list">
        {archive.map((item) => (
          <div
            key={item.id}
            className="archive-item"
            style={{
              backgroundColor: getRiskBgColor(item.risk_score),
              transition: "background-color 0.3s ease",
            }}
          >
            <div className="archive-header">
              <strong>#{item.id}</strong>
              <span className="archive-date">{item.timestamp}</span>
            </div>

            <div className="archive-field">
              <strong>Сеть:</strong> {item.meta.network}
            </div>
            <div className="archive-field">
              <strong>Адрес:</strong> {item.meta.address}
            </div>
            <div className="archive-field">
              <strong>Риск:</strong> {Math.round(item.risk_score)} из 100
            </div>

            {item.balance !== undefined && (
              <div className="archive-field">
                <strong>Баланс:</strong> {item.balance}
              </div>
            )}

            {item.report_risk?.risk_tags?.length > 0 && (
              <div className="archive-field">
                <strong>Риски:</strong>{" "}
                {item.report_risk.risk_tags.map((t) => t.tag).join(", ")}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Кнопка копирования */}
      <button className="export-pdf-button" onClick={copyReportToClipboard}>
        Скопировать отчёт
      </button>
    </div>
  );
}

export default ArchivePage;
