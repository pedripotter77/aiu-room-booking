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
       

        <div className="rooms-grid">
          <p>Здесь будет отображаться информация о загруженности кабинетов.</p>
        </div>
      </main>
    </div>
  );
}

export default App;
