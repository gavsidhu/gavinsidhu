package repository

import (
	"context"

	"github.com/gavsidhu/gavinsidhu.com/internal/models"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ActivityRepository struct {
	DB           *pgxpool.Pool
	ActivityChan chan string
}

func NewActivityRepository(pool *pgxpool.Pool, activityChan chan string) *ActivityRepository {
	return &ActivityRepository{
		DB:           pool,
		ActivityChan: activityChan,
	}
}

func (r *ActivityRepository) AddActivity(ctx context.Context, activity models.CreateActivity) error {
	_, err := r.DB.Exec(ctx, "INSERT INTO activity (title, type, url, message) VALUES($1, $2, $3, $4)", activity.Title, activity.Type, activity.Url, activity.Message)
	if err != nil {
		return err
	}

	go func() {
		r.ActivityChan <- "refresh"
	}()

	return nil
}

func (r *ActivityRepository) GetAllActivity(ctx context.Context, page int, pageSize int) ([]models.Activity, error) {
	offset := (page - 1) * pageSize
	rows, err := r.DB.Query(ctx, "SELECT id, title, type, url, message, created_at, updated_at FROM activity LIMIT $1 OFFSET $2", pageSize, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var activities []models.Activity
	for rows.Next() {
		var activity models.Activity
		err := rows.Scan(&activity.ID, &activity.Title, &activity.Type, &activity.Url, &activity.Message, &activity.CreatedAt, &activity.UpdatedAt)
		if err != nil {
			return nil, err
		}
		activities = append(activities, activity)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return activities, nil
}

func (r *ActivityRepository) GetTotalActivityCount(ctx context.Context) (int, error) {
	var count int
	query := `SELECT COUNT(*) FROM activity`
	err := r.DB.QueryRow(ctx, query).Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}

func (r *ActivityRepository) SearchActivity(ctx context.Context, searchQuery string) ([]models.Activity, error) {
	rows, err := r.DB.Query(ctx, "SELECT id, title, type, url, message, created_at, updated_at FROM activity WHERE ts @@ to_tsquery('english', $1 || ':*')", searchQuery)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var activities []models.Activity
	for rows.Next() {
		var activity models.Activity
		err := rows.Scan(&activity.ID, &activity.Title, &activity.Type, &activity.Url, &activity.Message, &activity.CreatedAt, &activity.UpdatedAt)
		if err != nil {
			return nil, err
		}
		activities = append(activities, activity)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return activities, nil
}
