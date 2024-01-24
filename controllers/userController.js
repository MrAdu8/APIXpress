const user = require('../routes/users');
const connection = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const SECRET_KEY = 'JAISHREERAM';

const signup = async(req, res) =>{
    const {firstName, lastName, email, phoneNo, password} = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const existingUser = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            res.status(400).json({msg: 'User already exist'});
            return;
        };
    const hashPass = await bcrypt.hash(password, 10);
    const userData = {
      firstName,
      lastName,
      email,
      phoneNo,
      password:hashPass
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
    res.status(200).json({ message: 'User data added successfully', result, token });

  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Unable to access user data. Something is wrong!' });
  }
};

const signin = async(req, res) =>{
    const {email, password} = req.body;
    try {
        const existingUser = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length === 0 || !existingUser[0]) {
            res.status(404).json({msg: 'User not found'});
            return;
        }
        
        const matchpass = await bcrypt.compare(password, existingUser[0].password);
        if (!matchpass) {
            res.status(400).json({msg: 'Password is wrong'});
            return;
        }

        const token = jwt.sign({email: existingUser.email, id: existingUser.id}, SECRET_KEY);
        res.status(201).json({user: existingUser, token: token});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'something went wrong !!'},);
    }
};

module.exports = {signup, signin};