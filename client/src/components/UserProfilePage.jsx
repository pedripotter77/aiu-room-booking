import icon from '../assets/profile_icon.png';

const USER_PROFILES = {
  student: {
    name: 'Ералы Куанышкали',
    role: 'Студент',
    handle: '@eraly_kuanyshkali',
    email: 'e•••••••••••••••@aiu.edu.kz',
    emailNote: 'Адрес маскирован в профиле',
    details: [
      { label: 'Курс', value: '2 курс' },
      { label: 'Высшая школа', value: 'Информационных технологий и инженерии' },
      { label: 'Группа', value: 'ВТиПО 25-Б' },
      { label: 'Корпус', value: 'Корпус 7' },
    ],
  },
  teacher: {
    name: 'Сергей Сергеев',
    role: 'Преподаватель',
    handle: '@sergey_aiu',
    email: null,
    details: [
      { label: 'Высшая школа', value: 'Педагогический институт' },
      { label: 'Кафедра', value: 'Естественно-научные дисциплины' },
      { label: 'Корпус', value: 'Корпус 7' },
      { label: 'Доступ', value: 'Заявки на бронирование аудиторий' },
    ],
  },
  admin: {
    name: 'Администратор AIU',
    role: 'Администратор системы',
    handle: '@admin_corp7',
    badge: 'ADMIN',
    email: null,
    details: [
      { label: 'Подразделение', value: 'Департамент диспетчеризации и расписания' },
      { label: 'Корпус', value: 'Корпус 7' },
      { label: 'Права доступа', value: 'Управление заявками и аудиториями корпуса 7' },
      { label: 'Уровень доступа', value: 'Администратор' },
    ],
  },
};

function UserProfilePage({ role }) {
  const profile = USER_PROFILES[role] || USER_PROFILES.student;

  return (
    <section className="user-profile-page" aria-labelledby="user-profile-title">
      <header className="user-profile-page-header">
        <span className="info-page-kicker">Учётная запись AIU</span>
        <h1 id="user-profile-title">Мой профиль</h1>
        <p>Основная информация об учётной записи и доступе в системе бронирования.</p>
      </header>

      <article className="user-profile-card">
        <div className="user-profile-identity">
          <div className="user-profile-avatar">
            <img src={icon} alt="" />
          </div>
          <div>
            <span className={`user-profile-role ${role}`}>{profile.role}</span>
            <div className="user-profile-name-row">
              <h2>{profile.name}</h2>
              {profile.badge && <span className="profile-admin-badge">{profile.badge}</span>}
            </div>
            <p>{profile.handle}</p>
          </div>
        </div>

        <div className="user-profile-details">
          <div className="user-profile-detail email">
            <span>Корпоративная почта</span>
            <strong>{profile.email || 'Не указана в демо-профиле'}</strong>
            {profile.emailNote && <small>{profile.emailNote}</small>}
          </div>
          {profile.details.map((item) => (
            <div className="user-profile-detail" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>

        <p className="user-profile-demo-note">
          Демонстрационные данные интерфейса. Профиль пока не загружается из учётной записи
          или базы данных.
        </p>
      </article>
    </section>
  );
}

export default UserProfilePage;
