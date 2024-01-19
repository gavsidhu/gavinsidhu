package internal

import (
	"context"

	"github.com/gavsidhu/gavinsidhu.com/internal/handlers"
	"github.com/gavsidhu/gavinsidhu.com/internal/middlewares"
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

func SetupRoutes(r chi.Router, ctx context.Context, pool *pgxpool.Pool, activityChan chan string) {

	activityHandler := handlers.NewActivityHandler(pool, activityChan)

	r.Route("/activity", func(r chi.Router) {
		r.Use(middlewares.AuthMiddleware)
		r.Get("/", activityHandler.GetAllActivity)
		r.Post("/", activityHandler.AddActivity)
		r.Post("/search", activityHandler.SearchActivity)
		r.Get("/sse", activityHandler.SSEHandler)
	})

}
