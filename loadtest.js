import http from 'k6/http'; // eslint-disable-line import/no-unresolved
import { sleep } from 'k6'; // eslint-disable-line import/no-extraneous-dependencies

export const options = {
  vus: 1100,
  duration: '30s',
};

export default () => {
  const productId = Math.floor(Math.random() * (100000 - 50000)) + 50000;
  const page = Math.floor(Math.random() * (5000000 - 2000000 + 1)) + 2000000;
  const count = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
  http.get(`http://localhost:3000/api/q_a/getQuestions?product_id=${productId}&page=${page}&count=${count}`);
  sleep(1);
};
