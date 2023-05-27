require('dotenv').config();
const axios = require('axios');
const models = require('../../models');

// test id 40344
const headAuth = { Authorization: process.env.API_KEY };
const serverAPI = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/qa/questions';

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

  getAllAnswers: (req, res) => {
    // I getQuestions returns an id, this will return the answers based off id
    // Otherwise this is redundant
    const params = req.query.question_id;
    const options = {
      method: 'get',
      url: `${serverAPI}/${params}/answers`,
      headers: headAuth,
    };
    return axios(options)
      .then((response) => {
        res.status(200).send(response.data);
      })
      .catch((err) => {
        console.error('ERROR GETTING ANSWERS:  ', err);
      });
  },

  postQuestion: async (req, res) => {
    try {
      const currentDate = new Date();
      const convertedDate = currentDate.getTime();
      const { product_id, ...rest } = req.body;
      const updateInfo = {
        ...rest,
        productId: product_id,
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

  postAnswer: (req, res) => {
    // Will post a new Answer to the question
    // req will vary based off how modal looks
    console.log('query: ', req.body);
    axios.post(`${serverAPI}/${req.body.question_id}/answers`, req.body, {
      headers: headAuth,
      params: {
        question_id: req.question_id,
      },
    })
      .then((response) => {
        res.status(201).send(response.data);
      })
      .catch((err) => {
        console.error('PROBLEM WITH POSTING ANSWER: ', err);
      });
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
    // console.log('upvote body: ', req.body.question_id);
    // axios.put(`${serverAPI}/${req.body.question_id}/helpful`, req.body, {
    //   headers: headAuth,
    //   params: {
    //     question_id: req.body.question_id,
    //   },
    // })
    //   .then((response) => {
    //     res.status(204).send(response.data);
    //   })
    //   .catch((err) => {
    //     console.error('PROBLEM UPVOTING QUESTION:  ', err);
    //   });
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

  upvoteAnswer: (req, res) => {
    axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/qa/answers/${req.body.answer_id}/helpful`, req.body, {
      headers: headAuth,
      params: {
        answer_id: req.body.answer_id,
      },
    })
      .then((response) => {
        res.status(204).send(response.data);
      })
      .catch((err) => {
        console.error('PROBLEM UPVOTING QUESTION:  ', err);
      });
  },

  reportAnswer: (req, res) => {
    axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/qa/answers/${req.body.answer_id}/report`, req.body, {
      headers: headAuth,
      params: {
        answer_id: req.body.answer_id,
      },
    })
      .then((response) => {
        res.status(204).send(response.data);
      })
      .catch((err) => {
        console.error('PROBLEM REPORTING ANSWER:  ', err);
      });
  },
};
