# Daily-behavior-monitor

This application provies you a basic framework (without UI design) wich can keep track of your behavior.

The application is deployed online in: https://huang-879095.herokuapp.com/

It works with [Deno](https://deno.land/) + [oak middleware framework](https://oakserver.github.io/oak/),
server side rendering with [EJS](https://ejs.co/) and is styled with [PaperCSS](https://www.getpapercss.com/)!
The deployment is automatically with [Github Actions](https://github.com/features/actions)
to [Heroku](https://dashboard.heroku.com/), and data is stored to [PostgreSQL](https://www.postgresql.org/).

## Running the application locally

### Configuring Postgres database:

Config the database before run the application locally

1.Create required tables for the application in your database:

```
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL,
  password CHAR(60) NOT NULL
  );
  
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  user_id integer NOT NULL,
  date DATE NOT NULL,
  morning BOOLEAN DEFAULT FALSE,
  evening BOOLEAN DEFAULT FALSE,
  time_sleep numeric(4,2),
  time_sports numeric(4,2),
  time_study numeric(4,2),
  mood_morning integer,
  mood_evening integer,
  quality_sleep integer,
  rq_eating integer
  );
```

2.Set your database in ./config/config.js, uncomment the configuration.

### starting the application

After the database has been configured with the proper tables,  type in the following command line in terminal where the directory that contains the application:

``` $ deno run --allow-all --unstable app.js ```

## Requirements

This project was made for [Aalto University's Web Software Development](https://wsd.cs.aalto.fi/web-software-development/)
course in 2020.

The requirements for the project can be found at [/requirements.pdf](/requirements.pdf).
