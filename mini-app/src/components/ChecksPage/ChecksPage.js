import React, { useEffect, useState } from "react";
import { LuScanSearch } from "react-icons/lu";
import "./ChecksPage.css";

const PROXY_URL = [HIDDEN FOR SECURITY REASONS] /

function ChecksPage({ onBack, saveToArchive, t }) {
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
      setError(t("enterWalletAddress"));
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
        setError(t("errorInvalidAddress"));
      } else if (response.status === 403) {
        setError(t("errorAuth"));
      } else if (response.status === 503) {
        setError(t("errorServiceUnavailable"));
      } else if (!response.ok) {
        setError(t("errorDefault").replace("{{status}}", response.status));
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
      setError(t("errorNoConnection"));
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
      <div className="checks-icon-container">
        <LuScanSearch size={70} color="#000000ff" />
      </div>

      <h1 className="checks-title">{t("checks")}</h1>

      <button
        className="check-address-button"
        onClick={selectedNetwork ? handleCheck : toggleNetworks}
        disabled={loading}
      >
        {loading
          ? t("checking")
          : selectedNetwork
          ? t("checkWalletAddress")
          : showNetworks
          ? t("selectNetwork")
          : t("checkAddress")}
      </button>

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

      {selectedNetwork && !result && (
        <div className="input-section">
          <p className="input-label">{t("enterWalletAddress")}</p>
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

      {error && <div className="error-message">{error}</div>}

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
          <h2 className="result-title">
            {t("resultTitle") || "Результат проверки"}
          </h2>

          <div className="result-meta">
            <div className="result-item">
              <strong>{t("network")}:</strong> {result.meta.network}
            </div>
            <div className="result-item">
              <strong>{t("address")}:</strong>{" "}
              <span className="result-address">{result.meta.address}</span>
            </div>
          </div>

          <hr className="divider" />

          <div className="result-item">
            <strong>{t("riskScore")}:</strong>{" "}
            <span className="risk-score">{result.risk_score} из 100</span>
          </div>

          {result.balance !== undefined && (
            <div className="result-item">
              <strong>{t("balance")}:</strong> {result.balance}
            </div>
          )}

          {result.report_risk?.risk_tags?.length > 0 && (
            <div className="result-item">
              <strong>{t("mainRisks")}:</strong>
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
              <strong>{t("fundSources")}:</strong>
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
              <strong>{t("assetRisks")}:</strong>
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
              <strong>{t("categories")}:</strong>
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

      {result && (
        <button
          className="back-to-check-button"
          onClick={() => {
            setResult(null);
            setSelectedNetwork(null);
            setWalletAddress("");
            setError("");
            setShowNetworks(true);
          }}
        >
          {t("newCheck")}
        </button>
      )}

      {result && !result.saved && (
        <button
          className="save-result-button"
          onClick={() => {
            saveToArchive(result);
            setResult({ ...result, saved: true });
          }}
        >
          {t("saveResult")}
        </button>
      )}
    </div>
  );
}

export default ChecksPage;

