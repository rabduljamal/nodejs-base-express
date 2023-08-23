FROM rjamal/node:18-slim
# Change Working Directory
WORKDIR /usr/src/application

ARG NODE_ENV
ARG PORT
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_DATABASE
ARG DB_HOST
ARG DB_PORT
ARG DB_DIALECT
ARG SECRET
ARG MINIO_URL
ARG MINIO_ACCESSKEY
ARG MINIO_SECRETKEY
ARG MINIO_BUCKET
ARG KEYCLOAK_ID
ARG KEYCLOAK_SERVER
ARG KEYCLOAK_REALM
ARG KEYCLOAK_REALMKEY
ARG KEYCLOAK_CLIENTSECRET

RUN touch /usr/src/application/.env
RUN echo "NODE_ENV=${NODE_ENV}" >> /usr/src/application/.env
RUN echo "PORT=${PORT}" >> /usr/src/application/.env
RUN echo "DB_USERNAME=${DB_USERNAME}" >> /usr/src/application/.env
RUN echo "DB_PASSWORD=${DB_PASSWORD}" >> /usr/src/application/.env
RUN echo "DB_DATABASE=${DB_DATABASE}" >> /usr/src/application/.env
RUN echo "DB_HOST=${DB_HOST}" >> /usr/src/application/.env
RUN echo "DB_PORT=${DB_PORT}" >> /usr/src/application/.env
RUN echo "DB_DIALECT=${DB_DIALECT}" >> /usr/src/application/.env
RUN echo "SECRET=${SECRET}" >> /usr/src/application/.env
RUN echo "MINIO_URL=${MINIO_URL}" >> /usr/src/application/.env
RUN echo "MINIO_ACCESSKEY=${MINIO_ACCESSKEY}" >> /usr/src/application/.env
RUN echo "MINIO_SECRETKEY=${MINIO_SECRETKEY}" >> /usr/src/application/.env
RUN echo "MINIO_BUCKET=${MINIO_BUCKET}" >> /usr/src/application/.env
RUN echo "KEYCLOAK_ID=${KEYCLOAK_ID}" >> /usr/src/application/.env
RUN echo "KEYCLOAK_SERVER=${KEYCLOAK_SERVER}" >> /usr/src/application/.env
RUN echo "KEYCLOAK_REALM=${KEYCLOAK_REALM}" >> /usr/src/application/.env
RUN echo "KEYCLOAK_REALMKEY=${KEYCLOAK_REALMKEY}" >> /usr/src/application/.env
RUN echo "KEYCLOAK_CLIENTSECRET=${KEYCLOAK_CLIENTSECRET}" >> /usr/src/application/.env

COPY . /usr/src/application

RUN rm -rf node_modules
RUN yarn install --frozen-lockfile
RUN yarn global add nodemon


EXPOSE 3000

CMD ["node", "/usr/src/application/bin/www"]