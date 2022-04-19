pipeline {
    agent { label 'nodejs12' }
    options {
        timeout(time: 1, unit: 'HOURS')
        timestamps()
        copyArtifactPermission('*')
    }
    stages {
        stage('Build') {
            steps {
                withNPM(npmrcConfig: 'e9d7a98e-f30a-440d-8a52-743c4ce7d9e5') {
                    sh 'yarn install --frozen-lockfile'
                    sh 'yarn run test'
                    sh 'yarn pack --dry-run'
                }
            }
        }
        stage('Publish') {
//             when { tag "*" }
            steps {
                withNPM(npmrcConfig: 'e9d7a98e-f30a-440d-8a52-743c4ce7d9e5') {
                    sh 'yarn publish --access public'
                }
            }
        }
        stage('Storybook') {
            steps {
                script {
                    sh 'yarn run build-storybook'
                    publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'storybook-static', reportFiles: 'index.html', reportName: 'Storybook', reportTitles: ''])
                }
            }
        }

    }
    post {
        fixed {
            mattermostSend color: "good", message: "${env.JOB_NAME} fixed!"
        }
        unsuccessful {
            mattermostSend color: "danger", message: "${env.JOB_NAME} failed!"
        }
    }
}
