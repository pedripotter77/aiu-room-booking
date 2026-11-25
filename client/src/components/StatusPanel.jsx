import { useState } from 'react';

function StatusPanel({ category, rooms, totalRooms, onClose, onBook }) {
  const [statusSearch, setStatusSearch] = useState('');
  const [showAllRooms, setShowAllRooms] = useState(false);

  const filteredRooms = rooms.filter((room) =>
    `${room.number} ${room.type} ${room.status}`.toLowerCase().includes(statusSearch.trim().toLowerCase())
  );
  const visibleRooms = showAllRooms ? filteredRooms : filteredRooms.slice(0, 6);
  const statusHeading = {
    free: `ВСЕ СВОБОДНЫЕ (${rooms.length})`,
    busy: `ВСЕ ЗАНЯТЫЕ (${rooms.length})`,
    booked: `ВСЕ ЗАБРОНИРОВАННЫЕ (${rooms.length})`,
  }[category];
  const dotColor = { free: 'green', busy: 'red', booked: 'yellow' }[category];

  return (
    <div className="status-panel-overlay" onClick={onClose}>
      <section
        className={`status-panel status-panel-${category}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-panel-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="status-panel-header">
          <div className="status-panel-heading">
            <h2 id="status-panel-title">
              <span className={`dot ${dotColor}`} />
              {statusHeading}
            </h2>
            {category === 'busy' && (
              <>
                <p>Главный корпус (А) <span>•</span> {rooms.length} кабинетов сейчас заняты</p>
                <div
                  className="occupancy-progress"
                  role="progressbar"
                  aria-label="Доля занятых кабинетов в списке"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={Math.round((rooms.length / totalRooms) * 100)}
                >
                  <span style={{ width: `${(rooms.length / totalRooms) * 100}%` }} />
                </div>
              </>
            )}
          </div>
          <button className="close-modal-btn" type="button" aria-label="Закрыть" onClick={onClose}>×</button>
        </header>

        <label className="status-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={statusSearch}
            onChange={(event) => {
              setStatusSearch(event.target.value);
              setShowAllRooms(false);
            }}
            placeholder="Поиск по кабинету или описанию..."
            aria-label="Поиск по кабинету или описанию"
          />
        </label>

        <div className="status-panel-rooms">
          {visibleRooms.map((room) => (
            <article className="status-room-card" key={room.id}>
              <div className="status-room-info">
                <div className="status-room-title">
                  <h3>{room.number}</h3>
                  <span className="room-type-badge">{room.type}</span>
                </div>
                <p>{room.status}</p>
              </div>
              {category === 'free' ? (
                <button className="modal-action-btn" type="button" onClick={() => onBook(room.id)}>
                  Забронировать
                </button>
              ) : (
                <span className={`room-status-pill ${category === 'busy' ? 'busy' : 'booked'}`}>
                  <span className="dot" />
                  {category === 'busy' ? 'Занято' : 'Забронировано'}
                </span>
              )}
            </article>
          ))}
          {visibleRooms.length === 0 && (
            <p className="status-empty-state">По вашему запросу кабинеты не найдены.</p>
          )}
        </div>

        <footer className="status-panel-footer">
          <span>
            Показано {visibleRooms.length} из {filteredRooms.length} кабинетов <span>•</span> Корпус 7
          </span>
          {filteredRooms.length > 6 && (
            <button type="button" onClick={() => setShowAllRooms((isShowingAll) => !isShowingAll)}>
              {showAllRooms ? 'Свернуть' : `Все (${filteredRooms.length})`}
              <span aria-hidden="true">{showAllRooms ? '↑' : '→'}</span>
            </button>
          )}
        </footer>
      </section>
    </div>
  );
}

export default StatusPanel;