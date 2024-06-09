const bcrypt = require('bcrypt');
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { config } = require('../config');
const apiResponse = require('../utils/apiResponse');

function generateJWT(user, res) {
  try {
    const payload = {
      user: {
        id: user.id,
        email: user.email,
      },
    };
    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: 360000 },
      (error, token) => {
        if (error) throw error;
        return res.json({ token });
      }
    );
  } catch (error) {
    return apiResponse(res, 500, false, error.message);
  }
}

exports.signup = async (req, res) => {
  let { password, email } = req.body;
  if (!password) {
    return apiResponse(res, 404, false, 'password is required');
  }
  try {
    if (email) {
      email = email.toLowerCase();
      const alreadyUser = await User.findOne({
        where: { email: email },
      });
      if (alreadyUser) {
        return apiResponse(res, 400, false, 'This email already exists');
      }
    }
    let user = await User.create(req.body);
    user = JSON.parse(JSON.stringify(user));
    return apiResponse(res, 201, true, 'Registered Successfully', user);
  } catch (err) {
    return apiResponse(res, 500, false, err.message);
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    // Check if email and password exists...
    if (!email || !password) {
      return apiResponse(res, 404, false, 'Password or email missing');
    }

    //Get User from database
    email = email.toLowerCase();
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return apiResponse(res, 404, 'No active user with this email');
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return apiResponse(res, 404, false, 'incorrect password');
    }
    generateJWT(user, res);
  } catch (error) {
    return apiResponse(res, 500, false, error.message);
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    return apiResponse(res, 200, true, 'Logged in user', user);
  } catch (err) {
    return apiResponse(res, 500, false, err.message);
  }
};

exports.user = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return apiResponse(res, 400, false, 'user id missing');
    }
    const user = await User.findOne({ where: { id: userId } });
    return apiResponse(res, 200, true, ' user', user);
  } catch (err) {
    return apiResponse(res, 500, false, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    if (!user) {
      return apiResponse(res, 404, false, 'No user found');
    }
    if (user.id !== req.user.id) {
      return apiResponse(
        res,
        400,
        false,
        'You have no access to edit this user'
      );
    }

    // Remove the password field from the request body
    const { password, ...updateData } = req.body;
    const updatedUser = await user.update(updateData);
    return apiResponse(res, 200, true, 'Updated successfully', updatedUser);
  } catch (error) {
    return apiResponse(res, 500, false, error.message);
  }
};
exports.delete = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    if (!user) {
      return apiResponse(res, 404, false, 'No user found');
    }
    if (user.id !== req.user.id) {
      return apiResponse(
        res,
        400,
        false,
        'You have no access to edit this user'
      );
    }

    // Remove the password field from the request body
    await user.destroy();
    return apiResponse(res, 200, true, 'Deleted successfully');
  } catch (error) {
    return apiResponse(res, 500, false, error.message);
  }
};
