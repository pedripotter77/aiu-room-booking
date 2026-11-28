import logo from '../assets/aiu.png';
import icon from '../assets/profile_icon.png';
import notificationIcon from '../assets/notification.png';

function Header({
  activeModal,
  activePage,
  menuPosition,
  onHome,
  onMenuToggle,
  onNavigate,
  onCloseMenu,
  onOpenProfile,
  language,
  onLanguageChange,
  notificationsEnabled,
}) {
  return (
    <header className="top-header">
      <div className="logo-search-container">
        <button className="home-logo-btn" type="button" aria-label="На главную" onClick={onHome}>
          <img src={logo} alt="AIU" className="aiu-logo-img" />
        </button>
        <div className={`menu-trigger ${activeModal === 'menu' ? 'menu-open' : ''}`}>
          <button
            className="burger-menu-btn"
            type="button"
            aria-label="Открыть меню"
            aria-haspopup="dialog"
            aria-expanded={activeModal === 'menu'}
            aria-controls="navigation-menu"
            onClick={onMenuToggle}
          >
            <span></span><span></span><span></span>
          </button>
          {activeModal === 'menu' && (
            <>
              <div className="navigation-backdrop" onClick={onCloseMenu} />
              <div
                className="navigation-modal"
                id="navigation-menu"
                style={{ top: menuPosition.top, left: menuPosition.left }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="navigation-title"
              >
                <div className="navigation-modal-header">
                  <h2 id="navigation-title">Навигация</h2>
                  <span className="building-badge">Корпус 7</span>
                </div>
                <nav className="navigation-menu" aria-label="Основная навигация">
                  <button
                    className={`navigation-menu-item ${activePage === 'rooms' ? 'active' : ''}`}
                    type="button"
                    onClick={() => onNavigate('rooms')}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3 21V4h18v17M1 21h22M7 8h2m6 0h2M7 12h2m6 0h2M7 16h2m6 0h2M11 21v-3h2v3" />
                    </svg>
                    <span>Все этажи и кабинеты</span>
                  </button>
                  <button
                    className={`navigation-menu-item ${activePage === 'rules' ? 'active' : ''}`}
                    type="button"
                    onClick={() => onNavigate('rules')}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6 3h9l5 5v13H6zM14 3v6h6M9 13h8m-8 4h8" />
                    </svg>
                    <span>Правила и регламент бронирования</span>
                  </button>
                  <button
                    className={`navigation-menu-item ${activePage === 'contacts' ? 'active' : ''}`}
                    type="button"
                    onClick={() => onNavigate('contacts')}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <circle cx="9" cy="11" r="2" />
                      <path d="M5.5 17c.7-2 2-3 3.5-3s2.8 1 3.5 3m4-7h2m-2 4h2" />
                    </svg>
                    <span>Контакты диспетчерской / Деканат</span>
                  </button>
                </nav>
              </div>
            </>
          )}
        </div>
        <input type="text" placeholder="Поиск кабинета..." className="search-input" />
      </div>

      <div className="header-title">
        <h1>Загруженность кабинетов в 7 корпусе<br />на ул. Жиембет Жырау 2</h1>
      </div>

      <div className="header-right-actions">
        <button
          className="notification-btn"
          aria-label="Notifications"
          disabled={!notificationsEnabled}
          title={notificationsEnabled ? 'Уведомления включены' : 'Уведомления выключены'}
        >
          <img src={notificationIcon} alt="Notifications" />
        </button>
        <div className="lang-switcher">
          {['KZ', 'RU', 'EN'].map((item, index) => (
            <span key={item}>
              {index > 0 && ' | '}
              {language === item ? (
                <strong>{item}</strong>
              ) : (
                <button type="button" onClick={() => onLanguageChange(item)}>{item}</button>
              )}
            </span>
          ))}
        </div>
        <button className="profile-icon" type="button" aria-label="Открыть профиль" onClick={onOpenProfile}>
          <img src={icon} alt="Profile Icon" className="profile-icon-img" />
        </button>
      </div>
    </header>
  );
}

export default Header;