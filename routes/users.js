var express = require('express');
const { body, validationResult } = require('express-validator');
const connection = require('../database');
const { getallusers, signup, signin, userUpdate, userDelete } = require('../controllers/userController');
const SECRET_KEY = 'JAISHREERAM';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var router = express.Router();

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

router.get('/', getallusers);
router.post('/signup', validateUserData, signup);
router.post('/signin', validateUserData, signin);
router.put('/:id', validateUserData, userUpdate);
router.delete('/:id', userDelete);

module.exports = router;
