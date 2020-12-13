The application is deployed online in：
https://huang-879095.herokuapp.com/


Config the database before run the application locally

  1.Create required tables for the application in your database:

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

  2.Set your database in ./config/config.js, uncomment the configuration.

Then the application can be run locally by type in the command:
$ deno run --unstable --allow-all app.js


Address and contents(guidline):
  / 
  Landing page

  /auth/registration
  Registrate new accounts

  /auth/login
  Login into a registered account; Unauthenticated user will automatically jump here when trying to access address which not starts with '/auth'

  /auth/logout
  logout current account

  /homepage
  Your mood today, yesterday and mood trend is shown here

  /behavior/reporting
  Make a new report, can choose morning or evening

  /behavior/reporting/morning
  Date, sleep duration, sleep quality and generic mood for morning can be reported here

  /behavior/reporting/morning
  Date, sports time, study time, regularity and quality of eating and generic mood for evening can be reported here

  /behavior/reporting/added
  A notification the report is successful.

  /behavior/summary
  See summary of your reports, can select a specific week or month

  /behavior/summary/week
  Weekly summary

  
  /behavior/summary/month
  Monthly summary


Tests:
No tests