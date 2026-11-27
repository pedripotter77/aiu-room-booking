import { useEffect, useMemo, useState } from 'react';
import './App.css';
import BookingModal from './components/BookingModal';
import Header from './components/Header';
import { ContactsPage, RulesPage } from './components/InfoPages';
import RoomsBoard from './components/RoomsBoard';
import StatusPanel from './components/StatusPanel';
import ROOMS_DATA from './data/roomsData';
import { INITIAL_BOOKINGS } from './data/bookingsData';
import BookingDashboard from './components/BookingDashboard';
import ProfileModal from './components/ProfileModal';

const TEACHER_NAME = 'Сергей Сергеев';
const BOOKINGS_STORAGE_KEY = 'aiu-room-booking-bookings';

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
  const [bookingRoomId, setBookingRoomId] = useState(null);
  const [role, setRole] = useState('teacher');
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);
  const [purpose, setPurpose] = useState('Открытая лекция / Высшая математика');
  const [assigneeOrGroup, setAssigneeOrGroup] = useState('ИС 24-А');
  const [toast, setToast] = useState(null);
  const [bookings, setBookings] = useState(() =>
    readStoredArray(BOOKINGS_STORAGE_KEY, INITIAL_BOOKINGS)
  );
  const rooms = useMemo(
    () =>
      bookings.reduce(
        (currentRooms, booking) =>
          booking.status === 'pending' || booking.status === 'approved'
            ? applyBookingToRooms(currentRooms, booking, booking.status)
            : currentRooms,
        ROOMS_DATA
      ),
    [bookings]
  );
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
    if (nextRole === 'admin' && activePage === 'my-bookings') {
      setActivePage('booking-management');
    } else if (nextRole !== 'admin' && activePage === 'booking-management') {
      setActivePage(nextRole === 'teacher' ? 'my-bookings' : 'rooms');
    } else if (nextRole === 'student' && activePage === 'my-bookings') {
      setActivePage('rooms');
    }
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
    <div className="app-layout">
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
             onOpenMyBookings={() => openBookingsPage('my-bookings')}
             onOpenBookingManagement={() => openBookingsPage('booking-management')}
             onClose={() => setActiveModal(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
