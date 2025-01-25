FROM node:18-alpine

RUN npm install -g pnpm@9.6.0

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# Gerar o cliente Prisma
RUN npx prisma generate

COPY . .

RUN pnpm run build

EXPOSE 3333

CMD ["node", "dist/http/server.js"]


