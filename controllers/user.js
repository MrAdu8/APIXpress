const connection = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const SECRET_KEY = process.env.SECRET_KEY;

const getallusers = async (req, res, next) => {
  try {
    const result = await connection.query("SELECT * FROM users");
    res.apiResponse = {
      status: 'success',
      data: result
    };
    next();
  } catch (error) {
    res.apiResponse = {
      status: 'failed',
      statusCode: 200,
      message: 'Internal server error',
      error: 'You cannot access user data; something is wrong!!',
      data: error,
    };
    next();
  }
};

const signup = async (req, res, next) => {
  const { firstName, lastName, email, phoneNo, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await connection.rollback();
    res.apiResponse = {
      status: 'failed',
      statusCode: 200,
      message: 'your data is not validate, something is not correct !!',
      error: errors
    };
    next();
  }
  const existingUser = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
  try {
    await connection.beginTransaction();
    if (existingUser.length > 0) {
      await connection.rollback();
      res.apiResponse = {
        status: 'failed',
        statusCode: 200,
        error: errors
      };
      next();
    };
    const hashPass = await bcrypt.hash(password, 10);
    const userData = {
      firstName,
      lastName,
      email,
      phoneNo,
      password: hashPass,
    };
    const sqlData = "INSERT INTO users SET ?";
    const result = await connection.query(sqlData, userData);
    // hobbies data insert
    var hobbies = req.body.hobbies;
    var userId = result.insertId;
    var hobbyData = hobbies.map(hobbyId => [userId, hobbyId]);
    const hsqlData = "INSERT INTO userhobby (userId, hobbyId) VALUES ?";
    const Hresult = await connection.query(hsqlData, [hobbyData]);

    const token = jwt.sign({ email: result.email, id: result.insertId }, SECRET_KEY);
    await connection.commit();
    res.apiResponse = {
      status: 'success',
      data: { result, token }
    };
    next();
  } catch (error) {
    await connection.rollback();
    res.apiResponse = {
      statusCode: 200,
      message: 'Internal server error',
      error: 'You cannot access user data; something is wrong!!',
      data: error,
    };
    next();
  }
};

const signin = async(req, res, next) =>{
    const {email, password} = req.body;
    try {
        const existingUser = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length === 0 || !existingUser[0]) {
          // await connection.rollback();
          res.apiResponse = {
            status: 'failed',
            statusCode: 200,
            message: 'User not Found',
            // error: errors
          }
          next();
        }
        
        const matchpass = await bcrypt.compare(password, existingUser[0].password);
        if (!matchpass) {
          // await connection.rollback();
          res.apiResponse = {
            status: 'failed',
            statusCode: 200,
            message: 'Password is wrong',
            // error: errors
          }
          next();
        }

        const token = jwt.sign({email: existingUser.email, id: existingUser.id}, SECRET_KEY);
        // await connection.commit();
        res.apiResponse = {
          status: 'success',
          data: { token }
        };
        next();
    } catch (error) {
      // await connection.rollback();
      res.apiResponse = {
        status: 'failed',
        statusCode: 200,
        message: 'Internal server error',
        error: 'You cannot access user data; something is wrong!!',
        data: error,
      };
      next();
    }
};

const userUpdate = async(req, res, next) => {
  try {
    await connection.beginTransaction();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await connection.rollback();
      res.apiResponse = {
        status: 'failed',
        statusCode: 200,
        message: 'your data is not validate, something is not correct !!',
        error: errors
      }
      next();
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
    const sqlData = "UPDATE users SET ? WHERE id = ?";
    const result = await connection.query(sqlData, [userData, id]);
    await connection.commit();
    res.apiResponse = {
      status: 'success',
      data: result
    };
    next();
  } catch (error) {
    await connection.rollback();
    res.apiResponse = {
      status: 'failed',
      statusCode: 200,
      message: 'Internal server error',
      error: 'You cannot access user data; something is wrong!!',
      data: error,
    };
    next();
  }
};

const userDelete = async(req, res, next) => {
  const userid = req.params.id;
  try {
    await connection.beginTransaction();
    const sqlData = "DELETE FROM users WHERE id = ?";

    const result = await connection.query(sqlData, [userid]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      res.apiResponse = {
        status: 'failed',
        statusCode: 200,
        message: 'User not found or unable to delete user',
        error: errors
      }
      next();
    } else {
      await connection.commit();
      res.apiResponse = {
        status: 'success',
        data: result
      };
      next();
    }
  } catch (error) {
    await connection.rollback();
    res.apiResponse = {
      status: 'failed',
      statusCode: 200,
      message: 'Internal server error',
      error: 'You cannot access user data; something is wrong!!',
      data: error,
    };
    next();
  }
};

module.exports = { getallusers, signup, signin, userUpdate, userDelete};