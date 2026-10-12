CREATE TABLE floors (
   id SERIAL PRIMARY KEY,
   floor_number INT NOT NULL UNIQUE
);

CREATE TABLE rooms (
   id SERIAL PRIMARY KEY,
   floor_id INT REFERENCES floors(id) ON DELETE CASCADE,
   room_number VARCHAR(20) NOT NULL,
   room_type VARCHAR(60),
   status VARCHAR(20) DEFAULT 'free'
);

CREATE TABLE bookings (
   id SERIAL PRIMARY KEY,
   room_id INT REFERENCES rooms(id) ON DELETE CASCADE,
   user_name VARCHAR(100) NOT NULL,
   start_time TIMESTAMP NOT NULL,
   end_time TIMESTAMP NOT NULL,  
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 