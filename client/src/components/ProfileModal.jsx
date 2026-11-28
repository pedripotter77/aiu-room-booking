import icon from '../assets/profile_icon.png';

const PROFILE_DATA = {
    student: {
        name: 'Ералы Куанышкали',
        role: 'student',
        handle: '@eraly_kuanyshkali',
        badge: null,
        onlineDot: false,
        meta: [
            { label: 'Курс:', value: '2 курс' },
            { label: 'Высшая школа:', value: 'Информационных технологий и инженерии' },
            { label: 'Группа:', value: 'ВТиПО 25-Б' },
            { label: 'Почта:', value: 'e•••••••••••••••@aiu.edu.kz' },
        ], 
    },
    teacher: {
        name: 'Сергей Сергеев',
    handle: '@sergey_aiu',
    badge: null,
    onlineDot: false,
    meta: [
      { label: 'Роль:', value: 'Преподаватель' },
      { label: 'Высшая школа:', value: 'Педагогический институт' },
      { label: 'Кафедра:', value: 'Естественно-научные дисциплины' },
    ],
    },
    admin: {
    name: 'Администратор AIU',
    handle: '@admin_corp7',
    badge: 'ADMIN',
    onlineDot: true,
    meta: [
      { label: 'Роль:', value: 'Администратор системы' },
      { label: 'Доступ:', value: 'Управление корпусом 7' },
      { label: 'Подразделение:', value: 'Департамент диспетчеризации и расписания' },
    ],
  },
};

function ProfileModal({
  role,
  setRole,
  position,
  bookingCounts,
  onOpenMyProfile,
  onOpenMyBookings,
  onOpenBookingManagement,
  onOpenRoomManagement,
  onOpenSettings,
  currentLanguage,
  onClose,
}) {
    const current = PROFILE_DATA[role];

    return (
        <div className="profile-overlay" onClick={onClose}>
            <div 
              className="modal-content profile-modal-card"
              style={{ top: position.top, left: position.left, maxHeight: position.maxHeight }}
              role="dialog"
              aria-modal="true"
              onClick={(event) => event.stopPropagation()}
              >
                <div className="profile-modal-header">
          <span className="profile-modal-title">ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ</span>
          <button
            type="button"
            className="close-modal-btn"
            aria-label="Закрыть"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="profile-role-section">
          <div className="profile-role-caption">ВЫБОР РОЛИ ДЛЯ ПРОВЕРКИ ИНТЕРФЕЙСА:</div>
          <div className="profile-role-tabs">
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

        <div className="profile-user-block">
          <div className="profile-avatar-box">
            <img src={icon} alt="Avatar" className="profile-modal-avatar" />
            {current.onlineDot && <span className="profile-online-dot" />}
          </div>
          <div>
            <div className="profile-name-row">
              <h3>{current.name}</h3>
              {current.badge && <span className="profile-admin-badge">{current.badge}</span>}
            </div>
            <p className="profile-handle">{current.handle}</p>
          </div>
        </div>

        <div className="profile-meta-list">
          {current.meta.map((row) => (
            <div className="profile-meta-row" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>

        <div className="profile-actions-list">
          <button type="button" className="profile-action-row" onClick={onOpenMyProfile}>
            <span>Мой профиль</span>
            {role !== 'student' && <span className="chevron">›</span>}
          </button>

          {role === 'student' && (
            <div className="profile-action-row disabled">
              <div>
                <div className="profile-disabled-title">🔒 Мои бронирования</div>
                <div className="profile-disabled-sub">
                  Недоступно студентам (бронирование закрыто)
                </div>
              </div>
            </div>
          )}

          {role === 'teacher' && (
            <button type="button" className="profile-action-row" onClick={onOpenMyBookings}>
              <span className="profile-row-left">
                <span>📅</span>
                <span>Мои бронирования</span>
              </span>
              <span className="profile-row-right">
                <span className="profile-pill-blue">{bookingCounts.pending} ожидают</span>
                <span className="chevron">›</span>
              </span>
            </button>
          )}

          {role === 'admin' && (
            <>
              <button type="button" className="profile-action-row" onClick={onOpenBookingManagement}>
                <div>
                  <div className="profile-row-left">
                    <span>🔒</span>
                    <strong>Управление бронированиями</strong>
                  </div>
                  <div className="profile-disabled-sub">
                    Рассмотрение заявок преподавателей
                  </div>
                </div>
                <span className="profile-pill-green">{bookingCounts.pending} новых</span>
              </button>

              <button type="button" className="profile-action-row" onClick={onOpenRoomManagement}>
                <span className="profile-row-left">
                  <span>🖥️</span>
                  <strong>Управление аудиториями</strong>
                </span>
                <span className="profile-row-right">
                  <span className="profile-muted-right">Корпус 7</span>
                  <span className="chevron">›</span>
                </span>
              </button>
            </>
          )}

          <button type="button" className="profile-action-row" onClick={onOpenSettings}>
            <span>Настройки</span>
            {role !== 'student' && <span className="chevron">›</span>}
          </button>
        </div>

        <div className="profile-footer-row">
          <span>
            Язык: <strong>{currentLanguage}</strong>
          </span>
          <button type="button" className="profile-logout-btn">
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;