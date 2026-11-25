function BookingModal({
  selectedRoom,
  selectableRooms,
  role,
  setRole,
  selectedSlotIndex,
  setSelectedSlotIndex,
  purpose,
  setPurpose,
  assigneeOrGroup,
  setAssigneeOrGroup,
  onSubmit,
  onClose,
  onSelectRoom,
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <form
        className="modal-content booking-modal-card"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        onSubmit={onSubmit}
      >
        <div className="booking-modal-top">
          <div>
            <h2>Бронирование аудитории</h2>
            <p className="booking-meta">
              <span className="dot green"></span> {selectedRoom.statusLabel} • {selectedRoom.floor} этаж (вместимость {selectedRoom.capacity} чел.)
            </p>
          </div>
          <button type="button" className="close-modal-btn" aria-label="Закрыть" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="room-tabs-row">
          {selectableRooms.map((room) => (
            <button
              key={room.id}
              type="button"
              className={`room-tab-btn ${room.id === selectedRoom.id ? 'active' : ''}`}
              onClick={() => onSelectRoom(room.id)}
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
            {selectedRoom.schedule.map((item, index) => {
              const isFree = item.status === 'free';
              const canSelectSlot = isFree && (role === 'teacher' || role === 'admin');
              const isChecked = canSelectSlot && selectedSlotIndex === index;

              return (
                <div
                  key={item.slot}
                  className={`schedule-row ${isFree ? 'is-free' : ''} ${
                    canSelectSlot ? 'clickable-slot' : ''
                  }`}
                  onClick={() => {
                    if (canSelectSlot) setSelectedSlotIndex(index);
                  }}
                >
                  <div className="slot-left">
                    {canSelectSlot && (
                      <input
                        type="radio"
                        name={`slot-${selectedRoom.id}`}
                        checked={isChecked}
                        onChange={() => setSelectedSlotIndex(index)}
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
                onChange={(event) => setPurpose(event.target.value)}
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
                onChange={(event) => setAssigneeOrGroup(event.target.value)}
              />
            </div>
          </div>
        )}

        <div className="booking-modal-footer">
          <span className="footer-caption">Система расписания AIU</span>
          {role === 'student' ? (
            <button type="button" className="secondary-close-btn" onClick={onClose}>
              Понятно / Закрыть
            </button>
          ) : (
            <div className="footer-actions-group">
              <button type="button" className="secondary-close-btn" onClick={onClose}>
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
  );
}

export default BookingModal;