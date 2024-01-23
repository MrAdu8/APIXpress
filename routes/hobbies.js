var express = require('express');
const {body, validationResult} = require('express-validator');
const connection = require('../database');
var router = express.Router();

const validateHobbyData = [
  body('name').isLength({ min:3 }).withMessage('Name must be at least 3 characters'),
];

/* GET hobby listing. */
// GET all data from hobbies
router.get('/', async(req, res, next) => {
  try {

    const result = await connection.query("SELECT * FROM hobbies");
    if (result.affectedRow === 0) {
      res.status(404).json({err: 'Unable to get data from hobby'});
    } else {
      res.status(200).json(result);
    }

  } catch (error) {
    res.status(500).json({err: 'You can not access hobby data something is wrong !!'});
  }
});

/* POST hobby listing. */
// ADD new data to hobbies
router.post('/', validateHobbyData, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    const hobbyData = {
      name
    };

    const SQL = "INSERT INTO hobbies SET ?";

    const result = await connection.query(SQL, hobbyData);

    res.status(200).json({ message: 'hobby data added successfully', result });

  } catch (error) {
    res.status(500).json({ error: 'Unable to access hobby data. Something is wrong!' });
  }
});

/* PUT hobby listing. */
// UPDATE existing hobby
router.put('/:id', validateHobbyData, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id;
    const { name } = req.body;

    const updatedOn = new Date();

    const hobbyData = {
      name,
      updatedOn
    };

    const SQL = "UPDATE hobbies SET ? WHERE id = ?";

    const result = await connection.query(SQL, [hobbyData, id]);

    res.status(200).json({ message: 'User data updated successfully', result });

  } catch (error) {
    res.status(500).json({ err: 'Unable to access user data. Something is wrong!' });
  }
});


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
