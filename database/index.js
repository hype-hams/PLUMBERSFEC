const { Pool } = require('pg'); // eslint-disable-line import/no-extraneous-dependencies

const pool = new Pool({
  host: 'localhost',
  user: 'gabrieljimenez',
  database: 'questionsandanswers',
  password: 'familia4eve',
  port: 5432,
  IdleTimeoutMillis: 10000,
  connectionTimeoutMillis: 2000,
  max: 100,
  allowExitOnIdle: true,
});

module.exports = pool;
