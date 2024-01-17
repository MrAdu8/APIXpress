var express = require('express');
const connection = require('../database');
var router = express.Router();

/* GET users listing. */
router.get('/', async(req, res, next) => {
  try {
    const SQL = "SELECT * FROM users";

    const result = await connection.query(SQL);
    if (result.affectedRow === 0) {
      console.log('ERROR');
      res.status(404).json({err: 'Unable to get data from user'});
    } else {
      console.log(result);
      res.status(200).json(result);
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({err: 'You can not access user data something is wrong !!'});
  }
});

/* POST users listing. */
router.post('/', async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNo } = req.body;

    if (!firstName || !lastName || !email || !phoneNo) {
      throw new Error('you are missing one column');
    }

    const userData = {
      firstName,
      lastName,
      email,
      phoneNo,
      updatedOn: new Date()
    };

    const SQL = "INSERT INTO users SET ?";

    const result = await connection.query(SQL, userData);

    if (result.affectedRows === 0) {
      console.log('ERROR');
      res.status(404).json({ err: 'Unable to update data for user' });
    } else {
      console.log(result);
      res.status(200).json({ message: 'User data added successfully' });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ err: 'Unable to access user data. Something is wrong!' });
  }
});

/* PUT users listing. */
router.put('/:Id', async (req, res, next) => {
  try {
    const Id = req.params.Id;
    const { firstName, lastName, email, phoneNo } = req.body;

    if (!firstName || !lastName || !email || !phoneNo) {
      throw new Error('You are missing one column');
    }

    const updatedOn = new Date();

    const SQL = "UPDATE users SET firstName = ?, lastName = ?, email = ?, phoneNo = ?, updatedOn = ? WHERE Id = ?";

    const result = await connection.query(SQL, [firstName, lastName, email, phoneNo, updatedOn, Id]);

    if (result.affectedRows === 0) {
      console.log('ERROR');
      res.status(404).json({ err: 'Unable to update data for user' });
    } else {
      console.log(result);
      res.status(200).json({ message: 'User data updated successfully' });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ err: 'Unable to access user data. Something is wrong!' });
  }
});

/* DELETE user listing. */
router.delete('/:Id', async (req, res, next) => {
  try {
    const userId = req.params.Id;

    const SQL = "DELETE FROM users WHERE Id = ?";

    const result = await connection.query(SQL, [userId]);

    if (result.affectedRows === 0) {
      console.log('ERROR');
      res.status(404).json({ err: 'User not found or unable to delete user' });
    } else {
      console.log(result);
      res.status(200).json({ message: 'User deleted successfully' });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ err: 'Unable to delete user. Something is wrong!' });
  }
});

module.exports = router;
