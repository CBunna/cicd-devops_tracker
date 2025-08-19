# DevOps Learning Tracker

A full-stack web application for tracking DevOps learning progress with topics, categories, and status management.

## Architecture

- **Frontend**: React.js with modern UI components
- **Backend**: Node.js with Express.js REST API
- **Database**: PostgreSQL with Docker
- **Containerization**: Docker & Docker Compose
- **CI/CD**: Jenkins pipeline ready

## Features

- ✅ Track learning topics with categories and status
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Filter by category and status
- ✅ Responsive web interface
- ✅ RESTful API
- ✅ Database persistence

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd devops-tracker
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:5002
   - Database: localhost:5432

## API Endpoints

### Topics
- `GET /api/topics` - Get all topics (with optional filters)
- `GET /api/topics/:id` - Get specific topic
- `POST /api/topics` - Create new topic
- `PUT /api/topics/:id` - Update topic
- `DELETE /api/topics/:id` - Delete topic

### Health Check
- `GET /api/health` - API health status

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_DB` | Database name | `devops_tracker` |
| `POSTGRES_USER` | Database user | `postgres` |
| `POSTGRES_PASSWORD` | Database password | `postgres` |
| `NODE_ENV` | Environment | `development` |
| `PORT` | Backend port | `5002` |
| `REACT_APP_API_URL` | Frontend API URL | `http://localhost:5002` |

## Development

### Local Development Setup

1. **Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Database**
   ```bash
   docker-compose up -d database
   ```

### Docker Development

```bash
# Build and start all services
docker-compose up --build

# Restart specific service
docker-compose restart backend

# View logs
docker-compose logs -f backend
```

## Production Deployment

1. **Set production environment**
   ```bash
   cp .env.example .env.production
   # Edit with production values
   ```

2. **Build and deploy**
   ```bash
   NODE_ENV=production docker-compose -f docker-compose.yml up -d
   ```

## CI/CD with Jenkins

This project includes a Jenkinsfile for automated CI/CD:

- **Build**: Docker image building
- **Test**: Run unit tests
- **Deploy**: Automated deployment
- **Notifications**: Build status updates

### Jenkins Setup

1. Create new Pipeline project in Jenkins
2. Set Git repository URL
3. Set branch to build (main/master)
4. Pipeline script from SCM
5. Configure environment variables in Jenkins

## Security Considerations

- ✅ No hardcoded passwords in repository
- ✅ Environment variables for sensitive data
- ✅ .gitignore excludes .env files
- ✅ Database credentials externalized
- 🚧 Add HTTPS in production
- 🚧 Implement authentication/authorization
- 🚧 Add input validation and sanitization

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License.

## Troubleshooting

### Common Issues

**Database connection failed**
```bash
docker-compose down -v
docker-compose up -d
```

**Port conflicts**
- Change ports in docker-compose.yml
- Update .env file accordingly

**Build failures**
- Check Docker daemon is running
- Verify all files exist
- Check .env configuration

## Support

For issues and questions:
1. Check existing GitHub issues
2. Create new issue with detailed description
3. Include logs and environment details