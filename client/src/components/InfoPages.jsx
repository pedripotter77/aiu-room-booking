function RulesPage({ onBackToRooms }) {
  return (
    <section className="info-page" aria-labelledby="rules-title">
      <div className="info-page-header">
        <span className="info-page-kicker">Корпус 7</span>
        <h1 id="rules-title">Правила бронирования кабинетов</h1>
        <p>Базовые правила для работы с аудиториями Astana International University.</p>
      </div>

      <div className="rules-grid">
        <article className="info-card">
          <h2>1. Бронируйте только свободное время</h2>
          <p>Кабинет можно бронировать только на свободный учебный слот. Занятые и уже забронированные аудитории недоступны.</p>
        </article>
        <article className="info-card">
          <h2>2. Указывайте реальную цель</h2>
          <p>В заявке укажите название мероприятия, учебной дисциплины или работы и ответственного преподавателя или студенческую группу.</p>
        </article>
        <article className="info-card">
          <h2>3. Соблюдайте время бронирования</h2>
          <p>Пользование кабинетом начинается и заканчивается в указанное время. Не задерживайте следующую занятую группу.</p>
        </article>
        <article className="info-card">
          <h2>4. Берегите имущество аудитории</h2>
          <p>Не повреждайте мебель и технику, не перемещайте оборудование без разрешения и оставляйте кабинет в чистом состоянии.</p>
        </article>
        <article className="info-card">
          <h2>5. Соблюдайте академические правила</h2>
          <p>Кабинет используется по назначению: для занятий, консультаций, встреч и учебных мероприятий. Запрещено мешать другим группам и нарушать режим университета.</p>
        </article>
        <article className="info-card">
          <h2>6. Сообщайте об изменениях</h2>
          <p>Если мероприятие отменено или перенесено, своевременно сообщите диспетчерской или отмените бронирование, чтобы освободить аудиторию для других пользователей.</p>
        </article>
      </div>

      <button className="back-to-rooms-btn" type="button" onClick={onBackToRooms}>
        Вернуться к кабинетам
      </button>
    </section>
  );
}

function ContactsPage({ onBackToRooms }) {
  return (
    <section className="info-page" aria-labelledby="contacts-title">
      <div className="info-page-header">
        <span className="info-page-kicker">Контакты</span>
        <h1 id="contacts-title">Диспетчерская и деканат</h1>
        <p>Нужен номер диспетчерской или хотите связаться с деканатом? Мы собрали основные контакты здесь.</p>
      </div>

      <div className="contact-grid">
        <article className="contact-card">
          <div className="contact-icon" aria-hidden="true">☎</div>
          <div>
            <h2>Диспетчерская</h2>
            <p className="dispatcher-phone">+7 (7172) 47-66-77</p>
            <p>Позвоните диспетчерской для уточнения бронирования или состояния кабинета.</p>
          </div>
        </article>

        <article className="contact-card">
          <div className="contact-icon" aria-hidden="true">✉</div>
          <div>
            <h2>Деканат</h2>
            <a className="contact-link" href="https://aiu.kz/" target="_blank" rel="noreferrer">
              Связаться с деканатом на aiu.kz
            </a>
            <p>У AIU есть 6 высших школ. Для связи выберите нужную высшую школу и деканат на официальном сайте университета.</p>
          </div>
        </article>
      </div>

      <button className="back-to-rooms-btn" type="button" onClick={onBackToRooms}>
        Вернуться к кабинетам
      </button>
    </section>
  );
}

export { RulesPage, ContactsPage };