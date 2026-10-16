package main 

import (
	"encoding/json"
	"net/http"
)

type Message struct {
	Status string `json:"status"`
	Message string `json:"message"`
}

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		response := Message{
			Status: "success",
			Message: "Добро пожаловать в бэкэнд системы бронирования аудиторий!",
		}

		json.NewEncoder(w).Encode(response)
	})

	println("Server is running on http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}