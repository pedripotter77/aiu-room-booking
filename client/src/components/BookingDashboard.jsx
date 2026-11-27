const STATUS_LABELS = {
  pending: 'Ожидает решения',
  approved: 'Одобрено',
  rejected: 'Отклонено',
};

function formatBookingDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function BookingCard({ booking, adminView, onApprove, onReject }) {
  const handleReject = (event) => {
    event.preventDefault();
    const reason = new FormData(event.currentTarget).get('rejection-reason');
    onReject(booking.id, String(reason || '').trim());
    event.currentTarget.reset();
  };

  return (
    <article className="booking-record-card">
      <div className="booking-record-heading">
        <div>
          <span className={`booking-status-badge ${booking.status}`}>
            {STATUS_LABELS[booking.status]}
          </span>
          <h2>{booking.roomNumber}</h2>
        </div>
        <span className="booking-record-date">{formatBookingDate(booking.date)}</span>
      </div>

      <div className="booking-record-details">
        <div><span>Время</span><strong>{booking.slot}</strong></div>
        <div><span>Цель</span><strong>{booking.purpose}</strong></div>
        <div><span>Группа</span><strong>{booking.assignee}</strong></div>
        {adminView && <div><span>Преподаватель</span><strong>{booking.teacher}</strong></div>}
      </div>

      {booking.status === 'rejected' && (
        <div className="booking-rejection-reason">
          <strong>Причина отказа</strong>
          <p>{booking.rejectionReason}</p>
        </div>
      )}

      {adminView && booking.status === 'pending' && (
        <div className="booking-review-actions">
          <button
            type="button"
            className="booking-approve-btn"
            onClick={() => onApprove(booking.id)}
          >
            Одобрить заявку
          </button>
          <form className="booking-reject-form" onSubmit={handleReject}>
            <label htmlFor={`rejection-reason-${booking.id}`}>
              Причина отказа <span>(обязательно)</span>
            </label>
            <textarea
              id={`rejection-reason-${booking.id}`}
              name="rejection-reason"
              rows="2"
              placeholder="Например: в это время запланирован тренинг или уборка"
              required
            />
            <button type="submit" className="booking-reject-btn">
              Отклонить с причиной
            </button>
          </form>
        </div>
      )}
    </article>
  );
}

function BookingDashboard({ adminView, bookings, onApprove, onReject }) {
  const counts = bookings.reduce(
    (result, booking) => ({ ...result, [booking.status]: result[booking.status] + 1 }),
    { pending: 0, approved: 0, rejected: 0 }
  );
  const orderedBookings = [...bookings].sort((first, second) =>
    first.date.localeCompare(second.date) || first.slotIndex - second.slotIndex
  );

  return (
    <section className="booking-dashboard" aria-labelledby="booking-dashboard-title">
      <header className="booking-dashboard-header">
        <span className="info-page-kicker">{adminView ? 'Панель администратора' : 'Кабинет преподавателя'}</span>
        <h1 id="booking-dashboard-title">
          {adminView ? 'Управление бронированиями' : 'Мои бронирования'}
        </h1>
        <p>
          {adminView
            ? 'Проверьте цель и время каждой заявки. При отказе укажите причину — она будет видна преподавателю.'
            : 'Здесь собраны ваши заявки, решения администратора и причины отклонения.'}
        </p>
        <p className="booking-data-notice">
          Демо-режим: заявки сохраняются в этом браузере и не синхронизируются между устройствами.
        </p>
      </header>

      <div className="booking-summary-grid" aria-label="Сводка бронирований">
        <div className="booking-summary-card pending"><span>Ожидают решения</span><strong>{counts.pending}</strong></div>
        <div className="booking-summary-card approved"><span>Одобрено</span><strong>{counts.approved}</strong></div>
        <div className="booking-summary-card rejected"><span>Отклонено</span><strong>{counts.rejected}</strong></div>
      </div>

      <div className="booking-dashboard-list">
        {orderedBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            adminView={adminView}
            onApprove={onApprove}
            onReject={onReject}
          />
        ))}
        {orderedBookings.length === 0 && (
          <div className="booking-empty-state">
            <h2>{adminView ? 'Новых заявок пока нет' : 'У вас пока нет бронирований'}</h2>
            <p>
              {adminView
                ? 'Заявки преподавателей появятся здесь после отправки.'
                : 'Выберите свободный кабинет и отправьте заявку на бронирование.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default BookingDashboard;
