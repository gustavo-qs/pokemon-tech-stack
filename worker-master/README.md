# Worker Boilerplate

A robust NestJS-based worker service boilerplate with SQS integration, structured using clean architecture principles.

## 🌟 Features

- Clean Architecture implementation
- AWS SQS integration for message processing
- Health check endpoints
- Comprehensive logging with Pino
- New Relic integration
- Docker support
- Terraform infrastructure setup
- Built with NestJS and TypeScript
- Testing setup with Jest
- Code quality tools (ESLint, Prettier)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- Docker and Docker Compose
- AWS CLI (for local development with LocalStack)
- Terraform (for infrastructure setup)

### Environment Setup

1. Copy the environment file:
```bash
cp .env.development .env
```

2. Configure the following environment variables:
```env
NEW_RELIC_ENABLED=FALSE
APP_NAME=WORKER BOILERPLATE
SUPPORT_DATASERVER_IP=0.0.0.0:50051
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_REGION=us-east-1
AWS_ENDPOINT_URL=https://localhost.localstack.cloud:4566
```

### Infrastructure Setup

1. Navigate to the infrastructure directory:
```bash
cd infra/terraform
```

2. Initialize and apply Terraform configuration:
```bash
terraform init
terraform plan
terraform apply
```

### Installation

```bash
# Install dependencies
yarn install

# Build the application
yarn build

# Start the development server
yarn start:dev
```

## 🏗️ Project Structure

```
├── src/
│   ├── core/               # Business logic and domain entities
│   ├── presentation/       # Controllers e modules
│   └── main.ts            # Application entry point
├── test/                  # Test files
├── infra/                 # Infrastructure configuration
└── docker-compose.yml     # Docker composition file
```

## 🛠️ Available Scripts

- `yarn build` - Build the application
- `yarn start:dev` - Start the development server
- `yarn test` - Run tests
- `yarn test:cov` - Run tests with coverage
- `yarn lint` - Lint the codebase
- `yarn format` - Format the codebase

## 🧪 Testing

The project includes both unit and integration tests:

```bash
# Run unit tests
yarn test

# Run tests with coverage
yarn test:cov

# Run e2e tests
yarn test:e2e
```

## 🐳 Docker Support

Build and run the application using Docker:

```bash
# Build the Docker image
docker build -t worker-boilerplate .

# Run the container
docker run -p 3000:3000 worker-boilerplate
```

## 📝 Health Checks

The application includes health check endpoints:

- `GET /healthcheck` - Check application health status

## 🔍 Message Processing

The worker processes messages from SQS queues:

- `process-message` queue - Receives messages for processing
- `message-processed` queue - Publishes processed message status

Sending a message to the `process-message` queue:

```bash
AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test aws --endpoint-url=http://localhost:4566 sqs send-message \
  --queue-url "http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/process-message" \
  --message-body '{"id": "test-123", "message": "Hello from terminal"}' \
  --region us-east-1
```

Checking message processing:

```bash
AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test aws --endpoint-url=http://localhost:4566 sqs receive-message \
  --queue-url "http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/message-processed" \
  --region us-east-1
```

## 📚 Documentation

For more detailed information about the infrastructure setup, refer to:
- [Infrastructure Documentation](infra/terraform/doc.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
