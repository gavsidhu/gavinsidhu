package models

import "time"

type Activity struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Type      string    `json:"type"`
	Url       string    `json:"url"`
	Message   string    `json:"message"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type CreateActivity struct {
	Title   string `json:"title"`
	Type    string `json:"type"`
	Url     string `json:"url"`
	Message string `json:"message"`
}

type SearchRequest struct {
	Query string `json:"query"`
}
