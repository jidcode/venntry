package cache

import (
	"context"

	"github.com/go-redis/redis_rate/v10"
	"github.com/labstack/echo/v4/middleware"
	"github.com/redis/go-redis/v9"
)

type rateLimiterStore struct {
	limiter *redis_rate.Limiter
}

func NewRateLimiterStore(redisURL string) middleware.RateLimiterStore {
	opt, err := redis.ParseURL(redisURL)
	if err != nil {
		panic(err)
	}

	rdb := redis.NewClient(opt)
	limiter := redis_rate.NewLimiter(rdb)

	return &rateLimiterStore{
		limiter: limiter,
	}
}

func (store *rateLimiterStore) Allow(identifier string) (bool, error) {
	res, err := store.limiter.Allow(context.Background(), identifier, redis_rate.PerMinute(60))
	if err != nil {
		return false, err
	}
	return res.Allowed > 0, nil
}
