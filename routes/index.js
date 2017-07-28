var express = require('express');

var router = express.Router();

var ctrlQuiz = require('../controllers/quiz.controller');
var ctrlQuestion = require('../controllers/question.controller');
var ctrlFile = require('../controllers/file.controller');

//  Quiz APIs
router.post('/quizzes', ctrlQuiz.quizPOST);
router.get('/quizzes', ctrlQuiz.quizGetAll);
router.get('/quizzes/:id', ctrlQuiz.quizGetOne);
router.put('/quizzes/:id', ctrlQuiz.quizPUT);
router.delete('/quizzes/:id', ctrlQuiz.quizDEL);

//  Question APIs
router.post('/questions', ctrlQuestion.questionPOST);
router.get('/questions', ctrlQuestion.questionGetAll);
router.get('/questions/:id', ctrlQuestion.questionGetOne);
router.put('/questions/:id', ctrlQuestion.questionPUT);
router.delete('/questions/:id', ctrlQuestion.questionDEL);

//  File Upload
router.post('/files', ctrlFile.uploadFile);

module.exports = router;
