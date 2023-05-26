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

COPY questions (product_id, body, date_written, asker_name, asker_email, reported, helpful)
FROM '/gabrieljimenez/downloads/questions.csv' DELIMITER ',' CSV HEADER;

COPY answers (question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
FROM '/gabrieljimenez/downloads/answers.csv' DELIMITER ',' CSV HEADER;

COPY photos (answer_id, url)
FROM '/gabrieljimenez/downloads/answers_photos.csv' DELIMITER ',' CSV HEADER;
