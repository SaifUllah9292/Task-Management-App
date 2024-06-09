module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    'Task',
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
        defaultValue: 'pending',
        validate: {
          isIn: {
            args: [['pending', 'in-progress', 'completed']],
            msg: "status must be ['pending', 'in-progress', 'completed']",
          },
        },
      },
      dueDate: DataTypes.DATE,
    },
    {
      timestamps: true,
    }
  );
  Task.associate = (models) => {
    Task.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return Task;
};
