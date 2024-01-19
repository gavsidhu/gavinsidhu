package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gavsidhu/gavinsidhu.com/internal"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("error loading env variables")
		return
	}

	dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to create connection pool: %v\n", err)
		os.Exit(1)
	}

	defer dbpool.Close()

	activityChan := make(chan string)

	r := chi.NewRouter()
	r.Use(middleware.Logger)

	internal.SetupRoutes(r, context.Background(), dbpool, activityChan)

	log.Fatal(http.ListenAndServe(":3333", r))

}
