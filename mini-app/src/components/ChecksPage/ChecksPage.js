import React, { useEffect, useState } from "react";
import { LuScanSearch } from "react-icons/lu";
import "./ChecksPage.css";

// Токен API от Шард
// const API_TOKEN = [HIDDEN FOR SECURITY REASONS];
// const API_BASE = "https://shard.ru/external/api";
const PROXY_URL = [HIDDEN FOR SECURITY REASONS];

function ChecksPage({ onBack, saveToArchive }) {
  const [showNetworks, setShowNetworks] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

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

  const toggleNetworks = () => {
    setShowNetworks((prev) => !prev);
    if (!showNetworks) {
      setSelectedNetwork(null);
      setWalletAddress("");
      setError("");
      setResult(null);
    }
  };

  const handleNetworkClick = (network) => {
    setSelectedNetwork(network);
    setShowNetworks(false);
    setWalletAddress("");
    setError("");
    setResult(null);
  };

  const handleAddressChange = (e) => {
    setWalletAddress(e.target.value);
    setError("");
    setResult(null);
  };

  const getCurrencyTag = (network) => {
    switch (network) {
      case "BTC":
        return "btc-btc";
      case "ETH":
        return "eth-eth";
      case "TRON":
        return "trx-trx";
      default:
        return "";
    }
  };

  const handleCheck = async () => {
    if (!walletAddress.trim()) {
      setError("Введите адрес кошелька");
      return;
    }
    if (!selectedNetwork) return;

    setLoading(true);
    setError("");
    setResult(null);

    const currencyTag = getCurrencyTag(selectedNetwork);
    const proxyUrl = `${PROXY_URL}/address/${encodeURIComponent(
      walletAddress
    )}/${currencyTag}`;

    try {
      const response = await fetch(proxyUrl);

      if (response.status === 400) {
        setError("Неверный формат адреса или сеть.");
      } else if (response.status === 403) {
        setError("Ошибка авторизации. Обратитесь к разработчику.");
      } else if (response.status === 503) {
        setError("Сервис временно недоступен. Попробуйте позже.");
      } else if (!response.ok) {
        setError(`Ошибка: ${response.status}`);
      } else {
        const data = await response.json();
        setResult({
          ...data,
          meta: {
            network: selectedNetwork,
            address: walletAddress,
          },
        });
      }
    } catch (err) {
      console.error("Ошибка запроса к прокси:", err);
      setError(
        "Не удалось подключиться к серверу. Убедитесь, что прокси запущен: tuna http 3001"
      );
    } finally {
      setLoading(false);
    }
  };

  const getResultBgColor = (riskScore) => {
    if (riskScore >= 80) return "#ffebee";
    if (riskScore >= 60) return "#fff3e0";
    if (riskScore >= 30) return "#fffde7";
    return "#f3fde8";
  };

  return (
    <div className="checks-page">
      {/* Иконка */}
      <div className="checks-icon-container">
        <LuScanSearch size={70} color="#000000ff" />
      </div>

      {/* Заголовок */}
      <h1 className="checks-title">Проверки</h1>

      {/* Кнопка */}
      <button
        className="check-address-button"
        onClick={selectedNetwork ? handleCheck : toggleNetworks}
        disabled={loading}
      >
        {loading
          ? "Проверка..."
          : selectedNetwork
          ? "Проверить адрес кошелька"
          : showNetworks
          ? "Выберите сеть"
          : "Проверить адрес"}
      </button>

      {/* Кнопки сетей */}
      {!selectedNetwork && showNetworks && (
        <div className="network-buttons">
          <button
            className="network-btn"
            onClick={() => handleNetworkClick("BTC")}
          >
            BTC
          </button>
          <button
            className="network-btn"
            onClick={() => handleNetworkClick("ETH")}
          >
            ETH
          </button>
          <button
            className="network-btn"
            onClick={() => handleNetworkClick("TRON")}
          >
            TRON
          </button>
        </div>
      )}

      {/* Поле ввода */}
      {selectedNetwork && !result && (
        <div className="input-section">
          <p className="input-label">Введите адрес кошелька</p>
          <input
            type="text"
            className="wallet-input"
            placeholder={`Например: ${
              selectedNetwork === "BTC"
                ? "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                : selectedNetwork === "ETH"
                ? "0x742d35Cc6634C0532925a3b8D4C0cB4D3Bede656"
                : "TQaTmRgnMyYiUZyJWx1S7bWZ981hU6aY97"
            }`}
            value={walletAddress}
            onChange={handleAddressChange}
            disabled={loading}
          />
        </div>
      )}

      {/* Ошибка */}
      {error && <div className="error-message">{error}</div>}

      {/* Результат */}
      {result && (
        <div
          className="result-section"
          style={{
            backgroundColor: result.meta
              ? getResultBgColor(result.risk_score)
              : "#f7f7f7",
            transition: "background-color 0.3s ease",
          }}
        >
          <h2 className="result-title">Результат проверки</h2>

          {/* Сеть и адрес */}
          <div className="result-meta">
            <div className="result-item">
              <strong>Сеть:</strong> {result.meta.network}
            </div>
            <div className="result-item">
              <strong>Адрес:</strong>{" "}
              <span className="result-address">{result.meta.address}</span>
            </div>
          </div>

          <hr className="divider" />

          {/* Основной риск */}
          <div className="result-item">
            <strong>Риск-оценка:</strong>{" "}
            <span className="risk-score">{result.risk_score} из 100</span>
          </div>

          {result.balance !== undefined && (
            <div className="result-item">
              <strong>Баланс:</strong> {result.balance}
            </div>
          )}

          {result.report_risk?.risk_tags?.length > 0 && (
            <div className="result-item">
              <strong>Основные риски:</strong>
              <div className="tags">
                {result.report_risk.risk_tags.map((tag, i) => (
                  <span key={i} className="tag tag-danger">
                    {tag.tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.reputation_risk?.risk_tags?.length > 0 && (
            <div className="result-item">
              <strong>Источники средств:</strong>
              <div className="tags">
                {result.reputation_risk.risk_tags.map((tag, i) => (
                  <span key={i} className="tag tag-warning">
                    {tag.tag} ({tag.percent}%)
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.coins_risk?.risk_tags?.length > 0 && (
            <div className="result-item">
              <strong>Риски по активам:</strong>
              <div className="tags">
                {result.coins_risk.risk_tags.map((tag, i) => (
                  <span key={i} className="tag tag-info">
                    {tag.tag} ({tag.percent}%)
                  </span>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(result.categories) && result.categories.length > 0 && (
            <div className="result-item">
              <strong>Категории:</strong>
              <div className="tags">
                {result.categories.map((cat, i) => (
                  <span key={i} className="tag tag-black">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Кнопка "Новая проверка" — ВНЕ контейнера результата */}
      {result && (
        <button
          className="back-to-check-button"
          onClick={() => {
            setResult(null);
            setSelectedNetwork(null);
            setWalletAddress("");
            setError("");
            setShowNetworks(true); // ← Опционально: сразу показать выбор сети
          }}
        >
          Новая проверка
        </button>
      )}

      {/* Кнопка "Сохранить результат" */}
      {result && !result.saved && (
        <button
          className="save-result-button"
          onClick={() => {
            saveToArchive(result);
            // Можешь добавить метку, что сохранено
            setResult({ ...result, saved: true });
          }}
        >
          Сохранить результат
        </button>
      )}
    </div>
  );
}

export default ChecksPage;
