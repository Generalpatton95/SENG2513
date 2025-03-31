import { DataTypes } from 'sequelize';

import sequelize from '../config/database.js';

const User = sequelize.define('user', {
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  email: DataTypes.STRING,
  birthday: DataTypes.DATE,
});

User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password; // Don't expose password
  return values;
};

export default User;
export{ User };
