package cloudflare

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"mime"
	"net/url"
	"path/filepath"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
)

type R2Config struct {
	AccountID       string
	AccessKeyID     string
	AccessKeySecret string
	BucketName      string
	PublicURL       string // e.g., "https://pub-<hash>.r2.dev" or your custom domain
}

type R2Service struct {
	client *s3.Client
	config R2Config
}

func NewR2Service(cfg R2Config) (*R2Service, error) {
	r2Resolver := aws.EndpointResolverWithOptionsFunc(func(service, region string, options ...interface{}) (aws.Endpoint, error) {
		return aws.Endpoint{
			URL: fmt.Sprintf("https://%s.r2.cloudflarestorage.com", cfg.AccountID),
		}, nil
	})

	awsCfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithEndpointResolverWithOptions(r2Resolver),
		config.WithCredentialsProvider(aws.CredentialsProviderFunc(func(ctx context.Context) (aws.Credentials, error) {
			return aws.Credentials{
				AccessKeyID:     cfg.AccessKeyID,
				SecretAccessKey: cfg.AccessKeySecret,
			}, nil
		}),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to load R2 configuration: %w", err)
	}

	client := s3.NewFromConfig(awsCfg)
	return &R2Service{
		client: client,
		config: cfg,
	}, nil
}

func (s *R2Service) UploadImage(ctx context.Context, file io.Reader, filename string) (*UploadResult, error) {
	// Generate a unique file key
	ext := filepath.Ext(filename)
	contentType := mime.TypeByExtension(ext)
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	fileKey := fmt.Sprintf("products/%s%s", uuid.New().String(), ext)

	// Read the file into a buffer
	var buf bytes.Buffer
	if _, err := io.Copy(&buf, file); err != nil {
		return nil, fmt.Errorf("failed to read file: %w", err)
	}

	// Upload to R2
	_, err := s.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(s.config.BucketName),
		Key:         aws.String(fileKey),
		Body:        bytes.NewReader(buf.Bytes()),
		ContentType: aws.String(contentType),
		ACL:         "public-read", // Make the object publicly accessible
	})
	if err != nil {
		return nil, fmt.Errorf("failed to upload to R2: %w", err)
	}

	// Construct the public URL
	publicURL := fmt.Sprintf("%s/%s", s.config.PublicURL, fileKey)

	return &UploadResult{
		FileKey: fileKey,
		URL:     publicURL,
	}, nil
}

func (s *R2Service) DeleteImage(ctx context.Context, fileKey string) error {
	_, err := s.client.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: aws.String(s.config.BucketName),
		Key:    aws.String(fileKey),
	})
	return err
}

type UploadResult struct {
	FileKey string
	URL     string
}