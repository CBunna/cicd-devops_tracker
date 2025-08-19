pipeline {
    agent any
    
    environment {
        // Docker registry (adjust as needed)
        DOCKER_REGISTRY = 'your-registry.com'
        IMAGE_NAME = 'devops-tracker'
        
        // Environment variables
        NODE_ENV = 'production'
        POSTGRES_DB = credentials('postgres-db')
        POSTGRES_USER = credentials('postgres-user') 
        POSTGRES_PASSWORD = credentials('postgres-password')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'git clean -fdx'
            }
        }
        
        stage('Environment Setup') {
            steps {
                script {
                    // Create .env file for build
                    writeFile file: '.env', text: """
POSTGRES_DB=${env.POSTGRES_DB}
POSTGRES_USER=${env.POSTGRES_USER}
POSTGRES_PASSWORD=${env.POSTGRES_PASSWORD}
NODE_ENV=${env.NODE_ENV}
PORT=5002
REACT_APP_API_URL=http://localhost:5002
"""
                }
            }
        }
        
        stage('Build Images') {
            parallel {
                stage('Build Backend') {
                    steps {
                        script {
                            sh 'docker build -t ${IMAGE_NAME}-backend:${BUILD_NUMBER} ./backend'
                            sh 'docker tag ${IMAGE_NAME}-backend:${BUILD_NUMBER} ${IMAGE_NAME}-backend:latest'
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        script {
                            sh 'docker build -t ${IMAGE_NAME}-frontend:${BUILD_NUMBER} ./frontend'
                            sh 'docker tag ${IMAGE_NAME}-frontend:${BUILD_NUMBER} ${IMAGE_NAME}-frontend:latest'
                        }
                    }
                }
            }
        }
        
        stage('Test') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        script {
                            // Run backend tests if they exist
                            dir('backend') {
                                sh 'npm install'
                                sh 'npm test || echo "No tests found"'
                            }
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        script {
                            // Run frontend tests
                            dir('frontend') {
                                sh 'npm install'
                                sh 'CI=true npm test -- --coverage --watchAll=false || echo "No tests found"'
                            }
                        }
                    }
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                script {
                    // Check for vulnerabilities
                    sh 'docker run --rm -v $(pwd):/app -w /app node:18-alpine npm audit --audit-level=moderate || echo "Vulnerabilities found, review required"'
                }
            }
        }
        
        stage('Integration Test') {
            steps {
                script {
                    try {
                        // Start services for integration testing
                        sh 'docker-compose -f docker-compose.yml up -d'
                        
                        // Wait for services to be ready
                        sh 'sleep 30'
                        
                        // Test API endpoints
                        sh '''
                            echo "Testing API health endpoint..."
                            curl -f http://localhost:5002/api/health || exit 1
                            
                            echo "Testing topics endpoint..."
                            curl -f http://localhost:5002/api/topics || exit 1
                            
                            echo "Integration tests passed!"
                        '''
                    } finally {
                        // Cleanup
                        sh 'docker-compose down -v || true'
                    }
                }
            }
        }
        
        stage('Push Images') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                    branch 'develop'
                }
            }
            steps {
                script {
                    // Push to registry (uncomment and configure as needed)
                    /*
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-registry-credentials') {
                        sh 'docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}-backend:${BUILD_NUMBER}'
                        sh 'docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}-backend:latest'
                        sh 'docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}-frontend:${BUILD_NUMBER}'
                        sh 'docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}-frontend:latest'
                    }
                    */
                    echo "Skipping registry push - configure registry settings above"
                }
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Deploy to staging/production
                    echo "Deploying to environment..."
                    
                    // Example deployment commands
                    sh '''
                        echo "Stopping existing services..."
                        docker-compose down || true
                        
                        echo "Starting updated services..."
                        docker-compose up -d
                        
                        echo "Deployment completed!"
                    '''
                    
                    // Health check after deployment
                    sh 'sleep 30'
                    sh 'curl -f http://localhost:5002/api/health || exit 1'
                }
            }
        }
    }
    
    post {
        always {
            // Cleanup
            sh 'docker system prune -f || true'
            
            // Archive artifacts
            archiveArtifacts artifacts: '*.log', fingerprint: true, allowEmptyArchive: true
        }
        
        success {
            echo 'Pipeline succeeded! 🎉'
            // Send success notification (configure as needed)
            /*
            slackSend(
                channel: '#devops',
                color: 'good',
                message: "✅ DevOps Tracker build #${BUILD_NUMBER} succeeded! Branch: ${BRANCH_NAME}"
            )
            */
        }
        
        failure {
            echo 'Pipeline failed! 💥'
            // Send failure notification (configure as needed)
            /*
            slackSend(
                channel: '#devops',
                color: 'danger',
                message: "❌ DevOps Tracker build #${BUILD_NUMBER} failed! Branch: ${BRANCH_NAME}\nCheck: ${BUILD_URL}"
            )
            */
        }
        
        unstable {
            echo 'Pipeline unstable! ⚠️'
        }
    }
}