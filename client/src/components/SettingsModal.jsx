function SettingsModal({
  settings,
  onChange,
  onReset,
  onClose,
}) {
  const updateSetting = (key, value) => onChange({ ...settings, [key]: value });

  return (
    <div className="settings-overlay" onMouseDown={onClose}>
      <div
        className="settings-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="settings-modal-header">
          <div>
            <span className="settings-kicker">ПАРАМЕТРЫ ИНТЕРФЕЙСА</span>
            <h2 id="settings-title">Настройки</h2>
          </div>
          <button type="button" className="close-modal-btn" aria-label="Закрыть" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="settings-section">
          <div className="settings-section-heading">
            <strong>Язык интерфейса</strong>
            <span>Выберите основной язык</span>
          </div>
          <div className="settings-language-list" role="radiogroup" aria-label="Язык интерфейса">
            {[
              ['KZ', 'Қазақша'],
              ['RU', 'Русский'],
              ['EN', 'English'],
            ].map(([code, label]) => (
              <button
                key={code}
                type="button"
                role="radio"
                aria-checked={settings.language === code}
                className={settings.language === code ? 'active' : ''}
                onClick={() => updateSetting('language', code)}
              >
                <strong>{code}</strong>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-heading">
            <strong>Оформление</strong>
            <span>Настройте внешний вид приложения</span>
          </div>
          <div className="settings-theme-list" role="radiogroup" aria-label="Тема оформления">
            {[
              ['light', 'Светлая'],
              ['dark', 'Тёмная'],
            ].map(([theme, label]) => (
              <button
                key={theme}
                type="button"
                role="radio"
                aria-checked={settings.theme === theme}
                className={settings.theme === theme ? 'active' : ''}
                onClick={() => updateSetting('theme', theme)}
              >
                <span className={`settings-theme-preview ${theme}`} aria-hidden="true">
                  <i /><i /><i />
                </span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="settings-section settings-options">
          <label className="settings-option-row">
            <span>
              <strong>Компактный режим</strong>
              <small>Уменьшает отступы и высоту элементов</small>
            </span>
            <input
              type="checkbox"
              checked={settings.compact}
              onChange={(event) => updateSetting('compact', event.target.checked)}
            />
          </label>
          <label className="settings-option-row">
            <span>
              <strong>Уведомления</strong>
              <small>Показывать уведомления о бронированиях</small>
            </span>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(event) => updateSetting('notifications', event.target.checked)}
            />
          </label>
        </div>

        <div className="settings-modal-footer">
          <button type="button" className="settings-reset-btn" onClick={onReset}>
            Сбросить
          </button>
          <button type="button" className="settings-save-btn" onClick={onClose}>
            Готово
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
