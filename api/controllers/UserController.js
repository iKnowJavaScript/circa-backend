const httpStatus = require('http-status');
const { UserQuery } = require('../models//index');
const sendResponse = require('../../helpers/response');
const bcryptService = require('../services/bcrypt.service');
const authService = require('../services/auth.service');

const UserController = () => {
  const signup = async (req, res, next) => {
    try {
      const { name, email, phone, password, password2, user_type } = req.body;

      if (password !== password2) {
        return res.json(
          sendResponse(
            httpStatus.BAD_REQUEST,
            'Passwords does not match',
            {},
            { password: 'password does not match' }
          )
        );
      }

      const userExist = await UserQuery.getOne({ email });

      if (userExist) {
        return res.json(
          sendResponse(
            httpStatus.BAD_REQUEST,
            'email has been taken',
            {},
            { email: 'email has been taken' }
          )
        );
      }

      const user = await UserQuery.create({
        name,
        email,
        phone,
        password,
        user_type
      });

      return res.json(sendResponse(httpStatus.OK, 'success', user, null));
    } catch (err) {
      next(err);
    }
  };

  const login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const userExist = await UserQuery.getOne({ email });

      if (!userExist) {
        return res.json(
          sendResponse(
            httpStatus.NOT_FOUND,
            'User does not exist',
            {},
            { error: 'User does not exist' }
          )
        );
      }

      const correctDetails = bcryptService().comparePassword(password, userExist.password);

      if (!correctDetails) {
        return res.json(
          sendResponse(
            httpStatus.BAD_REQUEST,
            'invalid email or password',
            {},
            { error: 'invalid email or password' }
          )
        );
      }

      // to issue token with the user object, convert it to JSON
      const token = authService().issue(userExist.toJSON());

      return res.json(sendResponse(httpStatus.OK, 'success', user, null, token));
    } catch (err) {
      next(err);
    }
  };

  const getAll = async (req, res, next) => {
    try {
      const query = req.body;
      const users = await UserQuery.getAll(query);
      return res.json(sendResponse(httpStatus.OK, 'success', users, null));
    } catch (err) {
      next(err);
    }
  };

  return {
    signup,
    login,
    getAll
  };
};

module.exports = UserController;
