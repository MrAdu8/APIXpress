const connection = require('../database');
const { validationResult} = require('express-validator');

const getallhobbies = async(req, res, next) => {
    try {
  
      const result = await connection.query("SELECT * FROM hobbies");
      if (result.affectedRow === 0) {
        res.apiResponse = {
            status: 'failed',
            statusCode: 200,
            message: 'Unable to get data from hobby',
            error: errors
          };
        next();
      } else {
        res.apiResponse = {
            status: 'success',
            data: result
          };
        next();
      }
  
    } catch (error) {
        res.apiResponse = {
            status: 'failed',
            status: 500,
            message: 'Internal server error',
            error: 'You can not access hobby data something is wrong !!',
            data: error,
          };
          next();
    }
  };

const addnewhobby = async (req, res, next) => {
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
          };
        next();
      }
  
      const { name } = req.body;
      const hobbyData = {
        name
      };
  
      const sqlData = "INSERT INTO hobbies SET ?";
      const result = await connection.query(sqlData, hobbyData);

      await connection.commit();
      res.apiResponse = {
        status: 'success',
        data: result
      };
      next();
  
    } catch (error) {
      await connection.rollback();
      res.apiResponse = {
        status: 500,
        message: 'Internal server error',
        error: 'You cannot access hobby data; something is wrong!!',
        data: error,
      };
      next();
    }
  };

const updatenewhobby = async (req, res, next) => {
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
          };
        next();
      }
  
      const id = req.params.id;
      const { name } = req.body;
      const updatedOn = new Date();
      const hobbyData = {
        name,
        updatedOn
      };
  
      const sqlData = "UPDATE hobbies SET ? WHERE id = ?";
      const result = await connection.query(sqlData, [hobbyData, id]);

      await connection.commit();
      res.apiResponse = {
        status: 'success',
        data: result
      };
      next();
  
    } catch (error) {
      await connection.rollback();
      res.apiResponse = {
        status: 500,
        message: 'Internal server error',
        error: 'You cannot access hobby data; something is wrong!!',
        data: error,
      };
      next();
    }
  };

module.exports = { getallhobbies, addnewhobby, updatenewhobby };