CREATE DATABASE IF NOT EXISTS questionsandanswers;

\c questionsandanswers

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  product_id INT,
  body VARCHAR(1000),
  date_written BIGINT,
  asker_name VARCHAR(60),
  asker_email VARCHAR(100),
  reported BOOLEAN,
  helpful INT
);

CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY,
  question_id INT,
  body VARCHAR(1000),
  date_written BIGINT,
  answerer_name VARCHAR(60),
  answerer_email VARCHAR(100),
  reported BOOLEAN,
  helpful INT,
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY,
  answer_id INT,
  url VARCHAR(1000),
  FOREIGN KEY (answer_id) REFERENCES answers(id)
);

