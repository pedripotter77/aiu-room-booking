import { useMemo, useState } from 'react';
import { BUILDING_FLOORS, ROOM_TYPES } from '../data/roomInventory';

function getToday() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function RoomCard({ room, onRequestChange }) {
  const [editingType, setEditingType] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const submitTypeChange = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submitted = onRequestChange(
      room.id,
      'change-type',
      String(formData.get('type')),
      String(formData.get('directive-number') || '').trim(),
      String(formData.get('directive-date') || ''),
      String(formData.get('reason') || '').trim()
    );
    if (submitted) {
      event.currentTarget.reset();
      setEditingType(false);
    }
  };

  const submitDeletion = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submitted = onRequestChange(
      room.id,
      'delete',
      null,
      String(formData.get('directive-number') || '').trim(),
      String(formData.get('directive-date') || ''),
      String(formData.get('reason') || '').trim()
    );
    if (submitted) {
      event.currentTarget.reset();
      setDeleting(false);
    }
  };

  return (
    <article className={`managed-room-card ${room.deleted ? 'is-deleted' : ''}`}>
      <div className="managed-room-heading">
        <div>
          <span className={`managed-room-status ${room.configured ? 'configured' : room.deleted ? 'deleted' : 'unconfigured'}`}>
            {room.deleted ? 'Удалён по распоряжению' : room.configured ? room.statusLabel : 'Не добавлен в систему'}
          </span>
          <h2>{room.number}</h2>
        </div>
        <span className="managed-room-floor">{room.floor ? `${room.floor} этаж` : 'Этаж не указан'}</span>
      </div>

      <div className="managed-room-summary">
        <div>
          <span>Предназначение</span>
          <strong>{room.type || 'Не указано'}</strong>
        </div>
        <div>
          <span>Вместимость</span>
          <strong>{room.configured ? `${room.capacity} мест` : '—'}</strong>
        </div>
        <div>
          <span>Текущее состояние</span>
          <strong>{room.deleted ? 'Не используется' : room.status}</strong>
        </div>
      </div>

      {room.legacyNumber && (
        <p className="managed-room-warning">
          Номер сохранён из каталога, хотя не входит в диапазон 201–1109 по 9 кабинетов на этаж.
        </p>
      )}

      {room.lastDirective && (
        <p className="managed-room-directive">
          Последнее распоряжение: <strong>{room.lastDirective}</strong>
        </p>
      )}

      {room.pendingManagementRequest && (
        <p className="managed-room-pending">
          Есть запрос на рассмотрении высшего руководства. Кабинет пока не изменён.
        </p>
      )}

      {room.configured && (
        <>
          <details className="managed-room-schedule">
            <summary>Посмотреть расписание</summary>
            {room.schedule.length > 0 ? (
              <div className="managed-schedule-list">
                {room.schedule.map((slot) => (
                  <div className="managed-schedule-row" key={slot.slot}>
                    <strong>{slot.slot}</strong>
                    <span className={`managed-schedule-status ${slot.status}`}>{slot.note}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="managed-schedule-empty">
                Расписание для кабинета пока не загружено.
              </p>
            )}
          </details>

          <div className="managed-room-actions">
            <button type="button" className="managed-room-secondary-btn" onClick={() => {
              setEditingType((current) => !current);
              setDeleting(false);
            }} disabled={room.pendingManagementRequest}>
              Запросить смену предназначения
            </button>
            <button type="button" className="managed-room-delete-btn" onClick={() => {
              setDeleting((current) => !current);
              setEditingType(false);
            }} disabled={room.pendingManagementRequest}>
              Запросить удаление
            </button>
          </div>

          {editingType && (
            <form className="managed-room-directive-form" onSubmit={submitTypeChange}>
              <label htmlFor={`room-type-${room.id}`}>Новое предназначение</label>
              <select id={`room-type-${room.id}`} name="type" defaultValue={room.type} required>
                {ROOM_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
              <label htmlFor={`type-directive-${room.id}`}>
                Номер документа <span>(только цифры)</span>
              </label>
              <input
                id={`type-directive-${room.id}`}
                name="directive-number"
                type="text"
                inputMode="numeric"
                pattern="[0-9]+"
                title="Введите номер, состоящий только из цифр"
                placeholder="Например, 172026"
                required
              />
              <label htmlFor={`type-date-${room.id}`}>Дата документа <span>(обязательно)</span></label>
              <input
                id={`type-date-${room.id}`}
                name="directive-date"
                type="date"
                max={getToday()}
                required
              />
              <label htmlFor={`type-reason-${room.id}`}>Основание запроса <span>(обязательно)</span></label>
              <textarea
                id={`type-reason-${room.id}`}
                name="reason"
                rows="2"
                placeholder="Например, оборудование в кабинете заменено"
                required
              />
              <button type="submit" className="managed-room-primary-btn">
                Отправить на рассмотрение
              </button>
            </form>
          )}

          {deleting && (
            <form className="managed-room-directive-form delete-form" onSubmit={submitDeletion}>
              <p>Кабинет не будет удалён до решения высшего руководства.</p>
              <label htmlFor={`delete-directive-${room.id}`}>
                Номер документа <span>(только цифры)</span>
              </label>
              <input
                id={`delete-directive-${room.id}`}
                name="directive-number"
                type="text"
                inputMode="numeric"
                pattern="[0-9]+"
                title="Введите номер, состоящий только из цифр"
                placeholder="Например, 242026"
                required
              />
              <label htmlFor={`delete-date-${room.id}`}>Дата документа <span>(обязательно)</span></label>
              <input
                id={`delete-date-${room.id}`}
                name="directive-date"
                type="date"
                max={getToday()}
                required
              />
              <label htmlFor={`delete-reason-${room.id}`}>Основание запроса <span>(обязательно)</span></label>
              <textarea
                id={`delete-reason-${room.id}`}
                name="reason"
                rows="2"
                placeholder="Кратко опишите причину удаления"
                required
              />
              <button type="submit" className="managed-room-delete-btn">
                Отправить на рассмотрение
              </button>
            </form>
          )}
        </>
      )}
    </article>
  );
}

function RoomManagement({ rooms, bookings, requests, onActivateRoom, onRequestChange }) {
  const [query, setQuery] = useState('');
  const [floorFilter, setFloorFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const roomTypes = useMemo(
    () => [...new Set(rooms.map((room) => room.type).filter(Boolean))].sort(),
    [rooms]
  );
  const visibleRooms = rooms.filter((room) => {
    const matchesQuery = room.number.toLowerCase().includes(query.trim().toLowerCase());
    const matchesFloor = floorFilter === 'all' || room.floor === Number(floorFilter);
    const matchesType = typeFilter === 'all' || room.type === typeFilter;
    return matchesQuery && matchesFloor && matchesType;
  });
  const activeCount = rooms.filter((room) => room.configured).length;
  const standardRoomCount = rooms.filter((room) => !room.legacyNumber).length;
  const legacyRoomCount = rooms.filter((room) => room.legacyNumber).length;
  const waitingDirectives = bookings.filter((booking) => booking.status === 'pending').length;
  const pendingRequests = requests.filter((request) => request.status === 'pending');

  return (
    <section className="room-management-page" aria-labelledby="room-management-title">
      <header className="room-management-header">
        <span className="info-page-kicker">Корпус 7 · Доступ администратора</span>
        <h1 id="room-management-title">Управление аудиториями</h1>
        <p>
          Каталог 2–11 этажей. Запросы на изменение предназначения и удаление отправляются
          высшему руководству и не применяются до его решения.
        </p>
        <p className="room-management-demo-note">
          Демо-режим: запросы хранятся только в этом браузере. До подключения сервера руководство их не получит.
        </p>
      </header>

      <div className="room-management-summary">
        <div><span>Кабинетов по схеме этажей 2–11</span><strong>{standardRoomCount}</strong></div>
        <div><span>Добавлено в систему</span><strong>{activeCount}</strong></div>
        <div><span>Ожидают решения по броням</span><strong>{waitingDirectives}</strong></div>
      </div>
      {legacyRoomCount > 0 && (
        <p className="room-management-legacy-note">
          В исходном каталоге есть {legacyRoomCount} кабинет вне принятой нумерации. Он сохранён отдельно.
        </p>
      )}

      <section className="room-requests-panel" aria-labelledby="room-requests-title">
        <div className="room-requests-heading">
          <div>
            <h2 id="room-requests-title">На рассмотрении высшего руководства</h2>
            <p>До одобрения данные кабинетов остаются без изменений.</p>
          </div>
          <span>{pendingRequests.length}</span>
        </div>
        {pendingRequests.length > 0 ? (
          <div className="room-requests-list">
            {pendingRequests.map((request) => (
              <article className="room-request-card" key={request.id}>
                <div>
                  <strong>{request.roomNumber}</strong>
                  <span>{request.action === 'delete' ? 'Запрос на удаление' : `Смена типа: ${request.previousType} → ${request.requestedType}`}</span>
                </div>
                <p>{request.reason}</p>
                <small>Документ № {request.directiveNumber} от {request.directiveDate}</small>
                <span className="room-request-status">Ожидает решения</span>
              </article>
            ))}
          </div>
        ) : (
          <p className="room-requests-empty">Запросов на рассмотрении пока нет.</p>
        )}
      </section>

      <section className="room-add-panel" aria-labelledby="room-add-title">
        <div>
          <h2 id="room-add-title">Добавить аудиторию</h2>
          <p>На этажах 2–11 предусмотрены кабинеты с номерами от 1 до 9.</p>
        </div>
        <RoomAddForm rooms={rooms} onActivateRoom={onActivateRoom} />
      </section>

      <div className="room-management-filters">
        <label className="room-search-field">
          <span>Поиск по номеру</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Например, 706"
          />
        </label>
        <label>
          <span>Этаж</span>
          <select value={floorFilter} onChange={(event) => setFloorFilter(event.target.value)}>
            <option value="all">Все этажи</option>
            {BUILDING_FLOORS.map((floor) => <option key={floor} value={floor}>{floor} этаж</option>)}
          </select>
        </label>
        <label>
          <span>Предназначение</span>
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            <option value="all">Все типы</option>
            {roomTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
      </div>

      <div className="managed-room-list" aria-live="polite">
        {visibleRooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onRequestChange={onRequestChange}
          />
        ))}
        {visibleRooms.length === 0 && (
          <p className="managed-room-empty">По заданным фильтрам аудитории не найдены.</p>
        )}
      </div>
    </section>
  );
}

function RoomAddForm({ rooms, onActivateRoom }) {
  const [floor, setFloor] = useState(String(BUILDING_FLOORS[0]));
  const [roomNumber, setRoomNumber] = useState('1');

  const roomId = Number(floor) * 100 + Number(roomNumber);
  const room = rooms.find((item) => item.id === roomId);
  const unavailable = !room || room.configured || room.deleted;
  const suggestedType = ROOM_TYPES.includes(room?.type)
    ? room.type
    : roomId % 10 === 6
    ? 'Лекционный класс'
    : 'Обычный класс';
  const selectableTypes = roomId % 10 === 6 ? ['Лекционный класс'] : ROOM_TYPES;
  const [type, setType] = useState(suggestedType);

  const handleFloorChange = (value) => {
    const nextId = Number(value) * 100 + Number(roomNumber);
    const nextRoom = rooms.find((item) => item.id === nextId);
    setFloor(value);
    setType(
      ROOM_TYPES.includes(nextRoom?.type)
        ? nextRoom.type
        : nextId % 10 === 6
        ? 'Лекционный класс'
        : 'Обычный класс'
    );
  };

  const handleNumberChange = (value) => {
    const nextId = Number(floor) * 100 + Number(value);
    const nextRoom = rooms.find((item) => item.id === nextId);
    setRoomNumber(value);
    setType(
      ROOM_TYPES.includes(nextRoom?.type)
        ? nextRoom.type
        : nextId % 10 === 6
        ? 'Лекционный класс'
        : 'Обычный класс'
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!unavailable) onActivateRoom(roomId, type);
  };

  return (
    <form className="room-add-form" onSubmit={handleSubmit}>
      <label>
        <span>Этаж</span>
        <select value={floor} onChange={(event) => handleFloorChange(event.target.value)}>
          {BUILDING_FLOORS.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <label>
        <span>Кабинет</span>
        <select value={roomNumber} onChange={(event) => handleNumberChange(event.target.value)}>
          {Array.from({ length: 9 }, (_, index) => String(index + 1)).map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>
      <label>
        <span>Тип</span>
        <select value={type} onChange={(event) => setType(event.target.value)}>
          {selectableTypes.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <button type="submit" className="managed-room-primary-btn" disabled={unavailable}>
        {room?.deleted ? 'Кабинет удалён' : room?.configured ? 'Уже добавлен' : 'Добавить кабинет'}
      </button>
    </form>
  );
}

export default RoomManagement;
