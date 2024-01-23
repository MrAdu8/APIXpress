var express = require('express');
const { body, validationResult } = require('express-validator');
const connection = require('../database');
var router = express.Router();

const validateUserData = [
  body('firstName').isLength({ min: 3 }).withMessage('First name must be at least 3 characters'),
  body('lastName').isLength({ min: 3 }).withMessage('Last name must be at least 3 characters'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('phoneNo').isLength({ min: 7, max: 15 }).withMessage('Phone number must be exactly 10 digits'),
  body('hobbies').optional().isArray().withMessage('Hobbies must be an integer or vaild number'),
];

/* GET users listing. */
// GET all data from users
router.get('/', async(req, res, next) => {
  try {

    const result = await connection.query("SELECT * FROM users");
    if (result.affectedRow === 0) {
      res.status(404).json({err: 'Unable to get data from user'});
    } else {
      res.status(200).json(result);
    }

  } catch (error) {
    res.status(500).json({err: 'You can not access user data something is wrong !!'});
  }
});

/* POST users listing. */
// ADD new data to users
router.post('/', validateUserData, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, phoneNo } = req.body;
    
    const userData = {
      firstName,
      lastName,
      email,
      phoneNo
    };
    var hobby = req.body.hobbies;
    // hobby = req.body.hobbies;

    const SQL = "INSERT INTO users SET ?";

    const result = await connection.query(SQL, userData);

    for (let i = 0; i < hobby.length; i++) {
      const hobbyId = hobby[i];
      const userId = result.insertId;
      const HSQL = "INSERT INTO userhobby SET ?";
      const Hresult = connection.query(HSQL, { userId, hobbyId });
    }

    res.status(200).json({ message: 'User data added successfully', result });

  } catch (error) {
    res.status(400).json({ error: 'Unable to access user data. Something is wrong!' });
  }
});

/* PUT users listing. */
// UPDATE existing user
router.put('/:id', validateUserData, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id;
    const { firstName, lastName, email, phoneNo } = req.body;

    const updatedOn = new Date();

    const userData = {
      firstName,
      lastName,
      email,
      phoneNo,
      updatedOn
    };

    const SQL = "UPDATE users SET ? WHERE id = ?";
    const result = await connection.query(SQL, [userData, id]);

    res.status(200).json({ message: 'User data updated successfully', result });

  } catch (error) {
    res.status(400).json({ err: 'Unable to access user data. Something is wrong!' });
  }
});


/* DELETE user listing. */
// DELETE user
router.delete('/:id', async (req, res, next) => {
  try {
    const userid = req.params.id;

    const SQL = "DELETE FROM users WHERE id = ?";

    const result = await connection.query(SQL, [userid]);

    if (result.affectedRows === 0) {
      res.status(404).json({ err: 'User not found or unable to delete user' });
    } else {
      res.status(200).json({ message: 'User deleted successfully' });
    }

  } catch (error) {
    res.status(400).json({ err: 'Unable to delete user. Something is wrong!' });
  }
});

module.exports = router;
