pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'cp /var/jenkins_home/project_secrets/website-backend/.env ./'
                sh 'docker build -t sysumsc/website-backend:latest .'
            }
        }
        stage('Deploy') {
            steps {
                node('docker-host') {
                    script {
                        sh 'docker-compose -f /home/sysumsc/services/docker-compose.yml up --build -d website-backend'
                    }
                }
            }
        }
    }
}
