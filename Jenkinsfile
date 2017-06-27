pipeline {
    agent { docker 'docker' }
    stages {
        stage('build') {
            steps {
                sh 'docker build -t test .'
            }
        }
        stage('test') {
          steps {
            sh 'docker run test'
          }
        }
    }
}
