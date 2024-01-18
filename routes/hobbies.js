var express = require('express');
const connection = require('../database');
var router = express.Router();

/* GET hobby listing. */
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
router.post('/', async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new Error('you are missing name');
    }

    const hobbyData = {
      name
    };

    const SQL = "INSERT INTO hobbies SET ?";

    const result = await connection.query(SQL, hobbyData);

    if (result.affectedRows === 0) {
      res.status(404).json({ err: 'Unable to update data for hobby' });
    } else {
      res.status(200).json({ message: 'hobby data added successfully' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Unable to access hobby data. Something is wrong!' });
  }
});

/* PUT hobby listing. */
router.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name } = req.body;

    if (!name) {
      throw new Error('You are missing name');
    }

    const updatedOn = new Date();

    const hobbyData = {
      name,
      updatedOn
    };

    const SQL = "UPDATE hobbies SET ? WHERE id = ?";

    const result = await connection.query(SQL, [hobbyData, id]);

    if (result.affectedRows === 0) {
      res.status(404).json({ err: 'Unable to update data for user' });
    } else {
      res.status(200).json({ message: 'User data updated successfully' });
    }

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
