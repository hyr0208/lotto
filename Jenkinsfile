pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        APP_NAME = 'lotto'
        APP_PORT = '3007'
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    pm2 delete $APP_NAME || true
                    pm2 serve dist $APP_PORT --name $APP_NAME --spa
                    pm2 save
                '''
            }
        }
    }

    post {
        success {
            echo "배포 완료: http://lotto.yyyerin.co.kr"
        }
        failure {
            echo "배포 실패. 로그를 확인하세요."
        }
    }
}
