const pool = require('../database');

module.exports = {
  async getAnswers(questionId) {
    try {
      const queryString = 'SELECT * FROM answers WHERE question_id = $1 AND reported = false ORDER BY helpful DESC LIMIT 15 OFFSET 0;';
      const values = [questionId];
      const answers = await pool.query(queryString, values);

      return answers.rows;
    } catch (error) {
      console.log('Error getting answers from database: ', error);
      throw error;
    }
  },

  async postAnswer(answer) {
    try {
      const {
        questionId,
        body,
        email,
        name,
        answerDate,
        helpfulness,
        reported,
      } = answer;
      const values = [questionId, body, answerDate, name, email, reported, helpfulness];
      const queryString = 'INSERT INTO answers (question_id, body, date_written, answerer_name, answerer_email, reported, helpful) VALUES ($1, $2, $3, $4, $5, $6, $7);';

      await pool.query(queryString, values);
    } catch (error) {
      console.log('Error posting new answer to database: ', error);
      throw error;
    }
  },

  async updateAnswerHelpfulness(answerId) {
    try {
      const queryString = `UPDATE answers SET helpful = helpful + 1 WHERE id = ${answerId};`;

      await pool.query(queryString);
    } catch (error) {
      console.log('Error updating answer helpfulness: ', error);
      throw error;
    }
  },

  async reportAnswer(answerId) {
    try {
      const queryString = `UPDATE answers SET reported = true WHERE id = ${answerId};`;

      await pool.query(queryString);
    } catch (error) {
      console.log('Error reporting answer: ', error);
      throw error;
    }
  },
};
