import React, { useEffect, useState } from 'react';
import './App.css';
import logo from './assets/aiu.png';
import icon from './assets/profile_icon.png';
import notificationIcon from './assets/notification.png';

function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const toggleMenu = (event) => {
    if (activeModal === 'menu') {
      setActiveModal(null);
      return;
    }

    const buttonBounds = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: buttonBounds.bottom + 8,
      left: Math.max(16, Math.min(buttonBounds.left, window.innerWidth - 436)),
    });
    setActiveModal('menu');
  };

  useEffect(() => {
    if (!activeModal) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setActiveModal(null);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeModal]);

  const freeRooms = [
    { number: 'Кабинет 404', type: 'Обычный класс', status: 'Не забронирован' },
    { number: 'Кабинет 706', type: 'Лекционный класс', status: 'Не забронирован' },
    { number: 'Кабинет 302', type: 'Компьютерный класс', status: 'Не забронирован' },
    { number: 'Кабинет 501', type: 'Обычный класс', status: 'Не забронирован' },
  ];

  const busyRooms = [
    { number: 'Кабинет 707', type: 'Обычный класс', status: 'Идет пара "Философия"' },
    { number: 'Кабинет 1104', type: 'Компьютерный класс', status: 'Идет пара "ИКТ"' },
    { number: 'Кабинет 909', type: 'Компьютерный класс', status: 'Идет пара "Программирование"' },
    { number: 'Кабинет 1010', type: 'Обычный класс', status: 'Идет пара "Физика"' },
    { number: 'Кабинет 1110', type: 'Компьютерный класс', status: 'Идет пара "Алгоритмы"' },
    { number: 'Кабинет 1102', type: 'Лекционный класс', status: 'Идет пара "Лексика"' },
    { number: 'Кабинет 1106', type: 'Лекционный класс', status: 'Идет пара "Базы данных"' },
    { number: 'Кабинет 1105', type: 'Обычный класс', status: 'Идет пара "Высшая математика"' },
    { number: 'Кабинет 506', type: 'Компьютерный класс', status: 'Идет пара "Сети"' },
  ];

  const bookedRooms = [
    { number: 'Кабинет 902', type: 'Обычный класс', status: 'Забронирован преподавателем на 10:55' },
    { number: 'Кабинет 1103', type: 'Компьютерный класс', status: 'Забронирован преподавателем на 17:40' },
    { number: 'Кабинет 1107', type: 'Обычный класс', status: 'Забронирован преподавателем на 15:30' },
    { number: 'Кабинет 809', type: 'Обычный класс', status: 'Забронирован преподавателем на 8:00' },
  ];

  const getCurrentRoomsList = () => {
    if (activeModal === 'free') return freeRooms;
    if (activeModal === 'busy') return busyRooms;
    if (activeModal === 'booked') return bookedRooms;
    return [];
  };

  return (
    <div className="app-layout">
      <main className="content-area">
        <header className="top-header">
          <div className="logo-search-container">
            <img src={logo} alt="AIU Logo" className="aiu-logo-img"/>
            <div className={`menu-trigger ${activeModal === 'menu' ? 'menu-open' : ''}`}>
              <button
                className="burger-menu-btn"
                type="button"
                aria-label="Открыть меню"
                aria-haspopup="dialog"
                aria-expanded={activeModal === 'menu'}
                aria-controls="navigation-menu"
                onClick={toggleMenu}
              >
                <span></span><span></span><span></span>
              </button>
              {activeModal === 'menu' && (
                <>
                  <div className="navigation-backdrop" onClick={() => setActiveModal(null)} />
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
                      <a className="navigation-menu-item active" href="#rooms" onClick={() => setActiveModal(null)}>
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M3 21V4h18v17M1 21h22M7 8h2m6 0h2M7 12h2m6 0h2M7 16h2m6 0h2M11 21v-3h2v3" />
                        </svg>
                        <span>Все этажи и кабинеты</span>
                      </a>
                      <div className="navigation-menu-item">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M6 3h9l5 5v13H6zM14 3v6h6M9 13h8m-8 4h8" />
                        </svg>
                        <span>Правила и регламент бронирования</span>
                      </div>
                      <div className="navigation-menu-item">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <rect x="3" y="5" width="18" height="14" rx="2" />
                          <circle cx="9" cy="11" r="2" />
                          <path d="M5.5 17c.7-2 2-3 3.5-3s2.8 1 3.5 3m4-7h2m-2 4h2" />
                        </svg>
                        <span>Контакты диспетчерской / Деканат</span>
                      </div>
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
       

      <div className="rooms-container" id="rooms">
          <div className="rooms-grid-columns">
            
            <div className="status-column">
              <div className="status-dropdown-header" onClick={() => setActiveModal('free')}>
                <span className="dot green"></span>
                <span>Свободные (4)</span>
                <span className="arrow-icon">▼</span>
              </div>
              <div className="room-card">
                <h3>Кабинет 404</h3>
                <p>Обычный класс</p>
                <span className="room-subtext">Не забронирован</span>
                <button className="book-btn">ЗАБРОНИРОВАТЬ</button>
              </div>
            </div>

            <div className="status-column">
              <div className="status-dropdown-header" onClick={() => setActiveModal('busy')}>
                <span className="dot red"></span>
                <span>Заняты (17)</span>
                <span className="arrow-icon">▼</span>
              </div>
              <div className="room-card">
                <h3>Кабинет 707</h3>
                <p>Обычный класс</p>
                <span className="room-subtext muted">Идет пара "Философия"</span>
              </div>
            </div>

            <div className="status-column">
              <div className="status-dropdown-header" onClick={() => setActiveModal('booked')}>
                <span className="dot yellow"></span>
                <span>Забронировано (7)</span>
                <span className="arrow-icon">▼</span>
              </div>
              <div className="room-card">
                <h3>Кабинет 902</h3>
                <p>Обычный класс</p>
                <span className="room-subtext muted">Забронирован преподавателем на 10:55</span>
              </div>
            </div>

          </div>
        </div>

        {activeModal && activeModal !== 'menu' && (
          <div className="modal-overlay" onClick={() => setActiveModal(null)}>
            <div className="modal-content" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  {activeModal === 'free' && '🟢 ВСЕ СВОБОДНЫЕ (4)'}
                  {activeModal === 'busy' && '🔴 ВСЕ ЗАНЯТЫ (17)'}
                  {activeModal === 'booked' && '🟡 ВСЕ ЗАБРОНИРОВАНЫ (7)'}
                </h2>
                <button className="close-modal-btn" type="button" aria-label="Закрыть" onClick={() => setActiveModal(null)}>×</button>
              </div>

              <div className="modal-rooms-list">
                {getCurrentRoomsList().map((room, index) => (
                  <div className="modal-room-item" key={index}>
                    <div>
                      <h4>{room.number}</h4>
                      <p>{room.type} — <strong>{room.status}</strong></p>
                    </div>
                    {activeModal === 'free' && (
                      <button className="modal-action-btn" type="button">Бронь</button>
                    )}
                    {activeModal === 'busy' && (
                      <span className="status-badge red-text">Занято</span>
                    )}
                    {activeModal === 'booked' && (
                      <span className="status-badge yellow-text">Забронировано</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
