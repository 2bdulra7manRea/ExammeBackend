const { createExam, getExams, getExamDetails, CreateQuestions, DeleteMyExam } = require('../controllers/CreateExam');
const verifyAuth = require('../middleware/verify.auth');
const router=require('express').Router();



router.get('/exams',getExams)
router.post('/exam',verifyAuth,createExam)
router.get('/exam/:id',getExamDetails)
router.patch('/exam/questions/:id',verifyAuth,CreateQuestions)
router.delete('/exam/:id',verifyAuth,DeleteMyExam)


module.exports=router;