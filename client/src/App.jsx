import React, { useState } from 'react';
import './App.css';
import logo from './assets/aiu.png';
import icon from './assets/profile_icon.png';
import notificationIcon from './assets/notification.png';

function App() {
  const [activeModal, setActiveModal] = useState(null);

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

        {activeModal && (
          <div className="modal-overlay" onClick={() => setActiveModal(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

              <div className="modal-header">
                <h2>
                  {activeModal === 'free' && '🟢 ВСЕ СВОБОДНЫЕ (4)'}
                  {activeModal === 'busy' && '🔴 ВСЕ ЗАНЯТЫ (17)'}
                  {activeModal === 'booked' && '🟡 ВСЕ ЗАБРОНИРОВАНЫ (7)'}
                </h2>
                <button className="close-modal-btn" onClick={() => setActiveModal(null)}>X</button>
              </div>

              <div className="modal-rooms-list">
                {getCurrentRoomsList().map((room, index) => (
                <div className="modal-room-item" key={index}>
                  <div>
                    <h4>{room.number}</h4>
                      <p>{room.type} — <strong>{room.status}</strong></p>
                  </div>
                 {activeModal === 'free' && (
                      <button className="modal-action-btn">Бронь</button>
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
