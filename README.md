## API TEST HUB

### Note 1:
To run migrations, you'll need to set the environment variables for your database correctly. Remember that TypeORM migrations run outside Docker containers.

- So, how can I run this application?: </br>
  - `npm install` or `yarn install`
- Set up all the environment variables in a .env file (See variable examples in .env.example)
- If you have Docker and Docker Compose:
  - `docker compose up`
- If you don't have Docker:
  - `yarn start:dev`

### Note 2:
You can run this application with an in-memory database by changing the injection's name in all services.

## One more thing
All the test suites are working perfectly, so if you want to know my view about the application, check them out

### And how can I run the tests?
- To the unit tests on the services: `yarn test` or `npm run test`
- To the E2E tests: `yarn test:e2e` or `npm run test:e2e`

# What did I use to build this?

- NestJs
- TypeScript
- Jest
- Docker
- PostgresSQL
- JWT
