package main 

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/joho/godotenv"
)

var db *sql.DB

type Message struct {
	Status string `json:"status"`
	Message string `json:"message"`
}

type Room struct {
	ID   int    `json:"id"`
	FloorID int   `json:"floor_id"`
	RoomNumber string `json:"room_number"`
	RoomType string `json:"room_type"`
	Status string `json:"status"`
}

type BookingRequest struct {
	RoomID    int    `json:"room_id"`
	UserName    string    `json:"user_name"`
	StartTime string `json:"start_time"`
	EndTime   string `json:"end_time"`
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	connStr := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=disable",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)

	db, err = sql.Open("pgx", connStr)
	if err != nil {
		log.Fatal("Error connecting to the database: %v", err)
	}
	defer db.Close()

	if err = db.Ping(); err != nil {
		log.Fatal("Error pinging the database: %v", err)
	}
	fmt.Println("Successfully connected to the database!")

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		
		w.Header().Set("Content-Type", "application/json")

		response := Message{
			Status: "success",
			Message: "Бэкенд успешно подключен к базе данных через .env!",
		}

		json.NewEncoder(w).Encode(response)
	})

	http.HandleFunc("/api/rooms", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		rows, err := db.Query("SELECT id, floor_id, room_number, room_type, status FROM rooms")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var rooms []Room

		for rows.Next() {
			var r Room
			err := rows.Scan(&r.ID, &r.FloorID, &r.RoomNumber, &r.RoomType, &r.Status)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			rooms = append(rooms, r)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(rooms)
	})

	http.HandleFunc("/api/bookings", func(w http.ResponseWriter, r *http.Request) {
       if r.Method != http.MethodPost {
		   http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		   return
	   }
	

	   var req BookingRequest 

	   err := json.NewDecoder(r.Body).Decode(&req)
	   if err != nil {
		   http.Error(w, "Invalid input data: "+ err.Error(), http.StatusBadRequest)
		   return
	   }

	   startTime, err1 := time.Parse("2006-01-02 15:04:05", req.StartTime)
	   endTime, err2 := time.Parse("2006-01-02 15:04:05", req.EndTime)
	   if err1 != nil || err2 != nil {
		   http.Error(w, "Invalid date format. Use YYYY-MM-DD HH:MM:SS", http.StatusBadRequest)
		   return
	   }

	   if !endTime.After(startTime) {
		   http.Error(w, "End time must be after start time", http.StatusBadRequest)
		   return
	   }

	   var existingID int
	   checkQuery := `SELECT id FROM bookings WHERE room_id = $1 AND start_time < $2 AND end_time > $3 LIMIT 1;`

	   err = db.QueryRow(checkQuery, req.RoomID, endTime, startTime).Scan(&existingID)
	   if err == nil {
		   http.Error(w, "Room is already booked for the selected time period", http.StatusConflict)
		   return
	   } else if err != sql.ErrNoRows {
		   http.Error(w, "Database error: " + err.Error(), http.StatusInternalServerError)
		   return
	   }

	   insertQuery := `INSERT INTO bookings (room_id, user_name, start_time, end_time) VALUES ($1, $2, $3, $4);`

	   _, err = db.Exec(insertQuery, req.RoomID, req.UserName, startTime, endTime)
	   if err != nil {
		   http.Error(w, "Failed to save booking: " + err.Error(), http.StatusInternalServerError)
		   return
	   }

	   log.Printf("Новая бронь: RoomID=%d, User=%s, From=%s, To=%s",
		   req.RoomID, req.UserName, req.StartTime, req.EndTime,
	   )

	   w.Header().Set("Content-Type", "application/json")
	   w.WriteHeader(http.StatusCreated)
	   json.NewEncoder(w).Encode(map[string]string{
		       "status": "success",
		       "message": "Бронь успешно создана!",
	   })
	})

	fmt.Println("Server is running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
