var express = require('express');
const connection = require('../database');
var router = express.Router();

/* GET users listing. */
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
      phoneNo
    };
    var hobby = [];
    hobby = req.body.hobbies.split(',');
    
    const SQL = "INSERT INTO users SET ?";
    
    const result = await connection.query(SQL, userData);
    
    
    // hobby = req.body.rate.split(',');
    for (let i = 0; i < hobby.length; i++) {
      const hobbyId = hobby[i];
      const   userId = result.insertId;
      const HSQL = "INSERT INTO userhobby SET ?"
      const Hresult = connection.query(HSQL, { userId, hobbyId })
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ err: 'Unable to update data for user' });
    } else {
      res.status(200).json({ message: 'User data added successfully' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Unable to access user data. Something is wrong!' });
  }
});

/* PUT users listing. */
router.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const { firstName, lastName, email, phoneNo } = req.body;

    if (!firstName || !lastName || !email || !phoneNo) {
      throw new Error('You are missing one column');
    }

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

    if (result.affectedRows === 0) {
      res.status(404).json({ err: 'Unable to update data for user' });
    } else {
      res.status(200).json({ message: 'User data updated successfully' });
    }

  } catch (error) {
    res.status(500).json({ err: 'Unable to access user data. Something is wrong!' });
  }
});


/* DELETE user listing. */
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
    res.status(500).json({ err: 'Unable to delete user. Something is wrong!' });
  }
});

module.exports = router;
