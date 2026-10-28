package main 

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

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

	   log.Printf("Новая бронь: RoomID=%d, User=%s, From=%s, To=%s",
		   req.RoomID, req.UserName, req.StartTime, req.EndTime,
	   )

	   w.Header().Set("Content-Type", "application/json")
	   w.WriteHeader(http.StatusCreated)
	   w.NewEncoder(w).Encode(map[string]string{
		       "status": "success",
		       "message": "Бронь успешно создана!",
	   })
	})

	fmt.Println("Server is running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
