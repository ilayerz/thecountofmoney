FROM node:latest

# définit le dossier 'app' comme dossier de travail
RUN apt-get -y update \
  && apt-get install -y git

#RUN npm install -g @vue/cli

WORKDIR /app

COPY . .

RUN npm install
EXPOSE 8080
CMD ["npm", "run", "serve"]
