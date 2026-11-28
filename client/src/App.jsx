import { useEffect, useMemo, useState } from 'react';
import './App.css';
import BookingModal from './components/BookingModal';
import Header from './components/Header';
import { ContactsPage, RulesPage } from './components/InfoPages';
import RoomsBoard from './components/RoomsBoard';
import StatusPanel from './components/StatusPanel';
import { INITIAL_BOOKINGS } from './data/bookingsData';
import {
  createInitialRoomInventory,
  createRoomSchedule,
  ROOM_TYPES,
} from './data/roomInventory';
import ROOMS_DATA from './data/roomsData';
import BookingDashboard from './components/BookingDashboard';
import ProfileModal from './components/ProfileModal';
import RoomManagement from './components/RoomManagement';
import UserProfilePage from './components/UserProfilePage';
import SettingsModal from './components/SettingsModal';

const TEACHER_NAME = 'Сергей Сергеев';
const BOOKINGS_STORAGE_KEY = 'aiu-room-booking-bookings';
const ROOMS_STORAGE_KEY = 'aiu-room-booking-inventory';
const ROOM_REQUESTS_STORAGE_KEY = 'aiu-room-change-requests';
const SETTINGS_STORAGE_KEY = 'aiu-room-booking-settings';
const DEFAULT_SETTINGS = {
  language: 'RU',
  theme: 'light',
  compact: false,
  notifications: true,
};

function loadSettings() {
  try {
    const stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!stored) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch (error) {
    console.error('Не удалось прочитать настройки интерфейса:', error);
    return DEFAULT_SETTINGS;
  }
}

function readStoredArray(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    if (stored === null) return fallback;
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) throw new Error('Stored value must be an array');
    return parsed;
  } catch (error) {
    console.error(`Не удалось прочитать данные "${key}" из браузера:`, error);
    return fallback;
  }
}

function getLocalDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function loadRoomInventory() {
  const storedRooms = readStoredArray(ROOMS_STORAGE_KEY, null);
  if (!storedRooms) return createInitialRoomInventory();

  const originalRooms = new Map(ROOMS_DATA.map((room) => [room.id, room]));
  return storedRooms.map((room) => {
    const originalRoom = originalRooms.get(room.id);
    if (originalRoom && (room.deleted || room.lastDirective)) {
      return { ...originalRoom, configured: true, deleted: false };
    }
    if (room.deleted) {
      return {
        ...room,
        type: room.id % 10 === 6 ? 'Лекционный класс' : 'Не указано',
        category: 'unconfigured',
        statusLabel: 'Не добавлен',
        status: 'Нет данных о состоянии кабинета',
        schedule: [],
        configured: false,
        deleted: false,
        lastDirective: undefined,
      };
    }
    if (room.lastDirective) {
      return {
        ...room,
        type: room.id % 10 === 6 ? 'Лекционный класс' : 'Не указано',
        lastDirective: undefined,
      };
    }
    return room;
  });
}

function applyBookingToRooms(rooms, booking, status) {
  if (booking.date !== getLocalDate()) return rooms;
  return rooms.map((room) => {
    if (room.id !== booking.roomId || !Array.isArray(room.schedule)) return room;
    const schedule = room.schedule.map((slot, index) => {
      if (index !== booking.slotIndex) return slot;
      if (status === 'rejected') {
        return {
          ...slot,
          status: booking.previousSlotStatus || 'free',
          note: booking.previousSlotNote || 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)',
        };
      }
      return {
        ...slot,
        status: status === 'approved' ? 'booked' : 'pending',
        note: `${status === 'approved' ? 'Одобрено' : 'Ожидает решения'}: ${booking.purpose}`,
      };
    });
    return { ...room, schedule };
  });
}

