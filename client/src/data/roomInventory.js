import ROOMS_DATA from './roomsData';

export const BUILDING_FLOORS = Array.from({ length: 10 }, (_, index) => index + 2);

export const ROOM_TYPES = [
  'Обычный класс',
  'Лекционный класс',
  'Компьютерный класс',
];

export const DEFAULT_ROOM_SCHEDULE = [
  '1 пара (08:30 – 09:20)',
  '2 пара (09:30 – 10:20)',
  '3 пара (10:30 – 11:20)',
  '4 пара (11:30 – 12:20)',
  '5 пара (12:50 – 13:40)',
  '6 пара (13:50 – 14:40)',
].map((slot) => ({
  slot,
  status: 'free',
  note: 'СВОБОДНО (ДОСТУПНО К ЗАКРЕПЛЕНИЮ)',
}));

export function createInitialRoomInventory() {
  const knownRooms = new Map(
    ROOMS_DATA.map((room) => [room.id, { ...room, configured: true, deleted: false }])
  );
  const inventory = [];

  BUILDING_FLOORS.forEach((floor) => {
    for (let roomNumber = 1; roomNumber <= 9; roomNumber += 1) {
      const id = floor * 100 + roomNumber;
      const knownRoom = knownRooms.get(id);
      if (knownRoom) {
        inventory.push(knownRoom);
        knownRooms.delete(id);
        continue;
      }

      inventory.push({
        id,
        number: `Кабинет ${id}`,
        type: id % 10 === 6 ? 'Лекционный класс' : 'Не указано',
        category: 'unconfigured',
        statusLabel: 'Не добавлен',
        status: 'Нет данных о состоянии кабинета',
        floor,
        capacity: 30,
        schedule: [],
        configured: false,
        deleted: false,
      });
    }
  });

  knownRooms.forEach((room) => {
    inventory.push({ ...room, legacyNumber: true });
  });

  return inventory;
}

export function createRoomSchedule() {
  return DEFAULT_ROOM_SCHEDULE.map((slot) => ({ ...slot }));
}
