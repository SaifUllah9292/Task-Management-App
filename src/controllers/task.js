const { Task, User } = require('../models');
const apiResponse = require('../utils/apiResponse');

exports.add = async (req, res) => {
  try {
    req.body.userId = req.user.id;
    const task = await Task.create(req.body);
    return apiResponse(res, 201, true, 'Task created successfully', task);
  } catch (error) {
    return apiResponse(res, 500, false, error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id },
    });
    if (!task) {
      return apiResponse(res, 404, false, 'No task found');
    }
    if (task.userId !== req.user.id) {
      return apiResponse(
        res,
        400,
        false,
        'You have no access to edit this task'
      );
    }
    const updatedTask = await task.update(req.body);
    return apiResponse(res, 200, true, 'Updated successfully', updatedTask);
  } catch (error) {
    return apiResponse(res, 500, false, error.message);
  }
};

exports.delete = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id },
    });
    if (!task) {
      return apiResponse(res, 404, false, 'No task found with this id');
    }
    if (req.user.id !== task.userId) {
      return apiResponse(
        res,
        400,
        false,
        'You have not access to delete this task'
      );
    }
    await Task.destroy({
      where: { id: req.params.id },
      force: true,
    });
    return apiResponse(res, 200, true, 'Deleted successfully');
  } catch (error) {
    return apiResponse(res, 500, false, error.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: User,
          as: 'user',
        },
      ],
    });
    if (!task) {
      return apiResponse(res, 404, false, 'No task found with this id');
    }

    if (req.user.id !== task.userId) {
      return apiResponse(
        res,
        400,
        false,
        'You do not have permission to view this task'
      );
    }
    return apiResponse(res, 200, true, 'Data', task);
  } catch (error) {
    return apiResponse(res, 500, false, error.message);
  }
};

exports.getAll = async (req, res) => {
  try {
    // Extract query parameters for pagination and sorting
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const sort = req.query.sort || 'createdAt'; // Default sort by createdAt
    const order = req.query.order === 'desc' ? 'DESC' : 'ASC'; // Default order is ascending

    // Calculate limit and offset
    const limit = size;
    const offset = (page - 1) * size;

    // Fetch tasks with pagination and sorting
    let tasks = await Task.findAll({
      where: { userId: req.user.id },
      limit: limit,
      offset: offset,
      order: [[sort, order]],
    });

    // Fetch total tasks count
    let tasksCount = await Task.count({ where: { userId: req.user.id } });

    return apiResponse(res, 200, true, `${tasks.length} tasks found`, {
      count: tasksCount,
      tasks,
    });
  } catch (error) {
    return apiResponse(res, 500, false, error.message);
  }
};
