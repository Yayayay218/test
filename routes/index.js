var express = require('express');

var router = express.Router();

var jwt = require('express-jwt');

var auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});

var ctrlQuiz = require('../controllers/quiz.controller');
var ctrlQuestion = require('../controllers/question.controller');
var ctrlResult = require('../controllers/result.controller');
var ctrlFile = require('../controllers/file.controller');
var authCtrl = require('../controllers/auth');

router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);

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

//  Result APIs
router.post('/results', ctrlResult.resultPOST);
router.get('/results', ctrlResult.resultGetAll);
router.get('/results/:id', ctrlResult.resultGetOne);
router.put('/results/:id', ctrlResult.resultPUT);
router.delete('/results/:id', ctrlResult.resultDEL);

//  File Upload
router.post('/files', ctrlFile.uploadFile);
router.post('/photos', ctrlFile.uploadPhotos);

module.exports = router;
