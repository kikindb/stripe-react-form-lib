pipeline {
  agent any

  tools {
    nodejs 'NODE22'  // Your configured Node.js installation in Jenkins
  }
  
  environment {
    SONARQUBE_ENV = 'sonarserver'
    NEXUS_REGISTRY = '192.168.56.15:8081'
    NEXUS_REPOSITORY = 'npm-releases'
  }

  stages {

    stage('Checkout') {
      steps {
        git url: 'https://github.com/kikindb/stripe-react-form-lib.git', branch: 'main'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Lint and Test') {
      steps {
        sh 'npm run test || true'
      }
    }

    stage('SonarQube Analysis') {
      environment {
        SONAR_SCANNER_OPTS = '-Dsonar.projectKey=formwidget'
      }
      steps {
        withSonarQubeEnv("${SONARQUBE_ENV}") {
          sh 'npx sonar-scanner'
        }
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Package NPM Artifact') {
      steps {
        sh 'npm version patch --no-git-tag-version'
        sh 'npm pack'
      }
      post {
        success {
          echo 'npm package created.'
          archiveArtifacts artifacts: "*.tgz", fingerprint: true
        }
      }
    }

    stage('Publish to Nexus NPM') {
  steps {
    withCredentials([usernamePassword(credentialsId: 'nexuslogin', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
      sh '''
        AUTH=$(echo -n "$NEXUS_USER:$NEXUS_PASS" | base64)

        echo "//${NEXUS_REGISTRY}/repository/${NEXUS_REPOSITORY}/:_auth=\${AUTH}" > .npmrc
        echo "//${NEXUS_REGISTRY}/repository/${NEXUS_REPOSITORY}/:username=\${NEXUS_USER}" >> .npmrc
        echo "//${NEXUS_REGISTRY}/repository/${NEXUS_REPOSITORY}/:email=jenkins@example.com" >> .npmrc
        echo "always-auth=true" >> .npmrc
        echo "registry=http://${NEXUS_REGISTRY}/repository/${NEXUS_REPOSITORY}/" >> .npmrc

        npm publish --registry=http://${NEXUS_REGISTRY}/repository/${NEXUS_REPOSITORY}/
      '''
    }
  }
}

  }

  post {
    always {
      cleanWs()
    }
  }
}
