pipeline {
    agent any
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
