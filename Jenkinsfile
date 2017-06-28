pipeline {
	agent any
		stages {
			stage('build') {
				steps {
					ansiColor('xterm') {
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