function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [activePage, setActivePage] = useState('rooms');
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [statusPanelPosition, setStatusPanelPosition] = useState(null);
  const [profilePosition, setProfilePosition] = useState({ top: 0, left: 0, maxHeight: 0 });
  const [settings, setSettings] = useState(loadSettings);
  const [bookingRoomId, setBookingRoomId] = useState(null);
  const [role, setRole] = useState('teacher');
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);
  const [purpose, setPurpose] = useState('Открытая лекция / Высшая математика');
  const [assigneeOrGroup, setAssigneeOrGroup] = useState('ИС 24-А');
  const [toast, setToast] = useState(null);
  const [bookings, setBookings] = useState(() =>
    readStoredArray(BOOKINGS_STORAGE_KEY, INITIAL_BOOKINGS)
  );
  const [roomInventory, setRoomInventory] = useState(() =>
    loadRoomInventory()
  );
  const [roomRequests, setRoomRequests] = useState(() =>
    readStoredArray(ROOM_REQUESTS_STORAGE_KEY, [])
  );
  const managedRooms = useMemo(
    () =>
      roomInventory.map((room) => {
        const pendingManagementRequest = roomRequests.find(
          (request) => request.roomId === room.id && request.status === 'pending'
        );
        const currentRoom =
          !room.configured || room.deleted
            ? room
            : bookings.reduce(
                (currentRooms, booking) =>
                  booking.status === 'pending' || booking.status === 'approved'
                    ? applyBookingToRooms(currentRooms, booking, booking.status)
                    : currentRooms,
                [room]
              )[0];
        return { ...currentRoom, pendingManagementRequest: Boolean(pendingManagementRequest) };
      }),
    [roomInventory, bookings, roomRequests]
  );
  const rooms = managedRooms.filter((room) => room.configured && !room.deleted);
  const teacherBookings = bookings.filter((booking) => booking.teacher === TEACHER_NAME);
  const bookingCounts = (role === 'admin' ? bookings : teacherBookings).reduce(
    (counts, booking) => ({ ...counts, [booking.status]: counts[booking.status] + 1 }),
    { pending: 0, approved: 0, rejected: 0 }
  );

  const freeRooms = rooms.filter((room) => room.category === 'free');
  const busyRooms = rooms.filter((room) => room.category === 'busy');
  const bookedRooms = rooms.filter((room) => room.category === 'booked');
  const selectableRooms = freeRooms.filter(
    (room) => Array.isArray(room.schedule) && room.schedule.length > 0
  );
  const selectedRoom = rooms.find((room) => room.id === bookingRoomId) || null;
  const currentStatusRooms =
    activeModal === 'free'
      ? freeRooms
      : activeModal === 'busy'
      ? busyRooms
      : activeModal === 'booked'
      ? bookedRooms
      : [];

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

  const openProfile = (event) => {
    const iconBounds = event.currentTarget.getBoundingClientRect();
    const width = Math.min(460, window.innerWidth - 32);
    const top = Math.min(iconBounds.bottom + 8, window.innerHeight - 16);
    setProfilePosition({
      top,
      left: Math.max(16, Math.min(iconBounds.right - width, window.innerWidth - width - 16)),
      maxHeight: Math.max(120, window.innerHeight - top - 16),
    });
    setActiveModal('profile');
  };

  useEffect(() => {
    if (!activeModal && !bookingRoomId) return undefined;

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
    try {
      window.localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    } catch (error) {
      console.error('Не удалось сохранить бронирования в браузере:', error);
      showToast('Не удалось сохранить бронирования в этом браузере');
    }
  }, [bookings]);

  useEffect(() => {
    try {
      window.localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(roomInventory));
    } catch (error) {
      console.error('Не удалось сохранить каталог кабинетов в браузере:', error);
      showToast('Не удалось сохранить изменения каталога в этом браузере');
    }
  }, [roomInventory]);

  useEffect(() => {
    try {
      window.localStorage.setItem(ROOM_REQUESTS_STORAGE_KEY, JSON.stringify(roomRequests));
    } catch (error) {
      console.error('Не удалось сохранить запросы на изменение кабинетов:', error);
      showToast('Не удалось сохранить запросы в этом браузере');
    }
  }, [roomRequests]);

  useEffect(() => {
    try {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Не удалось сохранить настройки интерфейса:', error);
    }
  }, [settings]);

  useEffect(() => {
    if (role === 'teacher') {
      setPurpose('Открытая лекция / Высшая математика');
      setAssigneeOrGroup('ИС 24-А');
    } else if (role === 'admin') {
      setPurpose('Открытая лекция / Спецкурс');
      setAssigneeOrGroup('Кафедра ИТ - Проф. Ибрагимов');
    }
  }, [role]);

  useEffect(() => {
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
      setToast((previousToast) => (previousToast === message ? null : previousToast));
    }, 3200);
  };

  const handleRoleChange = (nextRole) => {
    setRole(nextRole);
    if (activePage === 'my-profile') {
      return;
    }
    if (nextRole === 'admin' && activePage === 'my-bookings') {
      setActivePage('booking-management');
    } else if (nextRole !== 'admin' && activePage === 'booking-management') {
      setActivePage(nextRole === 'teacher' ? 'my-bookings' : 'rooms');
    } else if (nextRole === 'student' && activePage === 'my-bookings') {
      setActivePage('rooms');
    } else if (nextRole !== 'admin' && activePage === 'room-management') {
      setActivePage('rooms');
    }
  };

  const handleActivateRoom = (roomId, type) => {
    if (role !== 'admin') return;
    if (!ROOM_TYPES.includes(type)) {
      showToast('Выберите допустимое предназначение кабинета');
      return;
    }
    if (roomId % 10 === 6 && type !== 'Лекционный класс') {
      showToast('Кабинеты с номером на 6 добавляются как лекционные');
      return;
    }

    const room = roomInventory.find((item) => item.id === roomId);
    if (!room || room.configured || room.deleted) {
      showToast('Этот кабинет нельзя добавить повторно');
      return;
    }

    setRoomInventory((previousRooms) =>
      previousRooms.map((item) =>
        item.id === roomId
          ? {
              ...item,
              type,
              category: 'free',
              statusLabel: 'Свободен',
              status: 'Не забронирован',
              capacity: 30,
              schedule: createRoomSchedule(),
              configured: true,
            }
          : item
      )
    );
    showToast(`${room.number} добавлен в каталог корпуса 7`);
  };

  const handleRequestRoomChange = (
    roomId,
    action,
    requestedType,
    directiveNumber,
    directiveDate,
    reason
  ) => {
    if (role !== 'admin') return false;
    const room = roomInventory.find((item) => item.id === roomId && item.configured);
    if (!room) {
      showToast('Кабинет не найден или уже удалён');
      return false;
    }
    if (!/^\d+$/.test(String(directiveNumber || ''))) {
      showToast('Номер документа должен содержать только цифры');
      return false;
    }
    const parsedDirectiveDate = new Date(`${directiveDate}T00:00:00`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(directiveDate) ||
      Number.isNaN(parsedDirectiveDate.getTime()) ||
      directiveDate > getLocalDate()
    ) {
      showToast('Укажите корректную дату документа не позднее сегодняшнего дня');
      return false;
    }
    if (!String(reason || '').trim()) {
      showToast('Укажите основание запроса');
      return false;
    }
    if (action === 'change-type' && (!ROOM_TYPES.includes(requestedType) || requestedType === room.type)) {
      showToast('Выберите новое предназначение кабинета');
      return false;
    }
    if (action !== 'change-type' && action !== 'delete') {
      showToast('Неизвестный тип запроса');
      return false;
    }
    if (roomRequests.some((request) => request.roomId === roomId && request.status === 'pending')) {
      showToast('Для этого кабинета уже есть запрос на рассмотрении');
      return false;
    }
    if (
      action === 'delete' &&
      bookings.some(
        (booking) =>
          booking.roomId === roomId &&
          booking.date >= getLocalDate() &&
          (booking.status === 'pending' || booking.status === 'approved')
      )
    ) {
      showToast('Нельзя запросить удаление: у кабинета есть ожидающее или одобренное бронирование');
      return false;
    }

    const request = {
      id: `room-request-${roomId}-${Date.now()}`,
      roomId,
      roomNumber: room.number,
      action,
      previousType: room.type,
      requestedType: action === 'change-type' ? requestedType : null,
      directiveNumber,
      directiveDate,
      reason: String(reason).trim(),
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    setRoomRequests((previousRequests) => [request, ...previousRequests]);
    showToast('Запрос отправлен высшему руководству. Кабинет пока не изменён.');
    return true;
  };

  const openBookingModal = (roomId) => {
    const target = rooms.find((room) => room.id === roomId);
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
    const booking = {
      id: `booking-${Date.now()}`,
      teacher: isTeacher ? TEACHER_NAME : 'Администратор AIU',
      roomId: selectedRoom.id,
      roomNumber: selectedRoom.number,
      date: getLocalDate(),
      slotIndex: selectedSlotIndex,
      slot: chosenSlot.slot,
      purpose: purpose.trim() || 'Не указана',
      assignee: assigneeOrGroup.trim() || 'Не указана',
      status: isTeacher ? 'pending' : 'approved',
      rejectionReason: '',
      previousSlotStatus: chosenSlot.status,
      previousSlotNote: chosenSlot.note,
      createdAt: new Date().toISOString(),
    };

    setBookings((previousBookings) => [booking, ...previousBookings]);

    showToast(
      isTeacher
        ? `Заявка на ${selectedRoom.number} (${chosenSlot.slot}) отправлена администратору`
        : `${selectedRoom.number} забронирован на ${chosenSlot.slot}`
    );
  };

  const handleApproveBooking = (bookingId) => {
    const booking = bookings.find((item) => item.id === bookingId);
    if (!booking || booking.status !== 'pending') return;

    setBookings((previousBookings) =>
      previousBookings.map((item) =>
        item.id === bookingId ? { ...item, status: 'approved' } : item
      )
    );
    showToast(`Заявка преподавателя ${booking.teacher} одобрена`);
  };

  const handleRejectBooking = (bookingId, reason) => {
    const booking = bookings.find((item) => item.id === bookingId);
    if (!booking || booking.status !== 'pending') return;
    if (!reason.trim()) {
      showToast('Укажите обязательную причину отказа');
      return;
    }

    setBookings((previousBookings) =>
      previousBookings.map((item) =>
        item.id === bookingId
          ? { ...item, status: 'rejected', rejectionReason: reason.trim() }
          : item
      )
    );
    showToast(`Заявка отклонена. Причина будет видна преподавателю.`);
  };

  const openBookingsPage = (page) => {
    setActivePage(page);
    setActiveModal(null);
  };

  const openStatusPanel = (category, event) => {
    if (activeModal === category) {
      setActiveModal(null);
      return;
    }

    const buttonBounds = event.currentTarget.getBoundingClientRect();
    const spaceBelow = window.innerHeight - buttonBounds.bottom - 16;
    const spaceAbove = buttonBounds.top - 16;
    const opensAbove = spaceBelow < 360 && spaceAbove > spaceBelow;

    setStatusPanelPosition({
      top: opensAbove ? buttonBounds.top - 8 : buttonBounds.bottom + 8,
      left: Math.max(10, Math.min(buttonBounds.left, window.innerWidth - 576)),
      placement: opensAbove ? 'above' : 'below',
      maxHeight: Math.max(
        120,
        Math.min(
          Math.round(window.innerHeight * 0.75),
          (opensAbove ? spaceAbove : spaceBelow) - 8
        )
      ),
    });
    setActiveModal(category);
  };

  const handleNavigate = (page) => {
    setActivePage(page);
    setActiveModal(null);
  };

  const handleHome = () => {
    setActivePage('rooms');
    setActiveModal(null);
    setBookingRoomId(null);
  };

  return (
    <div
      className={[
        'app-layout',
        settings.theme === 'dark' ? 'theme-dark' : '',
        settings.compact ? 'compact-mode' : '',
      ].filter(Boolean).join(' ')}
    >
      {toast && <div className="toast-banner">{toast}</div>}

      <main className="content-area">
        <Header
          activeModal={activeModal}
          activePage={activePage}
          menuPosition={menuPosition}
          onHome={handleHome}
          onMenuToggle={toggleMenu}
          onNavigate={handleNavigate}
          onCloseMenu={() => setActiveModal(null)}
          onOpenProfile={openProfile}
          language={settings.language}
          onLanguageChange={(language) => setSettings((current) => ({ ...current, language }))}
          notificationsEnabled={settings.notifications}
        />

        {activePage === 'rooms' && (
          <RoomsBoard
            freeRooms={freeRooms}
            busyRooms={busyRooms}
            bookedRooms={bookedRooms}
            activeModal={activeModal}
            onOpenStatusPanel={openStatusPanel}
            onBook={openBookingModal}
          />
        )}
        {activePage === 'rules' && <RulesPage onBackToRooms={() => setActivePage('rooms')} />}
        {activePage === 'contacts' && <ContactsPage onBackToRooms={() => setActivePage('rooms')} />}
        {activePage === 'my-profile' && <UserProfilePage role={role} />}
        {activePage === 'my-bookings' && role === 'teacher' && (
          <BookingDashboard bookings={teacherBookings} />
        )}
        {activePage === 'booking-management' && role === 'admin' && (
          <BookingDashboard
            adminView
            bookings={bookings}
            onApprove={handleApproveBooking}
            onReject={handleRejectBooking}
          />
        )}
        {activePage === 'room-management' && role === 'admin' && (
          <RoomManagement
            rooms={managedRooms}
            bookings={bookings}
            requests={roomRequests}
            onActivateRoom={handleActivateRoom}
            onRequestChange={handleRequestRoomChange}
          />
        )}

        {['free', 'busy', 'booked'].includes(activeModal) && (
          <StatusPanel
            key={activeModal}
            category={activeModal}
            rooms={currentStatusRooms}
            totalRooms={rooms.length}
            position={statusPanelPosition}
            onClose={() => setActiveModal(null)}
            onBook={openBookingModal}
          />
        )}

        {selectedRoom && (
          <BookingModal
            selectedRoom={selectedRoom}
            selectableRooms={selectableRooms}
            role={role}
            setRole={handleRoleChange}
            selectedSlotIndex={selectedSlotIndex}
            setSelectedSlotIndex={setSelectedSlotIndex}
            purpose={purpose}
            setPurpose={setPurpose}
            assigneeOrGroup={assigneeOrGroup}
            setAssigneeOrGroup={setAssigneeOrGroup}
            onSubmit={handleSubmitBooking}
            onClose={() => setBookingRoomId(null)}
            onSelectRoom={setBookingRoomId}
          />
        )}

         {activeModal === 'profile' && (
           <ProfileModal
             role={role}
             setRole={handleRoleChange}
             position={profilePosition}
             bookingCounts={bookingCounts}
             onOpenMyProfile={() => openBookingsPage('my-profile')}
             onOpenMyBookings={() => openBookingsPage('my-bookings')}
             onOpenBookingManagement={() => openBookingsPage('booking-management')}
             onOpenRoomManagement={() => openBookingsPage('room-management')}
             onOpenSettings={() => setActiveModal('settings')}
             currentLanguage={settings.language}
             onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === 'settings' && (
          <SettingsModal
            settings={settings}
            onChange={setSettings}
            onReset={() => setSettings(DEFAULT_SETTINGS)}
            onClose={() => setActiveModal(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
