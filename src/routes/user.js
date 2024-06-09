const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const userController = require('../controllers/user');
const userValidator = require('../validators/user');

router.post(
  '/signup',
  userValidator.signUpValidator(),
  userValidator.validate,
  userController.signup
);
router.post('/login', userController.login);

router.get('/me', auth, userController.me);
router.get('/:id', auth, userController.user);
router.patch('/', auth, userController.update);
router.delete('/', auth, userController.delete);

module.exports = router;
