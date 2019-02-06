def abortPreviousRunningBuilds() {
  def hi = Hudson.instance
  def pname = env.JOB_NAME.split('/')[0]

  hi.getItem(pname).getItem(env.JOB_BASE_NAME).getBuilds().each{ build ->
    def exec = build.getExecutor()

    if (build.number != currentBuild.number && exec != null) {
      exec.interrupt(
        Result.ABORTED,
        new CauseOfInterruption.UserInterruption(
          "Aborted by #${currentBuild.number}"
        )
      )
      println("Aborted previous running build #${build.number}")
    } 
  }
}
pipeline {
	agent any
		stages {
			stage('build') {
				steps {
					ansiColor('xterm') {
						abortPreviousRunningBuilds()
						sh 'node create-Dockerfile.js > Dockerfile'
						sh 'docker build -t test .'
					}
				}
			}
			stage('test') {
				steps {
					ansiColor('xterm') {
						sh 'docker run --shm-size="1024m" --security-opt seccomp=unconfined test'
					}
				}
			}
		}
}
