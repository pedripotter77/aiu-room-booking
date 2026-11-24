import React, { useEffect, useState } from 'react';
import './App.css';
import logo from './assets/aiu.png';
import icon from './assets/profile_icon.png';
import notificationIcon from './assets/notification.png';

const INITIAL_ROOMS = [
  {
    id: 404,
    number: 'Кабинет 404',
    type: 'Обычный класс',
    category: 'free',
    statusLabel: 'Свободен',
    cardSubtext: 'Не забронирован',
    floor: 4,
    capacity: 32,
    schedule: [
      { slot: '1 пара (08:30 – 09:20)', status: 'busy', note: 'Занято (Высшая математика)' },
      { slot: '2 пара (09:30 – 10:20)', status: 'busy', note: 'Занято (Информатика)' },
      { slot: '3 пара (10:30 – 11:20)', status: 'busy', note: 'Занято' },
      { slot: '4 пара (11:30 – 12:20)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
      { slot: '5 пара (12:50 – 13:40)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
      { slot: '6 пара (13:50 – 14:40)', status: 'busy', note: 'Занято' },
    ],
  },
  {
    id: 706,
    number: 'Кабинет 706',
    type: 'Лекционный класс',
    category: 'free',
    statusLabel: 'Свободен',
    cardSubtext: 'Не забронирован',
    floor: 7,
    capacity: 60,
    schedule: [
      { slot: '1 пара (08:30 – 09:20)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
      { slot: '2 пара (09:30 – 10:20)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
      { slot: '3 пара (10:30 – 11:20)', status: 'busy', note: 'Занято (Алгоритмы и структуры данных)' },
      { slot: '4 пара (11:30 – 12:20)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
      { slot: '5 пара (12:50 – 13:40)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
      { slot: '6 пара (13:50 – 14:40)', status: 'busy', note: 'Занято' },
    ],
  },
  {
    id: 707,
    number: 'Кабинет 707',
    type: 'Обычный класс',
    category: 'busy',
    statusLabel: 'Занят',
    cardSubtext: 'Идет пара "Философия"',
    floor: 7,
    capacity: 30,
    schedule: [
      { slot: '1 пара (08:30 – 09:20)', status: 'busy', note: 'Занято (Философия)' },
      { slot: '2 пара (09:30 – 10:20)', status: 'busy', note: 'Занято (Философия)' },
      { slot: '3 пара (10:30 – 11:20)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
      { slot: '4 пара (11:30 – 12:20)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
      { slot: '5 пара (12:50 – 13:40)', status: 'busy', note: 'Занято' },
      { slot: '6 пара (13:50 – 14:40)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
    ],
  },
  {
    id: 902,
    number: 'Кабинет 902',
    type: 'Обычный класс',
    category: 'booked',
    statusLabel: 'Забронировано',
    cardSubtext: 'Забронирован преподавателем на 10:55',
    floor: 9,
    capacity: 28,
    schedule: [
      { slot: '1 пара (08:30 – 09:20)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
      { slot: '2 пара (09:30 – 10:20)', status: 'booked', note: 'Забронировано преподавателем' },
      { slot: '3 пара (10:30 – 11:20)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
      { slot: '4 пара (11:30 – 12:20)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
      { slot: '5 пара (12:50 – 13:40)', status: 'busy', note: 'Занято' },
      { slot: '6 пара (13:50 – 14:40)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
    ],
  },
];

function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [activePage, setActivePage] = useState('rooms');
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const [bookingRoomId, setBookingRoomId] = useState(null);
  const [role, setRole] = useState('teacher'); // 'teacher', 'admin' or 'student'
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);
  const [purpose, setPurpose] = useState('Открытая лекция / Высшая математика');
  const [assigneeOrGroup, setAssigneeOrGroup] = useState('ИС 24-А');
  const [toast, setToast] = useState(null);
  const [statusSearch, setStatusSearch] = useState('');
  const [showAllStatusRooms, setShowAllStatusRooms] = useState(false);

  const [rooms, setRooms] = useState([
    {
      id: 404,
      number: 'Кабинет 404',
      type: 'Обычный класс',
      category: 'free',
      statusLabel: 'Свободен',
      status: 'Не забронирован',
      floor: 4,
      capacity: 32,
      schedule: [
        { slot: '1 пара (08:30 – 09:20)', status: 'busy', note: 'Занято (Высшая математика)' },
        { slot: '2 пара (09:30 – 10:20)', status: 'busy', note: 'Занято (Информатика)' },
        { slot: '3 пара (10:30 – 11:20)', status: 'busy', note: 'Занято' },
        { slot: '4 пара (11:30 – 12:20)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
        { slot: '5 пара (12:50 – 13:40)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
        { slot: '6 пара (13:50 – 14:40)', status: 'busy', note: 'Занято' },
      ],
    },
    {
      id: 706,
      number: 'Кабинет 706',
      type: 'Лекционный класс',
      category: 'free',
      statusLabel: 'Свободен',
      status: 'Не забронирован',
      floor: 7,
      capacity: 60,
      schedule: [
        { slot: '1 пара (08:30 – 09:20)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
        { slot: '2 пара (09:30 – 10:20)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
        { slot: '3 пара (10:30 – 11:20)', status: 'busy', note: 'Занято (Алгоритмы)' },
        { slot: '4 пара (11:30 – 12:20)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
        { slot: '5 пара (12:50 – 13:40)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
        { slot: '6 пара (13:50 – 14:40)', status: 'busy', note: 'Занято' },
      ],
    },
    {
      id: 302,
      number: 'Кабинет 302',
      type: 'Компьютерный класс',
      category: 'free',
      statusLabel: 'Свободен',
      status: 'Не забронирован',
      floor: 3,
      capacity: 25,
      schedule: [
        { slot: '1 пара (08:30 – 09:20)', status: 'busy', note: 'Занято (Программирование)' },
        { slot: '2 пара (09:30 – 10:20)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
        { slot: '3 пара (10:30 – 11:20)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
        { slot: '4 пара (11:30 – 12:20)', status: 'busy', note: 'Занято (Сети)' },
        { slot: '5 пара (12:50 – 13:40)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
        { slot: '6 пара (13:50 – 14:40)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
      ],
    },
    {
      id: 501,
      number: 'Кабинет 501',
      type: 'Обычный класс',
      category: 'free',
      statusLabel: 'Свободен',
      status: 'Не забронирован',
      floor: 5,
      capacity: 30,
      schedule: [
        { slot: '1 пара (08:30 – 09:20)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
        { slot: '2 пара (09:30 – 10:20)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
        { slot: '3 пара (10:30 – 11:20)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
        { slot: '4 пара (11:30 – 12:20)', status: 'busy', note: 'Занято' },
        { slot: '5 пара (12:50 – 13:40)', status: 'free', note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)' },
        { slot: '6 пара (13:50 – 14:40)', status: 'busy', note: 'Занято' },
      ],
    },
    { id: 707, number: 'Кабинет 707', type: 'Обычный класс', category: 'busy', statusLabel: 'Занят', status: 'Идет пара "Философия"', floor: 7, capacity: 30, schedule: [] },
    { id: 1104, number: 'Кабинет 1104', type: 'Компьютерный класс', category: 'busy', statusLabel: 'Занят', status: 'Идет пара "ИКТ"', floor: 11, capacity: 25, schedule: [] },
    { id: 909, number: 'Кабинет 909', type: 'Компьютерный класс', category: 'busy', statusLabel: 'Занят', status: 'Идет пара "Программирование"', floor: 9, capacity: 25, schedule: [] },
    { id: 1010, number: 'Кабинет 1010', type: 'Обычный класс', category: 'busy', statusLabel: 'Занят', status: 'Идет пара "Физика"', floor: 10, capacity: 30, schedule: [] },
    { id: 1110, number: 'Кабинет 1110', type: 'Компьютерный класс', category: 'busy', statusLabel: 'Занят', status: 'Идет пара "Алгоритмы"', floor: 11, capacity: 25, schedule: [] },
    { id: 1102, number: 'Кабинет 1102', type: 'Лекционный класс', category: 'busy', statusLabel: 'Занят', status: 'Идет пара "Лексика"', floor: 11, capacity: 50, schedule: [] },
    { id: 1106, number: 'Кабинет 1106', type: 'Лекционный класс', category: 'busy', statusLabel: 'Занят', status: 'Идет пара "Базы данных"', floor: 11, capacity: 50, schedule: [] },
    { id: 1105, number: 'Кабинет 1105', type: 'Обычный класс', category: 'busy', statusLabel: 'Занят', status: 'Идет пара "Высшая математика"', floor: 11, capacity: 30, schedule: [] },
    { id: 506, number: 'Кабинет 506', type: 'Компьютерный класс', category: 'busy', statusLabel: 'Занят', status: 'Идет пара "Сети"', floor: 5, capacity: 25, schedule: [] },
    { id: 902, number: 'Кабинет 902', type: 'Обычный класс', category: 'booked', statusLabel: 'Забронировано', status: 'Забронирован преподавателем на 10:55', floor: 9, capacity: 28, schedule: [] },
    { id: 1103, number: 'Кабинет 1103', type: 'Компьютерный класс', category: 'booked', statusLabel: 'Забронировано', status: 'Забронирован преподавателем на 17:40', floor: 11, capacity: 25, schedule: [] },
    { id: 1107, number: 'Кабинет 1107', type: 'Обычный класс', category: 'booked', statusLabel: 'Забронировано', status: 'Забронирован преподавателем на 15:30', floor: 11, capacity: 30, schedule: [] },
    { id: 809, number: 'Кабинет 809', type: 'Обычный класс', category: 'booked', statusLabel: 'Забронировано', status: 'Забронирован преподавателем на 8:00', floor: 8, capacity: 30, schedule: [] },
  ]);

  const freeRooms = rooms.filter((room) => room.category === 'free');
  const busyRooms = rooms.filter((room) => room.category === 'busy');
  const bookedRooms = rooms.filter((room) => room.category === 'booked');

  const selectableRooms = freeRooms.filter((room) => Array.isArray(room.schedule) && room.schedule.length > 0);
  const selectedRoom = rooms.find((room) => room.id === bookingRoomId) || null;
  const currentStatusRooms =
    activeModal === 'free' ? freeRooms : activeModal === 'busy' ? busyRooms : activeModal === 'booked' ? bookedRooms : [];
  const filteredStatusRooms = currentStatusRooms.filter((room) =>
    `${room.number} ${room.type} ${room.status}`.toLowerCase().includes(statusSearch.trim().toLowerCase())
  );
  const visibleStatusRooms = showAllStatusRooms ? filteredStatusRooms : filteredStatusRooms.slice(0, 6);

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
      if (event.key === 'Escape') {
        setActiveModal(null);
        setBookingRoomId(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, bookingRoomId]);

  useEffect(() => {
    if (role == 'teacher') {
      setPurpose('Открытая лекция / Высшая математика');
      setAssigneeOrGroup('ИС 24-А');
    } else if (role == 'admin') {
      setPurpose('Открытая лекция / Спецкурс');
      setAssigneeOrGroup('Кафедра ИТ - Проф. Ибрагимов');
    }
  }, [role]);
  
  useEffect (() => {
    if (!selectedRoom || !Array.isArray(selectedRoom.schedule)) {
      setSelectedSlotIndex(null);
      return;
    }
    const firstFreeIdx = selectedRoom.schedule.findIndex((item) => item.status === 'free');
    setSelectedSlotIndex(firstFreeIdx !== -1 ? firstFreeIdx : null);
  }, [bookingRoomId, selectedRoom]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast((prev) => (prev === message ? null : prev));
    }, 3200);
  };

  const openBookingModal = (roomId) => {
    const target = rooms.find((r) => r.id === roomId);
    const fallbackId =
      target && Array.isArray(target.schedule) && target.schedule.length > 0
        ? target.id
        : selectableRooms[0]?.id ?? null;

    setActiveModal(null);
    setBookingRoomId(fallbackId);
  };

  const handleSubmitBooking = (event) => {
    event.preventDefault();
    if (!selectedRoom || selectedSlotIndex === null) {
      showToast('Выберите свободную пару');
      return;
    }

    const chosenSlot = selectedRoom.schedule[selectedSlotIndex];
    if (!chosenSlot || chosenSlot.status !== 'free') {
      showToast('Выбранная пара недоступна');
      return;
    }

    const isTeacher = role === 'teacher';
    const nextStatus = isTeacher ? 'pending' : 'booked';
    const nextNote = isTeacher
      ? `Заявка отправлена (${assigneeOrGroup || 'Преподаватель'})`
      : `Забронировано (${assigneeOrGroup || 'Админ'})`;

    setRooms((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id !== selectedRoom.id) return room;

        const updatedSchedule = room.schedule.map((item, idx) =>
          idx === selectedSlotIndex
            ? { ...item, status: nextStatus, note: nextNote }
            : item
        );

        const nextFreeIdx = updatedSchedule.findIndex((item) => item.status === 'free');
        setSelectedSlotIndex(nextFreeIdx !== -1 ? nextFreeIdx : null);

        return {
          ...room,
          schedule: updatedSchedule,
          status: isTeacher
            ? `Заявка на ${chosenSlot.slot}`
            : `Забронировано на ${chosenSlot.slot}`,
        };
      })
    );

    showToast(
      isTeacher
        ? `Заявка на ${selectedRoom.number} (${chosenSlot.slot}) отправлена администратору`
        : `${selectedRoom.number} забронирован на ${chosenSlot.slot}`
    );
  };

  const openStatusPanel = (category) => {
    if (activeModal === category) {
      setActiveModal(null);
      return;
    }

    setStatusSearch('');
    setShowAllStatusRooms(false);
    setActiveModal(category);
  };

  return (
    <div className="app-layout">
      {toast && <div className="toast-banner">{toast}</div>}

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
                      <button
                        className={`navigation-menu-item ${activePage === 'rooms' ? 'active' : ''}`}
                        type="button"
                        onClick={() => {
                          setActivePage('rooms');
                          setActiveModal(null);
                        }}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M3 21V4h18v17M1 21h22M7 8h2m6 0h2M7 12h2m6 0h2M7 16h2m6 0h2M11 21v-3h2v3" />
                        </svg>
                        <span>Все этажи и кабинеты</span>
                      </button>
                      <button
                        className={`navigation-menu-item ${activePage === 'rules' ? 'active' : ''}`}
                        type="button"
                        onClick={() => {
                          setActivePage('rules');
                          setActiveModal(null);
                        }}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M6 3h9l5 5v13H6zM14 3v6h6M9 13h8m-8 4h8" />
                        </svg>
                        <span>Правила и регламент бронирования</span>
                      </button>
                      <button
                        className={`navigation-menu-item ${activePage === 'contacts' ? 'active' : ''}`}
                        type="button"
                        onClick={() => {
                          setActivePage('contacts');
                          setActiveModal(null);
                        }}
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
       

        {activePage === 'rooms' && (
          <div className="rooms-container" id="rooms">
          <div className="rooms-grid-columns">
            
            <div className="status-column">
              <button
                className={`status-dropdown-header ${activeModal === 'free' ? 'is-open' : ''}`}
                type="button"
                aria-expanded={activeModal === 'free'}
                onClick={() => openStatusPanel('free')}
              >
                <span className="dot green"></span>
                <span>Свободные ({freeRooms.length})</span>
                <span className="arrow-icon">{activeModal === 'free' ? '▲' : '▼'}</span>
              </button>
              {freeRooms[0] && (
                <div className="room-card">
                  <h3>{freeRooms[0].number}</h3>
                  <p>{freeRooms[0].type}</p>
                  <span className="room-subtext">{freeRooms[0].status}</span>
                  <button
                    className="book-btn"
                    type="button"
                    onClick={() => openBookingModal(freeRooms[0].id)}
                  >
                    ЗАБРОНИРОВАТЬ
                  </button>
                </div>
              )}
            </div>

            <div className="status-column">
              <button
                className={`status-dropdown-header ${activeModal === 'busy' ? 'is-open' : ''}`}
                type="button"
                aria-expanded={activeModal === 'busy'}
                onClick={() => openStatusPanel('busy')}
              >
                <span className="dot red"></span>
                <span>Заняты ({busyRooms.length})</span>
                <span className="arrow-icon">{activeModal === 'busy' ? '▲' : '▼'}</span>
              </button>
              {busyRooms[0] && (
                <div className="room-card">
                  <h3>{busyRooms[0].number}</h3>
                  <p>{busyRooms[0].type}</p>
                  <span className="room-subtext muted">{busyRooms[0].status}</span>
                </div>
              )}
            </div>

            <div className="status-column">
              <button
                className={`status-dropdown-header ${activeModal === 'booked' ? 'is-open' : ''}`}
                type="button"
                aria-expanded={activeModal === 'booked'}
                onClick={() => openStatusPanel('booked')}
              >
                <span className="dot yellow"></span>
                <span>Забронировано ({bookedRooms.length})</span>
                <span className="arrow-icon">{activeModal === 'booked' ? '▲' : '▼'}</span>
              </button>
              {bookedRooms[0] && (
                <div className="room-card">
                  <h3>{bookedRooms[0].number}</h3>
                  <p>{bookedRooms[0].type}</p>
                  <span className="room-subtext muted">{bookedRooms[0].status}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        )}

        {activePage === 'rules' && (
          <section className="info-page" aria-labelledby="rules-title">
            <div className="info-page-header">
              <span className="info-page-kicker">Корпус 7</span>
              <h1 id="rules-title">Правила бронирования кабинетов</h1>
              <p>Базовые правила для работы с аудиториями Astana International University.</p>
            </div>

            <div className="rules-grid">
              <article className="info-card">
                <h2>1. Бронируйте только свободное время</h2>
                <p>Кабинет можно бронировать только на свободный учебный слот. Занятые и уже забронированные аудитории недоступны.</p>
              </article>
              <article className="info-card">
                <h2>2. Указывайте реальную цель</h2>
                <p>В заявке укажите название мероприятия, учебной дисциплины или работы и ответственного преподавателя или студенческую группу.</p>
              </article>
              <article className="info-card">
                <h2>3. Соблюдайте время бронирования</h2>
                <p>Пользование кабинетом начинается и заканчивается в указанное время. Не задерживайте следующую занятую группу.</p>
              </article>
              <article className="info-card">
                <h2>4. Берегите имущество аудитории</h2>
                <p>Не повреждайте мебель и технику, не перемещайте оборудование без разрешения и оставляйте кабинет в чистом состоянии.</p>
              </article>
              <article className="info-card">
                <h2>5. Соблюдайте академические правила</h2>
                <p>Кабинет используется по назначению: для занятий, консультаций, встреч и учебных мероприятий. Запрещено мешать другим группам и нарушать режим университета.</p>
              </article>
              <article className="info-card">
                <h2>6. Сообщайте об изменениях</h2>
                <p>Если мероприятие отменено или перенесено, своевременно сообщите диспетчерской или отмените бронирование, чтобы освободить аудиторию для других пользователей.</p>
              </article>
            </div>

            <button className="back-to-rooms-btn" type="button" onClick={() => setActivePage('rooms')}>
              Вернуться к кабинетам
            </button>
          </section>
        )}

        {activePage === 'contacts' && (
          <section className="info-page" aria-labelledby="contacts-title">
            <div className="info-page-header">
              <span className="info-page-kicker">Контакты</span>
              <h1 id="contacts-title">Диспетчерская и деканат</h1>
              <p>Нужен номер диспетчерской или хотите связаться с деканатом? Мы собрали основные контакты здесь.</p>
            </div>

            <div className="contact-grid">
              <article className="contact-card">
                <div className="contact-icon" aria-hidden="true">☎</div>
                <div>
                  <h2>Диспетчерская</h2>
                  <p className="dispatcher-phone">+7 (7172) 47-66-77</p>
                  <p>Позвоните диспетчерской для уточнения бронирования или состояния кабинета.</p>
                </div>
              </article>

              <article className="contact-card">
                <div className="contact-icon" aria-hidden="true">✉</div>
                <div>
                  <h2>Деканат</h2>
                  <a className="contact-link" href="https://aiu.kz/" target="_blank" rel="noreferrer">Связаться с деканатом на aiu.kz</a>
                  <p>У AIU есть 6 высших школ. Для связи выберите нужную высшую школу и деканат на официальном сайте университета.</p>
                </div>
              </article>
            </div>

            <button className="back-to-rooms-btn" type="button" onClick={() => setActivePage('rooms')}>
              Вернуться к кабинетам
            </button>
          </section>
        )}

        {['free', 'busy', 'booked'].includes(activeModal) && (
          <div className="status-panel-overlay" onClick={() => setActiveModal(null)}>
            <section
              className={`status-panel status-panel-${activeModal}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="status-panel-title"
              onClick={(event) => event.stopPropagation()}
            >
              <header className="status-panel-header">
                <div className="status-panel-heading">
                  <h2 id="status-panel-title">
                    <span className={`dot ${activeModal === 'free' ? 'green' : activeModal === 'busy' ? 'red' : 'yellow'}`} />
                    {activeModal === 'free' && `ВСЕ СВОБОДНЫЕ (${freeRooms.length})`}
                    {activeModal === 'busy' && `ВСЕ ЗАНЯТЫЕ (${busyRooms.length})`}
                    {activeModal === 'booked' && `ВСЕ ЗАБРОНИРОВАННЫЕ (${bookedRooms.length})`}
                  </h2>
                  {activeModal === 'busy' && (
                    <>
                      <p>Главный корпус (А) <span>•</span> {busyRooms.length} кабинетов сейчас заняты</p>
                      <div
                        className="occupancy-progress"
                        role="progressbar"
                        aria-label="Доля занятых кабинетов в списке"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow={Math.round((busyRooms.length / rooms.length) * 100)}
                      >
                        <span style={{ width: `${(busyRooms.length / rooms.length) * 100}%` }} />
                      </div>
                    </>
                  )}
                </div>
                <button className="close-modal-btn" type="button" aria-label="Закрыть" onClick={() => setActiveModal(null)}>×</button>
              </header>

              <label className="status-search">
                <span aria-hidden="true">⌕</span>
                <input
                  type="search"
                  value={statusSearch}
                  onChange={(event) => {
                    setStatusSearch(event.target.value);
                    setShowAllStatusRooms(false);
                  }}
                  placeholder="Поиск по кабинету или описанию..."
                  aria-label="Поиск по кабинету или описанию"
                />
              </label>

              <div className="status-panel-rooms">
                {visibleStatusRooms.map((room) => (
                  <article className="status-room-card" key={room.id}>
                    <div className="status-room-info">
                      <div className="status-room-title">
                        <h3>{room.number}</h3>
                        <span className="room-type-badge">{room.type}</span>
                      </div>
                      <p>{room.status}</p>
                    </div>
                    {activeModal === 'free' ? (
                      <button className="modal-action-btn" type="button" onClick={() => openBookingModal(room.id)}>
                        Забронировать
                      </button>
                    ) : (
                      <span className={`room-status-pill ${activeModal === 'busy' ? 'busy' : 'booked'}`}>
                        <span className="dot" />
                        {activeModal === 'busy' ? 'Занято' : 'Забронировано'}
                      </span>
                    )}
                  </article>
                ))}
                {visibleStatusRooms.length === 0 && (
                  <p className="status-empty-state">По вашему запросу кабинеты не найдены.</p>
                )}
              </div>

              <footer className="status-panel-footer">
                <span>
                  Показано {visibleStatusRooms.length} из {filteredStatusRooms.length} кабинетов <span>•</span> Корпус 7
                </span>
                {filteredStatusRooms.length > 6 && (
                  <button type="button" onClick={() => setShowAllStatusRooms((isShowingAll) => !isShowingAll)}>
                    {showAllStatusRooms ? 'Свернуть' : `Все (${filteredStatusRooms.length})`}
                    <span aria-hidden="true">{showAllStatusRooms ? '↑' : '→'}</span>
                  </button>
                )}
              </footer>
            </section>
          </div>
        )}

        {/* Модалка «Бронирование аудитории» */}
        {selectedRoom && (
          <div className="modal-overlay" onClick={() => setBookingRoomId(null)}>
            <form
              className="modal-content booking-modal-card"
              role="dialog"
              aria-modal="true"
              onClick={(event) => event.stopPropagation()}
              onSubmit={handleSubmitBooking}
            >
              <div className="booking-modal-top">
                <div>
                  <h2>Бронирование аудитории</h2>
                  <p className="booking-meta">
                    <span className="dot green"></span> {selectedRoom.statusLabel} • {selectedRoom.floor} этаж (вместимость {selectedRoom.capacity} чел.)
                  </p>
                </div>
                <button
                  type="button"
                  className="close-modal-btn"
                  aria-label="Закрыть"
                  onClick={() => setBookingRoomId(null)}
                >
                  ×
                </button>
              </div>

              <div className="room-tabs-row">
                {selectableRooms.map((room) => (
                  <button
                    key={room.id}
                    type="button"
                    className={`room-tab-btn ${room.id === selectedRoom.id ? 'active' : ''}`}
                    onClick={() => setBookingRoomId(room.id)}
                  >
                    {room.number} ({room.type})
                  </button>
                ))}
              </div>

              <div className="role-switcher-row">
                <span className="role-label">Роль в системе:</span>
                <div className="role-segmented">
                  <button
                    type="button"
                    className={role === 'student' ? 'active' : ''}
                    onClick={() => setRole('student')}
                  >
                    Студент
                  </button>
                  <button
                    type="button"
                    className={role === 'teacher' ? 'active' : ''}
                    onClick={() => setRole('teacher')}
                  >
                    Преподаватель
                  </button>
                  <button
                    type="button"
                    className={role === 'admin' ? 'active' : ''}
                    onClick={() => setRole('admin')}
                  >
                    Админ
                  </button>
                </div>
              </div>

              {role === 'student' && (
                <div className="student-notice-box">
                  <strong>ⓘ Режим просмотра (Студент)</strong>
                  <p>
                    Студентам доступен только просмотр расписания. Прямое бронирование закрыто.
                    Если вам нужна аудитория для кружка или проекта, обратитесь к преподавателю или куратору.
                  </p>
                </div>
              )}

              {role === 'teacher' && (
                <div className="role-info-banner">
                  <p>Режим преподавателя: Подача заявки на бронирование к администратору</p>
                  <strong>Режим преподавателя</strong>
                </div>
              )}

              {role === 'admin' && (
                <div className="role-info-banner">
                  <p>
                    Режим администратора: Прямое мгновенное закрепление кабинета и управление расписанием без согласования с диспетчерской.
                  </p>
                  <strong>Режим администратора</strong>
                </div>
              )}

              <div className="schedule-section">
                <div className="schedule-header-row">
                  <strong>
                    {role === 'student'
                      ? 'Расписание на сегодня:'
                      : 'Расписание на сегодня (выберите доступную пару):'}
                  </strong>
                  <span>Корпус 7 • Жиембет Жырау 2</span>
                </div>

                <div className="schedule-list">
                  {selectedRoom.schedule.map((item, idx) => {
                    const isFree = item.status === 'free';
                    const canSelectSlot = isFree && (role === 'teacher' || role === 'admin');
                    const isChecked = canSelectSlot && selectedSlotIndex === idx;

                    return (
                      <div
                        key={item.slot}
                        className={`schedule-row ${isFree ? 'is-free' : ''} ${
                          canSelectSlot ? 'clickable-slot' : ''
                        }`}
                        onClick={() => {
                          if (canSelectSlot) setSelectedSlotIndex(idx);
                        }}
                      >
                        <div className="slot-left">
                          {canSelectSlot && (
                            <input
                              type="radio"
                              name={`slot-${selectedRoom.id}`}
                              checked={isChecked}
                              onChange={() => setSelectedSlotIndex(idx)}
                              className="slot-radio"
                            />
                          )}
                          <span className={`slot-time ${isFree ? 'bold' : ''}`}>{item.slot}</span>
                        </div>

                        <span
                          className={`slot-badge ${
                            item.status === 'busy'
                              ? 'badge-busy'
                              : item.status === 'booked' || item.status === 'pending'
                              ? 'badge-booked'
                              : 'badge-free-view'
                          }`}
                        >
                          {item.note}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {(role === 'teacher' || role === 'admin') && (
                <div className="booking-form-grid">
                  <div className="form-field">
                    <label htmlFor="purpose-input">
                      {role === 'teacher' ? 'Цель / Предмет' : 'Цель / Мероприятие'}
                    </label>
                    <input
                      id="purpose-input"
                      type="text"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="assignee-input">
                      {role === 'teacher'
                        ? 'Академическая группа'
                        : 'Ответственный / Преподаватель или Кафедра'}
                    </label>
                    <input
                      id="assignee-input"
                      type="text"
                      value={assigneeOrGroup}
                      onChange={(e) => setAssigneeOrGroup(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="booking-modal-footer">
                <span className="footer-caption">Система расписания AIU</span>

                {role === 'student' ? (
                  <button
                    type="button"
                    className="secondary-close-btn"
                    onClick={() => setBookingRoomId(null)}
                  >
                    Понятно / Закрыть
                  </button>
                ) : (
                  <div className="footer-actions-group">
                    <button
                      type="button"
                      className="secondary-close-btn"
                      onClick={() => setBookingRoomId(null)}
                    >
                      Отмена
                    </button>
                    <button type="submit" className="primary-submit-btn">
                      {role === 'teacher'
                        ? 'Подать заявку на бронирование'
                        : 'Мгновенно забронировать кабинет'}
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
export default App;
