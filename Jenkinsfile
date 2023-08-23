def ImageBuild

def cancelPreviousBuilds() {
    def jobName = env.JOB_NAME
    def buildNumber = env.BUILD_NUMBER.toInteger()

    /* Get job name */
    def currentJob = Jenkins.instance.getItemByFullName(jobName)

    /* Iterating over the builds for specific job */
    for (def build : currentJob.builds) {
        def listener = build.getListener()
        def exec = build.getExecutor()
        /* If there is a build that is currently running and it's not current build */
        if (build.isBuilding() && build.number.toInteger() < buildNumber && exec != null) {
            /* Then stop it */
            exec.interrupt(
                    Result.ABORTED,
                    new CauseOfInterruption.UserInterruption("Aborted by #${currentBuild.number}")
                )
            println("Aborted previously running build #${build.number}")
        }
    }
}

pipeline { 
    agent any

    tools {nodejs "nodejs"} 

    parameters {
        string(name: 'IS_BRANCH', defaultValue: ( env.BRANCH_NAME == 'development' || env.BRANCH_NAME == 'staging' || env.BRANCH_NAME == 'master' ) ? env.BRANCH_NAME : 'development', description: '')
    }

    environment {
        APP_NAME = "snip-cms-be"
        NODE_ENV=credentials("NODE_ENV-${params.IS_BRANCH}")
        PORT=credentials("PORT-${params.IS_BRANCH}")
        DB_USERNAME=credentials("DB_USERNAME-${params.IS_BRANCH}")
        DB_PASSWORD=credentials("DB_PASSWORD-${params.IS_BRANCH}")
        DB_DATABASE=credentials("DB_DATABASE-${params.IS_BRANCH}")
        DB_HOST=credentials("DB_HOST-${params.IS_BRANCH}")
        DB_PORT=credentials("DB_PORT-${params.IS_BRANCH}")
        DB_DIALECT=credentials("DB_DIALECT-${params.IS_BRANCH}")
        SECRET=credentials("SECRET-${params.IS_BRANCH}")
        MINIO_URL=credentials("MINIO_URL-${params.IS_BRANCH}")
        MINIO_ACCESSKEY=credentials("MINIO_ACCESSKEY-${params.IS_BRANCH}")
        MINIO_SECRETKEY=credentials("MINIO_SECRETKEY-${params.IS_BRANCH}")
        MINIO_BUCKET=credentials("MINIO_BUCKET-${params.IS_BRANCH}")
        KEYCLOAK_ID=credentials("KEYCLOAK_ID-${params.IS_BRANCH}")
        KEYCLOAK_SERVER=credentials("KEYCLOAK_SERVER-${params.IS_BRANCH}")
        KEYCLOAK_REALM=credentials("KEYCLOAK_REALM-${params.IS_BRANCH}")
        KEYCLOAK_REALMKEY=credentials("KEYCLOAK_REALMKEY-${params.IS_BRANCH}")
        KEYCLOAK_CLIENTSECRET=credentials("KEYCLOAK_CLIENTSECRET-${params.IS_BRANCH}")
    }

    stages {
        
        stage('SCM') {
            steps{
                checkout scm
                script {
                    cancelPreviousBuilds()
                    sh "docker rmi svcsmartcity/snip:${env.APP_NAME}-${params.IS_BRANCH} -f"
                }
            }
        }

        stage('GitLeaks Scan'){
            agent {
                docker {
                    image 'zricethezav/gitleaks:latest'
                    args '--entrypoint='
                }
            }

            steps{
                script {
                    try {
                        sh "gitleaks detect --source . --report-path analytics-${APP_NAME}-repo.json -v"
                    } catch(e) {
                        currentBuild.result = 'FAILURE'
                    }
                }
            }
        }

        stage('SonarQube Analysis'){
            steps{
                script {
                    def scannerHome = tool 'SonarQube';
                    withSonarQubeEnv() {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        stage('Unit Testing'){
            steps{
                script {
                    sh "yarn install --frozen-lockfile"
                    sh "yarn test --passWithNoTests"
                }
            }
        }

        stage('Build Image Docker') { 
            when {
                expression {
                    env.BRANCH_NAME == 'development' || env.BRANCH_NAME == 'staging' || env.BRANCH_NAME == 'master'
                }
            }
            steps{
                script {
                    def buildArgs = """\
                    --build-arg NODE_ENV=${env.NODE_ENV} \
                    --build-arg PORT=${env.PORT} \
                    --build-arg DB_USERNAME=${env.DB_USERNAME} \
                    --build-arg DB_PASSWORD=${env.DB_PASSWORD} \
                    --build-arg DB_DATABASE=${env.DB_DATABASE} \
                    --build-arg DB_HOST=${env.DB_HOST} \
                    --build-arg DB_PORT=${env.DB_PORT} \
                    --build-arg DB_DIALECT=${env.DB_DIALECT} \
                    --build-arg SECRET=${env.SECRET} \
                    --build-arg MINIO_URL=${env.MINIO_URL} \
                    --build-arg MINIO_ACCESSKEY=${env.MINIO_ACCESSKEY} \
                    --build-arg MINIO_SECRETKEY=${env.MINIO_SECRETKEY} \
                    --build-arg MINIO_BUCKET=${env.MINIO_BUCKET} \
                    --build-arg KEYCLOAK_ID=${env.KEYCLOAK_ID} \
                    --build-arg KEYCLOAK_SERVER=${env.KEYCLOAK_SERVER} \
                    --build-arg KEYCLOAK_REALM=${env.KEYCLOAK_REALM} \
                    --build-arg KEYCLOAK_REALMKEY=${env.KEYCLOAK_REALMKEY} \
                    --build-arg KEYCLOAK_CLIENTSECRET=${env.KEYCLOAK_CLIENTSECRET} \
                    --no-cache \
                    ."""
                    
                    echo 'Bulding docker images'
                    ImageBuild = docker.build("svcsmartcity/snip", buildArgs)
                }
            }
        }

        stage("Push to Registry") { 
            when {
                expression {
                    env.BRANCH_NAME == 'development' || env.BRANCH_NAME == 'staging' || env.BRANCH_NAME == 'master'
                }
            }
            steps { 
                script {
                    docker.withRegistry('https://registry.docker.com', 'docker-hub-credential') {            
                        //ImageBuild.push("${env.BRANCH_NAME}.${env.BUILD_NUMBER}")            
                        ImageBuild.push("${env.APP_NAME}-${env.BRANCH_NAME}")        
                    } 
                }
            }
        }

        stage("Push to Server") { 
            when {
                expression {
                    env.BRANCH_NAME == 'development' || env.BRANCH_NAME == 'staging' || env.BRANCH_NAME == 'master'
                }
            }
            agent { label 'k8s-251-agent' }
			steps {
				sh "kubectl apply -n ${env.BRANCH_NAME} -f ./deployment/${env.BRANCH_NAME}"
				sh "kubectl rollout -n ${env.BRANCH_NAME} restart deploy ${APP_NAME}"
			}
        }

    }

}