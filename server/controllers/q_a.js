require('dotenv').config();
const models = require('../../models');

module.exports = {

  getQuestions: async (req, res) => {
    try {
      const results = await models.questions.getQuestions(req.query.product_id);
      const convertedResults = results.map((question) => {
        const milliseconds = parseInt(question.date_written, 10);
        const date = new Date(milliseconds);
        date.setHours(0, 0, 0, 0);
        const newDate = date.toISOString();

        const convertedQuestion = {
          question_id: question.id,
          question_body: question.body,
          question_date: newDate,
          asker_name: question.asker_name,
          asker_email: question.asker_email,
          question_helpfulness: question.helpful,
          reported: question.reported,
          answers: {},
        };
        return convertedQuestion;
      });
      res.status(200).send(convertedResults);
    } catch (error) {
      console.log('Error connecting to server ', error);
      res.sendStatus(500);
    }
  },

  getAllAnswers: async (req, res) => {
    try {
      const questionId = req.query.question_id;
      const answers = await models.answers.getAnswers(questionId);
      const convertedResults = answers.map((answer) => {
        const milliseconds = parseInt(answer.date_written, 10);
        const date = new Date(milliseconds);
        date.setHours(0, 0, 0, 0);
        const newDate = date.toISOString();

        const convertedAnswer = {
          answer_id: answer.id,
          body: answer.body,
          date: newDate,
          answerer_name: answer.answerer_name,
          helpfulness: answer.answerer_email,
          photos: [],
        };
        return convertedAnswer;
      });

      res.status(200).send(convertedResults);
    } catch (error) {
      console.log('Error getting questions from server: ', error);
      res.sendStatus(500);
    }
  },

  postQuestion: async (req, res) => {
    try {
      const currentDate = new Date();
      const convertedDate = currentDate.getTime();
      const { product_id, ...rest } = req.body; // eslint-disable-line camelcase
      const updateInfo = {
        ...rest,
        productId: product_id, // eslint-disable-line camelcase
        helpfulness: 0,
        reported: false,
        questionDate: convertedDate,
      };
      await models.questions.postQuestion(updateInfo);

      res.sendStatus(201);
    } catch (error) {
      console.log('Error sending data to server: ', error);
      res.sendStatus(500);
    }
  },

  postAnswer: async (req, res) => {
    try {
      const currentDate = new Date();
      const convertedDate = currentDate.getTime();
      const { question_id, ...rest } = req.body; // eslint-disable-line camelcase
      const updatedInfo = {
        ...rest,
        questionId: question_id, // eslint-disable-line camelcase
        answerDate: convertedDate,
        reported: false,
      };
      await models.answers.postAnswer(updatedInfo);

      res.sendStatus(201);
    } catch (error) {
      console.log('Error posting new answer to server: ', error);
      res.sendStatus(500);
    }
  },

  upvoteQuestion: async (req, res) => {
    try {
      const questionId = req.body.question_id;
      await models.questions.updateQuestionHelpfulness(questionId);

      res.sendStatus(204);
    } catch (error) {
      console.log('Error updating question helpfulness: ', error);
      res.sendStatus(500);
    }
  },

  reportQuestion: async (req, res) => {
    try {
      const questionId = req.body.question_id;
      await models.questions.reportQuestion(questionId);

      res.sendStatus(204);
    } catch (error) {
      console.log('Error reporting question: ', error);
      res.sendStatus(500);
    }
  },

  upvoteAnswer: async (req, res) => {
    try {
      const answerId = req.body.answer_id;
      await models.answers.updateAnswerHelpfulness(answerId);

      res.sendStatus(204);
    } catch (error) {
      console.log('Error updating answer helpfulness: ', error);
      res.sendStatus(500);
    }
  },

  reportAnswer: async (req, res) => {
    try {
      const answerId = req.body.answer_id;
      await models.answers.reportAnswer(answerId);

      res.sendStatus(204);
    } catch (error) {
      console.log('Error reporting answer to server: ', error);
      res.sendStatus(500);
    }
  },
};
