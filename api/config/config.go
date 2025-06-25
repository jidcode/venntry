package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Variables struct {
	DatabaseUrl        string
	RedisUrl           string
	JWTSecret          string
	Environment        string
	Domain             string
	CSRFCookieDomain   string
	RateLimitPerMinute int
}

func LoadEnv() *Variables {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Failed to load environmental variables: %s", err)
	}

	env := os.Getenv("APP_ENV")
	if env == "" {
		env = "development"
	}

	config := &Variables{
		DatabaseUrl:        os.Getenv("DATABASE_URL"),
		RedisUrl:           os.Getenv("REDIS_URL"),
		JWTSecret:          os.Getenv("JWT_SECRET"),
		Environment:        env,
		Domain:             os.Getenv("DOMAIN"),
		CSRFCookieDomain:   os.Getenv("CSRF_COOKIE_DOMAIN"),
		RateLimitPerMinute: 60,
	}

	return config
}
