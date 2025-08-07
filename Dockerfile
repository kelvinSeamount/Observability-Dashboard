FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run  build

EXPOSE 4173

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3\
  CMD curl -f http://localhost:4173/ || exit 1

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0" ]  