const user = require('../routes/users');
const connection = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const SECRET_KEY = 'JAISHREERAM';

const getallusers = async(req, res) => {
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
};

const signup = async(req, res) =>{
    const {firstName, lastName, email, phoneNo, password} = req.body;
  try {
    await connection.beginTransaction();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await connection.rollback();
      
      return res.status(400).json({ errors: errors.array() });
    }
    const existingUser = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            await connection.rollback();
            
            res.status(400).json({msg: 'User already exist'});
            return;
        };
    const hashPass = await bcrypt.hash(password, 10);
    const userData = {
      firstName,
      lastName,
      email,
      phoneNo,
      password: hashPass,
    };
    var hobby = req.body.hobbies;
    const SQL = "INSERT INTO users SET ?";

    const result = await connection.query(SQL, userData);

    for (let i = 0; i < hobby.length; i++) {
      const hobbyId = hobby[i];
      const userId = result.insertId;
      const HSQL = "INSERT INTO userhobby SET ?";
      const Hresult = connection.query(HSQL, { userId, hobbyId });
    }
    const token = jwt.sign({email: result.email, id: result.insertId}, SECRET_KEY);
    await connection.commit();
    
    res.status(200).json({ message: 'User data added successfully', result, token });

  } catch (error) {
    await connection.rollback();
    
    res.status(400).json({ error: 'Unable to access user data. Something is wrong!' });
  }
};

const signin = async(req, res) =>{
    const {email, password} = req.body;
    try {
        await connection.beginTransaction();
        const existingUser = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length === 0 || !existingUser[0]) {
            await connection.rollback();
            
            res.status(404).json({msg: 'User not found'});
            return;
        }
        
        const matchpass = await bcrypt.compare(password, existingUser[0].password);
        if (!matchpass) {
            await connection.rollback();
            
            res.status(400).json({msg: 'Password is wrong'});
            return;
        }

        const token = jwt.sign({email: existingUser.email, id: existingUser.id}, SECRET_KEY);
        await connection.commit();
        
        res.status(201).json({user: existingUser, token: token});
    } catch (error) {
        await connection.rollback();
        
        res.status(500).json({msg:'something went wrong !!'},);
    }
};

const userUpdate = async(req, res) => {
  try {
    await connection.beginTransaction();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await connection.rollback();
      
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
      updatedOn,
      password,
    };

    const SQL = "UPDATE users SET ? WHERE id = ?";
    const result = await connection.query(SQL, [userData, id]);
    await connection.commit();
    
    res.status(200).json({ message: 'User data updated successfully', result });
  } catch (error) {
    await connection.rollback();
    
    res.status(400).json({ err: 'Unable to access user data. Something is wrong!' });
  }
};

const userDelete = async(req, res) => {
  const userid = req.params.id;
  try {
    await connection.beginTransaction();
    const SQL = "DELETE FROM users WHERE id = ?";

    const result = await connection.query(SQL, [userid]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      
      res.status(404).json({ err: 'User not found or unable to delete user' });
    } else {
      await connection.commit();
      
      res.status(200).json({ message: 'User deleted successfully' });
    }

  } catch (error) {
    await connection.rollback();
    
    res.status(400).json({ err: 'Unable to delete user. Something is wrong!' });
  }
};

module.exports = {getallusers, signup, signin, userUpdate, userDelete};