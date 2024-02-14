const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { getallhobbies, addnewhobby, updatenewhobby } = require('../controllers/hobby');
const globalReponse = require('../helpers/globalResponse'); 

const validateHobbyData = [
  body('name').isLength({ min:3 }).withMessage('Name must be at least 3 characters'),
];

router.get('/', getallhobbies, globalReponse);
router.post('/', validateHobbyData, addnewhobby, globalReponse);
router.put('/:id', validateHobbyData, updatenewhobby, globalReponse);


// /* DELETE user listing. */
// router.delete('/:id', async (req, res, next) => {
//   try {
//     const hobbyid = req.params.id;

//     const SQL = "DELETE FROM hobbies WHERE id = ?";

//     const result = await connection.query(SQL, [hobbyid]);

//     if (result.affectedRows === 0) {
//       res.status(404).json({ err: 'User not found or unable to delete hobby' });
//     } else {
//       res.status(200).json({ message: 'User deleted successfully' });
//     }

//   } catch (error) {
//     res.status(500).json({ err: 'Unable to delete hobby. Something is wrong!' });
//   }
// });

module.exports = router;
