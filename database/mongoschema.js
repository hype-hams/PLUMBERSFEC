const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  product_id: {
    type: Number,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  date_written: {
    type: Number,
    required: true,
  },
  asker_name: {
    type: String,
    required: true,
  },
  asker_email: {
    type: String,
    required: true,
  },
  reported: {
    type: Boolean,
    required: true,
  },
  helpful: {
    type: Number,
    required: true,
  },
});

const answerSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  question_id: {
    type: Number,
    ref: 'Question',
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  date_written: {
    type: Number,
    required: true,
  },
  answerer_name: {
    type: String,
    required: true,
  },
  answerer_email: {
    type: String,
    required: true,
  },
  reported: {
    type: Boolean,
    required: true,
  },
  helpful: {
    type: Number,
    required: true,
  },
});

const photoSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  answer_id: {
    type: Number,
    ref: 'Answer',
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const Question = mongoose.model('Question', questionSchema);
const Answer = mongoose.model('Answer', answerSchema);
const Photo = mongoose.model('Photo', photoSchema);

module.exports = {
  Question,
  Answer,
  Photo,
};
