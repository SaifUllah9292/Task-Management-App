const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );
  User.associate = (models) => {
    User.hasMany(models.Task, {
      foreignKey: { name: 'userId', allowNull: false },
      as: 'tasks',
    });
  };
  User.beforeCreate(async (user) => {
    const encryptPassword = await bcrypt.hash(user.password, 12);
    user.password = encryptPassword;
  });

  return User;
};
