package cache

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"github.com/redis/go-redis/v9"
	"github.com/venntry/pkg/logger"
)

func NewRedisCache(redisURL string) *RedisCache {
	opt, err := redis.ParseURL(redisURL)
	if err != nil {
		logger.Fatal("Failed to parse Redis URL", logger.Field("error", err.Error()))
	}

	client := redis.NewClient(opt)

	if err := client.Ping(context.Background()).Err(); err != nil {
		logger.Fatal("Failed to connect to Redis", logger.Field("error", err.Error()))
	}

	logger.Info("Redis connected!",
		logger.Field("redis_url", redisURL))

	return &RedisCache{
		client: client,
		ctx:    context.Background(),
	}
}

func (r *RedisCache) Get(key string, dest interface{}) error {
	val, err := r.client.Get(r.ctx, key).Bytes()
	if err == redis.Nil {
		return ErrCacheMiss
	} else if err != nil {
		return err
	}

	return json.Unmarshal(val, dest)
}

func (r *RedisCache) Set(key string, value interface{}, expiration time.Duration) error {
	jsonData, err := json.Marshal(value)
	if err != nil {
		return err
	}

	return r.client.Set(r.ctx, key, jsonData, expiration).Err()
}

func (r *RedisCache) Delete(key string) error {
	return r.client.Del(r.ctx, key).Err()
}

func (r *RedisCache) Close() error {
	return r.client.Close()
}

var ErrCacheMiss = errors.New("cache miss")
