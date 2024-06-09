const express = require('express');
const router = express.Router();
const taskRoutes = require('./task');
const userRoutes = require('./user');
// const subscriptionPlan = require('./subscriptionPlans');
// const purchasedSubscription = require('./userSubscriptions');
// const socialRoutes = require('./social');

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Apis running successfully',
  });
});

router.use('/user', userRoutes);
router.use('/task', taskRoutes);
// router.use('/plan', subscriptionPlan);
// router.use('/purchasedSubscription', purchasedSubscription);
// router.use('/blog', blogsRoutes);
// router.use('/social', socialRoutes);

module.exports = router;
