package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/aws/aws-lambda-go/events"
	"github.com/gavsidhu/gavinsidhu.com/internal/models"
	"github.com/gavsidhu/gavinsidhu.com/internal/repository"
	"github.com/gavsidhu/gavinsidhu.com/internal/utils"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ActivityHandler struct {
	repo *repository.ActivityRepository
}

func NewActivityHandler(pool *pgxpool.Pool) *ActivityHandler {
	return &ActivityHandler{
		repo: repository.NewActivityRepository(pool),
	}
}

func (h *ActivityHandler) LambdaHandler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	switch request.HTTPMethod {
	case "GET":
		if request.Path == "/activity" {
			return h.GetAllActivity(ctx, request)
		}
	case "POST":
		if request.Path == "/activity" {
			return h.AddActivity(ctx, request)
		}

		if request.Path == "/activity/search" {
			return h.SearchActivity(ctx, request)
		}
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusMethodNotAllowed,
		Body:       http.StatusText(http.StatusMethodNotAllowed),
	}, nil
}

func (h *ActivityHandler) AddActivity(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	token := request.Headers["Authorization"]

	expectedToken := os.Getenv("AUTH_TOKEN")
	if token != expectedToken {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusUnauthorized,
			Body:       "{\"error\":\"Unauthorized\"}",
			Headers:    map[string]string{"Content-Type": "application/json"},
		}, nil
	}

	var activity models.CreateActivity

	err := json.Unmarshal([]byte(request.Body), &activity)

	if err != nil {
		errorResponse, _ := json.Marshal(utils.ErrorResponse{Error: "Error unmarshaling data: " + err.Error()})
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       string(errorResponse),
			Headers:    map[string]string{"Content-Type": "application/json"},
		}, nil
	}

	switch activity.Type {
	case "save":
		activity.Message = fmt.Sprintf("I saved %s for later", activity.Title)
	case "read":
		activity.Message = fmt.Sprintf("I read %s", activity.Title)
	}

	if err = h.repo.AddActivity(ctx, activity); err != nil {
		errorResponse, _ := json.Marshal(utils.ErrorResponse{Error: "There was an error: " + err.Error()})
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       string(errorResponse),
			Headers:    map[string]string{"Content-Type": "application/json"},
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Body:       "Activity added successfully",
		Headers:    map[string]string{"Content-Type": "application/json"},
	}, nil
}

func (h *ActivityHandler) GetAllActivity(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	token := request.Headers["Authorization"]

	expectedToken := os.Getenv("AUTH_TOKEN")
	if token != expectedToken {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusUnauthorized,
			Body:       "{\"error\":\"Unauthorized\"}",
			Headers:    map[string]string{"Content-Type": "application/json"},
		}, nil
	}

	defaultPage := 1
	defaultPageSize := 10

	queryValues := request.QueryStringParameters

	pageStr := queryValues["page"]
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = defaultPage
	}

	pageSizeStr := queryValues["pageSize"]
	pageSize, err := strconv.Atoi(pageSizeStr)
	if err != nil || pageSize < 1 {
		pageSize = defaultPageSize
	}

	activities, err := h.repo.GetAllActivity(ctx, page, pageSize)
	if err != nil {
		errorResponse, _ := json.Marshal(utils.ErrorResponse{Error: "There was an error: " + err.Error()})
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       string(errorResponse),
			Headers:    map[string]string{"Content-Type": "application/json"},
		}, nil
	}

	totalCount, err := h.repo.GetTotalActivityCount(ctx)
	if err != nil {
		errorResponse, _ := json.Marshal(utils.ErrorResponse{Error: "There was an error: " + err.Error()})
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       string(errorResponse),
			Headers:    map[string]string{"Content-Type": "application/json"},
		}, nil
	}

	result := struct {
		Activities []models.Activity `json:"activities"`
		TotalCount int               `json:"totalCount"`
	}{
		Activities: activities,
		TotalCount: totalCount,
	}

	jsonResult, err := json.Marshal(result)
	if err != nil {
		errorResponse, _ := json.Marshal(utils.ErrorResponse{Error: "There was an error marshaling data: " + err.Error()})
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       string(errorResponse),
			Headers:    map[string]string{"Content-Type": "application/json"},
		}, nil

	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Body:       string(jsonResult),
		Headers:    map[string]string{"Content-Type": "application/json"},
	}, nil
}

func (h *ActivityHandler) SearchActivity(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	token := request.Headers["Authorization"]

	expectedToken := os.Getenv("AUTH_TOKEN")
	if token != expectedToken {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusUnauthorized,
			Body:       "{\"error\":\"Unauthorized\"}",
			Headers:    map[string]string{"Content-Type": "application/json"},
		}, nil
	}

	var searchReq models.SearchRequest

	err := json.Unmarshal([]byte(request.Body), &searchReq)
	if err != nil {
		errorResponse, _ := json.Marshal(utils.ErrorResponse{Error: "Error unmarshaling data: " + err.Error()})
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       string(errorResponse),
			Headers:    map[string]string{"Content-Type": "application/json"},
		}, nil

	}

	activities, err := h.repo.SearchActivity(ctx, searchReq.Query)
	if err != nil {
		errorResponse, _ := json.Marshal(utils.ErrorResponse{Error: "There was an error: " + err.Error()})
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       string(errorResponse),
			Headers:    map[string]string{"Content-Type": "application/json"},
		}, nil
	}

	jsonResult, err := json.Marshal(activities)
	if err != nil {
		errorResponse, _ := json.Marshal(utils.ErrorResponse{Error: "There was an error marshaling data: " + err.Error()})
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       string(errorResponse),
			Headers:    map[string]string{"Content-Type": "application/json"},
		}, nil

	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Body:       string(jsonResult),
		Headers:    map[string]string{"Content-Type": "application/json"},
	}, nil

}
