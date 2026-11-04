import React from 'react';
import './App.css';
import logo from './assets/aiu.png';
import icon from './assets/profile_icon.png';

function App() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2>Этажи</h2>
      </aside>

      <main className="content-area">
        <header className="top-header">
          <div className="logo-search-container">
            <img src={logo} alt="AIU Logo" className="aiu-logo-img"/>
            <input type="text" placeholder="Поиск кабинета..." className="search-input" />
          </div>

          <div className="header-title">
            <h1>Загруженность кабинетов в 7 корпусе<br />на ул. Жиембет Жырау 2</h1>
          </div>

          <div className="profile-icon">
            <img src={icon} alt="Profile Icon" className="profile-icon-img" />
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
