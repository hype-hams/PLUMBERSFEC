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
      console.log(results);
      const convertedResults = results.map((question) => {
        const milliseconds = parseInt(question.date_written, 10);
        const date = new Date(milliseconds);
        date.setHours(0, 0, 0, 0);
        console.log(date);
        const newDate = date.toISOString();

        const convertedQuestion = {
          question_id: question.id,
          question_body: question.body,
          question_date: newDate,
          asker_name: question.asker_name,
          question_helpfulness: question.helpful,
          reported: question.reported,
          answers: {},
        };
        return convertedQuestion;
      });
      res.status(200).send(convertedResults);
    } catch (error) {
      console.log('Error connecting to server ', error);
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

  postQuestion: (req, res) => {
    // Will post a new question to the db
    // req will vary based off how modal looks
    axios.post(serverAPI, req.body, {
      headers: headAuth,
      params: {
        product_id: req.product_id,
      },
    })
      .then((response) => {
        res.status(201).send(response.data);
      })
      .catch((err) => {
        console.error('PROBLEM WITH POSTING QUESTION: ', err);
      });
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

  upvoteQuestion: (req, res) => {
    console.log('upvote body: ', req.body.question_id);
    axios.put(`${serverAPI}/${req.body.question_id}/helpful`, req.body, {
      headers: headAuth,
      params: {
        question_id: req.body.question_id,
      },
    })
      .then((response) => {
        res.status(204).send(response.data);
      })
      .catch((err) => {
        console.error('PROBLEM UPVOTING QUESTION:  ', err);
      });
  },

  reportQuestion: (req, res) => {
    axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/qa/questions/${req.body.question_id}/report`, req.body, {
      headers: headAuth,
      params: {
        question_id: req.body.question_id,
      },
    })
      .then((response) => {
        res.status(204).send(response.data);
      })
      .catch((err) => {
        console.error('PROBLEM REPORTING QUESTION:  ', err);
      });
  },
  // Can optimize the two functions below, by combining them and swapping the final endpoint with a passable tag
  // So it can just read the require task and run from there

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
