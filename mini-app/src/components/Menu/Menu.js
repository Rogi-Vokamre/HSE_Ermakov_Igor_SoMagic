import React from "react";
import "./Menu.css";
import { LuScanSearch } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { HiMiniLanguage } from "react-icons/hi2";
import { IoArchiveOutline } from "react-icons/io5";

function Menu({ type, onNavigate, t, language, setLanguage }) {
  const menuItems = {
    commands: [
      {
        icon: <LuScanSearch size={30} color="#000000ff" />,
        text: t("checks"),
        action: "checks",
      },
      {
        icon: <IoArchiveOutline size={30} color="#000000ff" />,
        text: t("archive"),
        action: "archive",
      },
      {
        icon: <CgProfile size={30} color="#000000ff" />,
        text: t("profile"),
        action: "profile",
      },
      {
        icon: <IoMdInformationCircleOutline size={30} color="#000000ff" />,
        text: t("guide"),
        action: "guide",
      },
    ],
    settings: [
      {
        icon: <HiMiniLanguage size={30} color="#000000ff" />,
        text: t("languageToggle"),
        action: "language",
        isToggle: true,
      },
    ],
  };

  const items = menuItems[type] || [];

  return (
    <div className="menu-container">
      {items.map((item, index) => (
        <div
          key={index}
          className={`menu-item ${item.disabled ? "menu-item-disabled" : ""}`}
          style={item.disabled ? { opacity: 0.5, cursor: "default" } : {}}
          onClick={
            item.disabled
              ? (e) => e.preventDefault()
              : () => {
                  if (item.action === "language" && item.isToggle) {
                    setLanguage(language === "ru" ? "en" : "ru");
                  } else {
                    onNavigate(item.action);
                  }
                }
          }
        >
          <div className="menu-icon">{item.icon}</div>
          <span className="menu-text">{item.text}</span>
          <div className="menu-arrow">›</div>
        </div>
      ))}
    </div>
  );
}

export default Menu;
