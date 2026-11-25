import { useEffect, useState } from 'react';
import './App.css';
import BookingModal from './components/BookingModal';
import Header from './components/Header';
import { ContactsPage, RulesPage } from './components/InfoPages';
import RoomsBoard from './components/RoomsBoard';
import StatusPanel from './components/StatusPanel';
import ROOMS_DATA from './data/roomsData';

function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [activePage, setActivePage] = useState('rooms');
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [bookingRoomId, setBookingRoomId] = useState(null);
  const [role, setRole] = useState('teacher');
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);
  const [purpose, setPurpose] = useState('Открытая лекция / Высшая математика');
  const [assigneeOrGroup, setAssigneeOrGroup] = useState('ИС 24-А');
  const [toast, setToast] = useState(null);
  const [rooms, setRooms] = useState(ROOMS_DATA);

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
    const nextStatus = isTeacher ? 'pending' : 'booked';
    const nextNote = isTeacher
      ? `Заявка отправлена (${assigneeOrGroup || 'Преподаватель'})`
      : `Забронировано (${assigneeOrGroup || 'Админ'})`;

    setRooms((previousRooms) =>
      previousRooms.map((room) => {
        if (room.id !== selectedRoom.id) return room;

        const updatedSchedule = room.schedule.map((item, index) =>
          index === selectedSlotIndex ? { ...item, status: nextStatus, note: nextNote } : item
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
    setActiveModal((currentModal) => (currentModal === category ? null : category));
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

        {['free', 'busy', 'booked'].includes(activeModal) && (
          <StatusPanel
            key={activeModal}
            category={activeModal}
            rooms={currentStatusRooms}
            totalRooms={rooms.length}
            onClose={() => setActiveModal(null)}
            onBook={openBookingModal}
          />
        )}

        {selectedRoom && (
          <BookingModal
            selectedRoom={selectedRoom}
            selectableRooms={selectableRooms}
            role={role}
            setRole={setRole}
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
      </main>
    </div>
  );
}

export default App;
