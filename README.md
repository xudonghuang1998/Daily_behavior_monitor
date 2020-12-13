# my-monitor

With this application, you can keep track of your behavior, which means
the time spent on:

- sleeping
- stydying
- exercises

and the quality of:

- sleeping
- eating
- mood

The application can be found at: https://my-m0nit0r.herokuapp.com/

It works with [Deno](https://deno.land/) + [oak middleware framework](https://oakserver.github.io/oak/),
server side rendering with [EJS](https://ejs.co/) and is styled with [PaperCSS](https://www.getpapercss.com/)!
The deployment is automatically with [Github Actions](https://github.com/features/actions)
to [Heroku](https://dashboard.heroku.com/), and data is stored to [PostgreSQL](https://www.postgresql.org/).

# Running the application locally

## Configuring Postgres database:

After getting your local PostgreSQL database running (you can check
[these instructions](/docs/local-postgres-docker-setup.md) if you want to run PostgreSQL with Docker),
add proper tables by running the commands in [/docs/SETUP.sql](/docs/SETUP.sql).

then create an `.env` file to `/config`, and add these variables
with proper values to it:

```
PG_USER=
PG_PASSWORD=
PG_HOSTNAME=
PG_PORT=
PG_DB_NAME=
```

## starting the application

After the database has been configured with the proper tables, you can run:

- app with: `./app.sh run`
- tests with: `./app.sh test`
- formatter with: `./app.sh format`
- linter with: `./app.sh lint`
- test+formatter+linter with: `./app.sh pre-commit`
- requirements ratio (met/all): `./app.sh requirements`

(if the bash script is not working on your platform, you can use
`deno run --allow-read --allow-net --unstable --allow-env app.js` to run the application, and
`TESTING=1 deno test --allow-read --allow-net --allow-env --unstable` for running the tests)

# Requirements

This project was made for [Aalto University's Web Software Development](https://wsd.cs.aalto.fi/web-software-development/)
course in 2020.

The requirements for the project can be found at [/docs/REQUIREMENTS.md](/docs/REQUIREMENTS.md).

Each requirement that has been met is marked with a '✅' symbol.

Each requirement that was implemented, but not in a way that described is marked with ❌
and attached with an explanation.

## Deviation from the requirements

- **Test configurations separate from production configurations**  
  Reason: from the additional instructions: 'if you use environmental variables, there is in practice
  no need to separate test configurations from production configurations' --> env variables are used

- **Summary page has a selector for week and month. Check input type="week" and input type="month".**  
  Reason: [no firefox support for type="week"](https://www.w3schools.com/tags/att_input_type_week.asp),
  type="number" input type was used
