const pool = require('../database');

module.exports = {
  async getQuestions(productId) {
    try {
      const queryString = 'SELECT * FROM questions WHERE product_id = $1 AND reported = false ORDER BY helpful DESC LIMIT 100 OFFSET 0;';
      const values = [productId];

      const results = await pool.query(queryString, values);
      return results.rows;
    } catch (error) {
      console.log('Error getting questions from database ', error);
      throw error;
    }
  },

  async postQuestion(question) {
    try {
      const {
        productId,
        body,
        email,
        questionDate,
        name,
        helpfulness,
        reported,
      } = question;

      const queryValues = [productId,
        body,
        questionDate,
        name,
        email,
        reported,
        helpfulness];
      const queryString = 'INSERT INTO questions (product_id, body, date_written, asker_name, asker_email, reported, helpful) VALUES ($1, $2, $3, $4, $5, $6, $7);';

      await pool.query(queryString, queryValues);
    } catch (error) {
      console.log('Error posting new question to database: ', error);
      throw error;
    }
  },

  async reportQuestion(questionId) {
    try {
      const queryString = `UPDATE questions SET reported = true WHERE id = ${questionId};`;
      await pool.query(queryString);
    } catch (error) {
      console.log('Error reporting question in database: ', error);
      throw error;
    }
  },

  async updateQuestionHelpfulness(questionId) {
    try {
      const queryString = `UPDATE questions SET helpful = helpful + 1 WHERE id = ${questionId};`;
      await pool.query(queryString);
    } catch (error) {
      console.log('Error updating question in database: ', error);
      throw error;
    }
  },
};
