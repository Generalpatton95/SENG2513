import { DataTypes } from 'sequelize';

import sequelize from '../config/database.js';

const Movie = sequelize.define('movie', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
},
  primaryImage: DataTypes.STRING,
  primaryTitle: DataTypes.TEXT,
  description: DataTypes.TEXT,
  releaseDate: DataTypes.STRING,
  contentRating: DataTypes.STRING,
  runtimeMinutes: DataTypes.INTEGER,
  genres: DataTypes.JSON,
  averageRating: DataTypes.INTEGER
});

Movie.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.id; 
  return values;
};

export default Movie;
export{ Movie };
