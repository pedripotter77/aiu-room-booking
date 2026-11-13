import React from 'react';
import './App.css';
import logo from './assets/aiu.png';
import icon from './assets/profile_icon.png';
import notificationIcon from './assets/notification.png';

function App() {
  return (
    <div className="app-layout">
      <main className="content-area">
        <header className="top-header">
          <div className="logo-search-container">
            <img src={logo} alt="AIU Logo" className="aiu-logo-img"/>
            <button className="burger-menu-btn" aria-label="Menu">
              <span></span><span></span><span></span>
            </button>
            <input type="text" placeholder="Поиск кабинета..." className="search-input" />
          </div>

          <div className="header-title">
            <h1>Загруженность кабинетов в 7 корпусе<br />на ул. Жиембет Жырау 2</h1>
          </div>

          <div className="header-right-actions">
            <button className="notification-btn" aria-label="Notifications">
              <img src={notificationIcon} alt="Notifications" />
            </button>

            <div className="lang-switcher">
              <span>KZ</span> | <strong>RU</strong> | <span>EN</span>
            </div>

            <div className="profile-icon">
              <img src={icon} alt="Profile Icon" className="profile-icon-img" />
            </div>
          </div>
        </header>
       

      <div className="rooms-container">
          <div className="rooms-grid-columns">
            
            {/* Колонка 1: Свободные */}
            <div className="status-column">
              <div className="status-header green">🟢 Свободные (4)</div>
              <div className="room-card">
                <h3>Кабинет 404</h3>
                <p>Обычный класс</p>
                <span className="room-subtext">Не забронирован</span>
                <button className="book-btn">ЗАБРОНИРОВАТЬ</button>
              </div>
            </div>

            {/* Колонка 2: Заняты */}
            <div className="status-column">
              <div className="status-header red">🔴 Заняты (17)</div>
              <div className="room-card">
                <h3>Кабинет 707</h3>
                <p>Обычный класс</p>
                <span className="room-subtext muted">Идет пара "Философия"</span>
              </div>
            </div>

            {/* Колонка 3: Забронировано */}
            <div className="status-column">
              <div className="status-header yellow">🟡 Забронировано (7)</div>
              <div className="room-card">
                <h3>Кабинет 902</h3>
                <p>Обычный класс</p>
                <span className="room-subtext muted">Забронирован преподавателем на 10:55</span>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
