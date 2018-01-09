pipeline {
	agent any
		stages {
			stage('build') {
				steps {
					ansiColor('xterm') {
						sh 'node create-Dockerfile.js > Dockerfile'
						sh 'docker build -t test .'
					}
				}
			}
			stage('test') {
				steps {
					ansiColor('xterm') {
						sh 'docker run --security-opt seccomp=unconfined --shm-size="1024m" test'
					}
				}
			}
		}
}
