const express = require('express');
const router = express.Router();
const taskRoutes = require('./task');
const userRoutes = require('./user');

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Apis running successfully',
  });
});

router.use('/user', userRoutes);
router.use('/task', taskRoutes);

module.exports = router;
