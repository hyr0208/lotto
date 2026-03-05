pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'lotto'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    sh '''
                        docker build \
                            -t ${DOCKER_IMAGE}:latest .
                    '''
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    // Stop existing container
                    sh 'docker stop lotto || true'
                    sh 'docker rm lotto || true'
                    
                    // Run new container
                    sh '''
                        docker run -d \
                            --name lotto \
                            --restart unless-stopped \
                            -p 3007:80 \
                            ${DOCKER_IMAGE}:latest
                    '''
                }
            }
        }
        
        stage('Cleanup') {
            steps {
                script {
                    // Remove dangling images
                    sh 'docker image prune -f'
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Lotto 배포 성공! http://lotto.yyyerin.co.kr'
        }
        failure {
            echo '❌ 배포 실패'
        }
    }
}
