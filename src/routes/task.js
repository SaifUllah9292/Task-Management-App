const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task');
const auth = require('../middlewares/auth');

router.post('/', auth, taskController.add);
router.patch('/:id', auth, taskController.update);
router.delete('/:id', auth, taskController.delete);

router.get('/:id', auth, taskController.getById);
router.get('/', auth, taskController.getAll);
module.exports = router;
