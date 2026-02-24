FROM docker.devops.somosdigital.io/releases/node:22-bookworm-slim.70

WORKDIR /app

COPY . ./
RUN npm rebuild --target_platform=linux

CMD ["node", "dist/src/main.js"]
