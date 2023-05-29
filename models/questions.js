const pool = require('../database');

module.exports = {
  async getQuestions(productId) {
    try {
      const queryString = `
  SELECT
    questions.id AS question_id,
    questions.product_id,
    questions.body AS question_body,
    questions.date_written AS question_date,
    questions.asker_name,
    questions.asker_email,
    questions.reported,
    questions.helpful,
    JSON_AGG(
      JSON_BUILD_OBJECT(
        'answer_id', answers.id,
        'answer_body', answers.body,
        'answer_date', answers.date_written,
        'answerer_name', answers.answerer_name,
        'answer_helpful', answers.helpful
      )
    ) AS answers
  FROM
    questions
  LEFT JOIN answers ON questions.id = answers.question_id
  WHERE
    questions.product_id = $1
    AND questions.reported = false
  GROUP BY
    questions.id
  ORDER BY
    questions.helpful DESC
  LIMIT 100 OFFSET 0;
`;


      const values = [productId];

      const results = await pool.query(queryString, values);
      console.log(results.rows[2].answers);
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
