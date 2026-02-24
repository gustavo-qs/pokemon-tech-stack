FROM docker.devops.somosdigital.io/releases/node:20-bullseye-slim.69

WORKDIR /app

COPY . ./
RUN npm rebuild --target_platform=linux

CMD ["node", "dist/src/main.js"]
