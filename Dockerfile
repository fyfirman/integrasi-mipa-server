FROM risingstack/alpine:3.4-v6.9.4-4.2.0

ENV PORT 3001
ENV NODE_ENV 'production'

EXPOSE 3001

COPY package.json package.json
RUN npm install
RUN npm install @types/mocha@^8.0.3
RUN npm install @types/node@^14.6.0
RUN npm install supertest@^4.0.2
RUN npm install -g typescript@3.3.3333

COPY . .
COPY .env .env
RUN npm run build

CMD ["node", "dist/app"]