const { Pool } = require('pg'); // eslint-disable-line import/no-extraneous-dependencies

const pool = new Pool({
  host: 'localhost',
  user: 'gabrieljimenez',
  database: 'questionsandanswers',
  password: 'familia4eve',
  port: 5432,
});

module.exports = pool;
