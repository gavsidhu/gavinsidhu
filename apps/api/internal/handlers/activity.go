package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gavsidhu/gavinsidhu.com/internal/models"
	"github.com/gavsidhu/gavinsidhu.com/internal/repository"
	"github.com/gavsidhu/gavinsidhu.com/internal/utils"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ActivityHandler struct {
	repo *repository.ActivityRepository
}

func NewActivityHandler(pool *pgxpool.Pool, activityChan chan string) *ActivityHandler {
	return &ActivityHandler{
		repo: repository.NewActivityRepository(pool, activityChan),
	}
}

func (h *ActivityHandler) AddActivity(w http.ResponseWriter, r *http.Request) {
	var activity models.CreateActivity

	err := json.NewDecoder(r.Body).Decode(&activity)
	defer r.Body.Close()

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(utils.ErrorResponse{Error: "Invalid request data"})
		return
	}

	switch activity.Type {
	case "save":
		activity.Message = fmt.Sprintf("I saved %s for later", activity.Title)
	case "read":
		activity.Message = fmt.Sprintf("I read %s", activity.Title)
	}

	if err = h.repo.AddActivity(r.Context(), activity); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(utils.ErrorResponse{Error: "Invalid request data"})
	}

	w.WriteHeader(http.StatusOK)
}

func (h *ActivityHandler) GetAllActivity(w http.ResponseWriter, r *http.Request) {
	defaultPage := 1
	defaultPageSize := 10

	queryValues := r.URL.Query()

	pageStr := queryValues.Get("page")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = defaultPage
	}

	pageSizeStr := queryValues.Get("pageSize")
	pageSize, err := strconv.Atoi(pageSizeStr)
	if err != nil || pageSize < 1 {
		pageSize = defaultPageSize
	}

	activities, err := h.repo.GetAllActivity(r.Context(), page, pageSize)
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	totalCount, err := h.repo.GetTotalActivityCount(r.Context())
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	result := struct {
		Activities []models.Activity `json:"activities"`
		TotalCount int               `json:"totalCount"`
	}{
		Activities: activities,
		TotalCount: totalCount,
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(result); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (h *ActivityHandler) SearchActivity(w http.ResponseWriter, r *http.Request) {
	var searchReq models.SearchRequest

	err := json.NewDecoder(r.Body).Decode(&searchReq)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	activities, err := h.repo.SearchActivity(r.Context(), searchReq.Query)
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(activities); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (h *ActivityHandler) SSEHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "data: %s\n\n", "connection established")
	flusher.Flush()

	for {
		select {
		case message, ok := <-h.repo.ActivityChan:
			if !ok {
				log.Println("not ok")
				return
			}
			log.Println(message)
			fmt.Fprintf(w, "data: %s\n\n", message)
			flusher.Flush()
		case <-r.Context().Done():
			return
		}
	}
}
