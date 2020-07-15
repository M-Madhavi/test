'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Movies.associate = function(models) {
        Movies.belongsToMany(models.Users, { through: "Watchlist", foreignKey: "movieId" });
      };
    }
  };
  Movies.init({
    title: DataTypes.STRING,
    released: DataTypes.STRING,
    actors: DataTypes.STRING,
    poster: DataTypes.STRING,
    director: DataTypes.STRING,
    language: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Movies',
  });
  return Movies;
};