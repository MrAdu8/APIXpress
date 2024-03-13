const express = require('express');
const { body } = require('express-validator');
const { getallusers, signup, signin, userUpdate, userDelete } = require('../controllers/user');
const router = express.Router();
const globalReponse = require('../helpers/globalResponse');
const vaildation = require('../auth/auth');

const validateUserData = [
  body('firstName').isLength({ min: 3 }).withMessage('First name must be at least 3 characters'),
  body('lastName').isLength({ min: 3 }).withMessage('Last name must be at least 3 characters'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('phoneNo').isLength({ min: 7, max: 15 }).withMessage('Phone number must be exactly 10 digits'),
  body('hobbies').optional().isArray().withMessage('Hobbies must be an integer or vaild number'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/\d/).withMessage('Password must contain a number')
    .matches(/[a-zA-Z]/).withMessage('Password must contain a letter')
];

router.get('/', getallusers, globalReponse);
router.post('/signup', validateUserData, signup, globalReponse);
router.post('/signin', validateUserData, signin, vaildation, globalReponse);
router.put('/:id', validateUserData, userUpdate, globalReponse);
router.delete('/:id', userDelete, globalReponse);

module.exports = router;
