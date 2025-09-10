import React from "react";
import "./Menu.css";
import { LuScanSearch } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { HiMiniLanguage } from "react-icons/hi2";
import { IoArchiveOutline } from "react-icons/io5";

const menuItems = {
  commands: [
    {
      icon: <LuScanSearch size={30} color="#000000ff" />,
      text: "Проверки",
      action: "checks",
    },
    {
      icon: <IoArchiveOutline size={30} color="#000000ff" />,
      text: "Архив проверок",
      action: "archive",
    },
    {
      icon: <CgProfile size={30} color="#000000ff" />,
      text: "Профиль",
      action: "profile",
    },
    {
      icon: <IoMdInformationCircleOutline size={30} color="#000000ff" />,
      text: "Гайд",
      action: "guide",
    },
  ],
  settings: [
    {
      icon: <HiMiniLanguage size={30} color="#000000ff" />,
      text: "Языки",
      action: "language",
    },
  ],
};

function Menu({ type, onNavigate }) {
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
                  if (item.action === "profile") {
                    onNavigate("profile");
                  } else if (item.action === "checks") {
                    onNavigate("checks");
                  } else if (item.action === "guide") {
                    onNavigate("guide");
                  } else if (item.action === "archive") {
                    onNavigate("archive");
                  } else if (item.action === "language") {
                    // Можно добавить переход или всплывающее окно
                    console.log("Переход к Языки");
                  } else {
                    console.log(`Переход к ${item.action}`);
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
