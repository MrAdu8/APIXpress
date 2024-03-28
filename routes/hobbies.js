const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { getallhobbies, addnewhobby, updatenewhobby, deletehobby } = require('../controllers/hobby');
const globalReponse = require('../helpers/globalResponse'); 

const validateHobbyData = [
  body('name').isLength({ min:3 }).withMessage('Name must be at least 3 characters'),
];

router.get('/', getallhobbies, globalReponse);
router.post('/', validateHobbyData, addnewhobby, globalReponse);
router.put('/:id', validateHobbyData, updatenewhobby, globalReponse);
router.delete('/:name',deletehobby, globalReponse );

module.exports = router;
