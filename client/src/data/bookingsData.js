function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const INITIAL_BOOKINGS = [
  {
    id: 'demo-pending-1',
    teacher: 'Сергей Сергеев',
    roomId: 706,
    roomNumber: 'Кабинет 706',
    date: getToday(),
    slotIndex: 0,
    slot: '1 пара (08:30 – 09:20)',
    purpose: 'Семинар по высшей математике',
    assignee: 'ИС 24-А',
    status: 'pending',
    rejectionReason: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-approved-1',
    teacher: 'Сергей Сергеев',
    roomId: 404,
    roomNumber: 'Кабинет 404',
    date: getToday(),
    slotIndex: 3,
    slot: '4 пара (11:30 – 12:20)',
    purpose: 'Лекция по информатике',
    assignee: 'ИС 24-А',
    status: 'approved',
    rejectionReason: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-rejected-1',
    teacher: 'Сергей Сергеев',
    roomId: 302,
    roomNumber: 'Кабинет 302',
    date: getToday(),
    slotIndex: 1,
    slot: '2 пара (09:30 – 10:20)',
    purpose: 'Практическое занятие по программированию',
    assignee: 'ПО 23-Б',
    status: 'rejected',
    rejectionReason: 'В это время в кабинете запланирован мастер-класс.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-pending-2',
    teacher: 'Анна Ким',
    roomId: 501,
    roomNumber: 'Кабинет 501',
    date: getToday(),
    slotIndex: 0,
    slot: '1 пара (08:30 – 09:20)',
    purpose: 'Научный семинар',
    assignee: 'Кафедра педагогики',
    status: 'pending',
    rejectionReason: '',
    createdAt: new Date().toISOString(),
  },
];
