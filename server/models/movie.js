import { DataTypes } from 'sequelize';

import sequelize from '../config/database.js';

const Movie = sequelize.define('movie', {
  id:{
     type: DataTypes.INTEGER,
     primaryKey: true,
     autoIncrement: true,
  } ,
  primaryTitle: DataTypes.STRING,
  primaryImage: DataTypes.STRING,
  releaseDate: DataTypes.DATE,
  description: DataTypes.TEXT,
});

Movie.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.id;
  return values;
};

export default Movie;
export{ Movie };