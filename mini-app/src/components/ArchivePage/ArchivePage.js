import React, { useEffect } from "react";
import { IoArchiveOutline } from "react-icons/io5";
import "./ArchivePage.css";

function ArchivePage({ onBack, archive, t }) {
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
        alert(t("reportCopied"));
      })
      .catch((err) => {
        console.error("Ошибка копирования: ", err);
        alert(t("reportCopyFailed"));
      });
  };

  const getRiskBgColor = (riskScore) => {
    if (riskScore >= 80) return "#ffebee";
    if (riskScore >= 60) return "#fff3e0";
    if (riskScore >= 30) return "#fffde7";
    return "#f3fde8";
  };

  if (!archive || archive.length === 0) {
    return (
      <div className="archive-page">
        <div className="archive-icon-container">
          <IoArchiveOutline size={80} color="#000000ff" />
        </div>
        <h1 className="archive-title">{t("archiveTitle")}</h1>
        <p className="archive-empty">{t("archiveEmpty")}</p>
      </div>
    );
  }

  return (
    <div className="archive-page">
      <div className="archive-icon-container">
        <IoArchiveOutline size={80} color="#000000ff" />
      </div>

      <h1 className="archive-title">{t("archiveTitle")}</h1>

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
              <strong>{t("network")}:</strong> {item.meta.network}
            </div>
            <div className="archive-field">
              <strong>{t("address")}:</strong> {item.meta.address}
            </div>
            <div className="archive-field">
              <strong>{t("riskScore")}:</strong> {Math.round(item.risk_score)}{" "}
              из 100
            </div>

            {item.balance !== undefined && (
              <div className="archive-field">
                <strong>{t("balance")}:</strong> {item.balance}
              </div>
            )}

            {item.report_risk?.risk_tags?.length > 0 && (
              <div className="archive-field">
                <strong>{t("mainRisks")}:</strong>{" "}
                {item.report_risk.risk_tags.map((t) => t.tag).join(", ")}
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="export-pdf-button" onClick={copyReportToClipboard}>
        {t("copyReport")}
      </button>
    </div>
  );
}

export default ArchivePage;
