function RoomsBoard({ freeRooms, busyRooms, bookedRooms, activeModal, onOpenStatusPanel, onBook }) {
  const columns = [
    { category: 'free', title: 'Свободные', rooms: freeRooms, color: 'green', canBook: true },
    { category: 'busy', title: 'Заняты', rooms: busyRooms, color: 'red' },
    { category: 'booked', title: 'Забронировано', rooms: bookedRooms, color: 'yellow' },
  ];

  return (
    <div className="rooms-container" id="rooms">
      <div className="rooms-grid-columns">
        {columns.map(({ category, title, rooms, color, canBook }) => {
          const room = rooms[0];
          const isOpen = activeModal === category;

          return (
            <div className="status-column" key={category}>
              <button
                className={`status-dropdown-header ${isOpen ? 'is-open' : ''}`}
                type="button"
                aria-expanded={isOpen}
                onClick={() => onOpenStatusPanel(category)}
              >
                <span className={`dot ${color}`}></span>
                <span>{title} ({rooms.length})</span>
                <span className="arrow-icon">{isOpen ? '▲' : '▼'}</span>
              </button>
              {room && (
                <div className="room-card">
                  <h3>{room.number}</h3>
                  <p>{room.type}</p>
                  <span className={`room-subtext ${canBook ? '' : 'muted'}`}>{room.status}</span>
                  {canBook && (
                    <button className="book-btn" type="button" onClick={() => onBook(room.id)}>
                      ЗАБРОНИРОВАТЬ
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RoomsBoard;