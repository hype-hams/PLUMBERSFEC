const pool = require('../database');

module.exports = {
  async getQuestions(productId) {
    try {
      const queryString = 'SELECT * FROM questions WHERE product_id = $1 ORDER BY helpful DESC LIMIT 100 OFFSET 0;';
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

    } catch (error) {
      console.log('Error posting new question to database: ', error);
      throw error;
    }
  },
  async reportQuestion() {
    try {

    } catch (error) {
      console.log('Error reporting question in database: ', error);
      throw error;
    }
  },
  async updateQuestionHelpfulness() {
    try {

    } catch (error) {
      console.log('Error updating question in database: ', error);
      throw error;
    }
  },
};
