const bcrypt = require('bcrypt');
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { config } = require('../config');
const apiResponse = require('../utils/apiResponse');
const ForgetPasswordEmail = require('../emailTemplates/forgotPassword');
const { sendMail } = require('../utils/send-mail');
const { promisify } = require('util');

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
        return res.json({ user, token });
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

    // Remove the password from the user object before generating the token
    const { password: userPassword, ...userWithoutPassword } = user.dataValues;
    generateJWT(userWithoutPassword, res);
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

exports.forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return apiResponse(res, 404, false, 'No active user with this email');
    }
    // const encryptPassword = await bcrypt.hash(password, 12);
    // user.password = encryptPassword;
    // await user.save()
    const payload = {
      user: {
        id: user.id,
      },
    };

    // token expires in 48 hours
    jwt.sign(
      payload,
      'Hello World',
      { expiresIn: '1h' },
      async (error, token) => {
        if (error) throw error;

        const html = ForgetPasswordEmail.email(
          'https://task-management-frontend-sable.vercel.app/resetpassword',
          token,
          req
        );

        const mailOptions = {
          to: email,
          subject: "Here's your password reset link!",
          text: 'click on Button to Reset ',
          html: html,
        };

        sendMail(mailOptions);

        return apiResponse(
          res,
          200,
          true,
          'Please check your mail reset password link has been sent'
        );
      }
    );
  } catch (error) {
    return apiResponse(res, 500, false, error.message);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const token = req.query.token;
    const { password } = req.body;
    const decoded = await promisify(jwt.verify)(token, 'Hello World');
    if (!decoded) {
      return apiResponse(res, 401, false, 'Invalid forgot password link');
    }
    const user = await User.findOne({
      where: {
        _id: decoded.user.id,
      },

      // attributes: {
      //   include: ["password"],
      // },
    });
    if (!user) {
      return apiResponse(res, 404, false, 'No active user with this email');
    }
    const encryptPassword = await bcrypt.hash(password, 12);
    user.password = encryptPassword;
    await user.save();
    return apiResponse(res, 200, true, 'Updated password successfully');
  } catch (error) {
    if (error?.message === 'jwt expired') {
      return apiResponse(
        res,
        401,
        false,
        'Forgot password link has been expired'
      );
    } else if (error?.message === 'jwt malformed') {
      return apiResponse(res, 401, false, 'Invalid forgot password link');
    } else {
      return apiResponse(res, 401, false, 'Unauthorized access');
    }
  }
};
