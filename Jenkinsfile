pipeline {
	agent any
		stages {
			stage('build') {
				steps {
					ansiColor('xterm') {
						node create-Dockerfile.js > Dockerfile
						sh 'docker build -t test .'
					}
				}
			}
			stage('test') {
				steps {
					ansiColor('xterm') {
						sh 'docker run test'
					}
				}
			}
		}
}
